import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT",
  },

  isFetchConnections: false,
  group_conversation: [],
  group_current_conversation: null,
  current_messages: [],
  role: "member",
  connections: {},
};

const slice = createSlice({
  name: "group",
  initialState,
  reducers: {
    toggleSidebarState(state) {
      state.sidebar.open = !state.sidebar.open;
    },

    updateSidebarType(state, action) {
      state.sidebar.type = action.payload.type;
    },

    fetchGroupConversation(state, action) {
      state.group_conversation = action.payload.group_conversation;
    },

    updateGroupConversations(state, action) {
      state.group_conversation.push(action.payload.group_conversation);
    },

    updateGroupCurrentConversation(state, action) {
      state.group_current_conversation =
        action.payload.group_current_conversation;
    },

    updateCurrentMessagesGroup(state, action) {
      if (state.group_current_conversation && state.group_current_conversation._id === action.payload.groupID) {
        state.current_messages.push(action.payload.message);
      }
    },

    updateRole(state, action) {
      state.role = action.payload.role;
    },

    fetchCurrentMessages(state, action) {
      if (action.payload.current_messages) {
        state.current_messages = action.payload.current_messages;
      } else {
        state.current_messages = [];
      }
    },

    updateGroupMembers(state, action) {
      const { members } = action.payload;
      const updatedGroupConversations = [...state.group_conversation];
      const currentConversationIndex = updatedGroupConversations.findIndex(
        (conversation) =>
          conversation._id === state.group_current_conversation._id
      );

      if (currentConversationIndex !== -1) {
        updatedGroupConversations[currentConversationIndex].members.push(
          ...members
        );
      }

      state.group_conversation = updatedGroupConversations;
      state.group_current_conversation.members.push(...members);
    },

    setGroupMember(state, action) {
      const { members } = action.payload;
      const updatedGroupConversations = [...state.group_conversation];
      const currentConversationIndex = updatedGroupConversations.findIndex(
        (conversation) =>
          conversation._id === state.group_current_conversation._id
      );

      if (currentConversationIndex !== -1) {
        updatedGroupConversations[currentConversationIndex].members = members;
      }

      state.group_conversation = updatedGroupConversations;
      state.group_current_conversation.members = members;
    },

    setGroupAvatar(state, action) {
      const { imageURL, groupID } = action.payload;
      const updatedGroupConversations = [...state.group_conversation];
      const currentConversationIndex = updatedGroupConversations.findIndex(
        (conversation) =>
          conversation._id === groupID
      );

      if (currentConversationIndex !== -1) {
        updatedGroupConversations[currentConversationIndex].avatar = imageURL;
      }

      state.group_conversation = updatedGroupConversations;

      if (state.group_current_conversation._id === groupID) state.group_current_conversation.avatar = imageURL;
    },

    setGroupName(state, action) {
      const { groupName, groupID } = action.payload;
      const updatedGroupConversations = [...state.group_conversation];
      const currentConversationIndex = updatedGroupConversations.findIndex(
        (conversation) =>
          conversation._id === groupID
      );

      if (currentConversationIndex !== -1) {
        updatedGroupConversations[currentConversationIndex].groupName = groupName;
      }

      state.group_conversation = updatedGroupConversations;
      if (state.group_current_conversation._id === groupID) state.group_current_conversation.groupName = groupName;
    },

    removeGroupConversation(state, action) {
      const { groupID } = action.payload;

      // Lọc ra danh sách group conversation mà không chứa groupID được chỉ định
      const updatedGroupConversations = state.group_conversation.filter(
        (conversation) => conversation._id !== groupID
      );

      // Gán lại danh sách group conversation đã lọc cho state
      state.group_conversation = updatedGroupConversations;
    },

    resetGroupState(state, action) {
      const { groupID } = action.payload;
      // Kiểm tra nếu group_current_conversation._id bằng với groupID được chỉ định
      if (
        state.group_current_conversation &&
        state.group_current_conversation._id === groupID
      ) {
        state.group_current_conversation = null;
        state.current_messages = [];
        state.role = "member";
        state.sidebar.open = false;
        state.sidebar.type = "CONTACT";
      }
    },

    updateGroupConversationMessage(state, action) {
      const { groupID, message, name, time, type } = action.payload;

      // Tìm kiếm groupID trong mảng group_conversation
      const index = state.group_conversation.findIndex(
        (group) => group._id === groupID
      );

      // Nếu tìm thấy groupID, cập nhật tin nhắn
      if (index !== -1) {
        const updatedGroup = {
          ...state.group_conversation[index],
          message,
          name,
          time,
          type,
        };

        const updatedGroupConversation = [
          ...state.group_conversation.slice(0, index),
          updatedGroup,
          ...state.group_conversation.slice(index + 1),
        ];
        state.group_conversation = updatedGroupConversation;
      }
    },

    resetUnreadAndLastRead(state, action) {
      const index = state.group_conversation.findIndex(
        (group) => group._id === action.payload.groupID
      );

      if (index !== -1) {
        const updatedGroup = {
          ...state.group_conversation[index],
          unread: false,
          lastRead: 0,
        };
        const updatedGroupConversation = [
          ...state.group_conversation.slice(0, index),
          updatedGroup,
          ...state.group_conversation.slice(index + 1),
        ];
        state.group_conversation = updatedGroupConversation;
      }
    },

    updateUnreadAndLastReadForMember(state, action) {
      const { groupID, memberID } = action.payload;
    
      const groupIndex = state.group_conversation.findIndex(
        (group) => group._id === groupID
      );
    
      if (groupIndex !== -1) {
        const group = state.group_conversation[groupIndex];
        const memberIndex = group.members.findIndex(
          (member) => member._id === memberID
        );
    
        if (memberIndex !== -1) {
          const updatedMember = {
            ...group.members[memberIndex],
            unread: true,
            lastRead: group.members[memberIndex].lastRead + 1,
          };
    
          const updatedMembers = [
            ...group.members.slice(0, memberIndex),
            updatedMember,
            ...group.members.slice(memberIndex + 1),
          ];
    
          const updatedGroup = {
            ...group,
            members: updatedMembers,
          };
    
          const updatedGroupConversation = [
            ...state.group_conversation.slice(0, groupIndex),
            updatedGroup,
            ...state.group_conversation.slice(groupIndex + 1),
          ];
    
          state.group_conversation = updatedGroupConversation;
        }
      }
    },

    resetUnreadAndLastReadForMember(state, action) {
      const { groupID, memberID } = action.payload;
    
      const groupIndex = state.group_conversation.findIndex(
        (group) => group._id === groupID
      );
    
      if (groupIndex !== -1) {
        const group = state.group_conversation[groupIndex];
        const memberIndex = group.members.findIndex(
          (member) => member._id === memberID
        );
    
        if (memberIndex !== -1) {
          const updatedMember = {
            ...group.members[memberIndex],
            unread: false,
            lastRead: 0,
          };
    
          const updatedMembers = [
            ...group.members.slice(0, memberIndex),
            updatedMember,
            ...group.members.slice(memberIndex + 1),
          ];
    
          const updatedGroup = {
            ...group,
            members: updatedMembers,
          };
    
          const updatedGroupConversation = [
            ...state.group_conversation.slice(0, groupIndex),
            updatedGroup,
            ...state.group_conversation.slice(groupIndex + 1),
          ];
    
          state.group_conversation = updatedGroupConversation;
        }
      }
    },

    updateUnreadAndLastReadForMemberList(state, action) {
      const { groupID, memberList } = action.payload;
    
      const groupIndex = state.group_conversation.findIndex(
        (group) => group._id === groupID
      );
    
      if (groupIndex !== -1) {
        const group = state.group_conversation[groupIndex];
    
        const updatedMembers = group.members.map((member) => {
          if (memberList.includes(member._id)) {
            return {
              ...member,
              unread: true,
              // lastRead: member.lastRead + 1,
            };
          }
          return member;
        });
    
        const updatedGroup = {
          ...group,
          members: updatedMembers,
        };
    
        const updatedGroupConversation = [
          ...state.group_conversation.slice(0, groupIndex),
          updatedGroup,
          ...state.group_conversation.slice(groupIndex + 1),
        ];
    
        state.group_conversation = updatedGroupConversation;
      }
    },
    
    resetUnreadAndLastReadForMemberList(state, action) {
      const { groupID, memberList } = action.payload;
    
      const groupIndex = state.group_conversation.findIndex(
        (group) => group._id === groupID
      );
    
      if (groupIndex !== -1) {
        const group = state.group_conversation[groupIndex];
    
        const updatedMembers = group.members.map((member) => {
          if (memberList.includes(member._id)) {
            return {
              ...member,
              unread: false,
              lastRead: 0,
            };
          }
          return member;
        });
    
        const updatedGroup = {
          ...group,
          members: updatedMembers,
        };
    
        const updatedGroupConversation = [
          ...state.group_conversation.slice(0, groupIndex),
          updatedGroup,
          ...state.group_conversation.slice(groupIndex + 1),
        ];
    
        state.group_conversation = updatedGroupConversation;
      }
    },
    
    
    setDefaultGroupState(state, action) {
      state.group_current_conversation = null;
      state.current_messages = [];
      state.role = "member";
      state.sidebar.open = false;
      state.sidebar.type = "CONTACT";
    },

    setWebSocketConnection(state, action) {
      const { groupID, pieSocket } = action.payload;
      state.connections[groupID] = pieSocket;
    },

    removeWebSocketConnection(state, action) {
      state.connections[action.payload.groupID].close();
      delete state.connections[action.payload.groupID];
    },

    setIsFetchConnections(state, action) {
      state.isFetchConnections = action.payload.isFetchConnections;
    },

    resetCurrentMessages(state, action) {
      state.current_messages = [];
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function ToggleSidebarState() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSidebarState());
  };
}

export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSidebarType({ type }));
  };
}

