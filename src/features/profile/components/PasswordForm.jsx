import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Box, Typography, TextField, Button, CircularProgress, 
    InputAdornment, IconButton, LinearProgress, Stack, Chip 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';

import { changePassword, resetProfileStatus } from '../profileSlice.js';

// Password strength calculation
const calculatePasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 15;
    
    // Character variety checks
    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^a-zA-Z0-9]/.test(password)) score += 15;
    
    // Determine label and color
    if (score < 40) return { score, label: 'Weak', color: 'error' };
    if (score < 70) return { score, label: 'Fair', color: 'warning' };
    if (score < 90) return { score, label: 'Good', color: 'info' };
    return { score, label: 'Strong', color: 'success' };
};

const PasswordForm = ({ onSuccess = () => {} }) => {
    const dispatch = useDispatch();
    const { passwordStatus, message } = useSelector((state) => state.profile);

    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const { currentPassword, newPassword, confirmPassword } = formData;
    const passwordStrength = calculatePasswordStrength(newPassword);
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

    // Password requirements checklist
    const requirements = [
        { label: 'At least 8 characters', met: newPassword.length >= 8 },
        { label: 'Contains uppercase letter', met: /[A-Z]/.test(newPassword) },
        { label: 'Contains lowercase letter', met: /[a-z]/.test(newPassword) },
        { label: 'Contains number', met: /[0-9]/.test(newPassword) },
        { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(newPassword) },
    ];

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

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('New passwords do not match.');
            return;
        }

        if (passwordStrength.score < 40) {
            toast.error('Password is too weak. Please choose a stronger password.');
            return;
        }

        dispatch(changePassword({ currentPassword, newPassword }));
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Change Password
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Current Password */}
                <TextField
                    type={showPasswords.current ? 'text' : 'password'}
                    label="Current Password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={handleChange}
                    required
                    fullWidth
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility('current')}
                                        edge="end"
                                    >
                                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: 1,
                            },
                        },
                    }}
                />

                {/* New Password */}
                <Box>
                    <TextField
                        type={showPasswords.new ? 'text' : 'password'}
                        label="New Password"
                        name="newPassword"
                        value={newPassword}
                        onChange={handleChange}
                        required
                        fullWidth
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => togglePasswordVisibility('new')}
                                            edge="end"
                                        >
                                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                transition: 'all 0.3s',
                                '&:hover': {
                                    boxShadow: 1,
                                },
                            },
                        }}
                    />
                    
                    {/* Password Strength Indicator */}
                    {newPassword && (
                        <Box sx={{ mt: 1.5 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Password Strength:
                                </Typography>
                                <Chip 
                                    label={passwordStrength.label} 
                                    color={passwordStrength.color}
                                    size="small"
                                    sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }}
                                />
                            </Stack>
                            <LinearProgress 
                                variant="determinate" 
                                value={passwordStrength.score} 
                                color={passwordStrength.color}
                                sx={{ 
                                    height: 6, 
                                    borderRadius: 1,
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.1)' 
                                            : 'rgba(0, 0, 0, 0.1)',
                                }}
                            />
                        </Box>
                    )}
                </Box>

                {/* Confirm New Password */}
                <TextField
                    type={showPasswords.confirm ? 'text' : 'password'}
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={confirmPassword && !passwordsMatch}
                    helperText={confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility('confirm')}
                                        edge="end"
                                    >
                                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            transition: 'all 0.3s',
                            '&:hover': {
                                boxShadow: 1,
                            },
                        },
                    }}
                />

                {/* Password Requirements Checklist */}
                {newPassword && (
                    <Box 
                        sx={{ 
                            p: 2, 
                            backgroundColor: (theme) => 
                                theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.03)' 
                                    : 'rgba(0, 0, 0, 0.02)',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                            Password Requirements:
                        </Typography>
                        <Stack spacing={0.5}>
                            {requirements.map((req, index) => (
                                <Stack 
                                    key={index} 
                                    direction="row" 
                                    spacing={1} 
                                    alignItems="center"
                                >
                                    {req.met ? (
                                        <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
                                    ) : (
                                        <CancelIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                                    )}
                                    <Typography 
                                        variant="caption" 
                                        color={req.met ? 'success.main' : 'text.secondary'}
                                        sx={{ fontWeight: req.met ? 600 : 400 }}
                                    >
                                        {req.label}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={
                        passwordStatus === 'loading' || 
                        !passwordsMatch || 
                        passwordStrength.score < 40
                    }
                    sx={{ 
                        mt: 1, 
                        alignSelf: 'flex-start',
                        minWidth: 160,
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        '&:not(:disabled):hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4,
                        },
                    }}
                >
                    {passwordStatus === 'loading' ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Update Password'
                    )}
                </Button>
            </Box>
        </Box>
    );
};

export default PasswordForm;