import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { FetchFriends } from "../../redux/slices/app";
import {
  UpdateGroupConversations,
  UpdateGroupCurrentConversation,
} from "../../redux/slices/group";
import { format } from "date-fns";
import { socket } from "../../socket";
import { createWebsocket, releaseWebsockets } from "../../pieSocket";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupForm = ({ handleClose }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const dispatch = useDispatch();
  const { friends } = useSelector((state) => state.app);

  useEffect(() => {
    const user_id = window.localStorage.getItem("user_id");
    dispatch(FetchFriends(user_id));
  }, [dispatch]);

  const NewGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    members: Yup.array()
      .of(
        Yup.object().shape({
          _id: Yup.string().required(), // Đảm bảo mỗi thành viên có _id
          name: Yup.string().required(), // Đảm bảo mỗi thành viên có tên
        })
      )
      .min(2, "Group must have at least 2 members"),
  });

  const defaultValues = {
    title: "",
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setError,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const user_id = window.localStorage.getItem("user_id");
      const user_name = window.localStorage.getItem("user_name");
      const randomNumber = Math.floor(Math.random() * 10000);
      const formattedNumber = randomNumber.toString().padStart(4, "0");
      const groupID = formattedNumber + "-" + user_id;
      const membersID = [];
      for (const member of selectedMembers) {
        membersID.push(member._id);
      }
      membersID.push(user_id);
      const currentTime = new Date();
      const formattedTime = format(currentTime, "HH:mm");
      const groupInfor = {
        _id: user_id,
        avatar:
          "https://chat-app-image-cnm.s3.ap-southeast-1.amazonaws.com/avatar.jpg",
        name: user_name,
        groupName: data.title,
        message: "New group created",
        time: formattedTime,
      };
      console.log("membersID", membersID);

      socket.emit(
        "create-group-conversation",
        groupID,
        membersID,
        groupInfor,
        (data) => {
          // Xử lý phản hồi từ máy chủ
          if (data.groupConversation) {
            let connections = {};
            let connectionsCount = 0; 
            selectedMembers.forEach((member) => {
              // Kiểm tra xem kết nối đã tồn tại cho thành viên này chưa
              if (!connections[member._id]) {
                // Tạo kết nối WebSocket mới cho thành viên này
                connections[member._id] = createWebsocket(
                  member.memberID,
                  dispatch,
                  0
                );

                // Xác nhận rằng kết nối đã sẵn sàng
                connections[member._id].onopen = () => {
                  connectionsCount++;
                  console.log(
                    `Kết nối WebSocket đã sẵn sàng cho thành viên ${member._id}.`
                  );

                  connections[member._id].send(
                    JSON.stringify({
                      type: "create-group",
                      message: data.groupConversation,
                    })
                  );
                };

                // Xử lý lỗi nếu có
                connections[member._id].onerror = (error) => {
                  console.error(
                    `Lỗi kết nối WebSocket cho thành viên ${member._id}:`,
                    error
                  );
                };
              }
            });
          } else {
            // Xử lý khi có lỗi hoặc không có dữ liệu được trả về từ máy chủ
            console.error("Error creating group conversation.");
          }
        }
      );
    } catch (error) {
      console.log("error", error);
    }
    handleClose();
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="title" label="Title" />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={friends.map((friend) => ({
            _id: friend._id,
            name: friend.name,
          }))}
          getOptionLabel={(option) => option.name}
          value={selectedMembers}
          onChange={(event, newValue) => {
            setSelectedMembers(newValue);
            methods.setValue("members", newValue); // Cập nhật giá trị trong form
          }}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          ChipProps={{ size: "medium" }}
        />
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

const CreateGroup = ({ open, handleClose }) => {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      sx={{ p: 4 }}
    >
      {/* Title */}
      <DialogTitle sx={{ mb: 2 }}>Create new group</DialogTitle>
      {/* Content */}
      <DialogContent>
        {/* Form */}
        <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
