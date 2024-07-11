import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import {  SelectConversation, showSnackbar } from "../../redux/slices/app";
import { socket, connectSocket } from "../../socket";
import {
  UpdateDirectConversation,
  AddDirectConversation,
  AddDirectMessage,
} from "../../redux/slices/conversation";
import { createWebsocket } from "../../pieSocket";
var pieSocket;

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();
  const {user_id} = useSelector((state) => state.auth);
  const {user_email} = useSelector((state) => state.auth);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

 
  useEffect(() => {
    // Khởi tạo kết nối WebSocket nếu chưa có
    if (isLoggedIn) {
      // Chỉ tạo kết nối mới khi chưa có kết nối hoặc khi ID cuộc trò chuyện thay đổi
      if (!pieSocket || pieSocket.id !== user_id) {
       
          // // Đóng kết nối WebSocket hiện tại nếu có
          if (pieSocket) {
            pieSocket.close();
            console.log("Đóng kết nối WebSocket hiện tại.");
          }
        // Tạo kết nối WebSocket mới
        pieSocket = createWebsocket(user_id, dispatch, 0);
  
        // Xác nhận rằng kết nối đã sẵn sàng
        pieSocket.onopen = () => {
          console.log("Kết nối WebSocket đã sẵn sàng." + user_id);
        };
  
        // Xử lý lỗi nếu có
        pieSocket.onerror = (error) => {
          console.error("Lỗi kết nối WebSocket:", error);
        };
      }
    }
  }, [ ]);
  
  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
         if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
         }
        // Đánh dấu trang đã được tải một lần
        
      }
      window.onload();
      if (!socket) {
        connectSocket(user_id, user_email);
      }

 
      socket.on("new_message", (data) => {
        const message = data.message;
        console.log("current_conversation login ", data);
        // check if msg we got is from currently selected conversation
        if (current_conversation?.id === data.conversation_id) {
          dispatch(
            AddDirectMessage({
              id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text,
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
            })
          );
        }
      });

      socket.on("start_chat", (data) => {
        console.log("Start chat with ",data);
        // add / update to conversation list
        if (Array.isArray(conversations)) {
        const existing_conversation = conversations.find(
          (el) => el?.id === data._id
        );
        console.log("existing", conversations);
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectConversation({ conversation: data }));
        }
        dispatch(SelectConversation({ room_id: data._id }));
      } else{
        console.error('Conversations is not an array.');
      }});
    
      socket.on("new_friend_request", (data) => {
        dispatch(
          showSnackbar({
            severity: "success",
            message: data.message }));
      });

      socket.on("request_accepted", (data) => {
        dispatch(
          showSnackbar({
            severity: "success",
            message: "Friend Request Accepted",
          })
        );
      });

      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ 
          severity: "success",
           message: "Request Sent successfully" }));
      });
    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
      socket?.off("start_chat");
      socket?.off("new_message");
    };
  }, [isLoggedIn,  conversations, current_conversation, user_id, user_email, dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <>
      <Stack direction="row">
        {isDesktop && (
          // SideBar
          <SideNav />
        )}

        <Outlet />
      </Stack>
   
     
    </>
  );
};

export default DashboardLayout;