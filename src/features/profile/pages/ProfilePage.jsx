import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Divider, Avatar,
    Stack, Paper, Collapse, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import DashboardIcon from '@mui/icons-material/Dashboard';

import UpdateProfileForm from '../components/UpdateProfileForm.jsx';
import PreferencesSection from '../components/PreferencesSection.jsx';
import PasswordForm from '../components/PasswordForm.jsx';



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


{/* STUDENT TESTING */}
                    {/* --- Student Status Section --- */}
                    {user.role === 'user' && (
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Student Status</Typography>
                            {(user.studentDetails?.applicationStatus === 'not_applied' || user.studentDetails?.applicationStatus === 'rejected') && (
                                <Box>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Gain access to attendance and feedback features by applying for student status.
                                    </Typography>
                                    <Button component={RouterLink} to="/student/dashboard" variant="contained">
                                        Apply for Student Access
                                    </Button>
                                </Box>
                            )}
                            {user.studentDetails?.applicationStatus === 'pending' && (
                                <Chip label="Application Pending Review" color="warning" />
                            )}
                        </Paper>
                    )}
                    {user.role === 'student' && (
                         <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Student Status</Typography>
                            <Chip label="Application Approved" color="success" />
                         </Paper>
                    )}



            {/* --- TESTING: DASHBOARD ACCESS SECTION --- */}
                    <Paper elevation={3} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Quick Access</Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap">
                            <Button component={RouterLink} to="/dashboard" variant="outlined" startIcon={<DashboardIcon />}>
                                Task Manager
                            </Button>
                            {user.role === 'student' && (
                                <Button component={RouterLink} to="/student/dashboard" variant="outlined">
                                    Student Dashboard
                                </Button>
                            )}
                            {user.role === 'teacher' && (
                                <Button component={RouterLink} to="/teacher/dashboard" variant="outlined">
                                    Teacher Dashboard
                                </Button>
                            )}
                            {(user.role === 'admin' || user.role === 'hod') && (
                                <>
                                <Button component={RouterLink} to="/admin/dashboard" variant="outlined">
                                    Admin Dashboard
                                </Button>
                                <Button component={RouterLink} to="/admin/reporting" variant="outlined">
                                    Reporting
                                </Button>
                                </>
                            )}
                        </Stack>
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