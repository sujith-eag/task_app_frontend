import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, CircularProgress, Divider, Grid } from '@mui/material';
import { getFeedbackSummaryForSession, clearFeedbackSummary } from '../teacherSlice';

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
            return <Typography>No student feedback has been submitted for this session yet.</Typography>;
        }
        return (
            <Box>
                <Typography variant="h6" gutterBottom>Student Feedback Summary ({summary.feedbackCount} Responses)</Typography>
                <Grid container spacing={2}>
                    {Object.entries(summary.averageRatings).map(([key, value]) => (
                        <Grid item xs={6} sm={3} key={key}>
                            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>{key}</Typography>
                            <Typography variant="h5">{value?.toFixed(2) || 'N/A'}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        );
    };

    const renderTeacherReflection = () => {
        const reflection = feedbackSummary?.teacherReflection;
        if (!reflection) {
            return <Typography sx={{ mt: 2 }}>You have not submitted a reflection for this session.</Typography>;
        }
        return (
            <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Your Reflection</Typography>
                <Typography variant="body2"><strong>Pace:</strong> {reflection.selfAssessment.pace}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}><strong>Highlights:</strong> {reflection.sessionHighlights}</Typography>
            </Box>
        );
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Feedback Summary for {session?.subject.name}</DialogTitle>
            <DialogContent>
                {isSummaryLoading || !feedbackSummary ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                ) : (
                    <>
                        {renderStudentFeedback()}
                        <Divider sx={{ my: 3 }} />
                        {renderTeacherReflection()}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FeedbackSummaryModal;