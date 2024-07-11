import React, { useState } from "react";
import { Box, Badge, Stack, Avatar, Typography } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SelectConversation } from "../redux/slices/app";

const truncateText = (string, n) => {
  return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

const StyledChatBox = styled(Box)(({ theme }) => ({
  "&:hover": {
    cursor: "pointer",
  },
}));

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

const ChatElement = ({ img, name, msg, time, unread, online, id }) => {
  const dispatch = useDispatch();
  const { room_id } = useSelector((state) => state.app);
  const selectedChatId = room_id?.toString();
  const isSelected = selectedChatId === id.toString();
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleOnClick = () => {
    dispatch(SelectConversation({ room_id: id }));
  };

  const getBackgroundColor = () => {
    if (isHovered || isSelected) {
      return theme.palette.mode === 'light' ? '#e3f2fd' :  alpha(theme.palette.primary.main, 0.5); // Màu nền xanh nhạt hoặc đen nhạt tùy thuộc vào chế độ màu
    } else {
      return 'transparent';
    }
  };

  return (
    <StyledChatBox
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOnClick}
      sx={{
        width: '100%',
        borderRadius: 1,
        backgroundColor: getBackgroundColor(), // Sử dụng hàm để xác định màu nền
        transition: 'background-color 0.3s',
      }}
      p={2}
      my={2}
      tabIndex="0"
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {msg.length > 35 ? `${msg.slice(0, 35)}...` : msg}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {time}
          </Typography>
          <Badge className="unread-count" color="error" badgeContent={unread > 5 ? '5+' : unread} />
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default ChatElement;
