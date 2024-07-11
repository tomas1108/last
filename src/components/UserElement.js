import React, { useEffect } from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Chat, Phone, Prohibit, UserPlus, VideoCamera } from "phosphor-react";
import { socket } from "../socket";
import { FetchDirectConversations } from "../redux/slices/conversation";
import { useDispatch } from "react-redux";
import { SimpleBarStyle } from "./Scrollbar";
import { createWebsocket } from "../pieSocket";
import { useSelector } from "react-redux";  
import CustomSnackBar from "./CustomSnackBar";
var pieSocket
const user_id = window.localStorage.getItem("user_id");


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

const UserElement = ({ online, avatar, name, _id, email }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {user_name} = useSelector((state) => state.auth);
  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={avatar} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={avatar} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{email}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            onClick={() => {
              console.log("Send friend request to ", _id);
              socket.emit("friend_request", { to: _id, from: user_id }, () => {
                alert("request sent"); }
              );
              pieSocket = createWebsocket(_id, dispatch, 0);
              pieSocket.onopen = () => {
                console.log("Friend request socket opened");
                const message = `You have a friend request from ${user_name}`;

                pieSocket.send(JSON.stringify({ type: "friend_request",message , to: _id, from: user_id}));
              };

              pieSocket.close = () => {
                console.log("Friend request socket closed");
              }


            }}
          >
            Send Request
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

const FriendRequestElement = ({
  avatar,
  name,
  incoming,
  missed,
  online,
  _id,


}) => {
  const theme = useTheme();

  const Username = name;

  return (
    <StyledChatBox
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={avatar} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={avatar} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{Username}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={() => {
              //  emit "accept_request" event
              socket.emit("accept_request", { to: _id, from: user_id });
            }}
          >
            Accept
          </Button>
          <Button>
            Decline
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

// FriendElement

const FriendElement = ({
  avatar,
  name,
  online,
  _id,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const Username = name;

  return (

    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"

      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={avatar} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={avatar} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{Username}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            onClick={() => {
              // start a new conversation
              socket.emit("start_conversation", { to: _id, from: user_id, avatar: avatar, name: name }, (data) => {
                dispatch(FetchDirectConversations({ conversations: data }));
              })
              // socket.emit("get_direct_conversations", {user_id} , (data) => {
              //   console.log("Get direct" ,data); // this data is the list of conversations
              //   // dispatch action
              //   dispatch(FetchDirectConversations({ conversations: data }));
              // });
            }}

          >
            <Chat />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          <IconButton>
            <Prohibit />
          </IconButton>



        </Stack>
      </Stack>
    </StyledChatBox>

  );
};

const MemberElement = ({ online, img, name, _id, email, onClick }) => {
  const theme = useTheme();
  return (
    <StyledChatBox
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
      onClick={onClick}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{email}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
          // onClick={() => {
          //   socket.emit("friend_request", { to: _id, from: user_id }, () => {
          //     alert("request sent");
          //   });
          // }}
          >
            <UserPlus size={30} />
          </Button>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};




export { UserElement, FriendRequestElement, FriendElement, MemberElement };
