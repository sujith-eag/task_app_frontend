import React, { useState, useMemo, createContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import getDesignTokens from '../theme';

// Create a context that will be available to all components
export const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light',
  setMode: () => {},
});

// Key for localStorage
const THEME_STORAGE_KEY = 'app-theme-mode';

// Detect system preference
const getSystemPreference = () => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Get initial theme mode from localStorage or system preference
const getInitialMode = () => {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedMode === 'light' || savedMode === 'dark') {
      return savedMode;
    }
  }
  // Fallback to system preference
  return getSystemPreference();
};

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(getInitialMode);

  // Persist theme preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
      // Update document class for potential CSS customizations
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(mode);
      // Update meta theme-color for mobile browsers
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', mode === 'dark' ? '#0a0e27' : '#1976d2');
      }
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, [mode]);

  // Listen for system theme changes (optional: auto-sync)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-sync if user hasn't set a preference
      const savedMode = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedMode) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    // Modern browsers support addEventListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Fallback for older browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Memoize the color mode context value
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
      setMode, // Allow direct mode setting
    }),
    [mode],
  );

  // Memoize the theme object so it's only recreated when the mode changes
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};