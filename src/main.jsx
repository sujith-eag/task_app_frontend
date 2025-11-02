import { store } from './app/store.js';
import App from './App.jsx';
import './index.css';
import { ColorModeProvider } from './context/ThemeContext.jsx';
import { SocketContextProvider } from './context/SocketContext.jsx';

import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';
import { forceLogout } from './features/auth/authSlice.js';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ColorModeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SocketContextProvider>
        <CssBaseline />
          <App />
        </SocketContextProvider>
      </LocalizationProvider>
    </ColorModeProvider>
    </Provider>
  </StrictMode>
);

// Global listener: when axios interceptor emits auth:sessionExpired, clear auth and show toast
window.addEventListener('auth:sessionExpired', (e) => {
  try {
    const message = e?.detail?.message || 'Your session has expired. Please log in again.';
    // Clear client auth state immediately
    store.dispatch(forceLogout());
    // Show a user-friendly toast (login page also listens, but a global toast helps notify in-app)
    toast.error(message, { position: 'top-center', autoClose: 4000, toastId: 'session-expired' });
  } catch (err) {
    // swallow
  }
});
