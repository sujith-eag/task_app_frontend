import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Avatar, Badge, IconButton, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { updateProfile, updateAvatar, resetProfileStatus } from '../profileSlice';
import { toast } from 'react-toastify';

const UpdateProfileForm = ({ user }) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    // Get the loading status from the profile slice
    const { profileStatus, avatarStatus, message } = useSelector((state) => state.profile);

    // State for form text fields
    const [formData, setFormData] = useState({
        name: user.name || '',
        bio: user.bio || '',
    });

    // State for the new avatar file and its preview
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const { name, bio } = formData;

    // Effect to show toast notifications on success or failure
    useEffect(() => {
        if (profileStatus === 'failed' || avatarStatus === 'failed') {
            toast.error(message);
        }
        if (profileStatus === 'succeeded' || avatarStatus === 'succeeded') {
            toast.success(message);
        }
        // Reset the status after showing the message
        if (profileStatus !== 'idle' || avatarStatus !== 'idle') {
            dispatch(resetProfileStatus());
        }
    }, [profileStatus, avatarStatus, message, dispatch]);

    const handleFormChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            // Create a temporary URL for preview
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
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

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    hidden
                    accept="image/*"
                />
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <IconButton
                            sx={{ backgroundColor: 'lightgray' }}
                            onClick={() => fileInputRef.current.click()}
                            disabled={avatarStatus === 'loading'}
                        >
                            {avatarStatus === 'loading' ? <CircularProgress size={24} /> : <EditIcon />}
                        </IconButton>
                    }
                >
                    <Avatar
                        src={avatarPreview || user.avatar}
                        sx={{ width: 120, height: 120 }}
                    />
                </Badge>
            </Box>

            <TextField
                label="Name"
                name="name"
                value={name}
                onChange={handleFormChange}
                fullWidth
            />
            <TextField
                label="Bio"
                name="bio"
                value={bio}
                onChange={handleFormChange}
                fullWidth
                multiline
                rows={3}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={profileStatus === 'loading'}
                sx={{ mt: 1 }}
            >
                {profileStatus === 'loading' ? <CircularProgress size={24} /> : 'Save Changes'}
            </Button>
        </Box>
    );
};

export default UpdateProfileForm;