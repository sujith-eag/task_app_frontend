import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Dialog, DialogContent, Rating, TextField, Typography, CircularProgress, Paper, Divider } from '@mui/material';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { toast } from 'react-toastify';
import { submitFeedback, getSessionsForFeedback } from '../studentSlice';

const ratingCategories = [
    { key: 'clarity', label: 'Clarity of Explanation' },
    { key: 'engagement', label: 'Class Engagement' },
    { key: 'pace', label: 'Pace of the Lecture' },
    { key: 'knowledge', label: 'Instructor\'s Knowledge' },
];

const FeedbackModal = ({ open, onClose, session }) => {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        ratings: { clarity: 3, engagement: 3, pace: 3, knowledge: 3 },
        positiveFeedback: '',
        improvementSuggestions: '',
    });

    if (!session) return null;

    const handleRatingChange = (key, value) => {
        setFormData(prev => ({ ...prev, ratings: { ...prev.ratings, [key]: value } }));
    };

    const handleTextChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        dispatch(submitFeedback({ classSessionId: session._id, ...formData }))
            .unwrap()
            .then((result) => {
                toast.success(result.message);
                dispatch(getSessionsForFeedback()); // Refresh the list after submission
                onClose();
            })
            .catch((error) => toast.error(error))
            .finally(() => setIsSubmitting(false));
    };

    return (
        <Dialog 
            open={open} 
            onClose={!isSubmitting ? onClose : undefined}
            fullWidth 
            maxWidth="sm"
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
                        ? '0 24px 48px rgba(0, 0, 0, 0.8), 0 12px 24px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                        : '0 24px 48px rgba(0, 0, 0, 0.15), 0 12px 24px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                }
            }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                {/* Header with Badge */}
                <Box sx={{ 
                    p: 3, 
                    pb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                }}>
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
                                    ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(25, 118, 210, 0.3) 100%)'
                                    : 'linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(33, 150, 243, 0.15) 100%)',
                            border: '2px solid',
                            borderColor: 'primary.main',
                            boxShadow: (theme) => `0 0 20px ${theme.palette.primary.main}40`,
                        }}
                    >
                        <RateReviewIcon sx={{ fontSize: '1.5rem', color: 'primary.main' }} />
                    </Paper>
                    <Box sx={{ flex: 1 }}>
                        <Typography 
                            variant="h5" 
                            fontWeight={700}
                            sx={{
                                background: (theme) => 
                                    theme.palette.mode === 'dark'
                                        ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                                        : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 0.5,
                            }}
                        >
                            Session Feedback
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {session.subject.name}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'divider' }} />

                <DialogContent sx={{ p: 3 }}>
                    {/* Rating Categories */}
                    <Box sx={{ mb: 3 }}>
                        {ratingCategories.map(({ key, label }, index) => (
                            <Box 
                                key={key} 
                                sx={{ 
                                    mb: index < ratingCategories.length - 1 ? 2.5 : 0,
                                    p: 2,
                                    borderRadius: 2,
                                    background: (theme) => theme.palette.mode === 'dark'
                                        ? 'rgba(255, 255, 255, 0.03)'
                                        : 'rgba(0, 0, 0, 0.02)',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        background: (theme) => theme.palette.mode === 'dark'
                                            ? 'rgba(33, 150, 243, 0.08)'
                                            : 'rgba(25, 118, 210, 0.04)',
                                    }
                                }}
                            >
                                <Typography 
                                    component="legend" 
                                    fontWeight={600}
                                    fontSize="0.95rem"
                                    sx={{ mb: 1, color: 'text.primary' }}
                                >
                                    {label}
                                </Typography>
                                <Rating 
                                    name={key} 
                                    value={formData.ratings[key]} 
                                    onChange={(e, newValue) => handleRatingChange(key, newValue)}
                                    size="large"
                                    sx={{
                                        '& .MuiRating-iconFilled': {
                                            color: 'primary.main',
                                        },
                                        '& .MuiRating-iconHover': {
                                            color: 'primary.light',
                                            transform: 'scale(1.1)',
                                        },
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>

                    {/* Text Feedback */}
                    <TextField
                        name="positiveFeedback"
                        label="What went well? (Optional)"
                        value={formData.positiveFeedback}
                        onChange={handleTextChange}
                        multiline
                        rows={3}
                        fullWidth
                        margin="normal"
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: 2,
                                },
                            },
                        }}
                    />
                    <TextField
                        name="improvementSuggestions"
                        label="Any suggestions for improvement? (Optional)"
                        value={formData.improvementSuggestions}
                        onChange={handleTextChange}
                        multiline
                        rows={3}
                        fullWidth
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: 2,
                                },
                            },
                        }}
                    />
                </DialogContent>

                <Divider sx={{ borderColor: 'divider' }} />

                {/* Actions */}
                <Box sx={{ 
                    p: 3, 
                    pt: 2,
                    display: 'flex', 
                    gap: 2,
                    justifyContent: 'flex-end',
                }}>
                    <Button 
                        onClick={onClose} 
                        disabled={isSubmitting}
                        variant="outlined"
                        sx={{
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isSubmitting} 
                        sx={{ 
                            position: 'relative',
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontWeight: 700,
                            px: 3,
                            boxShadow: 3,
                            '&:hover': {
                                boxShadow: 6,
                                transform: 'translateY(-1px)',
                            },
                            transition: 'all 0.2s ease',
                        }}
                    >
                        Submit Feedback
                        {isSubmitting && (
                            <CircularProgress 
                                size={24} 
                                sx={{ 
                                    position: 'absolute',
                                    color: 'primary.contrastText',
                                }} 
                            />
                        )}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default FeedbackModal;