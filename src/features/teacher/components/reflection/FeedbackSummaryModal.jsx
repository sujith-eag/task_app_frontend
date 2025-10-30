import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogContent, Typography, CircularProgress, Divider, Paper, LinearProgress, Chip } from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Summarize';
import StarIcon from '@mui/icons-material/Star';
import PeopleIcon from '@mui/icons-material/People';
import { getFeedbackSummaryForSession, clearFeedbackSummary } from '../../teacherSlice.js';

const FeedbackSummaryModal = ({ open, onClose, session }) => {
    const dispatch = useDispatch();
    const { feedbackSummary, isSummaryLoading } = useSelector((state) => state.teacher);

    useEffect(() => {
        if (open && session?._id) {
            dispatch(getFeedbackSummaryForSession(session._id));
        }
        // Cleanup when the modal closes
        return () => { dispatch(clearFeedbackSummary()); };
    }, [dispatch, open, session?._id]);

    const renderStudentFeedback = () => {
        const summary = feedbackSummary?.studentFeedbackSummary;
        if (!summary || summary.feedbackCount === 0) {
            return (
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
                    <Typography variant="body1" color="text.secondary">
                        No student feedback has been submitted for this session yet.
                    </Typography>
                </Box>
            );
        }

        const getColorForRating = (value) => {
            if (value >= 4) return 'success';
            if (value >= 3) return 'warning';
            return 'error';
        };

        return (
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: (theme) => 
                                theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(56, 142, 60, 0.3) 100%)'
                                    : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.15) 100%)',
                            border: '2px solid',
                            borderColor: 'success.main',
                        }}
                    >
                        <PeopleIcon sx={{ fontSize: '1.5rem', color: 'success.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>
                            Student Feedback Summary
                        </Typography>
                        <Chip 
                            label={`${summary.feedbackCount} Response${summary.feedbackCount !== 1 ? 's' : ''}`}
                            size="small"
                            color="success"
                            sx={{ mt: 0.5, fontWeight: 600 }}
                        />
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {Object.entries(summary.averageRatings).map(([key, value]) => {
                        const percentage = (value / 5) * 100;
                        const color = getColorForRating(value);
                        
                        return (
                            <Paper
                                key={key}
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    background: (theme) => theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.03)'
                                        : 'rgba(0, 0, 0, 0.02)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography 
                                        variant="body1" 
                                        fontWeight={600}
                                        sx={{ textTransform: 'capitalize' }}
                                    >
                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <StarIcon sx={{ fontSize: '1rem', color: `${color}.main` }} />
                                        <Typography variant="h6" fontWeight={700} color={`${color}.main`}>
                                            {value?.toFixed(1) || 'N/A'}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            / 5
                                        </Typography>
                                    </Box>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={percentage}
                                    color={color}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                                            ? 'rgba(255, 255, 255, 0.1)'
                                            : 'rgba(0, 0, 0, 0.08)',
                                        '& .MuiLinearProgress-bar': {
                                            borderRadius: 4,
                                        },
                                    }}
                                />
                            </Paper>
                        );
                    })}
                </Box>
            </Box>
        );
    };

    const renderTeacherReflection = () => {
        const reflection = feedbackSummary?.teacherReflection;
        if (!reflection) {
            return (
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
                    <Typography variant="body1" color="text.secondary">
                        You have not submitted a reflection for this session.
                    </Typography>
                </Box>
            );
        }
        return (
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: (theme) => 
                                theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(25, 118, 210, 0.3) 100%)'
                                    : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(33, 150, 243, 0.15) 100%)',
                            border: '2px solid',
                            borderColor: 'primary.main',
                        }}
                    >
                        <SummarizeIcon sx={{ fontSize: '1.5rem', color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700}>
                        Your Reflection
                    </Typography>
                </Box>

                {/* Self Assessment Summary */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.03)'
                            : 'rgba(0, 0, 0, 0.02)',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Effectiveness
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <StarIcon sx={{ fontSize: '1rem', color: 'warning.main' }} />
                                <Typography variant="h6" fontWeight={700}>
                                    {reflection.selfAssessment.effectiveness}/5
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Engagement
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <StarIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
                                <Typography variant="h6" fontWeight={700}>
                                    {reflection.selfAssessment.studentEngagement}/5
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary">
                                Pace
                            </Typography>
                            <Chip 
                                label={reflection.selfAssessment.pace}
                                size="small"
                                color={
                                    reflection.selfAssessment.pace === 'Just Right' ? 'success' :
                                    reflection.selfAssessment.pace === 'Too Slow' ? 'warning' : 'error'
                                }
                                sx={{ mt: 0.5, fontWeight: 600 }}
                            />
                        </Box>
                    </Box>
                </Paper>

                {/* Highlights */}
                {reflection.sessionHighlights && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(76, 175, 80, 0.08)'
                                : 'rgba(76, 175, 80, 0.05)',
                            border: '1px solid',
                            borderColor: 'success.main',
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} color="success.main" sx={{ mb: 1 }}>
                            Session Highlights
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {reflection.sessionHighlights}
                        </Typography>
                    </Paper>
                )}

                {/* Challenges */}
                {reflection.challengesFaced && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            mb: 2,
                            borderRadius: 2,
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(255, 152, 0, 0.08)'
                                : 'rgba(255, 152, 0, 0.05)',
                            border: '1px solid',
                            borderColor: 'warning.main',
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} color="warning.main" sx={{ mb: 1 }}>
                            Challenges Faced
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {reflection.challengesFaced}
                        </Typography>
                    </Paper>
                )}

                {/* Improvements */}
                {reflection.improvementsForNextSession && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(33, 150, 243, 0.08)'
                                : 'rgba(33, 150, 243, 0.05)',
                            border: '1px solid',
                            borderColor: 'info.main',
                        }}
                    >
                        <Typography variant="subtitle2" fontWeight={600} color="info.main" sx={{ mb: 1 }}>
                            Improvements for Next Session
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {reflection.improvementsForNextSession}
                        </Typography>
                    </Paper>
                )}
            </Box>
        );
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="md"
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(4px)',
                    }
                }
            }}
            PaperProps={{
                elevation: 24,
                sx: {
                    borderRadius: 3,
                    background: (theme) => 
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.98) 0%, rgba(15, 20, 40, 0.95) 100%)'
                            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '2px solid',
                    borderColor: 'divider',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 24px 48px rgba(0, 0, 0, 0.8), 0 12px 24px rgba(0, 0, 0, 0.6)'
                        : '0 24px 48px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.1)',
                }
            }}
        >
            {/* Header with Badge */}
            <Box sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Paper
                    elevation={0}
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: (theme) => 
                            theme.palette.mode === 'dark'
                                ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.2) 0%, rgba(251, 140, 0, 0.3) 100%)'
                                : 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.15) 100%)',
                        border: '2px solid',
                        borderColor: 'warning.main',
                        boxShadow: (theme) => `0 0 20px ${theme.palette.warning.main}40`,
                    }}
                >
                    <SummarizeIcon sx={{ fontSize: '1.5rem', color: 'warning.main' }} />
                </Paper>
                <Box sx={{ flex: 1 }}>
                    <Typography 
                        variant="h5" 
                        fontWeight={700}
                        sx={{
                            background: (theme) => 
                                theme.palette.mode === 'dark'
                                    ? 'linear-gradient(45deg, #ffa726 30%, #ff9800 90%)'
                                    : 'linear-gradient(45deg, #ed6c02 30%, #ff9800 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Feedback Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {session?.subject.name}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'divider' }} />

            <DialogContent sx={{ p: 3 }}>
                {isSummaryLoading || !feedbackSummary ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                        <CircularProgress size={60} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                            Loading feedback summary...
                        </Typography>
                    </Box>
                ) : (
                    <>
                        {renderStudentFeedback()}
                        <Divider sx={{ my: 4, borderColor: 'divider' }} />
                        {renderTeacherReflection()}
                    </>
                )}
            </DialogContent>

            <Divider sx={{ borderColor: 'divider' }} />

            <Box sx={{ p: 3, pt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                    variant="contained"
                    onClick={onClose}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 700,
                        boxShadow: 3,
                        '&:hover': {
                            boxShadow: 6,
                        },
                    }}
                >
                    Close
                </Button>
            </Box>
        </Dialog>
    );
};

export default FeedbackSummaryModal;