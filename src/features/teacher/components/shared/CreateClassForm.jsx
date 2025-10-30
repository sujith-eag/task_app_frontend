import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, CircularProgress, MenuItem } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { getClassCreationData, createClassSession, reset } from '../../teacherSlice.js';
import { toast } from 'react-toastify';

const CreateClassForm = () => {
    const dispatch = useDispatch();

    const { assignments, isLoading, isError, message } = useSelector((state) => state.teacher);

    // Form State
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [availableSections, setAvailableSections] = useState([]);
    const [selectedType, setSelectedType] = useState('Theory');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(getClassCreationData());
        return () => { dispatch(reset()); };
    }, [dispatch]);

    useEffect(() => {
        if (isError) { toast.error(message); }
    }, [isError, message]);

    // --- cascading logic ---
    const handleAssignmentChange = (e) => {
        const assignmentId = e.target.value;
        setSelectedAssignmentId(assignmentId);

        // Find the selected assignment to populate the section dropdown
        const assignment = assignments.find(a => a._id === assignmentId);
        if (assignment) {
            setAvailableSections(assignment.sections);
            // Auto-select the first available section
            setSelectedSection(assignment.sections[0] || '');
        } else {
            setAvailableSections([]);
            setSelectedSection('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedAssignment = assignments.find(a => a._id === selectedAssignmentId);
                
        if (!selectedAssignment || !selectedSection) {
            toast.error("Please select a valid assignment and section.");
            return;
        }

        const sessionData = {
            subject: selectedAssignment.subject._id,
            batch: selectedAssignment.batch,
            semester: selectedAssignment.semester,
            section: selectedSection,
            type: selectedType,
        };
        
        setIsSubmitting(true);
        dispatch(createClassSession(sessionData))
            .unwrap()
            .then(() => {
                toast.success('Class session started successfully!');
            })
            .catch((error) => {
                if (typeof error === 'string' && error.includes('No verified students')) {
                    toast.warn('Cannot start class: No verified students are enrolled for this assignment. Please contact an administrator.');
                } else {
                    toast.error(error || 'An unexpected error occurred. Please try again.');
                }
            })
            .finally(() => setIsSubmitting(false));        
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
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
                Start a New Class
            </Typography>
            
            <TextField
                select
                label="Select Assignment"
                value={selectedAssignmentId}
                onChange={handleAssignmentChange}
                fullWidth
                required
                margin="normal"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                            borderColor: 'primary.main',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                        },
                    },
                }}
            >
                {isLoading ? (
                    <MenuItem disabled><em>Loading assignments...</em></MenuItem>
                ) : assignments && assignments.length > 0 ? (
                    [                
                        <MenuItem 
                            value=""
                            key="default-disabled" 
                            disabled
                        >
                            <em>Select an assignment...</em>
                        </MenuItem>,
                        ...assignments.map((assign) => (
                            <MenuItem key={assign._id} value={assign._id}>
                                {`${assign.subject.name} - Sec ${assign.sections.join(', ')}  ( Sem ${assign.semester}, Batch ${assign.batch} )`}
                            </MenuItem>
                        ))
                    ]
                ) : (
                    <MenuItem disabled>
                        <em>No assignments found. Please contact an admin.</em>
                    </MenuItem>
                )}
            </TextField>

            <TextField
                select
                label="Class Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                fullWidth
                required
                margin="normal"
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                            borderColor: 'primary.main',
                        },
                    },
                }}
            >
                <MenuItem value="Theory">Theory</MenuItem>
                <MenuItem value="Lab">Lab</MenuItem>
            </TextField>

            <TextField
                select
                label="Section"
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                fullWidth
                required
                margin="normal"
                disabled={!selectedAssignmentId}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderWidth: 2,
                            borderColor: 'primary.main',
                        },
                    },
                }}
            >
                {availableSections.map((sec) => (
                    <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                ))}
            </TextField>            

            <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth
                disabled={isSubmitting || !selectedAssignmentId}
                startIcon={!isSubmitting && <PlayArrowIcon />}
                sx={{ 
                    mt: 3,
                    py: 1.75,
                    position: 'relative',
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: 3,
                    '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.2s ease',
                }}
            >
                Start Class & Generate Code
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

            {!selectedAssignmentId && (
                <Typography 
                    variant="caption" 
                    display="block" 
                    textAlign="center" 
                    color="text.secondary"
                    sx={{ mt: 2, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                    Select an assignment to begin
                </Typography>
            )}
        </Box>
    );
};

export default CreateClassForm;