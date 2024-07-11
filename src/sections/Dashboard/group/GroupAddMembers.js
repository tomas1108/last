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
import { FetchFriends, FetchUsers } from "../../../redux/slices/app";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import RHFAutocomplete from "../../../components/hook-form/RHFAutocomplete";
import RHFTextField from "../../../components/hook-form/RHFTexField";
import { MemberElement } from "../../../components/UserElement";
import ScrollbarCustom from "../../../components/ScrollbarCustom";
import FormProvider from "../../../components/hook-form/FormProvider";
import { createWebsocket, releaseWebsockets } from "../../../pieSocket";
import { UpdateGroupMembers } from "../../../redux/slices/group";
import { socket } from "../../../socket";
import { getCurrentTime } from "../../../utils/timeUtils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddMemberForm = ({ handleClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const { user_id, user_name, user_avatar } = useSelector(
    (state) => state.auth
  );
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.app);
  const { members } = useSelector(
    (state) => state.group.group_current_conversation
  );
  const { group_current_conversation, connections } = useSelector(
    (state) => state.group
  );
  const [filteredOptions, setFilteredOptions] = useState([]); // Danh sách phần tử được lọc

  const isMember = (friend) => {
    return members.some((member) => member.memberID === friend._id);
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

  const onSubmit = async (data) => {
    const memberList = selectedMembers.map((member) => ({
      name: member.name,
      avatar: member.avatar,
      memberID: member._id,
      role: "member",
    }));

    // console.log(
    //   "Danh sách tv trong nhóm: ",
    //   group_current_conversation.members
    // );
    // console.log("Danh sách tv cần thêm: ", memberList);
    // let connectionsCount = 0; // Biến đếm số lượng kết nối WebSocket đã hoàn tất
    // let mergeList = [...group_current_conversation.members,...memberList];

    const notification = {
      memberAvatar: user_avatar,
      memberID: user_id,
      memberName: user_name,
      message: " has been added by ",
      members: memberList,
      time: getCurrentTime(),
      type: "notification",
    };

    let connectionsLocal = {};
    socket.emit(
      "update-group-members",
      memberList,
      group_current_conversation._id,
      (data) => {
        if (data.success) {
          console.log("Group members updated successfully.");
          memberList.forEach((member) => {
            // Tạo kết nối WebSocket mới cho thành viên này
            connectionsLocal[member.memberID] = createWebsocket(
              member.memberID,
              dispatch,
              0
            );
            // Xác nhận rằng kết nối đã sẵn sàng
            connectionsLocal[member.memberID].onopen = () => {
              console.log(
                `Kết nối WebSocket đã sẵn sàng cho thành viên ${member.memberID}.`
              );

              connectionsLocal[member.memberID].send(
                JSON.stringify({
                  type: "update-group",
                  groupConversationData: group_current_conversation,
                  members: memberList,
                })
              );
              // Sau khi gửi xong dữ liệu, bạn cần lắng nghe sự kiện "onclose" để đảm bảo rằng kết nối đã đóng trước khi tiếp tục
              connectionsLocal[member.memberID].onclose = () => {
                console.log(
                  `Kết nối WebSocket cho thành viên ${member.memberID} đã đóng.`
                );
              };

              // Đóng kết nối sau khi gửi xong dữ liệu
              connectionsLocal[member.memberID].close();
            };

            // Xử lý lỗi nếu có
            connectionsLocal[member.memberID].onerror = (error) => {
              console.error(
                `Lỗi kết nối WebSocket cho thành viên ${member.memberID}:`,
                error
              );
            };
          });

          if (connections[group_current_conversation._id]) {
            connections[group_current_conversation._id].send(
              JSON.stringify({
                type: "update-group-members",
                members: memberList,
              })
            );
          } else {
            console.error("No active connection for current group conversation.");
          }
        } else {
          console.error("Error updating group members.");
        }
      }
    );
    
    socket.emit(
      "add-message",
      notification,
      group_current_conversation._id,
      (response) => {
        if (response.success) {
          connections[group_current_conversation._id].send(
            JSON.stringify({
              type: "send-group-message",
              message: notification,
              groupID: group_current_conversation._id,
            })
          );
        } else {
          console.error("Error:", response.error);
        }
      }
    );

    handleClose();
  };

  const handleMemberSelect = (friend) => {
    if (!selectedMembers.some((member) => member._id === friend._id)) {
      setSelectedMembers((prev) => [...prev, friend]);
      methods.setValue("members", [...selectedMembers, friend]);
    }
  };

  const renderFriendList = () => {
    if (search === "") {
      return friends.map((friend) => {
        // Kiểm tra xem friend đã được chọn hay không
        const isSelected = selectedMembers.some(
          (member) => member._id === friend._id
        );
        const isMember = group_current_conversation.members.some(
          (member) => member.memberID === friend._id
        );
        // Nếu đã được chọn, bỏ qua việc render
        if (isSelected || isMember) return null;
        // Nếu chưa được chọn, render thành viên
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
    } else {
      return filteredOptions.map((friend) => {
        // Kiểm tra xem friend đã được chọn hay không
        const isSelected = selectedMembers.some(
          (member) => member._id === friend._id
        );
        const isMember = group_current_conversation.members.some(
          (member) => member.memberID === friend._id
        );
        // Nếu đã được chọn, bỏ qua việc render
        if (isSelected || isMember) return null;
        // Nếu chưa được chọn, render thành viên
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
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Stack spacing={3}>
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
            Add
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
        <AddMemberForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default GroupAddMembers;
