import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light',
  isSidebarOpen: false,
  toast: null,
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.theme);
      if (state.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    initializeTheme: (state) => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        state.theme = savedTheme;
        if (savedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        state.theme = 'dark';
        document.documentElement.classList.add('dark');
      }
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
    openModal: (state, action) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  initializeTheme,
  toggleSidebar,
  setSidebarOpen,
  showToast,
  hideToast,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
