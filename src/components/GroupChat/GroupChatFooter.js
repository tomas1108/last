import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import { useTheme, styled } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { socket } from "../../socket";
import { create } from "@mui/material/styles/createTransitions";
import { createWebsocket } from "../../pieSocket";
import {
  UpdateCurrentMessagesGroup,
  UpdateGroupConversationMessage,
  ResetUnreadAndLastRead,
  UpdateUnreadAndLastReadForMemberList
} from "../../redux/slices/group";
// import conversation from "../../redux/slices/conversation";
import { getCurrentTime } from "../../utils/timeUtils";
import S3 from "../../utils/s3";
import { Mic, Stop } from "@mui/icons-material";

var pieSocket;

const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    paddingTop: '12px !important',
    paddingBottom: '12px !important',
  },
  '& .MuiFilledInput-root': {
    backgroundColor: theme.palette.background.paper, // Màu nền của input
    borderRadius: theme.shape.borderRadius, // Bo tròn góc
  },
  '& .MuiFilledInput-underline::before': {
    borderBottom: 'none', // Loại bỏ viền dưới
  },
  '& .MuiFilledInput-underline::after': {
    borderBottom: 'none', // Loại bỏ viền dưới sau khi focus
  },
  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary, // Màu của icon
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: <File size={24} />,
    y: 172,
    title: "Document",
  },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setValue,
  value,
  inputRef,
  handleKeyPress,
  fileInputRef,
  handleFileChange,
  handleImageChange,
  handleVoiceMessage,
  handleFocus
}) => {
  const [openActions, setOpenActions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const recorderRef = useRef(null);
  const startRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorderRef.current = new MediaRecorder(stream);
        recorderRef.current.start();
        setIsRecording(true);

        recorderRef.current.ondataavailable = async (e) => {
          const audioBlob = e.data;
          try {
            const audioKey = await uploadAudioToS3(audioBlob); // Tải file âm thanh lên S3
            setAudioURL(
              `https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/${audioKey}`
            ); // Cập nhật URL âm thanh mới
            handleVoiceMessage(audioKey); // Gửi đường dẫn tệp âm thanh lên máy chủ
          } catch (error) {
            console.error("Failed to upload audio:", error);
          }
          stopRecording(); // Dừng ghi âm SAU khi tải lên xong
        };
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state === "recording") {
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    // Đã di chuyển stopRecording() vào trong hàm startRecording()
    try {
      const audioUrl = await uploadAudioToS3(audioBlob);
      if (handleVoiceMessage && typeof handleVoiceMessage === "function") {
        handleVoiceMessage(audioUrl);
      }
    } catch (error) {
      console.error("Error handling voice message:", error);
    }
  };
  const uploadAudioToS3 = async (audioBlob) => {
    const timeStamp = Date.now();
    const audioKey = `audio_${timeStamp}.ogg`; // Tên của file âm thanh trên S3
    const params = {
      Bucket: "chat-app-audio-cnm",
      Key: audioKey,
      Body: audioBlob,
    };
    await S3.upload(params).promise(); // Tải lên file âm thanh lên S3
    return `https://chat-app-audio-cnm.s3.ap-southeast-1.amazonaws.com/${audioKey}`;
  };
  return (
    <>
      <StyledInput
        inputRef={inputRef}
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
        onFocus={handleFocus}
        fullWidth
        placeholder="Write a message..."
        variant="filled"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <IconButton
              onClick={() => {
                setOpenActions(!openActions);
              }}
            >
              <LinkSimple />
            </IconButton>
          ),
          endAdornment: (
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                onClick={() => {
                  if (isRecording) {
                    stopRecording();
                  } else {
                    startRecording();
                  }
                }}
              >
                {isRecording ? <Stop /> : <Mic />}
              </IconButton>
              {/* Additional end adornment content can go here */}
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <Smiley />
              </IconButton>
            </Stack>
          ),
        }}
        onKeyPress={handleKeyPress}
      />
      <Stack
        sx={{
          position: "relative",
          display: openActions ? "inline-block" : "none",
          alignItems: "center", // Vertically centers the content
        }}
      >
        {Actions.map((el) => (
          <Tooltip placement="right" title={el.title} key={el.title}>
            <IconButton
              onClick={() => {
                if (el.title === "Photo/Video") {
                  fileInputRef.current.accept = "image/jpeg, image/png"; // Accept only images
                  fileInputRef.current.click();
                } else if (el.title === "Document") {
                  fileInputRef.current.accept =
                    "application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"; // Accept only documents
                  fileInputRef.current.click();
                }
                setOpenActions(!openActions);
              }}
              sx={{
                position: "absolute",
                top: -el.y,
                backgroundColor: el.color,
              }}
              aria-label="add"
            >
              {el.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    </>
  );
  
};

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}
const GroupChatFooter = () => {
  const theme = useTheme();
  const { group_current_conversation } = useSelector((state) => state.group);
  const user_id = window.localStorage.getItem("user_id");
  const user_avatar = window.localStorage.getItem("user_avatar");
  const user_name = window.localStorage.getItem("user_name");
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const { sidebar } = useSelector((state) => state.group);
  const [openPicker, setOpenPicker] = React.useState(false);
  const [value, setValue] = useState("");
  const previousConversationIdRef = useRef(null);

  const dispatch = useDispatch();
  const { connections } = useSelector((state) => state.group);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
          emoji +
          value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const key = generateFileName(file);
        const imageUrl = await uploadImageToS3(file, key);

        if (group_current_conversation) {
          // Gửi tin nhắn qua pieSocket
          const message = {
            memberAvatar: user_avatar,
            memberID: user_id,
            memberName: user_name,
            message: imageUrl,
            time: getCurrentTime(),
            type: "image",
          };
          // // Gửi tin nhắn qua socket.io
          socket.emit(
            "add-message",
            message,
            group_current_conversation._id,
            (response) => {
              if (response.success) {
                connections[group_current_conversation._id].send(
                  JSON.stringify({
                    type: "send-group-message",
                    message,
                    groupID: group_current_conversation._id,
                  })
                );
              } else {
                console.error("Error:", response.error);
              }
            }
          );

          socket.emit(
            "update-group-conversation-message",
            message,
            group_current_conversation._id,
            (response) => {
              if (response.success) {
              } else {
                console.error("Error:", response.error);
              }
            }
          );
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const key = generateFileName(file);
        const fileUrl = await uploadFileToS3(file, key);
        if (group_current_conversation) {
          // Gửi tin nhắn qua pieSocket
          const message = {
            memberAvatar: user_avatar,
            memberID: user_id,
            memberName: user_name,
            message: fileUrl,
            time: getCurrentTime(),
            type: "doc",
          };
          // // Gửi tin nhắn qua socket.io
          socket.emit(
            "add-message",
            message,
            group_current_conversation._id,
            (response) => {
              if (response.success) {
                connections[group_current_conversation._id].send(
                  JSON.stringify({
                    type: "send-group-message",
                    message,
                    groupID: group_current_conversation._id,
                  })
                );
              } else {
                console.error("Error:", response.error);
              }
            }
          );

          socket.emit(
            "update-group-conversation-message",
            message,
            group_current_conversation._id,
            (response) => {
              if (response.success) {
              } else {
                console.error("Error:", response.error);
              }
            }
          );
        }
      } catch (error) {
        console.error("Failed to upload document:", error);
      }
    }
  };

  const generateFileName = (file) => {
    const timeStamp = Date.now();
    return `file_${timeStamp}_${file.name}`;
  };

  const uploadImageToS3 = async (file, key) => {
    const params = {
      Bucket: "chat-app-image-cnm",
      Key: key,
      Body: file,
    };
    await S3.upload(params).promise();
    return `https://chat-app-image-cnm.s3.ap-southeast-1.amazonaws.com/${key}`;
  };

  const uploadFileToS3 = async (file, key) => {
    const params = {
      Bucket: "chat-app-document-cnm",
      Key: key,
      Body: file,
    };
    await S3.upload(params).promise();
    return `https://chat-app-document-cnm.s3.ap-southeast-1.amazonaws.com/${key}`;
  };

  const handleVoiceMessage = async (audioUrl) => {
    if (group_current_conversation) {
      // Gửi tin nhắn qua pieSocket
      const message = {
        memberAvatar: user_avatar,
        memberID: user_id,
        memberName: user_name,
        message: audioUrl,
        time: getCurrentTime(),
        type: "voice",
      };
      // // Gửi tin nhắn qua socket.io
      socket.emit(
        "add-message",
        message,
        group_current_conversation._id,
        (response) => {
          if (response.success) {
            connections[group_current_conversation._id].send(
              JSON.stringify({
                type: "send-group-message",
                message,
                groupID: group_current_conversation._id,
              })
            );
          } else {
            console.error("Error:", response.error);
          }
        }
      );

      socket.emit(
        "update-group-conversation-message",
        message,
        group_current_conversation._id,
        (response) => {
          if (response.success) {
          } else {
            console.error("Error:", response.error);
          }
        }
      );

      socket.emit(
        "update-message-state",
        group_current_conversation._id,
        group_current_conversation.members.filter(
          (member) => member.memberID !== user_id
        ),
        (response) => {
          if (response.success) {
            console.log("Update message state success");
          } else {
            console.error("Error:", response.error);
          }
        }
      );
    }
  };

  function handleSendMessage() {
    // Kiểm tra nếu có cuộc trò chuyện hiện tại
    if (group_current_conversation) {
      // Gửi tin nhắn qua pieSocket
      const message = {
        memberAvatar: user_avatar,
        memberID: user_id,
        memberName: user_name,
        message: value.trim(),
        time: getCurrentTime(),
        type: "text",
      };
      // // Gửi tin nhắn qua socket.io
      socket.emit(
        "add-message",
        message,
        group_current_conversation._id,
        (response) => {
          if (response.success) {
            connections[group_current_conversation._id].send(
              JSON.stringify({
                type: "send-group-message",
                message,
                groupID: group_current_conversation._id,
              })
            );
          } else {
            console.error("Error:", response.error);
          }
        }
      );

      socket.emit(
        "update-group-conversation-message",
        message,
        group_current_conversation._id,
        (response) => {
          if (response.success) {
          } else {
            console.error("Error:", response.error);
          }
        }
      );

      socket.emit(
        "update-message-state",
        group_current_conversation._id,
        group_current_conversation.members.filter(
          (member) => member.memberID !== user_id
        ),
        (response) => {
          if (response.success) {
            console.log("Update message state success");
          } else {
            console.error("Error:", response.error);
          }
        }
      );

      if (previousConversationIdRef.current !== group_current_conversation._id) {
        dispatch(ResetUnreadAndLastRead(group_current_conversation._id));
        dispatch(UpdateUnreadAndLastReadForMemberList(group_current_conversation._id, group_current_conversation.members));
        connections[group_current_conversation._id].send(JSON.stringify({
          type: "update-message-state", user_id, groupID: group_current_conversation._id
        }));
      }
      // Xóa nội dung trong input sau khi gửi tin nhắn
      setValue("");
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Ngăn người dùng gửi tin nhắn khi nhấn Enter nếu họ không nhấn phím Shift đồng thời
      e.preventDefault();
      // Gửi tin nhắn khi người dùng nhấn phím Enter
      handleSendMessage();
    }
  };

  const handleOnFocus = () => {
    if (previousConversationIdRef.current !== group_current_conversation._id) {
      dispatch(ResetUnreadAndLastRead(group_current_conversation._id));
      connections[group_current_conversation._id].send(JSON.stringify({
        type: "update-message-state", user_id, groupID: group_current_conversation._id
      }));
    }
  }

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        p={isMobile ? 1 : 2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 81,
                right: isMobile ? 20 : sidebar.open ? 420 : 100,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(emoji) => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Box>
            {/* Chat Input */}
            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              handleKeyPress={handleKeyPress}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              handleFileChange={handleFileChange}
              handleVoiceMessage={handleVoiceMessage}
              handleFocus={handleOnFocus}
            />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%" }}
              alignItems={"center"}
              justifyContent="center"
            >
              <IconButton onClick={handleSendMessage}>
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            if (fileInputRef.current.accept.includes("image")) {
              handleImageChange(e);
            } else {
              handleFileChange(e);
            }
          }}
          accept="" // Leave empty, will be set dynamically
        />
      </Box>
    </Box>
  );
};

export default GroupChatFooter;
