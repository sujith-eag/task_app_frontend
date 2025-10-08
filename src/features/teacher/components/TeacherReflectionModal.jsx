import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { upsertSessionReflection, getFeedbackSummaryForSession, 
    clearFeedbackSummary } from '../teacherSlice.js';

const TeacherReflectionModal = ({ open, onClose, session }) => {
    const dispatch = useDispatch();
    // Get the feedback summary which contains the teacher's reflection
    const { isLoading, feedbackSummary } = useSelector((state) => state.teacher);

    const [formData, setFormData] = useState({
        // Default state for a new reflection
        selfAssessment: { pace: 'Just Right', effectiveness: 3, studentEngagement: 3 },
        sessionHighlights: '',
        challengesFaced: '',
        improvementsForNextSession: '',
    });
    
    // EFFECT 1: Fetch existing reflection data when editing
    useEffect(() => {
        if (open && session?.hasReflection) {
            dispatch(getFeedbackSummaryForSession(session._id));
        }
        // cleanup function will run when the modal closes (when 'open' becomes false)
        return() => {
            dispatch(clearFeedbackSummary());
            // Also reset the local form state to its default
            setFormData({
                selfAssessment: { pace: 'Just Right', effectiveness: 3, studentEngagement: 3 },
                sessionHighlights: '',
                challengesFaced: '',
                improvementsForNextSession: '',
            });            
        };
    }, [open, session, dispatch]);

    // EFFECT 2: Populate the form when the fetched data arrives
    useEffect(() => {
        const reflection = feedbackSummary?.teacherReflection;
        if (reflection) {
            setFormData({
                selfAssessment: reflection.selfAssessment,
                sessionHighlights: reflection.sessionHighlights,
                challengesFaced: reflection.challengesFaced || '',
                improvementsForNextSession: reflection.improvementsForNextSession || '',
            });
        }
    }, [feedbackSummary]);
    
    if (!session) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in formData.selfAssessment) {
            setFormData(prev => ({ ...prev, selfAssessment: { ...prev.selfAssessment, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(upsertSessionReflection({ classSessionId: session._id, ...formData }))
            .unwrap()
            .then(() => {
                toast.success("Reflection submitted/updated successfully.");
                onClose();
            })
            .catch((error) => toast.error(error));
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="md">
                
            <DialogTitle>Reflection for {session.subject.name}</DialogTitle>

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    <Typography 
                        variant="h6" 
                        gutterBottom
                        >Self Assessment
                    </Typography>

                    {/* --- Effectiveness Rating --- */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Session Effectiveness (1-5)</InputLabel>
                        <Select
                            name="effectiveness"
                            value={formData.selfAssessment.effectiveness}
                            label="Session Effectiveness (1-5)"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>1 - Ineffective</MenuItem>
                            <MenuItem value={2}>2 - Somewhat Ineffective</MenuItem>
                            <MenuItem value={3}>3 - Average</MenuItem>
                            <MenuItem value={4}>4 - Effective</MenuItem>
                            <MenuItem value={5}>5 - Highly Effective</MenuItem>
                        </Select>
                    </FormControl>

                    {/* --- Student Engagement Rating --- */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Student Engagement (1-5)</InputLabel>
                        <Select
                            name="studentEngagement"
                            value={formData.selfAssessment.studentEngagement}
                            label="Student Engagement (1-5)"
                            onChange={handleChange}
                        >
                            <MenuItem value={1}>1 - Very Low</MenuItem>
                            <MenuItem value={2}>2 - Low</MenuItem>
                            <MenuItem value={3}>3 - Moderate</MenuItem>
                            <MenuItem value={4}>4 - High</MenuItem>
                            <MenuItem value={5}>5 - Very High</MenuItem>
                        </Select>
                    </FormControl>

                    {/* --- Pace of Session FormControl --- */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Pace of the Session</InputLabel>
                        <Select 
                            name="pace" 
                            value={formData.selfAssessment.pace} 
                            label="Pace of the Session" 
                            onChange={handleChange}
                        >
                            <MenuItem value="Too Slow">Too Slow</MenuItem>
                            <MenuItem value="Just Right">Just Right</MenuItem>
                            <MenuItem value="Too Fast">Too Fast</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField 
                        name="sessionHighlights" 
                        label="Session Highlights"
                        value={formData.sessionHighlights}
                        onChange={handleChange} 
                        multiline 
                        rows={4} 
                        fullWidth 
                        required 
                        margin="normal" 
                    />

                    <TextField 
                        name="challengesFaced" 
                        label="Challenges Faced (Optional)" 
                        onChange={handleChange}
                        value={formData.challengesFaced} 
                        multiline
                        rows={3} 
                        fullWidth 
                        margin="normal" 
                    />

                    <TextField 
                        name="improvementsForNextSession" 
                        label="Improvements for Next Session (Optional)" 
                        onChange={handleChange} 
                        value={formData.improvementsForNextSession}
                        multiline 
                        rows={3} 
                        fullWidth 
                        margin="normal" 
                    />

                </DialogContent>

                <DialogActions>
                    <Button 
                        onClick={onClose} 
                        disabled={isLoading}
                    >Cancel</Button>
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isLoading} 
                        sx={{ position: 'relative' }}
                    > Submit Reflection
                        {isLoading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default TeacherReflectionModal;