import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Classic blue
    },
    secondary: {
      main: '#dc004e', // Vibrant pink
    },
    background: {
      default: '#f4f6f8', // Light grey page background
      paper: '#ffffff',   // White for cards, etc.
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
  // Add global style overrides here
  components: {
    // MuiCssBaseline is the component that applies global resets
    MuiCssBaseline: {
      styleOverrides: `
        a {
          text-decoration: none;
          color: inherit;
        }
      `,
    },
    // You can also set default props for all instances of a component
    MuiButton: {
      defaultProps: {
        variant: 'contained', // All buttons will be "contained" unless specified otherwise
      },
    },
  },
});

export default theme;