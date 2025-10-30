import React from 'react';
import { Box, Typography, LinearProgress, Paper, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AttendanceStats = ({ totalStudents, presentCount, absentCount }) => {
    const percentage = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
    
    // Determine color based on attendance percentage
    const getColor = () => {
        if (percentage >= 75) return 'success';
        if (percentage >= 50) return 'warning';
        return 'error';
    };

    const color = getColor();

    return (
        <Paper
            elevation={4}
            sx={{
                p: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                background: (theme) => 
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.9) 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
                border: '2px solid',
                borderColor: 'divider',
                mb: 3,
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={700} fontSize={{ xs: '1rem', sm: '1.25rem' }}>
                    Attendance Overview
                </Typography>
                <Chip
                    label={`${percentage}%`}
                    color={color}
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        height: { xs: 28, sm: 32 },
                    }}
                />
            </Box>

            {/* Progress Bar */}
            <LinearProgress
                variant="determinate"
                value={percentage}
                color={color}
                sx={{
                    height: 12,
                    borderRadius: 6,
                    mb: 2,
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.08)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        boxShadow: (theme) => {
                            const colorMap = {
                                success: theme.palette.success.main,
                                warning: theme.palette.warning.main,
                                error: theme.palette.error.main,
                            };
                            return `0 0 10px ${colorMap[color]}80`;
                        },
                    },
                }}
            />

            {/* Stats Row */}
            <Box sx={{ 
                display: 'flex', 
                gap: 2,
                flexDirection: { xs: 'column', sm: 'row' },
            }}>
                {/* Present */}
                <Box 
                    sx={{ 
                        flex: 1,
                        p: 1.5,
                        borderRadius: 1.5,
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(76, 175, 80, 0.15)'
                            : 'rgba(76, 175, 80, 0.08)',
                        border: '1px solid',
                        borderColor: 'success.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                            Present
                        </Typography>
                        <Typography variant="h5" fontWeight={700} fontSize={{ xs: '1.25rem', sm: '1.5rem' }}>
                            {presentCount}
                        </Typography>
                    </Box>
                </Box>

                {/* Absent */}
                <Box 
                    sx={{ 
                        flex: 1,
                        p: 1.5,
                        borderRadius: 1.5,
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(244, 67, 54, 0.15)'
                            : 'rgba(244, 67, 54, 0.08)',
                        border: '1px solid',
                        borderColor: 'error.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <CancelIcon sx={{ color: 'error.main', fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                            Absent
                        </Typography>
                        <Typography variant="h5" fontWeight={700} fontSize={{ xs: '1.25rem', sm: '1.5rem' }}>
                            {absentCount}
                        </Typography>
                    </Box>
                </Box>

                {/* Total */}
                <Box 
                    sx={{ 
                        flex: 1,
                        p: 1.5,
                        borderRadius: 1.5,
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(33, 150, 243, 0.15)'
                            : 'rgba(33, 150, 243, 0.08)',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <Box 
                        sx={{ 
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(33, 150, 243, 0.3)'
                                : 'rgba(33, 150, 243, 0.2)',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            fontWeight: 700,
                            color: 'primary.main',
                        }}
                    >
                        ∑
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" color="text.secondary" fontSize={{ xs: '0.75rem', sm: '0.875rem' }}>
                            Total
                        </Typography>
                        <Typography variant="h5" fontWeight={700} fontSize={{ xs: '1.25rem', sm: '1.5rem' }}>
                            {totalStudents}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default AttendanceStats;
