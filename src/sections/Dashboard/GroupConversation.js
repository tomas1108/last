import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
  Avatar,
  Chip,
  Modal,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { DotsThreeVertical, DownloadSimple, FileCsv, Image } from "phosphor-react";
import { Message_options } from "../../data";
import { useSelector } from "react-redux";
import { PlayArrow, Pause, GetApp, GraphicEq } from "@mui/icons-material";
import TxtPng from "../../assets/Images/txt.png";
const user_id = window.localStorage.getItem("user_id");

function isLink(str) {
  // Biểu thức chính quy để kiểm tra xem chuỗi có phải là một liên kết hay không
  const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  // Kiểm tra xem chuỗi có khớp với biểu thức chính quy không
  return regex.test(str);
}
function extractFilenameFromUrl(url) {
  // Split the URL by '/' and take the last part
  const parts = url.split('/');
  // Lấy phần cuối cùng của URL
  const lastPart = parts[parts.length - 1];
  // Tách phần tên tệp tin bằng dấu gạch ngang (_ hoặc -) và lấy phần cuối cùng
  const filenameParts = lastPart.split(/[_-]/);
  return filenameParts[filenameParts.length - 1];
}


const getFileTypeIcon = (fileName) => {
  const fileExtension = fileName.split('.').pop().toLowerCase();
  switch (fileExtension) {
    case 'pdf':

      return <img src=" https://chat.zalo.me/assets/icon-pdf.53e522c77f7bb0de2eb682fe4a39acc3.svg" alt="PDF Icon" />;
    case 'doc':
    case 'docx':
      return <img src="https://chat.zalo.me/assets/icon-word.d7db8ecee5824ba530a5b74c5dd69110.svg" alt="DOCX Icon" />;
    case 'txt':
      return <img src={TxtPng} alt="TXT Icon" width={42} height={52} />;

    // return <Avatar src={TxtPng} alt="TXT Icon" />;
    default:
      return <FileCsv size={48} color="white" />;
  }
};
const MessageOption = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <DotsThreeVertical
        size={20}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((el) => (
            <MenuItem onClick={handleClose}>{el.title}</MenuItem>
          ))}
        </Stack>
      </Menu>
    </>
  );
};

const TextMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = el.memberID !== user_id;
  const [isFocused, setIsFocused] = React.useState(false);

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  const handleLinkClick = (event) => {
    event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
    window.open(el.text, "_blank"); // Mở liên kết trong một tab mới
  };

  const renderContent = () => {
    return (
      <React.Fragment>
        {isLink(el.message) ? (
          // Nếu el.text là một liên kết, trả về thẻ <a>
          <a
            href={el.message}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            style={{
              color: incoming ? theme.palette.text.main : theme.palette.common.white,
              wordBreak: 'break-word' // Thêm thuộc tính word-break
            }}
          >
            {el.text}
          </a>
        ) : (
          // Nếu el.text không phải là một liên kết, trả về nội dung của el.text
          <Typography
            variant="body2"
            color={incoming ? theme.palette.text.primary : "#fff"}
            className={el.isFromSender ? "bold-text" : ""} // Add the bold-text class conditionally
            sx={{ wordBreak: 'break-word' }} // Thêm thuộc tính word-break
          >
            {el.message}
          </Typography>
        )}
        {isFocused && (
          <Typography variant="body2" sx={{ fontWeight: 600, opacity: incoming ? 0.5 : 1 }}>
            {el.time}
          </Typography>
        )}
      </React.Fragment>
    );
  };

  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};
const MediaMsg = ({ el, menu }) => {
  const theme = useTheme();
  const incoming = el.memberID !== user_id;

  const [isFocused, setIsFocused] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ position: "relative" }} // Đặt vị trí của Box là tương đối để sử dụng vị trí tuyệt đối cho IconButton
      >
        <Stack spacing={1}>
          <img
            src={el.message}
            alt={el.message}
            style={{
              maxHeight: 210,
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={handleOpenModal}
          />
          {isFocused && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, opacity: incoming ? 0.5 : 1 }}
              >
                {el.time}
              </Typography>
              <IconButton
                href={el.message}
                download
                size="small" // Thiết lập kích thước nhỏ cho IconButton
                sx={{
                  bgcolor: theme.palette.primary.main, // Màu nền của IconButton
                  color: "#fff", // Màu của biểu tượng
                }}
              >
                <DownloadSimple fontSize="small" /> {/* Chỉ định kích thước nhỏ cho biểu tượng tải xuống */}
              </IconButton>
            </Stack>
          )}
          <Typography
            variant="body2"
            color={incoming ? theme.palette.text : "#fff"}
          >
          
          </Typography>
        </Stack>

      </Box>

      {menu && <MessageOption />}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxWidth: "80vw",
            maxHeight: "80vh",
          }}
        >
          <img
            src={el.message}
            alt={el.message}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Box>
      </Modal>
    </Stack>
  );
};
const DocMsg = ({ el, menu }) => {

  const incoming = el.memberID !== user_id;
  const [isFocused, setIsFocused] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };


  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          width: 300,
          height: 108,
        }}

      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: "#e5efff",
              borderRadius: 1.5,
            }}
          >
           {getFileTypeIcon(el.message)}
            <Typography
              sx={{
               
                color: "#081c36"
              }}
              variant="body2"
            >
              {extractFilenameFromUrl(el.message)}
            </Typography>

            <IconButton href={el.message} download>
              <DownloadSimple  color="black" /> {/* Chuyển màu biểu tượng tải xuống thành trắng */}
            </IconButton>
          </Stack>
        </Stack>
        {isFocused && (
            <Typography variant="body2" sx={{ fontWeight: 600, opacity: incoming ? 0.5 : 1 }}>
              {el.time}
            </Typography>
          )}
      </Box>

      {menu && <MessageOption />}
    </Stack>
  );
}

