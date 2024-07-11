import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Avatar,
  Button,
  Checkbox,
  Menu,
  MenuItem,
} from "@mui/material";
import { ArrowLeft } from "phosphor-react";
import useResponsive from "../../../hooks/useResponsive";
import { useDispatch, useSelector } from "react-redux";
import {
  UpdateSidebarType,
  UpdateGroupCurrentConversation,
  SetGroupConversations,
} from "../../../redux/slices/group";
import { socket } from "../../../socket";
import { createWebsocket } from "../../../pieSocket";
import { getCurrentTime } from "../../../utils/timeUtils";

const GroupMembers = () => {
  const dispatch = useDispatch();
  const { group_current_conversation, connections } = useSelector(
    (state) => state.group
  );
  const { user_avatar, user_id, user_name } = useSelector((state) => state.auth);
  const { members: initialMembers, _id } = useSelector(
    (state) => state.group.group_current_conversation
  );

  const [members, setMembers] = useState(initialMembers);
  const { role } = useSelector((state) => state.group);
  const isSingleMember = members.length === 1;

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [selectAll, setSelectAll] = useState(false);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [showCheckbox, setShowCheckbox] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => {
    const initialCheckboxStates = members.reduce((acc, member) => {
      acc[member.name] = false;
      return acc;
    }, {});
    setCheckboxStates(initialCheckboxStates);
  }, [members]);

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowCheckbox(true);
    }, 500); // 3000ms = 3s
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setTimeout(() => {
      setShowCheckbox(false);
      resetCheckboxStates();
    }, 10000); // 2000ms = 2s
  };

  const resetCheckboxStates = () => {
    const initialCheckboxStates = {};
    members.forEach((member) => {
      initialCheckboxStates[member.name] = false;
    });
    setCheckboxStates(initialCheckboxStates);
  };

  const handleSelectAll = () => {
    if (!isSingleMember) {
      const newSelectAll = !selectAll;
      setSelectAll(newSelectAll);

      const updatedCheckboxStates = {};
      members.forEach((member) => {
        if (member.role !== "leader") {
          updatedCheckboxStates[member.name] = !selectAll;
        }
      });
      setCheckboxStates(updatedCheckboxStates);
    }
  };

  const handleCheckboxChange = (name) => {
    const isLeader =
      members.find((member) => member.name === name).role === "leader";

    if (!isLeader) {
      const updatedCheckboxStates = { ...checkboxStates };
      updatedCheckboxStates[name] = !updatedCheckboxStates[name];
      setCheckboxStates(updatedCheckboxStates);
    }
  };

  async function handleDeleteMembers() {
    if (!isSingleMember) {
      try {
        const selectedMembers = members.filter(
          (member) => checkboxStates[member.name]
        );
        const selectedMemberIDs = selectedMembers.map(
          (member) => member.memberID
        );

        const memberAfterUpdate = group_current_conversation.members.filter(
          (member) => !selectedMemberIDs.includes(member.memberID)
        );

        socket.emit(
          "delete-members",
          selectedMemberIDs,
          _id,
          user_id,
          (response) => {
            if (response.success) {
              let connectionsLocal = {};
              selectedMembers.forEach((member) => {
                connectionsLocal[member.memberID] = createWebsocket(
                  member.memberID,
                  dispatch,
                  0
                );
                connectionsLocal[member.memberID].onopen = () => {
                  connectionsLocal[member.memberID].send(
                    JSON.stringify({
                      type: "delete-group",
                      groupID: group_current_conversation._id,
                    })
                  );
                  connectionsLocal[member.memberID].onclose = () => {
                    console.log(
                      "Đã đóng kết nối WebSocket cho thành viên",
                      member.memberID
                    );
                  };
                  connectionsLocal[member.memberID].close();
                };

                connectionsLocal[member.memberID].onerror = (error) => {
                  console.error(
                    `Lỗi kết nối WebSocket cho thành viên ${member.memberID}:`,
                    error
                  );
                };
              });

              connections[group_current_conversation._id].send(
                JSON.stringify({
                  type: "update-group-members-leaved",
                  members: memberAfterUpdate,
                })
              );
            }
          }
        );

        const notification = {
          memberAvatar: user_avatar,
          memberID: user_id,
          memberName: user_name,
          message: " has been removed by ",
          members: selectedMembers,
          time: getCurrentTime(),
          type: "notification",
        };

        socket.emit(
          "add-message",
          notification,
          group_current_conversation._id,
          (response) => {
            if (response.success) {
              connections[group_current_conversation._id].send(
                JSON.stringify({
                  type: "send-group-message",
                  message: notification,
                  groupID: group_current_conversation._id,
                })
              );
            } else {
              console.error("Error:", response.error);
            }
          }
        );
      } catch (error) {
        console.error("Error deleting members:", error);
      }
    }
  }

  const handleDeselectAll = () => {
    const updatedCheckboxStates = {};
    members.forEach((member) => {
      updatedCheckboxStates[member.name] = false;
    });
    setCheckboxStates(updatedCheckboxStates);
    setSelectAll(false);
  };

  const handleContextMenu = (event, member) => {
    event.preventDefault();
    setSelectedMember(member);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeAdmin = async () => {
    if (selectedMember) {
      try {
        const newAdminID = selectedMember.memberID;

        socket.emit("change-admin", newAdminID, _id, user_id, (response) => {
          if (response.success) {
            dispatch(UpdateGroupCurrentConversation(response.updatedGroup));
            handleCloseMenu();
          } else {
            console.error("Error:", response.error);
          }
        });
      } catch (error) {
        console.error("Error changing admin:", error);
      }
    }
  };

  return (
    <Box sx={{ width: !isDesktop ? "100vw" : 320, maxHeight: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack sx={{ p: 2 }} direction="row" alignItems={"center"}>
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2">Members</Typography>
          </Stack>
          {role === "leader" && (
            <>
              <Stack sx={{ px: 3, my: 3 }}>
                <Button
                  color="primary"
                  size="medium"
                  type="submit"
                  variant="contained"
                  disabled={Object.values(checkboxStates).every(
                    (value) => !value
                  )}
                  onClick={handleDeleteMembers}
                >
                  Xóa thành viên khỏi nhóm
                </Button>
              </Stack>
            </>
          )}
          <Stack
            direction="row"
            justifyContent={"space-between"}
            gap={1}
            sx={{ px: 3, my: 3 }}
          >
            {role === "leader" && (
              <Button
                color="primary"
                size="medium"
                variant="contained"
                onClick={selectAll ? handleDeselectAll : handleSelectAll}
                sx={{ flexGrow: 1 }}
                disabled={!showCheckbox}
              >
                {selectAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
              </Button>
            )}
          </Stack>
          <Stack
            sx={{ p: 2 }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {[...members]
              .sort((a, b) => {
                if (a.role === "leader") return -1;
                if (b.role === "leader") return 1;
                return 0;
              })
              .map((member) => (
                <Stack
                  key={member._id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                  p={2}
                  sx={{
                    backgroundColor: "background",
                    transition: "background-color 0.3s",
                  }}
                  onContextMenu={(event) => handleContextMenu(event, member)}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar alt={member.name} src={member.avatar} />
                    <Typography variant="subtitle2">{member.name}</Typography>
                    {member.role === "leader" && (
                      <Typography variant="subtitle2" color="primary">
                        Leader
                      </Typography>
                    )}
                  </Stack>
                  {role === "leader" &&
                    showCheckbox &&
                    member.role !== "leader" && (
                      <Checkbox
                        color="primary"
                        checked={checkboxStates[member.name]}
                        onChange={() => handleCheckboxChange(member.name)}
                      />
                    )}
                </Stack>
              ))}
          </Stack>
        </Box>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleChangeAdmin}>Chuyển quyền Admin</MenuItem>
      </Menu>
    </Box>
  );
};

export default GroupMembers;
