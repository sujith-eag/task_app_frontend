import { createTheme } from '@mui/material/styles';

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // Light Mode Colors - Enhanced
          primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#dc004e',
            light: '#f50057',
            dark: '#c51162',
            contrastText: '#ffffff',
          },
          success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
          },
          warning: {
            main: '#ed6c02',
            light: '#ff9800',
            dark: '#e65100',
          },
          error: {
            main: '#d32f2f',
            light: '#ef5350',
            dark: '#c62828',
          },
          info: {
            main: '#0288d1',
            light: '#03a9f4',
            dark: '#01579b',
          },
          background: {
            default: '#f5f7fa',
            paper: '#ffffff',
            neutral: '#f4f6f8',
          },
          text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.6)',
            disabled: 'rgba(0, 0, 0, 0.38)',
          },
          divider: 'rgba(0, 0, 0, 0.12)',
          action: {
            active: 'rgba(0, 0, 0, 0.54)',
            hover: 'rgba(0, 0, 0, 0.04)',
            selected: 'rgba(0, 0, 0, 0.08)',
            disabled: 'rgba(0, 0, 0, 0.26)',
            disabledBackground: 'rgba(0, 0, 0, 0.12)',
          },
        }
      : {
          // Dark Mode Colors - Enhanced
          primary: {
            main: '#90caf9',
            light: '#b3d9ff',
            dark: '#5d99c6',
            contrastText: '#000000',
          },
          secondary: {
            main: '#f48fb1',
            light: '#ffc1e3',
            dark: '#bf5f82',
            contrastText: '#000000',
          },
          success: {
            main: '#66bb6a',
            light: '#81c784',
            dark: '#388e3c',
          },
          warning: {
            main: '#ffa726',
            light: '#ffb74d',
            dark: '#f57c00',
          },
          error: {
            main: '#f44336',
            light: '#e57373',
            dark: '#d32f2f',
          },
          info: {
            main: '#29b6f6',
            light: '#4fc3f7',
            dark: '#0288d1',
          },
          background: {
            default: '#0a0e27',
            paper: '#1a1f3a',
            neutral: '#151a30',
          },
          text: {
            primary: '#ffffff',
            secondary: '#b0bec5',
            disabled: 'rgba(255, 255, 255, 0.5)',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
          action: {
            active: 'rgba(255, 255, 255, 0.56)',
            hover: 'rgba(255, 255, 255, 0.08)',
            selected: 'rgba(255, 255, 255, 0.16)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)',
          },
        }),
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none', // Remove all-caps default
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 500,
      lineHeight: 2.66,
      letterSpacing: '0.08333em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12, // Increased for modern feel
  },
  spacing: 8, // Default MUI spacing unit
  shadows: [
    'none',
    mode === 'light'
      ? '0px 2px 4px rgba(0, 0, 0, 0.05)'
      : '0px 2px 4px rgba(0, 0, 0, 0.4)',
    mode === 'light'
      ? '0px 4px 8px rgba(0, 0, 0, 0.08)'
      : '0px 4px 8px rgba(0, 0, 0, 0.5)',
    mode === 'light'
      ? '0px 8px 16px rgba(0, 0, 0, 0.1)'
      : '0px 8px 16px rgba(0, 0, 0, 0.6)',
    mode === 'light'
      ? '0px 12px 24px rgba(0, 0, 0, 0.12)'
      : '0px 12px 24px rgba(0, 0, 0, 0.7)',
    // ... rest of default shadows
    ...Array(20).fill(mode === 'light' 
      ? '0px 16px 32px rgba(0, 0, 0, 0.15)' 
      : '0px 16px 32px rgba(0, 0, 0, 0.8)'
    ),
  ],
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        body {
          overflow-x: hidden;
        }
        a {
          text-decoration: none;
          color: inherit;
        }
        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        ::-webkit-scrollbar-track {
          background: ${mode === 'light' ? '#f1f1f1' : '#1a1f3a'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${mode === 'light' ? '#888' : '#4a5568'};
          border-radius: 5px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${mode === 'light' ? '#555' : '#5a6578'};
        }
        /* Selection styling */
        ::selection {
          background-color: ${mode === 'light' ? 'rgba(25, 118, 210, 0.3)' : 'rgba(144, 202, 249, 0.3)'};
        }
      `,
    },
    MuiButton: {
      defaultProps: {
        disableElevation: false, // Enable elevation for better depth
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 22px',
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: mode === 'light' 
            ? '0 2px 8px rgba(0, 0, 0, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.4)',
          '&:hover': {
            boxShadow: mode === 'light'
              ? '0 4px 12px rgba(0, 0, 0, 0.2)'
              : '0 4px 12px rgba(0, 0, 0, 0.5)',
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        sizeSmall: {
          padding: '5px 16px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '10px 28px',
          fontSize: '0.9375rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: mode === 'light'
            ? '0 4px 20px rgba(0, 0, 0, 0.08)'
            : '0 4px 20px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: mode === 'light'
              ? '0 8px 30px rgba(0, 0, 0, 0.12)'
              : '0 8px 30px rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Remove default gradient
        },
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: mode === 'light'
            ? '0 2px 8px rgba(0, 0, 0, 0.08)'
            : '0 2px 8px rgba(0, 0, 0, 0.4)',
        },
        elevation2: {
          boxShadow: mode === 'light'
            ? '0 4px 12px rgba(0, 0, 0, 0.1)'
            : '0 4px 12px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: `1px solid ${mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)'}`,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: mode === 'light' ? '#1976d2' : '#90caf9',
              },
            },
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.95)',
          color: mode === 'light' ? '#ffffff' : '#000000',
          fontSize: '0.75rem',
          borderRadius: 6,
          padding: '8px 12px',
        },
        arrow: {
          color: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: mode === 'light' ? '#e8f5e9' : '#1b5e20',
        },
        standardError: {
          backgroundColor: mode === 'light' ? '#ffebee' : '#c62828',
        },
        standardWarning: {
          backgroundColor: mode === 'light' ? '#fff3e0' : '#e65100',
        },
        standardInfo: {
          backgroundColor: mode === 'light' ? '#e3f2fd' : '#01579b',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          animationDuration: '1.5s',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(144, 202, 249, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.12)' : 'rgba(144, 202, 249, 0.16)',
            '&:hover': {
              backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.16)' : 'rgba(144, 202, 249, 0.2)',
            },
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          marginTop: 8,
          minWidth: 180,
          boxShadow: mode === 'light'
            ? '0 8px 24px rgba(0, 0, 0, 0.12)'
            : '0 8px 24px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: '4px 8px',
          padding: '8px 12px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: mode === 'light' ? 'rgba(25, 118, 210, 0.08)' : 'rgba(144, 202, 249, 0.08)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: mode === 'light'
            ? '0 16px 48px rgba(0, 0, 0, 0.15)'
            : '0 16px 48px rgba(0, 0, 0, 0.7)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1.25rem',
          fontWeight: 600,
          padding: '20px 24px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 20px',
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.7rem',
        },
      },
    },
  },
});

export default getDesignTokens;