export function UpdateGroupConversations(groupConversation) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateGroupConversations({
        group_conversation: groupConversation,
      })
    );
  };
}

export const SetGroupConversations = (groupConversations) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.fetchGroupConversation({
        group_conversation: groupConversations,
      })
    );
  };
};

export const UpdateGroupCurrentConversation = (groupInfor) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateGroupCurrentConversation({
        group_current_conversation: groupInfor,
      })
    );
  };
};

export const UpdateCurrentMessagesGroup = (groupID, message) => {
  return async (dispatch, getState) => {
      dispatch(slice.actions.updateCurrentMessagesGroup({ groupID, message }));
  };
};


export const FetchCurrentMessages = (messages) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.fetchCurrentMessages({ current_messages: messages })
    );
  };
};

export const UpdateGroupMembers = (members, channel_id) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateGroupMembers({ members, channel_id }));
  };
};

export const SetGroupMember = (members) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setGroupMember({ members }));
  };
};

export const UpdateRole = (role) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateRole({ role }));
  };
};

export const RemoveGroupConversation = (groupID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.removeGroupConversation({ groupID }));
  };
};

export const ResetGroupState = (groupID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetGroupState({ groupID }));
  };
};

export const UpdateGroupConversationMessage = (
  groupID,
  message,
  name,
  time,
  type
) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateGroupConversationMessage({
        groupID,
        message,
        name,
        time,
        type
      })
    );
  };
};

