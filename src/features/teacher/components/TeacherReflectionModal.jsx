import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { createSessionReflection } from '../teacherSlice.js';

const TeacherReflectionModal = ({ open, onClose, session }) => {
    const dispatch = useDispatch();
    const { isLoading } = useSelector((state) => state.teacher);
    const [formData, setFormData] = useState({
        selfAssessment: { effectiveness: 3, studentEngagement: 3, pace: 'Just Right' },
        sessionHighlights: '',
        challengesFaced: '',
        improvementsForNextSession: '',
    });

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
        dispatch(createSessionReflection({ classSessionId: session._id, ...formData }))
            .unwrap()
            .then(() => {
                toast.success("Your reflection has been submitted successfully.");
                onClose();
            })
            .catch((error) => toast.error(error));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Reflection for {session.subject.name}</DialogTitle>
            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>Self Assessment</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Pace of the Session</InputLabel>
                        <Select name="pace" value={formData.selfAssessment.pace} label="Pace of the Session" onChange={handleChange}>
                            <MenuItem value="Too Slow">Too Slow</MenuItem>
                            <MenuItem value="Just Right">Just Right</MenuItem>
                            <MenuItem value="Too Fast">Too Fast</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField name="sessionHighlights" label="Session Highlights" onChange={handleChange} multiline rows={4} fullWidth required margin="normal" />
                    <TextField name="challengesFaced" label="Challenges Faced (Optional)" onChange={handleChange} multiline rows={3} fullWidth margin="normal" />
                    <TextField name="improvementsForNextSession" label="Improvements for Next Session (Optional)" onChange={handleChange} multiline rows={3} fullWidth margin="normal" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isLoading} sx={{ position: 'relative' }}>
                        Submit Reflection
                        {isLoading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default TeacherReflectionModal;