import { useSocket } from '../context/SocketContext.jsx';
import { Box, Chip, IconButton, Tooltip, Fade } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * ConnectionStatus Component
 * 
 * Displays real-time Socket.IO connection status with visual indicators.
 * Shows connection state (connected/disconnected/reconnecting) and provides
 * a manual reconnect button for disconnected states.
 * 
 * Features:
 * - Real-time connection status indicator
 * - Color-coded status (success/error/warning)
 * - Animated transitions
 * - Manual reconnect button
 * - Responsive design
 * - Theme-aware styling
 * 
 * States:
 * - Connected: Small green dot (online indicator)
 * - Disconnected: Red chip with WiFi-off icon + reconnect button
 * - Reconnecting: Orange chip with spinning refresh icon
 * 
 * @component
 * @example
 * // Add to Header or App level
 * <ConnectionStatus />
 */
const ConnectionStatus = () => {
    const { isConnected, isReconnecting, reconnect } = useSocket();
    const theme = useTheme();

    // Show small green dot when connected
    if (isConnected) {
        return (
            <Tooltip title="Connected" arrow>
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: theme.palette.success.main,
                        ml: { xs: 0.5, md: 1 },
                        boxShadow: `0 0 8px ${theme.palette.success.main}`,
                        animation: 'glow 2s ease-in-out infinite',
                        '@keyframes glow': {
                            '0%, 100%': { 
                                boxShadow: `0 0 4px ${theme.palette.success.main}`,
                                opacity: 0.8
                            },
                            '50%': { 
                                boxShadow: `0 0 12px ${theme.palette.success.main}`,
                                opacity: 1
                            }
                        }
                    }}
                />
            </Tooltip>
        );
    }

    const statusConfig = {
        reconnecting: {
            label: 'Reconnecting...',
            color: 'warning',
            icon: <RefreshIcon sx={{ 
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                }
            }} />,
            showReconnect: false
        },
        disconnected: {
            label: 'Offline',
            color: 'error',
            icon: <WifiOffIcon />,
            showReconnect: true
        }
    };

    const status = isReconnecting ? 'reconnecting' : 'disconnected';
    const config = statusConfig[status];

    return (
        <Fade in={!isConnected}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    ml: { xs: 0, md: 1 }
                }}
            >
                <Chip
                    icon={config.icon}
                    label={config.label}
                    color={config.color}
                    size="small"
                    sx={{
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        height: 28,
                        '& .MuiChip-icon': {
                            fontSize: '1rem'
                        },
                        animation: 'pulse 2s ease-in-out infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.7 }
                        }
                    }}
                />
                
                {config.showReconnect && (
                    <Tooltip title="Reconnect" arrow>
                        <IconButton
                            onClick={reconnect}
                            size="small"
                            color="error"
                            sx={{
                                width: 28,
                                height: 28,
                                '&:hover': {
                                    backgroundColor: theme.palette.error.main,
                                    color: theme.palette.error.contrastText,
                                    transform: 'rotate(180deg)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <RefreshIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Fade>
    );
};

export default ConnectionStatus;
