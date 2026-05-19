import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = (): boolean => {
  const savedTheme = localStorage.getItem('gigflow_dark_mode');
  if (savedTheme !== null) {
    return savedTheme === 'true';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('gigflow_dark_mode', String(state.darkMode));
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