const VoiceMsg = ({ el, menu }) => {
  const theme = useTheme();
  const [audioPlayer, setAudioPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pausedTime, setPausedTime] = useState(null);
  const incoming = el.memberID !== user_id;

  const [isFocused, setIsFocused] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const handleMouseEnter = () => {
    setIsFocused(true);
  };

  const handleMouseLeave = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause();
      }
    };
  }, [audioPlayer]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioPlayer.pause();
      setPausedTime(audioPlayer.currentTime);
    } else {
      if (!audioPlayer) {
        const audio = new Audio(el.message);
        setAudioPlayer(audio);
        audio.play();
        audio.onended = () => setIsPlaying(false);
        if (pausedTime) {
          audio.currentTime = pausedTime;
        }
      } else {
        audioPlayer.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Stack direction="row" justifyContent={ incoming ? "start" : "end"}>
      {incoming && (
        <Avatar
          src={el.avatar}
          alt={el.name}
          sx={{ width: 24, height: 24, mr: 0.5 }}
        />
      )}
      <Box
        px={1.5}
        py={1.5}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          backgroundColor: incoming
            ? alpha(theme.palette.background.paper, 1)
            : theme.palette.primary.light,
          borderRadius: 2,
          width: "max-content",

        }}
      >
        <IconButton onClick={handlePlayPause}>
          {isPlaying ? <Pause /> : <PlayArrow />}
        </IconButton>
        <IconButton sx={{ width: 48, height: 48 }}> {/* Đặt chiều rộng và chiều cao của IconButton */}
          <GraphicEq sx={{ fontSize: 50 }} /> {/* Đặt kích thước của biểu tượng GraphicEq */}
        </IconButton>
        <Stack direction="row" spacing={1}>

          {isFocused && (
            <Typography variant="body2" sx={{ fontWeight: 600, opacity: incoming ? 0.5 : 1 }}>
              {el.time}
            </Typography>
          )}
        </Stack>
      </Box>

      {menu && <MessageOption />}
    </Stack>
  );
};



const LinkMsg = ({ el, menu }) => {
  const incoming = el.memberID !== user_id;
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="start"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Stack direction={"column"} spacing={2}></Stack>
          </Stack>
          <Typography
            variant="body2"
            color={incoming ? theme.palette.text : "#fff"}
          >
            <div dangerouslySetInnerHTML={{ __html: el.message }}></div>
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const ReplyMsg = ({ el, menu }) => {
  const incoming = el.memberID !== user_id;
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: incoming
            ? alpha(theme.palette.background.paper, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 1),

              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {el.message}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={incoming ? theme.palette.text : "#fff"}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessageOption />}
    </Stack>
  );
};

const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems={"center"} justifyContent="space-between">
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {el.name} {el.message}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

const Notification = ({ el }) => {
  const { user_name } = useSelector((state) => state.auth);
  const theme = useTheme();
  const name = el.members.length === 0 ? user_name : el.memberName;

  // Hàm xử lý chuỗi để hiển thị tên thành viên
  const renderMemberNames = (members) => {
    if (members.length === 1) {
      return members[0].name;
    } else if (members.length === 2) {
      return `${members[0].name} and ${members[1].name}`;
    } else {
      return `${members[0].name}, ${members[1].name} and ${
        members.length - 2
      } others`;
    }
  };

  return (
    <Divider sx={{ p: 1 }}>
      {el.members.length > 0 && (
        <Chip
          avatar={<Avatar alt={el.memberName} src={el.members[0].avatar} />}
          label={
            <>
              <span style={{ fontWeight: "bold" }}>
                {renderMemberNames(el.members)}
              </span>
              {el.message}
              <span style={{ fontWeight: "bold" }}>{name}</span>
            </>
          }
          sx={{ color: theme.palette.text.primary }}
        />
      )}
      {el.members.length === 0 && (
        <Chip
        avatar={<Avatar alt={el.memberName} src={el.memberAvatar} />}
          label={
            <>
              <span style={{ fontWeight: "bold" }}>{name}</span>
              {el.message}
            </>
          }
          sx={{ color: theme.palette.text.primary }}
        />
      )}
    </Divider>
  );
};
export { Timeline, MediaMsg, LinkMsg, DocMsg, TextMsg, ReplyMsg, Notification ,VoiceMsg };
