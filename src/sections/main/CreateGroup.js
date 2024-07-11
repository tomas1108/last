import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Slide,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriends } from "../../redux/slices/app";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import RHFTextField from "../../components/hook-form/RHFTexField";
import { MemberElement } from "../../components/UserElement";
import ScrollbarCustom from "../../components/ScrollbarCustom";
import FormProvider from "../../components/hook-form/FormProvider";
import { generateGroupID } from "../../utils/groupIDformat";
import { getCurrentTime } from "../../utils/timeUtils";
import { socket } from "../../socket";
import { createWebsocket } from "../../pieSocket";
import {
  ResetCurrentMessages,
  UpdateGroupCurrentConversation,
} from "../../redux/slices/group";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupForm = ({ handleClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { user_id, user_name, user_avatar } = useSelector(
    (state) => state.auth
  );
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.app);

  const { group_current_conversation, connections } = useSelector(
    (state) => state.group
  );
  const [filteredOptions, setFilteredOptions] = useState([]); // Danh sách phần tử được lọc

  const isMember = (friend) => {
    return group_current_conversation.members.some(
      (member) => member.memberID === friend._id
    );
  };

  const handleSearchChange = (event) => {
    const inputValue = event.target.value;
    setSearch(inputValue); // Cập nhật state search với nội dung nhập vào

    // Lọc danh sách phần tử phù hợp dựa trên nội dung nhập vào
    const filtered = friends.filter(
      (friend) =>
        friend.email.toLowerCase().includes(inputValue.toLowerCase()) &&
        !isMember(friend)
    );
    setFilteredOptions(filtered); // Cập nhật danh sách phần tử được lọc
  };

  useEffect(() => {
    dispatch(FetchFriends(user_id));
  }, [dispatch, user_id]);

  const NewGroupSchema = Yup.object().shape({
    name: Yup.string().required("Title is required"),
    members: Yup.array()
      .of(
        Yup.object().shape({
          _id: Yup.string().required(), // Đảm bảo mỗi thành viên có _id
          name: Yup.string().required(), // Đảm bảo mỗi thành viên có tên
        })
      )
      .min(1, "You must add at least one member"),
  });

  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const emitPromise = (event, ...args) => {
    return new Promise((resolve, reject) => {
      socket.emit(event, ...args, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error("Error: " + response.error || response.message));
        }
      });
    });
  };

  const onSubmit = async (data) => {
    handleClose();
    try {
      const groupID = generateGroupID(user_id);
      const memberList = selectedMembers.map((member) => ({
        name: member.name,
        avatar: member.avatar,
        memberID: member._id,
        role: "member",
        lastRead: 0,
        unread: true,
      }));

      memberList.push({
        name: user_name,
        avatar: user_avatar,
        memberID: user_id,
        role: "leader",
        lastRead: 0,
        unread: true,
      });

      const groupInfor = {
        _id: groupID,
        avatar:
          "https://chat-app-image-cnm.s3.ap-southeast-1.amazonaws.com/avatar.jpg",
        name: user_name,
        groupName: data.name,
        message: "created new group",
        time: getCurrentTime(),
      };

      const notification = {
        memberAvatar: user_avatar,
        memberID: user_id,
        memberName: user_name,
        message: " has been added by ",
        members: memberList,
        time: getCurrentTime(),
        type: "notification",
      };

      socket.emit("create-group-conversation", memberList, groupInfor, (response) => {
        if (response.success) {
          let connectionsLocal = {};
          memberList.forEach((member) => {
            dispatch(ResetCurrentMessages());
            dispatch(UpdateGroupCurrentConversation({ ...groupInfor, members: memberList }));
            if (!connectionsLocal[member.memberID]) {
              const ws = createWebsocket(member.memberID, dispatch, 0);
              connectionsLocal[member.memberID] = ws;
              ws.onopen = () => {
                console.log(
                  `Kết nối WebSocket đã sẵn sàng cho thành viên ${member.memberID}.`
                );

                ws.send(
                  JSON.stringify({
                    type: "create-group",
                    message: {
                      ...groupInfor,
                      members: memberList,
                    },
                  })
                );

                ws.onclose = () => {
                  console.log(
                    `Kết nối WebSocket cho thành viên ${member.memberID} đã đóng.`
                  );
                };

                ws.close();
              };

              ws.onerror = (error) => {
                console.error(
                  `Lỗi kết nối WebSocket cho thành viên ${member.memberID}:`,
                  error
                );
              };
            }
          });
          console.log("Group conversation created successfully.");
        } else {
          console.error("Error:", response.error);
        }
      });

      socket.emit(
        "add-message",
        notification,
        groupID,
        (response) => {
          if (response.success) {
            connections[group_current_conversation._id].send(
              JSON.stringify({
                type: "send-group-message",
                message: notification,
                groupID: groupID,
              })
            );
          } else {
            console.error("Error:", response.error);
          }
        }
      );
    } catch (error) {
      console.error("Error creating group conversation:", error);
    }
  };

  const handleMemberSelect = (friend) => {
    if (!selectedMembers.some((member) => member._id === friend._id)) {
      setSelectedMembers((prev) => [...prev, friend]);
      methods.setValue("members", [...selectedMembers, friend]);
    }
  };

  const renderFriendList = () => {
    const list = search === "" ? friends : filteredOptions;
    return list.map((friend) => {
      const isSelected = selectedMembers.some(
        (member) => member._id === friend._id
      );
      if (isSelected) return null;
      return (
        <MemberElement
          key={friend._id}
          name={friend.name}
          email={friend.email}
          img={friend.avatar}
          _id={friend._id}
          onClick={() => handleMemberSelect(friend)}
        />
      );
    });
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="name" label="Name" />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={filteredOptions}
          getOptionLabel={(option) => option.name}
          value={selectedMembers}
          onChange={(event, newValue) => {
            setSelectedMembers(newValue);
            methods.setValue("members", newValue); // Cập nhật giá trị trong form
          }}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          ChipProps={{ size: "medium" }}
          inputValue={search} // Sử dụng state search làm giá trị nhập vào
          onInputChange={handleSearchChange} // Lắng nghe sự kiện thay đổi nội dung nhập
        />

        <ScrollbarCustom>{renderFriendList()}</ScrollbarCustom>
        <Stack
          spacing={2}
          direction="row"
          alignItems={"center"}
          justifyContent="end"
        >
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const GroupAddMembers = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogContent>
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default GroupAddMembers;
