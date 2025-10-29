import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, TextField, Button, Avatar, Badge, IconButton,
    CircularProgress, Stack, Typography, LinearProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast } from 'react-toastify';

import { updateProfile, updateAvatar, resetProfileStatus } from '../profileSlice.js';

// Constants for validation
const MAX_BIO_LENGTH = 500;
const MAX_NAME_LENGTH = 50;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

const UpdateProfileForm = ({ user, onCancel }) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    // Get the loading status from the profile slice
    const { profileStatus, avatarStatus, message } = useSelector((state) => state.profile);

    const [formData, setFormData] = useState({
        name: user.name || '',
        bio: user.bio || '',
    });
    // State for the new avatar file and its preview
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [fileError, setFileError] = useState(null);

    const { name, bio } = formData;

    // Effect to show toast notifications on success or failure
    // This useEffect now handles exiting edit mode on success
    useEffect(() => {
        if (profileStatus === 'failed' || avatarStatus === 'failed') {
            toast.error(message);
            dispatch(resetProfileStatus());
        }
        if (profileStatus === 'succeeded' || avatarStatus === 'succeeded') {
            toast.success('Profile updated successfully!');
            dispatch(resetProfileStatus());
            onCancel(); // Exit edit mode only on success
        }
    }, [profileStatus, avatarStatus, message, dispatch, onCancel]);

    const handleFormChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setFileError(null); // Reset error

        if (file) {
            // Validate file type
            if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                setFileError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                return;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                setFileError(`Image size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
                return;
            }

            setAvatarFile(file);
            // Create a temporary URL for preview
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate name length
        if (name.trim().length === 0) {
            toast.error('Name cannot be empty');
            return;
        }

        // Dispatch avatar update if a new file was selected
        if (avatarFile) {
            const formData = new FormData();
            formData.append('avatar', avatarFile);
            dispatch(updateAvatar(formData));
        }
        // Dispatch profile update if name or bio changed
        if (name !== user.name || bio !== user.bio) {
            dispatch(updateProfile({ name, bio }));
        }
    };

    // Check if form has changes
    const hasChanges = name !== user.name || bio !== user.bio || avatarFile !== null;

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            {/* Avatar Section with Gradient Ring */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    hidden
                    accept="image/*"
                />
                <Box sx={{ position: 'relative' }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <IconButton
                                sx={{ 
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(144, 202, 249, 0.9)' 
                                            : 'primary.main',
                                    color: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(0, 0, 0, 0.87)' 
                                            : 'white',
                                    width: 40,
                                    height: 40,
                                    boxShadow: 3,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(144, 202, 249, 1)' 
                                                : 'primary.dark',
                                        transform: 'scale(1.1)',
                                        boxShadow: 6,
                                    },
                                    '&:disabled': {
                                        backgroundColor: 'action.disabledBackground',
                                    },
                                }}
                                onClick={() => fileInputRef.current.click()}
                                disabled={avatarStatus === 'loading'}
                            >
                                {avatarStatus === 'loading' ? (
                                    <CircularProgress size={20} color="inherit" />
                                ) : (
                                    <PhotoCameraIcon fontSize="small" />
                                )}
                            </IconButton>
                        }
                    >
                        <Avatar
                            src={avatarPreview || user.avatar}
                            sx={{ 
                                width: 120, 
                                height: 120,
                                border: '4px solid',
                                borderColor: (theme) => 
                                    theme.palette.mode === 'dark' 
                                        ? 'rgba(144, 202, 249, 0.3)' 
                                        : 'rgba(25, 118, 210, 0.2)',
                                boxShadow: 4,
                                transition: 'all 0.3s',
                            }}
                        />
                    </Badge>
                    {avatarFile && (
                        <Box 
                            sx={{ 
                                position: 'absolute', 
                                top: -8, 
                                right: -8,
                                backgroundColor: 'success.main',
                                borderRadius: '50%',
                                width: 32,
                                height: 32,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 2,
                            }}
                        >
                            <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                    )}
                </Box>
            </Box>

            {/* File Error Alert */}
            {fileError && (
                <Alert severity="error" onClose={() => setFileError(null)} sx={{ mb: 1 }}>
                    {fileError}
                </Alert>
            )}

            {/* Upload Progress */}
            {avatarStatus === 'loading' && (
                <Box sx={{ width: '100%' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                        Uploading avatar...
                    </Typography>
                    <LinearProgress />
                </Box>
            )}

            {/* Name Field with Character Counter */}
            <TextField
                label="Name"
                name="name"
                value={name}
                onChange={handleFormChange}
                fullWidth
                required
                slotProps={{
                    htmlInput: { maxLength: MAX_NAME_LENGTH },
                }}
                helperText={`${name.length}/${MAX_NAME_LENGTH} characters`}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        transition: 'all 0.3s',
                        '&:hover': {
                            boxShadow: 1,
                        },
                        '&.Mui-focused': {
                            boxShadow: 2,
                        },
                    },
                }}
            />

            {/* Bio Field with Character Counter */}
            <TextField
                label="Bio"
                name="bio"
                value={bio}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={4}
                slotProps={{
                    htmlInput: { maxLength: MAX_BIO_LENGTH },
                }}
                helperText={`${bio.length}/${MAX_BIO_LENGTH} characters`}
                placeholder="Tell us about yourself..."
                sx={{
                    '& .MuiOutlinedInput-root': {
                        transition: 'all 0.3s',
                        '&:hover': {
                            boxShadow: 1,
                        },
                        '&.Mui-focused': {
                            boxShadow: 2,
                        },
                    },
                }}
            />

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={profileStatus === 'loading' || avatarStatus === 'loading' || !hasChanges}
                    sx={{
                        minWidth: 140,
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        '&:not(:disabled):hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: 4,
                        },
                    }}
                >
                    {(profileStatus === 'loading' || avatarStatus === 'loading') ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Save Changes'
                    )}
                </Button>
                <Button 
                    variant="outlined" 
                    onClick={onCancel}
                    disabled={profileStatus === 'loading' || avatarStatus === 'loading'}
                    sx={{
                        minWidth: 100,
                        fontWeight: 600,
                        transition: 'all 0.3s',
                        '&:hover': {
                            backgroundColor: (theme) => 
                                theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.05)' 
                                    : 'rgba(0, 0, 0, 0.04)',
                        },
                    }}
                >
                    Cancel
                </Button>
            </Stack>
        </Box>
    );
};

export default UpdateProfileForm;