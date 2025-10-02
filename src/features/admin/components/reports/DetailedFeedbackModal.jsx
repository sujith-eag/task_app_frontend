import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress, Grid, Divider } from '@mui/material';
import { getFeedbackReport } from '../../adminSlice/adminReportingSlice.js';

const DetailedFeedbackModal = ({ open, onClose, classSessionId }) => {
    const dispatch = useDispatch();
    const { detailedReport, isDetailLoading } = useSelector((state) => state.adminReporting);

    useEffect(() => {
        if (open && classSessionId) {
            dispatch(getFeedbackReport(classSessionId));
        }
    }, [dispatch, open, classSessionId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>Detailed Feedback Report</DialogTitle>
            <DialogContent>
                {isDetailLoading || !detailedReport ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                ) : (
                    <Grid container spacing={3}>
                        {/* Student Feedback Section */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Student Feedback ({detailedReport.studentFeedbackSummary.feedbackCount} Responses)</Typography>
                            {/* Render ratings, comments, etc. */}
                        </Grid>
                        {/* Teacher Reflection Section */}
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6">Teacher's Reflection</Typography>
                            {detailedReport.teacherReflection ? (
                                <Box>
                                    <Typography><strong>Pace:</strong> {detailedReport.teacherReflection.selfAssessment.pace}</Typography>
                                    {/* Render other reflection details */}
                                </Box>
                            ) : (
                                <Typography>No reflection submitted.</Typography>
                            )}
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
        </Dialog>
    );
};

export default DetailedFeedbackModal;