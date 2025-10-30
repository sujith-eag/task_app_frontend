import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CountdownTimer = ({ timeLeft, isWindowOpen }) => {
    // Calculate percentage of time remaining (assuming 5 minutes = 300 seconds total)
    const totalTime = 300; // 5 minutes in seconds
    const percentage = Math.min((timeLeft / totalTime) * 100, 100);
    
    // Determine color based on time remaining
    const getColor = () => {
        if (!isWindowOpen) return 'error';
        if (timeLeft > 180) return 'success'; // > 3 minutes
        if (timeLeft > 60) return 'warning';  // > 1 minute
        return 'error'; // < 1 minute
    };

    const color = getColor();
    
    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getIcon = () => {
        if (!isWindowOpen) return <WarningAmberIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />;
        if (color === 'success') return <CheckCircleIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />;
        if (color === 'warning') return <WarningAmberIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />;
        return <AccessTimeIcon sx={{ fontSize: { xs: '2rem', sm: '2.5rem' } }} />;
    };

    return (
        <Paper
            elevation={4}
            sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3,
                background: (theme) => {
                    const colorMap = {
                        success: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.25) 0%, rgba(56, 142, 60, 0.35) 100%)'
                            : 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.2) 100%)',
                        warning: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(255, 167, 38, 0.25) 0%, rgba(251, 140, 0, 0.35) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 167, 38, 0.15) 0%, rgba(255, 167, 38, 0.2) 100%)',
                        error: theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(244, 67, 54, 0.25) 0%, rgba(211, 47, 47, 0.35) 100%)'
                            : 'linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(244, 67, 54, 0.2) 100%)',
                    };
                    return colorMap[color];
                },
                boxShadow: (theme) => {
                    const colorMap = {
                        success: theme.palette.success.main,
                        warning: theme.palette.warning.main,
                        error: theme.palette.error.main,
                    };
                    return theme.palette.mode === 'dark'
                        ? `0 12px 40px ${colorMap[color]}30, 0 4px 12px ${colorMap[color]}20, 0 0 40px ${colorMap[color]}15`
                        : `0 12px 40px ${colorMap[color]}20, 0 4px 12px ${colorMap[color]}15, 0 0 40px ${colorMap[color]}10`;
                },
                border: '2px solid',
                borderColor: `${color}.main`,
                mb: 3,
                transition: 'all 0.5s ease',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Icon */}
                <Box
                    sx={{
                        width: { xs: 56, sm: 64 },
                        height: { xs: 56, sm: 64 },
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: (theme) => {
                            const colorMap = {
                                success: theme.palette.mode === 'dark'
                                    ? 'rgba(76, 175, 80, 0.3)'
                                    : 'rgba(76, 175, 80, 0.2)',
                                warning: theme.palette.mode === 'dark'
                                    ? 'rgba(255, 167, 38, 0.3)'
                                    : 'rgba(255, 167, 38, 0.2)',
                                error: theme.palette.mode === 'dark'
                                    ? 'rgba(244, 67, 54, 0.3)'
                                    : 'rgba(244, 67, 54, 0.2)',
                            };
                            return colorMap[color];
                        },
                        border: '2px solid',
                        borderColor: `${color}.main`,
                        color: `${color}.main`,
                    }}
                >
                    {getIcon()}
                </Box>

                {/* Timer Display */}
                <Box sx={{ flex: 1 }}>
                    <Typography 
                        variant="body2" 
                        color="text.secondary"
                        fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                        sx={{ mb: 0.5 }}
                    >
                        {isWindowOpen ? 'Time Remaining' : 'Window Status'}
                    </Typography>
                    
                    {isWindowOpen ? (
                        <Typography
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                                fontWeight: 700,
                                fontFamily: 'monospace',
                                color: `${color}.main`,
                                lineHeight: 1,
                            }}
                        >
                            {formatTime(timeLeft)}
                        </Typography>
                    ) : (
                        <Typography
                            sx={{
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                fontWeight: 700,
                                color: 'error.main',
                            }}
                        >
                            Closed
                        </Typography>
                    )}
                    
                    <Typography 
                        variant="caption" 
                        color="text.secondary"
                        fontSize={{ xs: '0.7rem', sm: '0.75rem' }}
                        sx={{ mt: 0.5, display: 'block' }}
                    >
                        {isWindowOpen 
                            ? 'Students can mark attendance' 
                            : 'Manual changes enabled'}
                    </Typography>
                </Box>

                {/* Visual Progress */}
                {isWindowOpen && (
                    <Box
                        sx={{
                            width: { xs: 40, sm: 48 },
                            height: { xs: 40, sm: 48 },
                            borderRadius: '50%',
                            position: 'relative',
                            display: { xs: 'none', sm: 'flex' },
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="8"
                                opacity="0.2"
                            />
                            {/* Progress circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke={
                                    color === 'success' ? '#4caf50' :
                                    color === 'warning' ? '#ff9800' : '#f44336'
                                }
                                strokeWidth="8"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                                transform="rotate(-90 50 50)"
                                style={{ transition: 'stroke-dashoffset 1s ease' }}
                            />
                        </svg>
                        <Typography
                            sx={{
                                position: 'absolute',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                color: `${color}.main`,
                            }}
                        >
                            {Math.round(percentage)}%
                        </Typography>
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default CountdownTimer;
