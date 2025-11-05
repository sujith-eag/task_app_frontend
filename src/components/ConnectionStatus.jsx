import { useSocket } from '../context/SocketContext.jsx';
import { Box, Chip, IconButton, Tooltip, Fade, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// Note: using a styled red dot for offline state for clarity
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * ConnectionStatus Component
 *
 * Displays real-time Socket.IO connection status with compact visual
 * indicators and an optional manual reconnect action. This component is
 * responsive and uses small inline indicators on narrow viewports to avoid
 * header overflow.
 *
 * Features:
 * - Real-time connection status indicator
 * - Color-coded status (connected/reconnecting/offline)
 * - Small, non-intrusive indicators on mobile
 * - Manual reconnect button when disconnected
 * - Accessibility: aria-labels/roles provided for screen readers
 *
 * States:
 * - Connected: small green dot (online indicator)
 * - Reconnecting: orange chip / spinning icon
 * - Disconnected: red dot (mobile) or red 'Offline' chip with reconnect
 *
 * @component
 */
const ConnectionStatus = () => {
    const { isConnected, isReconnecting, reconnect } = useSocket();
    const theme = useTheme();

    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    // Small reusable dot used for connected/offline indicators
    const Dot = ({ size = 8, color = theme.palette.success.main, shadow = true, ariaLabel }) => (
        <Box sx={{ ml: 0.5 }}>
            <Box
                role="img"
                aria-label={ariaLabel}
                sx={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    backgroundColor: color,
                    boxShadow: shadow ? `0 0 ${Math.max(4, size)}px ${color}` : 'none',
                }}
            />
        </Box>
    );

    // Show small green dot when connected
    if (isConnected) {
        if (isSmall) {
            return (
                <Tooltip title="Connected" arrow>
                    <Dot ariaLabel="Connected" />
                </Tooltip>
            );
        }

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
                                opacity: 0.8,
                            },
                            '50%': {
                                boxShadow: `0 0 12px ${theme.palette.success.main}`,
                                opacity: 1,
                            },
                        },
                    }}
                    role="status"
                    aria-live="polite"
                />
            </Tooltip>
        );
    }

    const status = isReconnecting ? 'reconnecting' : 'disconnected';

    // Compact UI for small screens: use only an icon button with tooltip to avoid overflow
    if (isSmall) {
        if (status === 'reconnecting') {
            return (
                <Tooltip title="Reconnecting..." arrow>
                    <IconButton size="small" sx={{ ml: 0.5 }}>
                        <RefreshIcon sx={{ animation: 'spin 1s linear infinite' }} fontSize="small" aria-hidden />
                    </IconButton>
                </Tooltip>
            );
        }

        // disconnected (small) — show a red dot button
        return (
            <Tooltip title="Offline" arrow>
                <IconButton size="small" sx={{ ml: 0.5 }} onClick={reconnect} aria-label="Reconnect">
                    <Box role="img" aria-label="Offline" sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: theme.palette.error.main, boxShadow: `0 0 6px ${theme.palette.error.main}` }} />
                </IconButton>
            </Tooltip>
        );
    }

    // Larger screens: show a compact chip without overly verbose styling
    if (status === 'reconnecting') {
        return (
            <Fade in={!isConnected}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                    <Chip
                        icon={<RefreshIcon sx={{ animation: 'spin 1s linear infinite' }} />}
                        label="Reconnecting"
                        color="warning"
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                </Box>
            </Fade>
        );
    }

    // disconnected (large)
    return (
        <Fade in={!isConnected}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                <Chip
                    icon={<Box role="img" aria-label="Offline" sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: theme.palette.error.main }} />}
                    label="Offline"
                    color="error"
                    size="small"
                    sx={{ fontWeight: 600 }}
                />
                <Tooltip title="Reconnect" arrow>
                    <IconButton onClick={reconnect} size="small" color="error" aria-label="Reconnect">
                        <RefreshIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Box>
        </Fade>
    );
};

export default ConnectionStatus;
