import React, { useCallback, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Slide,
  TextField,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import {
  Bell,
  CaretRight,
  Phone,
  Prohibit,
  Star,
  Trash,
  User,
  UsersThree,
  VideoCamera,
  LinkSimple,
  Article,
  UserPlus,
  X,
  SignOut,
  Warning,
  PencilSimpleLine,
  Check,
  XCircle,
} from "phosphor-react";
import useResponsive from "../../../hooks/useResponsive";
import AntSwitch from "../../../components/AntSwitch";
import { useDispatch, useSelector } from "react-redux";
import {
  ToggleSidebarState,
  UpdateSidebarType,
  RemoveGroupConversation,
  ResetGroupState,
  RemoveWebSocketConnection
} from "../../../redux/slices/group";
import ScrollbarCustom from "../../../components/ScrollbarCustom";
import GroupAddMembers from "./GroupAddMembers";
import ConfirmDialog from "../../../components/ConfirmForm";
import { createWebsocket } from "../../../pieSocket";
import { socket } from "../../../socket";
import { RHFUploadGroupAvatar } from "../../../components/hook-form/RHFUpload";
import FormProvider from "../../../components/hook-form/FormProvider";
import { useForm } from "react-hook-form";
import GroupNameModal from "./GroupNameModal";
import S3 from "../../../utils/s3";
import { getCurrentTime } from "../../../utils/timeUtils";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GroupName = ({ group_current_conversation }) => {
  const [editing, setEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const { user_id, user_avatar, user_name } = useSelector((state) => state.auth);
  const { connections } = useSelector((state) => state.group);

  const handleEditClick = () => {
    setEditing(true);
    setNewGroupName(group_current_conversation?.groupName || "");
  };

  const handleSaveClick = () => {
    console.log("New group name:", newGroupName);
    socket.emit("update-group-name", newGroupName, group_current_conversation._id, (response) => {
      if (response.success) {
        connections[group_current_conversation._id].send(
          JSON.stringify({
            type: "update-group-name",
            name: newGroupName,
            groupID: group_current_conversation._id,
          })
        );
        console.log("Avatar updated successfully");
      } else {
        console.log("Error updating avatar:", response.error);
      }
    });

    const notification = {
      memberAvatar: user_avatar,
      memberID: user_id,
      memberName: user_name,
      message: " changed the group name to " + newGroupName + ".",
      members: [],
      time: getCurrentTime(),
      type: "notification",
    };

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
    console.log("Tên mới:", newGroupName);
    setEditing(false);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setNewGroupName(group_current_conversation?.groupName || "");
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        justifyContent="space-between"
      >
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          {editing ? (
            <TextField
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              variant="standard"
              size="small"
              fullWidth
            />
          ) : (
            <Typography
              variant="article"
              fontWeight={800}
              sx={{ fontSize: 18, textAlign: "center", flexGrow: 1 }}
            >
              {group_current_conversation?.groupName}
            </Typography>
          )}
        </Box>
        {!editing && (
          <IconButton onClick={handleEditClick} size="small">
            <PencilSimpleLine />
          </IconButton>
        )}
      </Stack>
      {editing && (
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
          <Button onClick={handleSaveClick} size="small" variant="contained" color="primary">
            Save
          </Button>
          <Button onClick={handleCancelClick} size="small" variant="outlined" color="primary">
            Cancel
          </Button>
        </Stack>
      )}
    </>
  );
};


const GroupContact = () => {
  const dispatch = useDispatch();
  const { group_current_conversation, role, connections } = useSelector(
    (state) => state.group
  );

  const [openDialogAddMember, setOpenDialogAddMember] = useState(false);

  const handleCloseAddDialog = () => {
    setOpenDialogAddMember(false);
  };
  const handleOpenAddDialog = () => {
    setOpenDialogAddMember(true);
  };
  // FetchGroupConversations
  const isDesktop = useResponsive("up", "md");
  const [openDeleteGroup, setOpenDeleteGroup] = useState(false);
  const [openLeveGroup, setOpenLeaveGroup] = useState(false);
  const { user_id, user_avatar, user_name } = useSelector((state) => state.auth);
  const [file, setFile] = useState();

  const handleCloseLeaveGroupForm = () => {
    setOpenLeaveGroup(false);
  };

  const handleSubmitLeaveGroupForm = () => {
    const memberAfterUpdate = group_current_conversation.members.filter(
      (member) => member.memberID !== user_id
    );

    socket.emit('delete-member', user_id, group_current_conversation._id, callback => {
      if (callback.success) {
        console.log('Delete member successfully')
        connections[group_current_conversation._id].send(
          JSON.stringify({
            type: "update-group-members-leaved",
            members: memberAfterUpdate,
          })
        );
        connections[group_current_conversation._id].close()
        dispatch(RemoveWebSocketConnection(group_current_conversation._id));
        dispatch(RemoveGroupConversation(group_current_conversation._id));
        dispatch(ResetGroupState(group_current_conversation._id));
      } else {
        console.error(callback.error)
      }
    })
    const notification = {
      memberAvatar: user_avatar,
      memberID: user_id,
      memberName: user_name,
      message: " left the group. ",
      members: [],
      time: getCurrentTime(),
      type: "notification",
    };

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


    setOpenLeaveGroup(false);
  };

  const handleCloseDeleteGroupForm = () => {
    setOpenDeleteGroup(false);
  };

  const handleConfirmDeleteGroupForm = () => {
    socket.emit("delete-group", group_current_conversation._id, (data) => {
      if (data.success) {
        connections[group_current_conversation._id].send(
          JSON.stringify({
            type: "delete-group",
            groupID: group_current_conversation._id,
          })
        );
        console.log("Delete group successfully");
      } else {
        console.error("Error deleting group");
      }
    });

    setOpenDeleteGroup(false);
  };

  const methods = useForm({});

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods;

  const handleUpdateImage = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles || acceptedFiles.length === 0) {
        console.error("No valid file selected.");
        return;
      }
  
      const file = acceptedFiles[0];
      setFile(file);
  
      try {
        // Tải ảnh lên S3
        const key = generateFileName(file);
        const imageUrl = await uploadFileToS3(file, key);
        console.log("Uploaded image URL:", imageUrl);
  
        // Cập nhật hình ảnh lên server thông qua socket emit (nếu cần)
        socket.emit("update-group-avatar", imageUrl, group_current_conversation._id, (response) => {
          if (response.success) {
            connections[group_current_conversation._id].send(
              JSON.stringify({
                type: "update-group-avatar",
                avatar: imageUrl,
                groupID: group_current_conversation._id,
              })
            );
            console.log("Avatar updated successfully");
          } else {
            console.log("Error updating avatar:", response.error);
          }
        });

        const notification = {
          memberAvatar: user_avatar,
          memberID: user_id,
          memberName: user_name,
          message: " updated the group avatar.",
          members: [],
          time: getCurrentTime(),
          type: "notification",
        };
    
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
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    },
    [setFile, group_current_conversation, connections, user_avatar, user_id, user_name]
  );
  

  const generateFileName = (file) => {
    // Lấy ngày giờ hiện tại
    const timeStamp = Date.now();
    // Kết hợp tên người dùng, ngày giờ và tên file để tạo tên file mới
    return `image_${timeStamp}_${file.name}`;
  };

  const uploadFileToS3 = async (file, key) => {
    const params = {
      Bucket: "chat-app-image-cnm",
      Key: key,
      Body: file,
    };
    await S3.upload(params).promise();
    return `https://chat-app-image-cnm.s3.ap-southeast-1.amazonaws.com/${key}`;
  };

  return (
    <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            width: "100%",
            backgroundColor: "background",
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems={"center"}
            justifyContent="space-between"
            spacing={3}
          >
            <Typography variant="subtitle2">Group Info</Typography>
            <IconButton
              onClick={() => {
                dispatch(ToggleSidebarState());
              }}
            >
              <X />
            </IconButton>
          </Stack>
        </Box>
        <ScrollbarCustom autoHeightMin={600} autoHide={false}>
          <Stack
            sx={{
              height: "100%",
              position: "relative",
              flexGrow: 1,
            }}
            p={3}
            spacing={3}
          >
            <Stack
              alignItems="center"
              direction="column"
              spacing={2}
              justifyContent="center"
            >
              <Stack>
                <FormProvider methods={methods}>
                  <RHFUploadGroupAvatar
                    name="avatar"
                    maxSize={314572}
                    onDrop={handleUpdateImage}
                    avatar={group_current_conversation?.avatar}
                  />
                </FormProvider>

                {/* <Avatar
                  src={group_current_conversation?.avatar}
                  alt={group_current_conversation?.groupName}
                  sx={{ height: 64, width: 64 }}
                /> */}
              </Stack>
              <GroupName
                group_current_conversation={group_current_conversation}
              />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-evenly"}
            >
              {/* <Stack alignItems={"center"} spacing={1}>
                <IconButton>
                  <Phone />
                </IconButton>
                <Typography variant="overline">Voice</Typography>
              </Stack>
              <Stack alignItems={"center"} spacing={1}>
                <IconButton>
                  <VideoCamera />
                </IconButton>
                <Typography variant="overline">Video</Typography>
              </Stack> */}
            </Stack>
            <Divider />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
            >
              {group_current_conversation?.members && (
                <Stack direction="row" alignItems="center" spacing={2}>
                  <UsersThree size={21} />
                  <Typography variant="subtitle2">
                    Members: {group_current_conversation.members.length}
                  </Typography>
                </Stack>
              )}

              <IconButton
                onClick={() => {
                  dispatch(UpdateSidebarType("MEMBERS"));
                }}
              >
                <CaretRight />
              </IconButton>
            </Stack>
            <Divider />
            {role === "leader" && (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={"space-between"}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <UserPlus size={21} />
                    <Typography variant="subtitle2">Add Member</Typography>
                  </Stack>
                  <IconButton
                    onClick={() => {
                      handleOpenAddDialog();
                    }}
                  >
                    <CaretRight />
                  </IconButton>
                </Stack>
                <Divider />
              </>
            )}

            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <LinkSimple size={21} />
              <Typography variant="subtitle2">Media, Links & Docs</Typography>
              <Button
                onClick={() => {
                  dispatch(UpdateSidebarType("SHARED"));
                }}
                endIcon={<CaretRight />}
              >
                401
              </Button>
            </Stack>
            <Stack direction={"row"} alignItems="center" spacing={2}>
              {[1, 2, 3].map((e, index) => (
                <Box key={index}>
                  <img
                    key={index}
                    src={faker.image.city()}
                    alt={faker.internet.userName()}
                  />
                </Box>
              ))}
            </Stack>
            <Divider />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Star size={21} />
                <Typography variant="subtitle2">Starred Messages</Typography>
              </Stack>

              <IconButton
                onClick={() => {
                  dispatch(UpdateSidebarType("STARRED"));
                }}
              >
                <CaretRight />
              </IconButton>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Stack direction="row" alignItems="center" spacing={2}>
                <Bell size={21} />
                <Typography variant="subtitle2">Mute Notifications</Typography>
              </Stack>
              <AntSwitch />
            </Stack>
            <Divider />
            {role === "leader" && (
              <>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent={"space-between"}
                  onClick={() => setOpenDeleteGroup(true)}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    sx={{ color: "error.main" }}
                  >
                    <Trash size={21} />
                    <Typography variant="subtitle2">Delete group</Typography>
                  </Stack>
                </Stack>
                <Divider />
              </>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ color: "error.main" }}
              >
                <Warning size={21} />
                <Typography variant="subtitle2">Report</Typography>
              </Stack>
            </Stack>
            <Divider />
            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"space-between"}
              onClick={() => setOpenLeaveGroup(true)}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ color: "error.main" }}
              >
                <SignOut size={21} />
                <Typography variant="subtitle2">Leave group</Typography>
              </Stack>
            </Stack>
            <Divider />
          </Stack>
        </ScrollbarCustom>
      </Stack>
      {openDialogAddMember && (
        <GroupAddMembers
          open={openDialogAddMember}
          handleClose={handleCloseAddDialog}
        />
      )}
      {openDeleteGroup && (
        <ConfirmDialog
          onClose={handleCloseDeleteGroupForm}
          onConfirm={handleConfirmDeleteGroupForm}
          open={openDeleteGroup}
          title={"Delete this group"}
          content={"Are you sure you want to delete this group?"}
          cancelContent={"Cancel"}
          submitContent={"Delete"}
        />
      )}
      {openLeveGroup && (
        <ConfirmDialog
          onClose={handleCloseLeaveGroupForm}
          onConfirm={handleSubmitLeaveGroupForm}
          open={openLeveGroup}
          title={"Leave this group"}
          content={"Are you sure you want to leave this group?"}
          cancelContent={"Cancel"}
          submitContent={"Leave"}
        />
      )}
    </Box>
  );
};

export default GroupContact;
