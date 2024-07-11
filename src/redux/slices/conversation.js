import { createSlice } from "@reduxjs/toolkit";

import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config";

const user_id = window.localStorage.getItem("user_id");
const date = new Date();
const hours = date.getHours();
const minutes = date.getMinutes();
const time = `${hours}:${minutes}`;

function isLink(str) {
  // Biểu thức chính quy để kiểm tra xem chuỗi có phải là một liên kết hay không
  const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  // Kiểm tra xem chuỗi có khớp với biểu thức chính quy không
  return regex.test(str);
}




const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  current_chat:[],

   
};



const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    // tải danh sách tin nhắn lên
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        const user = el.participantsInfo.find(
          (elm) => elm._id.toString() !== user_id
        );
        let gender;
        if (user?.sex === true) {
          gender = "Male";
        } else {
          gender = "Female";
        }
    
        const about = {
          sex: gender,
          birthday: user?.birthday,
          email: user?.email,
        };
        console.log("about", about);
    
        // Get the last message from the messages array
        const lastMessage = el.messages[el.messages.length - 1];
        let messageText = lastMessage?.text || "";
        let unreadCount = 0;
        let unreadTo = "";
    
        const isMessageFromSender = lastMessage?.from === user?._id;
    
        if (lastMessage?.type === "notice") {
          messageText = `Bạn và ${user?.name} đã kết nối `;
          unreadTo = unreadCount = null;
        } else if (lastMessage?.from === user_id) {
          // Nếu tin nhắn là từ người dùng hiện tại
          if (lastMessage?.type === "image") {
            messageText = "You: sent a photo";
          } else if (isLink(messageText)) {
            messageText = "You: sent a link";
          } else {
            messageText = "You: " + messageText;
          }
          unreadTo = unreadCount = null;
        } else {
          // Tin nhắn từ người khác
          if (lastMessage?.type === "image") {
            messageText = `${user?.name}: sent a photo`;
          } else if (isLink(messageText)) {
            messageText = `${user?.name} sent a link`;
          } else {
            messageText = messageText;
          }
          // Tính số lượng tin nhắn chưa đọc nếu tin nhắn không phải là notice và không phải từ người dùng hiện tại
          unreadCount = el.messages.filter((message) => message.from !== user_id && !message.read).length;
          unreadTo = unreadCount.toString();
        }
    
        // Định dạng thời gian và so sánh với ngày hiện tại
        // const messageTime = parseDateTime(lastMessage?.time);
        // console.log("messageTime", messageTime);
        // const hours = String(messageTime.getHours()).padStart(2, '0');
        // const minutes = String(messageTime.getMinutes()).padStart(2, '0');
        // const currentTime = new Date();
    
        // let formattedTime = `${hours}:${minutes}`;;
  
        // const dayDifference = getDayDifference(currentTime, messageTime);
    

        // if (dayDifference > 0) {
        //   formattedTime = `${dayDifference} days`;
        // }
        // else{
        //   formattedTime = `${hours}:${minutes}`;
        // }
    
        return {
          id: el._id,
          user_id: user?._id,
          name: user?.name,
          online: user?.status === "Online",
          img: user?.avatar,
          msg: messageText,
          time: lastMessage?.time || time,
          unread: unreadTo, // Convert the unread count to string for consistency
          pinned: false,
          about: about,
        };
      });
      state.direct_chat.conversations = list;
    },
    
    
    
    
    
    // cập nhật cuộc trò chuyện trực tiếp với dữ liệu mới nhận được từ server
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      // Lấy tin nhắn cuối cùng trong cuộc trò chuyện
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id,
              user_id: user?._id,
              name: user?.name,
              online: user?.status === "Online",
              img: user?.avatar,
              msg: this_conversation.messages.slice(-1)[0].text,
              time: time,
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    // thêm cuộc trò chuyện trực tiếp mới vào danh sách cuộc trò chuyện
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      const message = action.payload.message;
      state.direct_chat.conversations.push({
        id: this_conversation._id,
        user_id: user?._id,
        name: user?.name,
        online: user?.status === "Online",
        img: user?.avatar,
        msg: message,
        time: time,
        unread: 0,
        pinned: false,
      });
    },
    // cập nhật cuộc trò chuyện hiện tại
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    // tải tin nhắn hiện tại lên
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      console.log("tin nhắn fect",messages);
      if (!Array.isArray(messages)) return; // Kiểm tra xem messages là một mảng hay không
      // const formatted_messages = messages.map((el) => ({
      //   id: el.id,
      //   type: "msg",
      //   subtype: el.type,
      //   message: el.text,
      //   time: el.created_at,
      //   incoming: el.to === user_id,
      //   outgoing: el.from === user_id,
 
      state.direct_chat.current_messages = messages;
    },

    /* addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    }, */
    // Cập nhật danh sách cuộc trò chuyện với dữ liệu mới nhận được từ server
    updateDirectConversations(state, action) {
      const listMsg = action.payload.message.map((el) => {  

      });

      console.log("listMsg",listMsg)
   
    },

    updateCurrentMessages(state, action) {
      
      state.direct_chat.current_messages.push(action.payload.message);
    },
    
  },
  addDirectMessage(state, action) {
    state.direct_chat.current_messages.push(action.payload.message);
  }
  
 
});

export default slice.reducer;
// ----------------------------------------------------------------------


export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectConversations({ conversations }));
  };
};
export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation({ conversation }));
  };
};
export const UpdateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversation({ conversation }));
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_conversation));
  };
};


export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  };
};



export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage({ message }));
  }
}
export const UpdateDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversations({ conversations }));
  };
}

export const UpdateCurrentMessages = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateCurrentMessages({ message }));
  };
}