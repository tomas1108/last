import React, {useState} from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera, PencilSimpleLine } from "phosphor-react";
import { UsersThree } from "phosphor-react";
import useResponsive from "../../hooks/useResponsive";
import { ResetCurrentMessages, ToggleSidebarState } from "../../redux/slices/group";
import { useDispatch, useSelector } from "react-redux";
import zIndex from "@mui/material/styles/zIndex";
import GroupNameModal from "../../sections/Dashboard/group/GroupNameModal";
import { socket } from "../../socket";
const GroupName = ({ group_current_conversation }) => {
  const [editing, setEditing] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const handleEditClick = () => {
    setEditing(true);
    setNewGroupName(group_current_conversation?.groupName || "");
  };

  const handleSaveClick = () => {
    // Thực hiện logic lưu tên mới ở đây
    console.log("Tên mới:", newGroupName);
    setEditing(false);
  };

  const handleCancelClick = () => {
    setEditing(false);
    // Reset tên mới về tên hiện tại của nhóm
    setNewGroupName(group_current_conversation?.groupName || "");
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="start"
      >
        <Box sx={{ display: "flex", alignItems: "start"}}>
          <Typography
            variant="article"
            sx={{ fontSize: 16, textAlign: "start", flexGrow: 1 }}
          >
            {group_current_conversation?.groupName}
          </Typography>
        </Box>
        <IconButton sx={{ml: 1}} onClick={handleEditClick} size="small">
          <PencilSimpleLine />
        </IconButton>
      </Stack>

      <GroupNameModal
        open={editing} // Đặt open thành trạng thái của editing
        onClose={handleCancelClick} // Đóng modal khi người dùng hủy
        onSave={handleSaveClick} // Lưu tên mới khi người dùng bấm Lưu
        currentName={group_current_conversation?.groupName} // Truyền tên hiện tại vào modal
        newName={newGroupName} // Truyền tên mới vào modal
        setNewName={setNewGroupName} // Đặt tên mới từ modal
        avatar={group_current_conversation?.avatar} // Truyền avatar của nhóm vào modal
      />
    </>
  );
};


const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const Conversation_Menu = [
  {
    title: "Contact info",
  },
  {
    title: "Mute notifications",
  },
  {
    title: "Clear messages",
  },
  {
    title: "Delete chat",
  },
];

const GroupChatHeader = () => {
  const dispatch = useDispatch();
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  const { group_current_conversation, connections } = useSelector((state) => state.group);

  const [conversationMenuAnchorEl, setConversationMenuAnchorEl] =
    React.useState(null);
  const openConversationMenu = Boolean(conversationMenuAnchorEl);
  const handleClickConversationMenu = (event) => {
    setConversationMenuAnchorEl(event.currentTarget);
  };


  const handleClick = (title) => {
    if (title === "Contact info") {
      dispatch(ToggleSidebarState());
    } else if (title === "Clear messages") {
      dispatch(ResetCurrentMessages());
    } else if (title === "Delete chat") {
      socket.emit("delete-group", group_current_conversation._id, (data) => {
        if (data.success) {
          console.log(connections[group_current_conversation._id])
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
    }
    handleCloseConversationMenu();
  };

  const handleCloseConversationMenu = () => {
    setConversationMenuAnchorEl(null);
  };

  return (
    <>
      <Box
        p={2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack
          alignItems={"center"}
          direction={"row"}
          sx={{ width: "100%", height: "100%" }}
          justifyContent="space-between"
        >
          <Stack
            // onClick={() => {
            //   dispatch(ToggleSidebarState());
            // }}
            spacing={2}
            direction="row"
          >
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
              >
                <Avatar
                  alt={group_current_conversation?.groupName}
                  src={group_current_conversation?.avatar}
                />
              </StyledBadge>
            </Box>
            <Stack>
              <GroupName group_current_conversation={group_current_conversation} />
              <Stack spacing={1} direction="row" alignItems="center">
                <UsersThree size={20}/>
                <Typography variant="caption">
                  Members: {group_current_conversation.members.length}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={isMobile ? 1 : 3}
          >
            <IconButton onClick={() => {}}>
              <VideoCamera />
            </IconButton>
            <IconButton onClick={() => {}}>
              <Phone />
            </IconButton>
            {!isMobile && (
              <IconButton>
                <MagnifyingGlass />
              </IconButton>
            )}
            <Divider orientation="vertical" flexItem />
            <IconButton
              id="conversation-positioned-button"
              aria-controls={
                openConversationMenu
                  ? "conversation-positioned-menu"
                  : undefined
              }
              aria-haspopup="true"
              aria-expanded={openConversationMenu ? "true" : undefined}
              onClick={handleClickConversationMenu}
            >
              <CaretDown />
            </IconButton>
            <Menu
              MenuListProps={{
                "aria-labelledby": "fade-button",
              }}
              TransitionComponent={Fade}
              id="conversation-positioned-menu"
              aria-labelledby="conversation-positioned-button"
              anchorEl={conversationMenuAnchorEl}
              open={openConversationMenu}
              onClose={handleCloseConversationMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Box p={1}>
                <Stack spacing={1}>
                  {Conversation_Menu.map((el, idx) => (
                    <MenuItem key={idx} onClick={() => handleClick(el.title)}
                    >
                      
                      <Stack
                        sx={{ minWidth: 100 }}
                        direction="row"
                        alignItems={"center"}
                        justifyContent="space-between"
                      >
                        <span>{el.title}</span>
                      </Stack>{" "}
                    </MenuItem>
                  ))}
                </Stack>
              </Box>
            </Menu>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default GroupChatHeader;
