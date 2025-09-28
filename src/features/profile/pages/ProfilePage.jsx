import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Divider, Avatar,
    Stack, Paper, Collapse, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import BarChartIcon from '@mui/icons-material/BarChart';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ChatIcon from '@mui/icons-material/ChatBubble';
import SettingsIcon from '@mui/icons-material/Settings';
import LockResetIcon from '@mui/icons-material/LockReset';

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
                        // Profile Section
                        <Box>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
                            <Box>
                            <Typography variant="h6">{user.name}</Typography>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <EmailIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                            </Stack>

                            <Chip 
                                label={user.role} 
                                color="primary" 
                                size="small" 
                                sx={{ mt: 1 }} 
                            />
                            </Box>
                        </Stack>

                        <Typography 
                            variant="body1" 
                            sx={{ mt: 2, whiteSpace: 'pre-wrap', color: 'text.secondary' }}
                        >
                            {user.bio || 'No bio provided.'}
                        </Typography>

                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditingProfile(true)}
                            sx={{ mt: 2, transition: "0.3s", "&:hover": { transform: "scale(1.05)" } }}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                    )}
                </Paper>

                {/* --- 2. Student Status Section --- */}
                {user.role === 'user' && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <SchoolIcon color="primary" />
                    <Typography variant="h6" gutterBottom>Student Status</Typography>
                    </Stack>

                    {(user.studentDetails?.applicationStatus === 'not_applied' || 
                    user.studentDetails?.applicationStatus === 'rejected') && (
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Gain access to <b>attendance</b> and <b>feedback</b> features by applying for student status.
                        </Typography>
                        <Button 
                        component={RouterLink} 
                        to="/student/dashboard" 
                        variant="contained" 
                        sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.02)" } }}
                        startIcon={<HowToRegIcon />}
                        >
                        Apply for Student Access
                        </Button>
                    </Box>
                    )}

                    {user.studentDetails?.applicationStatus === 'pending' && (
                    <Chip 
                        icon={<HourglassEmptyIcon />} 
                        label="Application Pending Review" 
                        color="warning" 
                        variant="outlined" 
                    />
                    )}
                </Paper>
                )}

                {user.role === 'student' && (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <SchoolIcon color="success" />
                    <Typography variant="h6" gutterBottom>Student Status</Typography>
                    </Stack>
                    <Chip 
                    icon={<CheckCircleIcon />} 
                    label="Application Approved" 
                    color="success" 
                    />
                </Paper>
                )}


                {/* --- 3. Quick Access Section --- */}
                <Paper elevation={3} sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <ShortcutIcon color="primary" />
                    <Typography variant="h6">Quick Access</Typography>
                </Stack>

                <Stack 
                    direction="row" 
                    spacing={2} 
                    flexWrap="wrap"
                    useFlexGap
                >
                    <Button 
                    component={RouterLink} 
                    to="/dashboard" 
                    variant="outlined"
                    sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.05)" } }}
                    startIcon={<DashboardIcon />}
                    >
                    Task Manager
                    </Button>

                    {user.role === 'student' && (
                    <Button 
                        component={RouterLink} 
                        to="/student/dashboard" 
                        variant="outlined" 
                        sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.05)" } }}
                        startIcon={<SchoolIcon />}
                    >
                        Student Dashboard
                    </Button>
                    )}

                    {user.role === 'teacher' && (
                    <Button 
                        component={RouterLink} 
                        to="/teacher/dashboard" 
                        variant="outlined" 
                        sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.05)" } }}
                        startIcon={<MenuBookIcon />}
                    >
                        Teacher Dashboard
                    </Button>
                    )}

                    {(user.role === 'admin' || user.role === 'hod') && (
                    <>
                        <Button 
                        component={RouterLink} 
                        to="/admin/dashboard" 
                        variant="outlined" 
                        startIcon={<AdminPanelSettingsIcon />}
                        sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.05)" } }}
                        >
                        Admin Dashboard
                        </Button>
                        <Button 
                        component={RouterLink} 
                        to="/admin/reporting" 
                        variant="outlined" 
                        sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.05)" } }}
                        startIcon={<BarChartIcon />}
                        >
                        Reporting
                        </Button>
                    </>
                    )}
                </Stack>
                </Paper>


                {/* --- 4. MY CONTENT SECTION --- */}
                <Paper elevation={3} sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <FolderIcon color="primary" />
                    <Typography variant="h6">My Content</Typography>
                </Stack>

                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Button 
                    component={RouterLink} 
                    to="/files" 
                    variant="outlined" 
                    sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.05)" } }}
                    startIcon={<FolderOpenIcon />}
                    >
                    Manage Files
                    </Button>
                    <Button 
                    component={RouterLink} 
                    to="/chat" 
                    variant="outlined" 
                    sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.05)" } }}
                    startIcon={<ChatIcon />}
                    >
                    Messages
                    </Button>
                </Stack>
                </Paper>

                {/* --- 5. ACCOUNT SETTINGS SECTION --- */}
                <Paper elevation={3} sx={{ p: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <SettingsIcon color="primary" />
                    <Typography variant="h6">Account Settings</Typography>
                </Stack>

                {/* Preferences */}
                <PreferencesSection preferences={user.preferences} />

                <Divider sx={{ my: 3 }} />


                {/* Change Password */}
                <Button
                    variant="outlined"
                    startIcon={<LockResetIcon />}
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    sx={{ transition: "0.2s", "&:hover": { transform: "scale(1.05)" } }}
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