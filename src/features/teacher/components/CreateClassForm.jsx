import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, CircularProgress, MenuItem } from '@mui/material';
import { getClassCreationData, createClassSession, reset } from '../teacherSlice.js';
import { toast } from 'react-toastify';

const CreateClassForm = () => {
    const [formData, setFormData] = useState({ subject: '', type: 'Theory', section: 'A' });
    const dispatch = useDispatch();
    const { assignedSubjects, isLoading, isError, message } = useSelector((state) => state.teacher);

    useEffect(() => {
        dispatch(getClassCreationData());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        // Cleanup function to reset the slice's state when the component unmounts
        return () => {
            dispatch(reset());
        };
    }, [isError, message, dispatch]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedSubject = assignedSubjects.find(s => s._id === formData.subject);
        if (!selectedSubject) {
            toast.error("Please select a valid subject.");
            return;
        }
        const sessionData = {
            ...formData,
            batch: new Date().getFullYear(), // This should be dynamic in a real app
            semester: selectedSubject.semester,
        };
        dispatch(createClassSession(sessionData));
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>Start a New Class</Typography>
            <TextField
                select
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            >
                {assignedSubjects.map((subject) => (
                    <MenuItem key={subject._id} value={subject._id}>
                        {subject.name} ({subject.subjectCode})
                    </MenuItem>
                ))}
            </TextField>
             <TextField select label="Class Type" name="type" value={formData.type} onChange={handleChange} fullWidth required margin="normal">
                <MenuItem value="Theory">Theory</MenuItem>
                <MenuItem value="Lab">Lab</MenuItem>
            </TextField>
            <TextField select label="Section" name="section" value={formData.section} onChange={handleChange} fullWidth required margin="normal">
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" size="large" disabled={isLoading} sx={{ mt: 2, position: 'relative' }}>
                Start Class & Generate Code
                {isLoading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
            </Button>
        </Box>
    );
};

export default CreateClassForm;