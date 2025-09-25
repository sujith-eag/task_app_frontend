import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { applyAsStudent } from '../../auth/authSlice.js';

const StudentApplication = () => {
    const [formData, setFormData] = useState({ usn: '', batch: '', section: '' });
    // This would likely come from your authSlice since it modifies the user object
    const { isLoading, isError, message } = useSelector((state) => state.auth); 
    const dispatch = useDispatch();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(applyAsStudent(formData));
        console.log("Dispatching application with:", formData); // Placeholder for dispatch
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
            <Typography variant="h5" gutterBottom>Apply for Student Status</Typography>
            {isError && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}
             {/* Add a specific message for rejected applications */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please fill in your details accurately to get access to attendance and feedback features.
            </Typography>
            <TextField
                label="University Seat Number (USN)"
                name="usn"
                value={formData.usn}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Batch (Year)"
                name="batch"
                type="number"
                value={formData.batch}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                select
                SelectProps={{ native: true }}
            >
                <option value=""></option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
            </TextField>
            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 2, position: 'relative' }}
            >
                Submit Application
                {isLoading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
            </Button>
        </Box>
    );
};

export default StudentApplication;