import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
  onlineUsers: [],
  onlineCount: 0,
  isTyping: [],
  isConnected: false,
  currentEventId: null,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSocket: (state, action) => {
      state.isConnected = action.payload;
    },
    setCurrentEvent: (state, action) => {
      state.currentEventId = action.payload;
      state.messages = [];
      state.onlineUsers = [];
      state.isTyping = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setOnlineCount: (state, action) => {
      state.onlineCount = action.payload;
    },
    userJoined: (state, action) => {
      if (!state.onlineUsers.find(u => u.userId === action.payload.userId)) {
        state.onlineUsers.push(action.payload);
      }
    },
    userLeft: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(
        u => u.userId !== action.payload.userId
      );
    },
    setTyping: (state, action) => {
      const { userId, isTyping } = action.payload;
      if (isTyping) {
        if (!state.isTyping.includes(userId)) {
          state.isTyping.push(userId);
        }
      } else {
        state.isTyping = state.isTyping.filter(id => id !== userId);
      }
    },
    clearChat: (state) => {
      state.messages = [];
      state.onlineUsers = [];
      state.isTyping = [];
      state.currentEventId = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSocket,
  setCurrentEvent,
  addMessage,
  setMessages,
  setOnlineUsers,
  setOnlineCount,
  userJoined,
  userLeft,
  setTyping,
  clearChat,
  setError,
  clearError,
} = chatSlice.actions;

export default chatSlice.reducer;