export const ResetUnreadAndLastRead = (groupID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetUnreadAndLastRead({ groupID }));
  };
}

export const UpdateUnreadAndLastRead = (groupID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateUnreadAndLastRead({ groupID }));
  };
}

export const SetWebSocketConnection = (groupID, pieSocket) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.setWebSocketConnection({
        groupID: groupID,
        pieSocket: pieSocket,
      })
    );
  };
};

export const RemoveWebSocketConnection = (groupID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.removeWebSocketConnection({ groupID }));
  };
};

export const SetIsFetchConnections = (isFetchConnections) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setIsFetchConnections({ isFetchConnections }));
  };
};

export const ResetCurrentMessages = () => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetCurrentMessages());
  };
};

export const SetGroupAvatar = (imageURL, groupID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setGroupAvatar({ imageURL, groupID }));
  };
};

export const SetGroupName = (groupName, groupID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setGroupName({ groupName, groupID }));
  };
}

export const ResetUnreadAndLastReadForMember = (groupID, memberID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetUnreadAndLastReadForMember({ groupID, memberID }));
  };
};

export const UpdateUnreadAndLastReadForMember = (groupID, memberID) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateUnreadAndLastReadForMember({ groupID, memberID }));
  };
};

export const ResetUnreadAndLastReadForMemberList = (groupID, memberList) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.resetUnreadAndLastReadForMemberList({ groupID, memberList }));
  };
}

export const UpdateUnreadAndLastReadForMemberList = (groupID, memberList) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateUnreadAndLastReadForMemberList({ groupID, memberList }));
  };
}
// Selector

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i]._id < pivot._id) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}
