import React, { useState } from "react";
import { Box, Badge, Stack, Avatar, Typography } from "@mui/material";
import { styled, useTheme, alpha } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateGroupCurrentConversation,
  ToggleSidebarState,
  FetchCurrentMessages,
  UpdateSidebarType,
  UpdateRole,
} from "../redux/slices/group";
import { socket } from "../socket";

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

const GroupElement = ({
  _id,
  name,
  groupName,
  avatar,
  time,
  online,
  message,
  members,
  type,
  isActive,
  onSelect,
}) => {
  const dispatch = useDispatch();
  const { room_id } = useSelector((state) => state.auth);
  const { sidebar } = useSelector((state) => state.group);
  const { user_id, user_name } = useSelector((state) => state.auth);
  const [isHovered, setIsHovered] = useState(false);

  const { lastRead, unread } = members.find((member) => {
    return member.memberID === user_id;
  }) || {};

  function isLink(str) {
    const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
    return regex.test(str);
  }

  const nameConvert = name === user_name ? "You" : name;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const groupInfo = {
    _id,
    name,
    groupName,
    avatar,
    time,
    message,
    members,
  };

  const theme = useTheme();

  const fetchGroupChatHistory = async (groupId) => {
    try {
      const response = await new Promise((resolve) => {
        socket.emit("fetch-group-chat-history-group-id", groupId, (response) => {
          resolve(response);
        });
      });

      if (response.success) {
        dispatch(FetchCurrentMessages(response.messages));
      } else {
        console.error("Error:", response.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleGroupClick = async () => {
    dispatch(UpdateGroupCurrentConversation(groupInfo));
    if (sidebar.open) dispatch(ToggleSidebarState());
    if (sidebar.type !== "CONTACT") dispatch(UpdateSidebarType("CONTACT"));
    if (user_id) {
      const role = members.find((member) => member.memberID === user_id).role;
      dispatch(UpdateRole(role));
    }

    try {
      await fetchGroupChatHistory(_id);
    } catch (error) {
      console.error("Error:", error);
    }

    if (onSelect) {
      onSelect(_id);
    }
  };

  return (
    <StyledChatBox
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleGroupClick}
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: isHovered
          ? alpha(theme.palette.primary.main, 0.5)
          : isActive
          ? theme.palette.mode === "light"
            ? alpha(theme.palette.primary.main, 0.5)
            : theme.palette.primary.main
          : theme.palette.mode === "light"
          ? "#fff"
          : theme.palette.background.paper,
        transition: "background-color 0.3s",
      }}
      p={2}
      my={2}
      tabIndex="0"
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={groupName} src={avatar} />
            </StyledBadge>
          ) : (
            <Avatar alt={groupName} src={avatar} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">
              {truncateText(groupName, 20)}
            </Typography>
            <Typography variant="caption">
              {nameConvert + ": "}
              {type === "text"
                ? isLink(message)
                  ? "has sent a link"
                  : truncateText(message, 12)
                : type === "image"
                ? "has sent an image"
                : type === "doc"
                ? "has sent a document"
                : type === "reply"
                ? "has replied to a message"
                : type === "timeline"
                ? truncateText(message, 12)
                : type === "notification"
                ? "has sent a notification"
                : type === "voice"
                ? "has sent a voice message"
                : truncateText(message, 12)}
            </Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={"center"}>
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time && time.length >= 16 ? time.slice(11, 16) : ""}
          </Typography>
          <Badge
            className="unread-count"
            color="primary"
            badgeContent={lastRead > 0 ? lastRead : null}
          />
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default GroupElement;
