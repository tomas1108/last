// webSocketSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const webSocketSlice = createSlice({
  name: 'webSocket',
  initialState: {
    isConnected: false,
  },
  reducers: {
    setConnected: (state, action) => {
      state.isConnected = action.payload;
    },
  },
});

export const { setConnected } = webSocketSlice.actions;

export default webSocketSlice.reducer;
