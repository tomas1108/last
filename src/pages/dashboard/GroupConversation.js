import { Stack, Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { GroupChatHeader, GroupChatFooter } from "../../components/GroupChat";
import { FetchCurrentMessages } from "../../redux/slices/group";
import useResponsive from "../../hooks/useResponsive";
import { socket } from "../../socket";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
  Notification,
  VoiceMsg,
} from "../../sections/Dashboard/GroupConversation";
import { useDispatch, useSelector } from "react-redux";
import ScrollbarCustom from "../../components/ScrollbarCustom";
import { Scrollbars } from "react-custom-scrollbars";
import ScrollbarCustomGroup from "../../components/ScrollBarCustomGroup";
import AvatarGroupWithTooltip from "../../components/AvatarGroupWithTooltip";

const Conversation = ({ isMobile, menu, messageListRef }) => {
  const { current_messages } = useSelector((state) => state.group);
  return (
    <>
      <Box p={isMobile ? 1 : 3}>
        <Stack spacing={3}>
          {current_messages.map((el, idx) => (
            <React.Fragment key={idx}>
              {(() => {
                switch (el.type) {
                  case "text":
                    return <TextMsg el={el} menu={menu} />;
                  case "image":
                    return <MediaMsg el={el} menu={menu} />;
                  case "doc":
                    return <DocMsg el={el} menu={menu} />;
                  case "link":
                    return <LinkMsg el={el} menu={menu} />;
                  case "reply":
                    return <ReplyMsg el={el} menu={menu} />;
                  case "timeline":
                    return <Timeline el={el} menu={menu} />;
                  case "notification":
                    return <Notification el={el} menu={menu} />;
                  case "voice":
                    return <VoiceMsg el={el} menu={menu} />;
                  default:
                    return null;
                }
              })()}
            </React.Fragment>
          ))}
        </Stack>
        <Stack spacing={1} sx={{p: 2}}>
        <AvatarGroupWithTooltip />
        </Stack>
      </Box>

    </>
  );
};

const GroupChatComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const messageListRef = useRef(null);
  const { current_messages } = useSelector((state) => state.group);
  useEffect(() => {
    if (messageListRef.current && messageListRef.current.scrollToBottom) {
      messageListRef.current.scrollToBottom();
    }
  }, [current_messages]);

  const theme = useTheme();

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      {/*  */}
      <GroupChatHeader />
      <Box
        width={"100%"}
        ref={messageListRef}
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
        <ScrollbarCustomGroup autoHeightMin="75vh">
          <Conversation
            menu={true}
            isMobile={isMobile}
            messageListRef={messageListRef}
          />
        </ScrollbarCustomGroup>
      </Box>
      {/*  */}
      <GroupChatFooter />
    </Stack>
  );
};

export default GroupChatComponent;
