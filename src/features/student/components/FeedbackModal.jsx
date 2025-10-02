import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating, TextField, Typography, CircularProgress } from '@mui/material';
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
    const { isLoading } = useSelector((state) => state.student);
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
        dispatch(submitFeedback({ classSessionId: session._id, ...formData }))
            .unwrap()
            .then((result) => {
                toast.success(result.message);
                dispatch(getSessionsForFeedback()); // Refresh the list after submission
                onClose();
            })
            .catch((error) => toast.error(error));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Feedback for {session.subject.name}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    {ratingCategories.map(({ key, label }) => (
                        <Box key={key} sx={{ mb: 2 }}>
                            <Typography component="legend">{label}</Typography>
                            <Rating name={key} value={formData.ratings[key]} onChange={(e, newValue) => handleRatingChange(key, newValue)} />
                        </Box>
                    ))}
                    <TextField
                        name="positiveFeedback"
                        label="What went well? (Optional)"
                        value={formData.positiveFeedback}
                        onChange={handleTextChange}
                        multiline
                        rows={3}
                        fullWidth
                        margin="normal"
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isLoading} sx={{ position: 'relative' }}>
                        Submit Feedback
                        {isLoading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default FeedbackModal;