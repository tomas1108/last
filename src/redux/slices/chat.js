import { createSlice } from "@reduxjs/toolkit";

const initialState = {
   chat_conversations: [],
   chat_current_conversation: null,
   current_messages: [],
  };


const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    fetchChatConversation(state, action) {
      state.group_conversation = action.payload.chat_conversation;
    },

    updateChatConversations(state, action) {
      state.group_conversation.push(action.payload.chat_conversation);
    },

    updateChatCurrentConversation(state, action) {
      state.group_current_conversation =
        action.payload.chat_current_conversation;
    },

    updateCurrentMessagesChat(state, action) {
      state.current_messages.push(action.payload.message);
    },

    fetchCurrentMessagesChat(state, action) {
      if (action.payload.current_messages) {
        state.current_messages = action.payload.current_messages;
      } else {
        state.current_messages = [];
      }
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

export function UpdateChatConversations(chatConversation) {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateChatConversations({
        chat_conversation: chatConversation,
      })
    );
  };
}

export const SetChatConversations = (chatConversation) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.fetchChatConversation({
        chat_conversation: chatConversation,
      })
    );
  };
};

export const UpdateChatCurrentConversation = (chatInfor) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.updateChatCurrentConversation({
        chat_current_conversation: chatInfor,
      })
    );
  };
};

export const updateCurrentMessagesChat = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateCurrentMessagesChat({ message }));
  };
};

export const fetchCurrentMessagesChat = (messages) => {
  return async (dispatch, getState) => {
    dispatch(
      slice.actions.fetchCurrentMessagesChat({ current_messages: messages })
    );
  };
};

