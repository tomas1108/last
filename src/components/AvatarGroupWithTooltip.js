import { AvatarGroup, Avatar, Typography, Box } from "@mui/material";
import { useSelector } from "react-redux";
import DoneAllIcon from '@mui/icons-material/DoneAll'; // Import biểu tượng DoneAllIcon

const AvatarGroupWithCheckmark = () => {
  // Lọc ra các thành viên có unread: false
  const { members } = useSelector((state) => state.group.group_current_conversation);
  const unreadMembers = members.filter((member) => !member.unread);

  // Kiểm tra nếu không có thành viên nào đã xem, hiển thị một tin nhắn thông báo
  if (unreadMembers.length === 0) {
    return (
      <Typography sx={{fontSize: 12}} textAlign="right" variant="body2"><DoneAllIcon style={{ fontSize: 12 }} /> Tất cả đã xem </Typography>
    );
  }

  // Nếu có thành viên đã xem, hiển thị AvatarGroup kèm dấu tích và chữ "Đã xem"
  return (
    <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems="flex-end">
      <AvatarGroup max={6}>
        {unreadMembers.map((member, index) => (
          <Avatar
            key={index}
            alt={member.name}
            src={member.avatar}
            sx={{
              width: '24px',
              height: '24px',
              border: '2px solid #fff', // Thêm viền cho Avatar
              boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)', // Thêm hiệu ứng nổi bật cho Avatar
            }}
          />
        ))}
      </AvatarGroup>
      <Box display="flex" flexDirection="row" justifyContent={"center"} alignItems="center" ml={1} sx={{mt: 1}}>
        <DoneAllIcon style={{ fontSize: 12 }} /> {/* Hiển thị biểu tượng dấu tích */}
        <Typography variant="body2" sx={{ml: 0.5, color: 'inherit', fontSize: 12 }}>Đã xem</Typography> {/* Hiển thị chữ "Đã xem" */}
      </Box>
    </Box>
  );
};

export default AvatarGroupWithCheckmark;
