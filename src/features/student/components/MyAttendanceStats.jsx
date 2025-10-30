import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, LinearProgress, CircularProgress, Alert, Paper, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';

import { getStudentDashboardStats } from '../studentSlice.js';

const SubjectStat = ({ subject }) => {
    const percentage = subject.attendancePercentage;
    const getStatusColor = () => {
        if (percentage >= 75) return 'success';
        if (percentage >= 50) return 'warning';
        return 'error';
    };

    const getStatusIcon = () => {
        if (percentage >= 75) return <CheckCircleIcon fontSize="small" />;
        if (percentage >= 50) return <WarningIcon fontSize="small" />;
        return <ErrorIcon fontSize="small" />;
    };

    return (
        <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                    {subject.subjectName}
                </Typography>
                <Chip 
                    icon={getStatusIcon()}
                    label={`${percentage.toFixed(1)}%`}
                    color={getStatusColor()}
                    size="small"
                    sx={{ fontWeight: 700 }}
                />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, fontWeight: 500 }}>
                {subject.subjectCode} • {subject.attendedClasses}/{subject.totalClasses} Classes
            </Typography>
            <LinearProgress
                variant="determinate"
                value={percentage}
                color={getStatusColor()}
                sx={{ 
                    height: 12, 
                    borderRadius: 6,
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.08)'
                        : 'rgba(0, 0, 0, 0.08)',
                    '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                            ? '0 0 8px currentColor'
                            : '0 0 6px currentColor',
                    }
                }}
            />
        </Box>
    );
};

const MyAttendanceStats = () => {
    const dispatch = useDispatch();
    const { dashboardStats, isLoading, isError, message } = useSelector((state) => state.student);

    useEffect(() => {
        dispatch(getStudentDashboardStats());
    }, [dispatch]);

    if (isLoading) {
        return (
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    borderRadius: { xs: 2, sm: 3 },
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 200,
                }}
            >
                <CircularProgress />
            </Paper>
        );
    }

    if (isError) {
        return <Alert severity="error">{message}</Alert>;
    }

    return (
        <Paper
            elevation={4}
            sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: { xs: 2, sm: 3 },
                background: (theme) => 
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.9) 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                border: '2px solid',
                borderColor: 'divider',
            }}
        >
            <Typography variant="h5" gutterBottom fontWeight={700} sx={{
                mb: 2.5,
                background: (theme) => 
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                        : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}>
                My Attendance Record
            </Typography>
            {dashboardStats && dashboardStats.length > 0 ? (
                <Box>
                    {dashboardStats.map((subject) => (
                        <SubjectStat key={subject.subjectId} subject={subject} />
                    ))}
                </Box>
            ) : (
                <Box sx={{
                    textAlign: 'center',
                    py: 4,
                    px: 2,
                    borderRadius: 2,
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(0, 0, 0, 0.02)',
                    border: '1px dashed',
                    borderColor: 'divider',
                }}>
                    <Typography variant="body2" color="text.secondary">
                        No attendance data available yet. Attend a class to see your stats.
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};

export default MyAttendanceStats;