import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
  UsersThree,
} from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import BottomNav from "../../layouts/dashboard/BottomNav";
import GroupElement from "../../components/GroupElement";
import CreateGroup from "../../sections/main/CreateGroup";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import { SetGroupConversations, ResetGroupState, SetWebSocketConnection, SetIsFetchConnections } from "../../redux/slices/group";
import ScrollbarCustom from "../../components/ScrollbarCustom";
import { createWebsocket } from "../../pieSocket";
import ScrollbarCustomGroup from "../../components/ScrollBarCustomGroup";

const Chats = () => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");

  const dispatch = useDispatch();
  const { group_conversation, connections } = useSelector((state) => state.group);
  const { user_id } = useSelector((state) => state.auth);
  const [activeGroupId, setActiveGroupId] = useState(null);

  const handleSelectGroup = (groupId) => {
    setActiveGroupId(groupId);
  };
  let connectionsCheck = {};
  useEffect(() => {
    // Gọi các hàm chỉ một lần khi component mount
    socket.emit("fetch-group-conversations", user_id, (data) => {
      // Xử lý phản hồi từ máy chủ
      if (data.groupConversations) {
        // Cập nhật dữ liệu trong Redux Store
        for (let group in data.groupConversations) {
          const groupId = data.groupConversations[group]._id; // Lấy ID của nhóm
          if (groupId && !connectionsCheck[groupId]) {
            connectionsCheck[groupId] = true;
            const pieSocket = createWebsocket(groupId, dispatch, 1);
            pieSocket.onopen = () => {
              console.log(`Kết nối WebSocket đã sẵn sàng với group ${groupId}.`);
            };
      
            // Xử lý lỗi nếu có
            pieSocket.onerror = (error) => {
              console.error(`Lỗi kết nối WebSocket với group ${groupId}: ${error}`);
            };
            console.log("PieSocket: ", pieSocket);
            dispatch(SetWebSocketConnection(groupId, pieSocket));
          }
        }
        dispatch(SetGroupConversations(data.groupConversations));
      } else {
        // Xử lý khi có lỗi hoặc không có dữ liệu được trả về từ máy chủ
        console.error("Error fetching group conversations.");
      }
    });
  
    // Hàm này chỉ được gọi một lần khi component unmount
    return () => {
      // Xử lý cleanup nếu cần
    };
  }, []); // Dependency array rỗng chỉ gọi một lần khi component mount
  
  const [openNewGroup, setOpenNewGroup] = useState(false);

  const handleCloseCreateGroup = () => {
    setOpenNewGroup(false);
  };
  const handleOpenCreateGroup = () => {
    setOpenNewGroup(true);
  };
  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: isDesktop ? 320 : "100vw",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        {!isDesktop && (
          // Bottom Nav
          <BottomNav />
        )}

        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
          >
            <Typography variant="h5">Groups</Typography>

            <Stack direction={"row"} alignItems="center" spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenCreateGroup();
                }}
                sx={{ width: "max-content" }}
              >
                <UsersThree></UsersThree>
              </IconButton>
              <IconButton sx={{ width: "max-content" }}>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          </Stack>
          <Stack spacing={1}>
            <Stack direction={"row"} spacing={1.5} alignItems="center"></Stack>
            <Divider />
          </Stack>
          <Stack sx={{ flexGrow: 1, height: "100%" }}>
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                All Groups
              </Typography>
              {/* Chat List */}
              <ScrollbarCustomGroup
              autoHide={false}
              autoHeightMin={500}
              >
                {group_conversation.map((el) => {
                  return <GroupElement key={el._id} {...el} 
                  isActive={el._id === activeGroupId}
                  onSelect={() => handleSelectGroup(el._id)}/>;
                })}
              </ScrollbarCustomGroup>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      {openNewGroup && (
        <CreateGroup open={openNewGroup} handleClose={handleCloseCreateGroup} />
      )}
    </>
  );
};

export default Chats;
