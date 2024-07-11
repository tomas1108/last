import React, { useState } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Stack,
  styled,
  Typography,
  List, ListItem, ListItemIcon, ListItemText
} from "@mui/material";
import { Edit, Group, Share, Block, Report, Delete } from '@mui/icons-material';
import { useTheme } from "@mui/material/styles";
import { CaretDown, MagnifyingGlass, Phone, VideoCamera, X } from "phosphor-react";

import useResponsive from "../../hooks/useResponsive";
import { ToggleSidebar } from "../../redux/slices/app";
import { useDispatch, useSelector } from "react-redux";

import { faker } from "@faker-js/faker";
import ScrollbarCustom from "../ScrollbarCustom";
import ScrollbarNormal from "../ScrollbarNormal";

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

const ChatHeader = () => {
  const dispatch = useDispatch();
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  const { current_conversation } = useSelector((state) => state.conversation.direct_chat);
  const [backgroundImg, setBackgroundImg] = useState(faker.image.fashion()); // Sử dụng useState để lưu trữ URL ảnh nền
  const [conversationMenuAnchorEl, setConversationMenuAnchorEl] = useState(null);
  const openConversationMenu = Boolean(conversationMenuAnchorEl);
  const handleClickConversationMenu = (event) => {
    setConversationMenuAnchorEl(event.currentTarget);
  };
  const handleCloseConversationMenu = () => {
    setConversationMenuAnchorEl(null);
  };
  const handleContactInfoClick = () => {
    dispatch(ToggleSidebar());
    handleCloseConversationMenu();
  };
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Hàm để chuyển đổi người dùng
  const switchUser = (newUser) => {
    setBackgroundImg(faker.image.fashion()); // Cập nhật backgroundImg với ảnh ngẫu nhiên mới khi chuyển đổi người dùng
    // Các bước khác để cập nhật thông tin người dùng khác
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
            spacing={2}
            direction="row"
          >
            <Box onClick={handleOpenModal}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
                onClick={() => switchUser()} // Gọi hàm switchUser khi click vào StyledBadge

              >
                <Avatar
                  alt={current_conversation?.name}
                  src={current_conversation?.img}
                />
              </StyledBadge>
            </Box>
            <Stack spacing={0.2}>
              <Typography variant="subtitle2">
                {current_conversation?.name}
              </Typography>
              <Typography variant="caption">Online</Typography>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            alignItems="center"
            spacing={isMobile ? 1 : 3}
          >
            <IconButton onClick={() => {

            }}>
              <VideoCamera />
            </IconButton>
            <IconButton
              onClick={() => {

              }}
            >
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
                  {Conversation_Menu.map((el) => (
                    <MenuItem key={el.title} onClick={el.title === "Contact info" ? handleContactInfoClick : handleCloseConversationMenu}>
                      <Stack
                        sx={{ minWidth: 100 }}
                        direction="row"
                        alignItems={"center"}
                        justifyContent="space-between"
                      >
                        <span>{el.title}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Stack>
              </Box>
            </Menu>
          </Stack>
        </Stack>
      </Box>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative', // để Box cha có thể chứa Box con tương đối
          }}
        >
          {/* Thêm Button đóng modal */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1,
              padding: 1,
            }}
          >
            <IconButton onClick={handleCloseModal}>
              <X />
            </IconButton>
          </Box>
          <ScrollbarNormal autoHeightMax="70vh">
            <Box
              sx={{
                overflowY: 'auto',
              }}
            >
              {/* Phần 1 với ảnh nền */}
              <Box
                sx={{
                  backgroundColor: '#ffa690',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: 150,
                  position: 'relative',
                }}
              >
              </Box>
              <Box sx={{ textAlign: 'center', mt: -8, p: 2 }}>
                <Avatar
                  alt={current_conversation?.name}
                  src={current_conversation?.img}
                  sx={{ width: 80, height: 80, margin: '0 auto', border: '2px solid white' }}
                />
                <Stack direction="row" justifyContent="center" alignItems="center">
                  <Typography id="modal-modal-title" variant="h6" component="h2">
                    {current_conversation?.name}
                  </Typography>
                </Stack>
                <Button variant="outlined" color="secondary" sx={{ mt: 1, width: "95%", borderRadius: 1 }}>
                  Chat
                </Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Phần 2 */}
              <Box sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 'bold' }}>Personal Information</Typography>
                <Stack sx={{ mt: 2 }}>
                  <Stack direction="row">
                    <Typography sx={{ minWidth: 100 }}>Gender:</Typography>
                    <Typography>{current_conversation?.about?.sex}</Typography>
                  </Stack>

                  <Stack direction="row">
                    <Typography sx={{ minWidth: 100 }}>Birthday:</Typography>
                    <Typography>{current_conversation?.about?.birthday}</Typography>
                  </Stack>

                  <Stack direction="row">
                    <Typography sx={{ minWidth: 100 }}>Email:</Typography>
                    <Typography>{current_conversation?.about?.email}</Typography>
                  </Stack>
                </Stack>
              </Box>
              <Divider sx={{ my: 2 }} />
              {/* Phần 3 */}
              <Box sx={{ px: 2, pb: 2 }}>
                <Typography sx={{ fontWeight: 'bold', mb: 1 }}>Photo</Typography>
                <Typography>No shared images</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ px: 2, pb: 2 }}>
                <List>
                  <ListItem button>
                    <ListItemIcon>
                      <Share />
                    </ListItemIcon>
                    <ListItemText primary="Share contact" />
                  </ListItem>
                  <ListItem button>
                    <ListItemIcon>
                      <Block />
                    </ListItemIcon>
                    <ListItemText primary="Block messages and calls" />
                  </ListItem>

                  <ListItem button>
                    <ListItemIcon>
                      <Delete />
                    </ListItemIcon>
                    <ListItemText primary="Remove Friend" />
                  </ListItem>
                </List>
              </Box>
            </Box>
          </ScrollbarNormal>
        </Box>
      </Modal>
    </>
  );
};

export default ChatHeader;
