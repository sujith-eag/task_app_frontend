import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import { changePassword, resetProfileStatus } from '../profileSlice';
import { toast } from 'react-toastify';

const PasswordForm = (onSuccess) => {
    const dispatch = useDispatch();
    const { passwordStatus, message } = useSelector((state) => state.profile);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const { currentPassword, newPassword, confirmPassword } = formData;

    // Effect to show toast notifications and reset the form
    useEffect(() => {
        if (passwordStatus === 'failed') {
            toast.error(message);
        }
        if (passwordStatus === 'succeeded') {
            toast.success(message);
            // Clear the form fields on success
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            onSuccess();
        }
        // Reset the status in the slice after handling the message
        if (passwordStatus !== 'idle') {
            dispatch(resetProfileStatus());
        }
    }, [passwordStatus, message, dispatch, onSuccess]);

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }

        dispatch(changePassword({ currentPassword, newPassword }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
                Change Password
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField
                    type="password"
                    label="Current Password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={handleChange}
                    required
                />
                <TextField
                    type="password"
                    label="New Password"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleChange}
                    required
                />
                <TextField
                    type="password"
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={passwordStatus === 'loading'}
                    sx={{ mt: 1, alignSelf: 'flex-start' }}
                >
                    {passwordStatus === 'loading' ? <CircularProgress size={24} /> : 'Update Password'}
                </Button>
            </Box>
        </Box>
    );
};

export default PasswordForm;