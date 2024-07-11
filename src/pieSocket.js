import CustomSnackbar from "./components/CustomSnackBar";
import { showSnackbar, showSnackbarTop } from "./redux/slices/app";
import { UpdateCurrentMessages } from "./redux/slices/conversation";
import {
  UpdateCurrentMessagesGroup, UpdateGroupMembers, UpdateGroupConversations, UpdateGroupCurrentConversation,
  RemoveGroupConversation, ResetGroupState, UpdateGroupConversationMessage,
  SetGroupMember, SetWebSocketConnection, RemoveWebSocketConnection, SetGroupAvatar, UpdateUnreadAndLastRead,
  UpdateUnreadAndLastReadForMember, SetGroupName
} from "./redux/slices/group";
import { playNotificationSound } from './utils/playsound';

const user_id = window.localStorage.getItem("user_id");
// import { socket } from "./socket";
const createWebsocket = (CHANNEL_ID, dispatch, notify_self) => {

  const pieSocket = new WebSocket(
    `wss://free.blr2.piesocket.com/v3/${CHANNEL_ID}?api_key=ujXx32mn0joYXVcT2j7Gp18c0JcbKTy3G6DE9FMB&notify_self=${notify_self}`
  );

 

  pieSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case "friend_request":
        dispatch(
          showSnackbarTop({ severity: "info", message: data.message })
        );
      
        console.log(data.message);
    
        break;
      case "send-message":
        dispatch(UpdateCurrentMessages(data.message));
        playNotificationSound('https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/sound-effect/send-group-message.mp3', 0.05);
        // dispatch(UpdateDirectConversations(data.message));
        break;
      case "send-img":
        dispatch(UpdateCurrentMessages(data.message));
        playNotificationSound('https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/sound-effect/send-group-message.mp3', 0.05);
       
        break;
      case "send-doc":
        dispatch(UpdateCurrentMessages(data.message));
        playNotificationSound('https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/sound-effect/send-group-message.mp3', 0.05);
       
        break;

      case "send-voice":
        dispatch(UpdateCurrentMessages(data.message));
        playNotificationSound('https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/sound-effect/send-group-message.mp3', 0.05);
     
        break;
        case "send-group-message":
          if (data.message.memberID !== user_id) {
            // dispatch(UpdateUnreadAndLastRead(data.groupID));
            playNotificationSound(
              "https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/sound-effect/send-group-message.mp3",
              0.05
            );
            dispatch(UpdateUnreadAndLastRead(data.groupID));
          }
          dispatch(UpdateCurrentMessagesGroup(data.groupID, data.message));
          dispatch(
            UpdateGroupConversationMessage(
              data.groupID,
              data.message.message,
              data.message.memberName,
              data.message.time,
              data.message.type
            )
          );
          break;
        case "update-message-state":
          if (data.user_id !== user_id) {
            dispatch(
              UpdateUnreadAndLastReadForMember(data.groupID, data.user_id)
            );
          }
          break;
        case "update-group":
          playNotificationSound(
            "https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/sound-effect/group-create.mp3",
            0.05
          );
          dispatch(UpdateGroupConversations(data.groupConversationData));
          dispatch(UpdateGroupCurrentConversation(data.groupConversationData));
          dispatch(UpdateGroupMembers(data.members));
          break;
        case "delete-group":
          playNotificationSound(
            "https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/sound-effect/leave-delete-add.mp3",
            0.05
          );
          dispatch(RemoveWebSocketConnection(data.groupID));
          dispatch(RemoveGroupConversation(data.groupID));
          dispatch(ResetGroupState(data.groupID));
          break;
        case "update-group-members-leaved":
          dispatch(SetGroupMember(data.members));
          break;
        case "update-group-members":
          dispatch(UpdateGroupMembers(data.members));
          break;
        case "create-group":
          dispatch(
            SetWebSocketConnection(
              data.message._id,
              createWebsocket(data.message._id, dispatch, 1)
            )
          );
          dispatch(UpdateGroupConversations(data.message));
          break;
        case "update-group-avatar":
          dispatch(SetGroupAvatar(data.avatar, data.groupID));
          break;
        case "update-group-name":
          dispatch(SetGroupName(data.name, data.groupID));
          break;
        default:
          console.log("Tin nhắn không được nhận diện:", data);
      }
    };
    return pieSocket;
  };
  
  const releaseWebsockets = (connections) => {
    // Duyệt qua tất cả các kết nối và đóng chúng
    Object.values(connections).forEach((connection) => {
      connection.close();
    });
  };
  
  export { createWebsocket, releaseWebsockets };
  