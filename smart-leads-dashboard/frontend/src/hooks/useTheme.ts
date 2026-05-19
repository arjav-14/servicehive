import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useAuth';
import { toggleTheme } from '../redux/slices/themeSlice';

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.theme.darkMode);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return {
    darkMode,
    toggleTheme: handleToggle,
  };
};

export default useTheme;
