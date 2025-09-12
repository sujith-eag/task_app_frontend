// main.jsx
import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store.js';
import App from './App.jsx';
import './index.css';

// 1. Import ThemeProvider, CssBaseline, and your new theme
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      {/* 2. Wrap your App in the ThemeProvider */}
      <ThemeProvider theme={theme}>
        {/* 3. Add CssBaseline to apply the background color and normalize styles */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
