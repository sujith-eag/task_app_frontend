import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, List, ListItem, ListItemText, 
    CircularProgress, Alert, Button, Stack, Chip } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { getTeacherSessionsHistory } from '../../teacherSlice.js';

import TeacherReflectionModal from '../reflection/TeacherReflectionModal.jsx';
import FeedbackSummaryModal from '../reflection/FeedbackSummaryModal.jsx';


const ClassHistory = () => {
    const dispatch = useDispatch();
    const { sessionHistory, isLoading, isError, message } = useSelector((state) => state.teacher);

    
    // State for modals
    const [selectedSession, setSelectedSession] = useState(null);
    const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getTeacherSessionsHistory());
    }, [dispatch]);

    const openReflectionModal = (session) => {
        setSelectedSession(session);
        setReflectionModalOpen(true);
    };

    const openSummaryModal = (session) => {
        setSelectedSession(session);
        setSummaryModalOpen(true);
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (isError) {
        return (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
                {message}
            </Alert>
        );
    }

    return (
        <Box>
            <Typography 
                variant="h5" 
                fontWeight={700}
                fontSize={{ xs: '1.25rem', sm: '1.5rem' }}
                sx={{
                    mb: 3,
                    background: (theme) => 
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Recent Class History
            </Typography>
            
            <List 
                dense 
                sx={{ 
                    maxHeight: { xs: 400, md: 500 }, 
                    overflow: 'auto',
                    // Custom scrollbar
                    '&::-webkit-scrollbar': {
                        width: 8,
                    },
                    '&::-webkit-scrollbar-track': {
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                        borderRadius: 4,
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradient(180deg, #90caf9 0%, #64b5f6 100%)'
                            : 'linear-gradient(180deg, #1976d2 0%, #42a5f5 100%)',
                        borderRadius: 4,
                    },
                }}
            >
                {sessionHistory.length > 0 ? (
                    sessionHistory.map((session) => (
                        <ListItem 
                            key={session._id}
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'flex-start',
                                mb: 2,
                                p: { xs: 2, sm: 2.5 },
                                border: '1px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                background: (theme) => theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.03)'
                                    : 'rgba(255, 255, 255, 0.6)',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: (theme) => theme.palette.mode === 'dark'
                                        ? 'rgba(33, 150, 243, 0.15)'
                                        : 'rgba(25, 118, 210, 0.08)',
                                    borderColor: 'primary.main',
                                    transform: 'translateX(4px)',
                                    boxShadow: 2,
                                },
                            }}
                        >
                            {/* Subject Header with Reflection Status */}
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                                <ListItemText
                                    primary={
                                        <Typography fontWeight={700} fontSize={{ xs: '0.95rem', sm: '1.1rem' }}>
                                            {session.subject.name}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary" fontSize={{ xs: '0.7rem', sm: '0.75rem' }}>
                                            {session.subject.subjectCode}
                                        </Typography>
                                    }
                                    sx={{ m: 0 }}
                                />
                                
                                {session.hasReflection && (
                                    <Chip
                                        icon={<CheckCircleIcon sx={{ fontSize: '0.875rem' }} />}
                                        label="Reflected"
                                        size="small"
                                        color="success"
                                        variant="outlined"
                                        sx={{
                                            height: 24,
                                            fontSize: '0.7rem',
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                            </Box>

                            {/* Session Details */}
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                fontSize={{ xs: '0.8rem', sm: '0.875rem' }}
                                sx={{ mb: 1.5, width: '100%' }}
                            >
                                {`Sem: ${session.semester}, Sec: ${session.section} • Batch: ${session.batch}`}
                                <br />
                                {`${new Date(session.startTime).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}`}
                            </Typography>

                            {/* Action Buttons */}
                            <Stack 
                                direction={{ xs: 'column', sm: 'row' }} 
                                spacing={1}
                                sx={{ width: { xs: '100%', sm: 'auto' } }}
                            >
                                <Button 
                                    size="small" 
                                    variant={session.hasReflection ? "outlined" : "contained"}
                                    startIcon={session.hasReflection ? <RateReviewIcon /> : <PendingIcon />}
                                    onClick={() => openReflectionModal(session)}
                                    fullWidth={{ xs: true, sm: false }}
                                    sx={{
                                        borderRadius: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: { xs: '0.8rem', sm: '0.8125rem' },
                                        px: 2,
                                        '&:hover': {
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    {session.hasReflection ? 'Edit Reflection' : 'Add Reflection'}
                                </Button>
                                <Button 
                                    size="small" 
                                    variant="outlined"
                                    startIcon={<SummarizeIcon />}
                                    onClick={() => openSummaryModal(session)}
                                    fullWidth={{ xs: true, sm: false }}
                                    sx={{
                                        borderRadius: 1.5,
                                        fontWeight: 600,
                                        textTransform: 'none',
                                        fontSize: { xs: '0.8rem', sm: '0.8125rem' },
                                        px: 2,
                                        '&:hover': {
                                            boxShadow: 3,
                                        },
                                    }}
                                >
                                    View Summary
                                </Button>
                            </Stack>
                        </ListItem>
                    ))
                ) : (
                    <Box sx={{
                        textAlign: 'center',
                        py: 6,
                        px: 2,
                        borderRadius: 2,
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.03)'
                            : 'rgba(0, 0, 0, 0.02)',
                        border: '1px dashed',
                        borderColor: 'divider',
                    }}>
                        <Typography variant="body2" color="text.secondary">
                            No past sessions found. Start a new class to begin!
                        </Typography>
                    </Box>
                )}
            </List>

            {/* Modals */}
            {selectedSession && (
                <>
                    <TeacherReflectionModal
                        open={isReflectionModalOpen}
                        onClose={() => setReflectionModalOpen(false)}
                        session={selectedSession}
                    />
                    <FeedbackSummaryModal
                        open={isSummaryModalOpen}
                        onClose={() => setSummaryModalOpen(false)}
                        session={selectedSession}
                    />
                </>
            )}
        </Box>
    );
};

export default ClassHistory;