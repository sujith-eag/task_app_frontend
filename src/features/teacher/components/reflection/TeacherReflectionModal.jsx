import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Dialog, DialogContent, TextField, Typography, Select, MenuItem, FormControl, InputLabel, CircularProgress, Paper, Divider, Rating } from '@mui/material';
import { toast } from 'react-toastify';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SaveIcon from '@mui/icons-material/Save';
import { upsertSessionReflection, getFeedbackSummaryForSession, 
    clearFeedbackSummary } from '../../teacherSlice.js';

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
                        }}
                    >
                        Session Reflection
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {session.subject.name}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'divider' }} />

            <Box component="form" onSubmit={handleSubmit}>
                <DialogContent sx={{ p: 3 }}>
                    {/* Self Assessment Section */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            mb: 3,
                            borderRadius: 2,
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.03)'
                                : 'rgba(0, 0, 0, 0.02)',
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            fontWeight={600}
                            sx={{ mb: 2 }}
                        >
                            Self Assessment
                        </Typography>

                        {/* Session Effectiveness - Visual Rating */}
                        <Box sx={{ mb: 2 }}>
                            <Typography component="legend" fontWeight={500} fontSize="0.95rem" sx={{ mb: 1 }}>
                                Session Effectiveness
                            </Typography>
                            <Rating 
                                name="effectiveness"
                                value={formData.selfAssessment.effectiveness}
                                onChange={(e, newValue) => handleChange({ target: { name: 'effectiveness', value: newValue || 1 } })}
                                size="large"
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                        </Box>

                        {/* Student Engagement - Visual Rating */}
                        <Box sx={{ mb: 2 }}>
                            <Typography component="legend" fontWeight={500} fontSize="0.95rem" sx={{ mb: 1 }}>
                                Student Engagement
                            </Typography>
                            <Rating 
                                name="studentEngagement"
                                value={formData.selfAssessment.studentEngagement}
                                onChange={(e, newValue) => handleChange({ target: { name: 'studentEngagement', value: newValue || 1 } })}
                                size="large"
                                sx={{
                                    '& .MuiRating-iconFilled': {
                                        color: 'success.main',
                                    },
                                }}
                            />
                        </Box>

                        {/* Pace Selection */}
                        <FormControl fullWidth>
                            <InputLabel>Pace of the Session</InputLabel>
                            <Select 
                                name="pace" 
                                value={formData.selfAssessment.pace} 
                                label="Pace of the Session" 
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderRadius: 2,
                                    },
                                }}
                            >
                                <MenuItem value="Too Slow">🐢 Too Slow</MenuItem>
                                <MenuItem value="Just Right">✓ Just Right</MenuItem>
                                <MenuItem value="Too Fast">🚀 Too Fast</MenuItem>
                            </Select>
                        </FormControl>
                    </Paper>

                    {/* Session Details Section */}
                    <TextField 
                        name="sessionHighlights" 
                        label="Session Highlights"
                        placeholder="What went well in this session? Key achievements or moments..."
                        value={formData.sessionHighlights}
                        onChange={handleChange} 
                        multiline 
                        rows={4} 
                        fullWidth 
                        required 
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: 2,
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                    />

                    <TextField 
                        name="challengesFaced" 
                        label="Challenges Faced (Optional)" 
                        placeholder="Any difficulties or obstacles encountered..."
                        onChange={handleChange}
                        value={formData.challengesFaced} 
                        multiline
                        rows={3} 
                        fullWidth 
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: 2,
                                    borderColor: 'warning.main',
                                },
                            },
                        }}
                    />

                    <TextField 
                        name="improvementsForNextSession" 
                        label="Improvements for Next Session (Optional)" 
                        placeholder="What would you do differently next time..."
                        onChange={handleChange} 
                        value={formData.improvementsForNextSession}
                        multiline 
                        rows={3} 
                        fullWidth 
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderWidth: 2,
                                    borderColor: 'success.main',
                                },
                            },
                        }}
                    />

                </DialogContent>

                <Divider sx={{ borderColor: 'divider' }} />

                <Box sx={{ p: 3, pt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button 
                        variant="outlined"
                        onClick={onClose} 
                        disabled={isLoading}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Cancel
                    </Button>
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        disabled={isLoading} 
                        startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
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
                        {isLoading ? 'Saving...' : 'Submit Reflection'}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

export default TeacherReflectionModal;