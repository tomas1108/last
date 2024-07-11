import { Stack, Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { Chat_History } from "../../data";
import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";

import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  Notice,
  ReplyMsg,
  TextMsg,
  Timeline,
  VoiceMsg,
} from "../../sections/Dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import {
  AddDirectMessage,
  FetchCurrentMessages,
  SetCurrentConversation,

} from "../../redux/slices/conversation";
import { socket } from "../../socket";
import ScrollbarCustom from "../../components/ScrollbarCustom";
const Conversation = ({ isMobile, menu }) => {
  const dispatch = useDispatch();
  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { room_id } = useSelector((state) => state.app);

  useEffect(() => {
    // Fetch current messages
    const current = conversations.find((el) => el?.id === room_id);
    
    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      console.log(data, "List of messages");
      dispatch(FetchCurrentMessages({ messages: data }));
    });


    // Set current conversation
    dispatch(SetCurrentConversation(current));
  }, [room_id, conversations, dispatch]);



  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack spacing={3}>
        {current_messages.map((el, idx) => (
          // console.log("chat", current_messages , el),
          <React.Fragment key={idx}>
            {(() => {
              switch (el.type) {
                case "divider":
                  //thời gian
                  return <Timeline el={el} />
                case "notice":
                  // thông báo
                  return <Notice el={el} />
                case "text":
                  // tin nhắn văn bản
                  return <TextMsg el={el} menu={menu} />
                case "image" :
                  // hình ảnh  
                  return <MediaMsg el={el} menu={menu} />
                case "doc":
                  // tài liệu
                  return <DocMsg el={el} menu={menu} />
                case "voice":
                  return <VoiceMsg el={el} menu={menu} />  
                default:
                  return <TextMsg el={el} menu={menu} />
                }
              })()}
           </React.Fragment>
        ))}
      </Stack>
    </Box>
  );
};

const ChatComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();
  const messageListRef = useRef(null);
  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
   
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      {/*  */}
      <ChatHeader />
      <Box
        ref={messageListRef}
        width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
         

          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
      <ScrollbarCustom autoHeightMin="75vh" >
          <Conversation menu={true} isMobile={isMobile} />
          </ScrollbarCustom>
      </Box>

      {/*  */}
      <ChatFooter />
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
