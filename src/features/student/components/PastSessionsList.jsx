import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { getSessionsForFeedback } from '../studentSlice';
import FeedbackModal from './FeedbackModal.jsx';

const PastSessionsList = () => {
    const dispatch = useDispatch();
    const { sessionsAwaitingFeedback, isLoading } = useSelector((state) => state.student);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        dispatch(getSessionsForFeedback());
    }, [dispatch]);

    const handleOpenModal = (session) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
    };

    if (isLoading && !sessionsAwaitingFeedback.length) {
        return (
            <Paper
                elevation={4}
                sx={{
                    p: 3,
                    borderRadius: { xs: 2, sm: 3 },
                    display: 'flex',
                    justifyContent: 'center',
                    minHeight: 200,
                }}
            >
                <CircularProgress />
            </Paper>
        );
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
                Pending Feedback
            </Typography>
            {sessionsAwaitingFeedback && sessionsAwaitingFeedback.length > 0 ? (
                <List sx={{ p: 0 }}>
                    {sessionsAwaitingFeedback.map((session, idx) => (
                        <ListItem 
                            key={session._id}
                            sx={{
                                mb: 1,
                                p: { xs: 1.5, sm: 2 },
                                borderRadius: 1.5,
                                background: (theme) => theme.palette.mode === 'dark'
                                    ? 'rgba(255, 255, 255, 0.03)'
                                    : 'rgba(255, 255, 255, 0.6)',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.2s ease',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'stretch', sm: 'center' },
                                gap: { xs: 1.5, sm: 0 },
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
                            <ListItemText
                                sx={{ 
                                    flex: 1,
                                    m: 0,
                                    pr: { xs: 0, sm: 2 },
                                }}
                                primary={
                                    <Typography 
                                        fontWeight={600} 
                                        fontSize={{ xs: '0.9rem', sm: '1rem' }}
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                        }}
                                    >
                                        {session.subject.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: { xs: 'nowrap', sm: 'normal' },
                                        }}
                                    >
                                        {session.teacher.name} • {new Date(session.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </Typography>
                                }
                            />
                            <Button 
                                variant="contained" 
                                size="small"
                                startIcon={<RateReviewIcon sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />}
                                onClick={() => handleOpenModal(session)}
                                fullWidth={{ xs: true, sm: false }}
                                sx={{
                                    borderRadius: 1.5,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    boxShadow: 2,
                                    minWidth: { sm: 120 },
                                    py: { xs: 1, sm: 0.75 },
                                    fontSize: { xs: '0.85rem', sm: '0.8125rem' },
                                    '&:hover': {
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                Feedback
                            </Button>
                        </ListItem>
                    ))}
                </List>
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
                        You have no pending feedback requests. Great job!
                    </Typography>
                </Box>
            )}
            {selectedSession && (
                <FeedbackModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    session={selectedSession}
                />
            )}
        </Paper>
    );
};

export default PastSessionsList;