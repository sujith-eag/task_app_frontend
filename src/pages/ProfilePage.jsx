import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Divider, Avatar,
    Stack, Paper, Collapse
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';

import UpdateProfileForm from '../features/profile/components/UpdateProfileForm';
import PreferencesSection from '../features/profile/components/PreferencesSection';
import PasswordForm from '../features/profile/components/PasswordForm';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    
    // State for toggling the two forms
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    if (!user) {
        return <Typography>Loading profile...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Stack spacing={4}> {/* Use Stack for consistent vertical spacing */}
                    
                    {/* --- 1. MAIN PROFILE SECTION --- */}
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h5" component="h1" gutterBottom>
                            My Profile
                        </Typography>
                        {isEditingProfile ? (
                            <UpdateProfileForm user={user} onCancel={() => setIsEditingProfile(false)} />
                        ) : (
                            <Box>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
                                    <Box>
                                        <Typography variant="h6">{user.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                                    </Box>
                                </Stack>
                                <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                                    {user.bio || 'No bio provided.'}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    onClick={() => setIsEditingProfile(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Edit Profile
                                </Button>
                            </Box>
                        )}
                    </Paper>

                    {/* --- 2. MY CONTENT SECTION (More Prominent) --- */}
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>My Content</Typography>
                        <Stack direction="row" spacing={2}>
                            <Button component={RouterLink} to="/files" variant="outlined">
                                Manage My Files
                            </Button>
                            <Button component={RouterLink} to="/chat" variant="outlined">
                                Message
                            </Button>
                        </Stack>
                    </Paper>

                    {/* --- 3. ACCOUNT SETTINGS SECTION (Preferences & Password) --- */}
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <PreferencesSection preferences={user.preferences} />
                        <Divider sx={{ my: 3 }} />
                        <Button
                            variant="outlined"
                            startIcon={<LockResetIcon />}
                            onClick={() => setIsChangingPassword(!isChangingPassword)}
                        >
                            Change Password
                        </Button>
                        <Collapse in={isChangingPassword} sx={{ mt: 2 }}>
                            <PasswordForm onSuccess={() => setIsChangingPassword(false)} />
                        </Collapse>
                    </Paper>

                </Stack>
            </Box>
        </Container>
    );
};

export default ProfilePage;