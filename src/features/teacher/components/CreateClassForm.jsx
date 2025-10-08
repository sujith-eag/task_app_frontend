import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, CircularProgress, MenuItem } from '@mui/material';
import { getClassCreationData, createClassSession, reset } from '../teacherSlice.js';
import { toast } from 'react-toastify';

const CreateClassForm = () => {
    const dispatch = useDispatch();

    const { assignments, isLoading, isError, message } = useSelector((state) => state.teacher);

    // Form State
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [availableSections, setAvailableSections] = useState([]);
    const [selectedType, setSelectedType] = useState('Theory');

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
        // dispatch(createClassSession(sessionData));
        dispatch(createClassSession(sessionData))
            .unwrap() // Use unwrap to get the promise behavior
            .then(() => {
            // On success, the dashboard will automatically switch views.
            // A success toast is optional here as the UI change is clear feedback.
            })
            .catch((error) => {
                // Check for the specific error message from the backend.
                if (typeof error === 'string' && error.includes('No verified students')) {
                    toast.warn('Cannot start class: No verified students are enrolled for this assignment. Please contact an administrator.');
            } else {
                // For any other unexpected errors.
                toast.error(error || 'An unexpected error occurred. Please try again.');
            }
        });        
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom
                >Start a New Class</Typography>
            <TextField
                select
                label="Select Assignment"
                value={selectedAssignmentId}
                onChange={handleAssignmentChange}
                fullWidth
                required
                margin="normal"
            >

                {isLoading ? (
                    <MenuItem disabled><em>Loading assignments...</em></MenuItem>
                ) : assignments && assignments.length > 0 ? (
                    [                
                
                <MenuItem 
                    value=""
                    key="default-disabled" 
                    disabled
                    ><em>Select an assignment...</em>
                </MenuItem>,
                ...assignments.map((assign) => (
                    <MenuItem key={assign._id} value={assign._id}>
                        {`${assign.subject.name} - Batch ${assign.batch} (Sem ${assign.semester})`}
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
                disabled={!selectedAssignmentId} // Disabled until an assignment is chosen
            >
                {availableSections.map((sec) => (
                    <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                ))}
            </TextField>            

            <Button type="submit" variant="contained" size="large" disabled={isLoading || !selectedAssignmentId} sx={{ mt: 2, position: 'relative' }}>
                Start Class & Generate Code
                {isLoading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
            </Button>
        </Box>
    );
};

export default CreateClassForm;