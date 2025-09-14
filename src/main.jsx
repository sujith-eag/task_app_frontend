// main.jsx
import { store } from './app/store.js';
import App from './App.jsx';
import './index.css';
import { ColorModeProvider } from './context/ThemeContext.jsx';

import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ColorModeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <App />
      </LocalizationProvider>
    </ColorModeProvider>
    </Provider>
  </StrictMode>
);
