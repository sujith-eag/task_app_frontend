import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, TextField, Button, Typography, Alert, 
    CircularProgress, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';

import { applyAsStudent } from '../../profile/profileSlice.js';

const StudentApplication = () => {
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { profileStatus, message } = useSelector((state) => state.profile);
    
    const [formData, setFormData] = useState({ 
        usn: '',
        batch: new Date().getFullYear(),
        section: '' 
    });
    const { usn, batch, section } = formData;
    
    
    // --- Client-side validation ---
    const canSubmit = usn.trim() !== '' && batch.toString().length === 4 && section !== '';
    
    const applicationStatus = user?.studentDetails?.applicationStatus;
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!canSubmit){
            toast.error("Please fill out all required fields.");
            return;
        }
        dispatch(applyAsStudent(formData));
    };

    const isLoading = profileStatus === 'loading';
    
    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500 }}>
            <Typography variant="h5" gutterBottom>Apply for Student Status</Typography>
            {profileStatus === 'failed' && <Alert severity="error" sx={{ mb: 2 }}>{message}</Alert>}
             
            {applicationStatus === 'rejected' && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Your previous application was not approved. Please review your details and resubmit.
                </Alert>
            )}

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Please fill in your details accurately to get access to student features.
            </Typography>
            <TextField
                label="University Seat Number (USN)"
                name="usn"
                value={usn}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Batch (Year)"
                name="batch"
                type="number"
                value={batch}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                label="Section"
                name="section"
                value={section}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                select
            >
                <MenuItem value=""><em>Select a section</em></MenuItem>
                <MenuItem value="A">A</MenuItem>
                <MenuItem value="B">B</MenuItem>
                {/* <MenuItem value="C">C</MenuItem> */}
            </TextField>
            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={ !canSubmit || isLoading}
                sx={{ mt: 2, position: 'relative' }}
            >
                Submit Application
                {isLoading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
            </Button>
        </Box>
    );
};

export default StudentApplication;