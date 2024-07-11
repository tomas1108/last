import React, { useState, useRef } from "react";
import { IconButton, InputAdornment } from "@mui/material";
import { Mic, MicOff, PlayArrow, Pause, GetApp , Stop} from "@mui/icons-material";
import S3 from "../utils/s3";

const VoiceMessage = ({ handleVoiceMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(""); // State để lưu trữ URL của âm thanh ghi âm
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
          stopRecording();
          try {
            const audioKey = await uploadAudioToS3(audioBlob); // Tải file âm thanh lên S3
            setAudioURL(`https://chat-app-image-cnm.s3.ap-southeast-1.amazonaws.com/${audioKey}`); // Cập nhật URL âm thanh mới
          handleVoiceMessage(audioKey); // Gửi đường dẫn tệp âm thanh lên máy chủ
          } catch (error) {
            console.error("Failed to upload audio:", error);
          }
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

  const uploadAudioToS3 = async (audioBlob) => {
    const timeStamp = Date.now();
    const audioKey = `audio_${timeStamp}.ogg`; // Tên của file âm thanh trên S3
    const params = {
      Bucket: "chat-app-image-cnm",
      Key: audioKey,
      Body: audioBlob,
    };
    await S3.upload(params).promise(); // Tải lên file âm thanh lên S3
    return audioKey;
  };

  return (
    <InputAdornment position="end">
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
      {audioURL && ( // Hiển thị đường dẫn âm thanh nếu có
        <audio controls>
          <source src={audioURL} type="audio/ogg" />
        </audio>
      )}
    </InputAdornment>
  );
};

export default VoiceMessage;
