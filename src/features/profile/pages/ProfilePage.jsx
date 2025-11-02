import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container, Typography, Box, Button, Divider, Avatar,
    Stack, Paper, Collapse, Chip, Skeleton
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
import LockIcon from '@mui/icons-material/Lock';
import TuneIcon from '@mui/icons-material/Tune';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import UpdateProfileForm from '../components/UpdateProfileForm.jsx';
import PreferencesSection from '../components/PreferencesSection.jsx';
import PasswordForm from '../components/PasswordForm.jsx';
import SessionManager from '../components/SessionManager.jsx';
import { getUserRoles } from '../../../utils/roles.js';



const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const userRoles = getUserRoles(user);
    
    // State for toggling profile edit mode
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    
    // State for collapsible sections in Account Settings
    const [expandPreferences, setExpandPreferences] = useState(false);
    const [expandPassword, setExpandPassword] = useState(false);

    if (!user) {
        return (
            <Container maxWidth="md">
                <Box sx={{ my: 4 }}>
                    <Stack spacing={4}>
                        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
                    </Stack>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Stack spacing={4}> {/* Use Stack for consistent vertical spacing */}
                    
                    {/* --- 1. MAIN PROFILE SECTION --- */}
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 3,
                            backgroundColor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            component="h1" 
                            gutterBottom
                            sx={{
                                fontWeight: 700,
                                background: (theme) => 
                                    theme.palette.mode === 'dark'
                                        ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                                        : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            My Profile
                        </Typography>
                        {isEditingProfile ? (
                            <UpdateProfileForm user={user} onCancel={() => setIsEditingProfile(false)} />
                        ) : (
                        // Profile Section
                        <Box>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Avatar 
                                src={user.avatar} 
                                sx={{ 
                                    width: 80, 
                                    height: 80,
                                    border: '4px solid',
                                    borderColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(144, 202, 249, 0.2)' 
                                            : 'rgba(25, 118, 210, 0.1)',
                                    boxShadow: 4,
                                }} 
                            />
                            <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{user.name}</Typography>

                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                <EmailIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                            </Stack>

                            <Chip 
                                label={userRoles.length ? userRoles.join(', ') : (user?.role || '')} 
                                color="primary" 
                                size="small" 
                                sx={{ 
                                    mt: 1,
                                    fontWeight: 600,
                                    textTransform: 'capitalize',
                                }} 
                            />
                            </Box>
                        </Stack>

                        {user.bio ? (
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    mt: 2, 
                                    whiteSpace: 'pre-wrap', 
                                    color: 'text.secondary',
                                    p: 2,
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.03)' 
                                            : 'rgba(0, 0, 0, 0.02)',
                                    borderRadius: 1,
                                    borderLeft: '4px solid',
                                    borderColor: 'primary.main',
                                }}
                            >
                                {user.bio}
                            </Typography>
                        ) : (
                            <Box 
                                sx={{ 
                                    p: 3, 
                                    mt: 2,
                                    textAlign: 'center',
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.03)' 
                                            : 'rgba(0, 0, 0, 0.02)',
                                    borderRadius: 2,
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    No bio yet. Click "Edit Profile" to add one!
                                </Typography>
                            </Box>
                        )}

                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditingProfile(true)}
                            sx={{ 
                                mt: 2, 
                                fontWeight: 600,
                                transition: "all 0.3s", 
                                "&:hover": { 
                                    transform: "scale(1.05)",
                                    boxShadow: 2,
                                } 
                            }}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                    )}
                </Paper>

                {/* --- 2. Student Status Section --- */}
                {userRoles.includes('user') && (
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <SchoolIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Student Status</Typography>
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
                            sx={{ 
                                fontWeight: 600,
                                transition: "all 0.3s", 
                                "&:hover": { 
                                    transform: "translateY(-2px)",
                                    boxShadow: 4,
                                } 
                            }}
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
                        sx={{
                            fontWeight: 600,
                            py: 2.5,
                            '& .MuiChip-icon': {
                                animation: 'pulse 2s infinite',
                            },
                            '@keyframes pulse': {
                                '0%, 100%': { opacity: 1 },
                                '50%': { opacity: 0.5 },
                            },
                        }}
                    />
                    )}
                </Paper>
                )}

                {userRoles.includes('student') && (
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <SchoolIcon color="success" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Student Status</Typography>
                    </Stack>
                    <Chip 
                        icon={<CheckCircleIcon />} 
                        label="Application Approved" 
                        color="success"
                        sx={{
                            fontWeight: 600,
                            py: 2.5,
                            boxShadow: 2,
                        }}
                    />
                </Paper>
                )}


                {/* --- 3. Quick Access Section --- */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                        <ShortcutIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Quick Access</Typography>
                    </Stack>

                    <Box 
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        <Paper
                            component={RouterLink}
                            to="/dashboard"
                            elevation={0}
                            sx={{
                                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)' },
                                minWidth: { xs: '100%', sm: '200px' },
                                p: 2.5,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                backgroundColor: (theme) => 
                                    theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)' 
                                        : 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                textDecoration: 'none',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: 'primary.main',
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(144, 202, 249, 0.08)' 
                                            : 'rgba(25, 118, 210, 0.04)',
                                },
                            }}
                        >
                            <DashboardIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                Task Manager
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Manage your tasks
                            </Typography>
                        </Paper>

                        {userRoles.includes('student') && (
                            <Paper
                                component={RouterLink}
                                to="/student/dashboard"
                                elevation={0}
                                sx={{
                                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)' },
                                    minWidth: { xs: '100%', sm: '200px' },
                                    p: 2.5,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.05)' 
                                            : 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4,
                                        borderColor: 'primary.main',
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(144, 202, 249, 0.08)' 
                                                : 'rgba(25, 118, 210, 0.04)',
                                    },
                                }}
                            >
                                <SchoolIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Student Dashboard
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Attendance & feedback
                                </Typography>
                            </Paper>
                        )}

                        {userRoles.includes('teacher') && (
                            <Paper
                                component={RouterLink}
                                to="/teacher/dashboard"
                                elevation={0}
                                sx={{
                                    flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)' },
                                    minWidth: { xs: '100%', sm: '200px' },
                                    p: 2.5,
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.05)' 
                                            : 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    textDecoration: 'none',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4,
                                        borderColor: 'primary.main',
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(144, 202, 249, 0.08)' 
                                                : 'rgba(25, 118, 210, 0.04)',
                                    },
                                }}
                            >
                                <MenuBookIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    Teacher Dashboard
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Teaching tools
                                </Typography>
                            </Paper>
                        )}

                        {(userRoles.includes('admin') || userRoles.includes('hod')) && (
                            <>
                                <Paper
                                    component={RouterLink}
                                    to="/admin/dashboard"
                                    elevation={0}
                                    sx={{
                                        flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)' },
                                        minWidth: { xs: '100%', sm: '200px' },
                                        p: 2.5,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.05)' 
                                                : 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                            borderColor: 'primary.main',
                                            backgroundColor: (theme) => 
                                                theme.palette.mode === 'dark' 
                                                    ? 'rgba(144, 202, 249, 0.08)' 
                                                    : 'rgba(25, 118, 210, 0.04)',
                                        },
                                    }}
                                >
                                    <AdminPanelSettingsIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        Admin Dashboard
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        System management
                                    </Typography>
                                </Paper>
                                <Paper
                                    component={RouterLink}
                                    to="/admin/reporting"
                                    elevation={0}
                                    sx={{
                                        flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 11px)' },
                                        minWidth: { xs: '100%', sm: '200px' },
                                        p: 2.5,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s',
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.05)' 
                                                : 'background.paper',
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                            borderColor: 'primary.main',
                                            backgroundColor: (theme) => 
                                                theme.palette.mode === 'dark' 
                                                    ? 'rgba(144, 202, 249, 0.08)' 
                                                    : 'rgba(25, 118, 210, 0.04)',
                                        },
                                    }}
                                >
                                    <BarChartIcon sx={{ fontSize: 36, color: 'primary.main', mb: 1 }} />
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        Reporting
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Analytics & reports
                                    </Typography>
                                </Paper>
                            </>
                        )}
                    </Box>
                </Paper>


                {/* --- 4. My Content Section --- */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                        <FolderOpenIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>My Content</Typography>
                    </Stack>

                    <Box 
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                        }}
                    >
                        <Paper
                            component={RouterLink}
                            to="/files"
                            elevation={0}
                            sx={{
                                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
                                minWidth: { xs: '100%', sm: '200px' },
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                backgroundColor: (theme) => 
                                    theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)' 
                                        : 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                textDecoration: 'none',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: 'primary.main',
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(144, 202, 249, 0.08)' 
                                            : 'rgba(25, 118, 210, 0.04)',
                                    '&::before': {
                                        opacity: 1,
                                    },
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: (theme) => 
                                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                },
                            }}
                        >
                            <InsertDriveFileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1.5 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                My Files
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Access and manage your uploaded files
                            </Typography>
                        </Paper>

                        <Paper
                            component={RouterLink}
                            to="/chat"
                            elevation={0}
                            sx={{
                                flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)' },
                                minWidth: { xs: '100%', sm: '200px' },
                                p: 3,
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                backgroundColor: (theme) => 
                                    theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.05)' 
                                        : 'background.paper',
                                border: '1px solid',
                                borderColor: 'divider',
                                textDecoration: 'none',
                                position: 'relative',
                                overflow: 'hidden',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: 'primary.main',
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(144, 202, 249, 0.08)' 
                                            : 'rgba(25, 118, 210, 0.04)',
                                    '&::before': {
                                        opacity: 1,
                                    },
                                },
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '3px',
                                    background: (theme) => 
                                        `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                                    opacity: 0,
                                    transition: 'opacity 0.3s',
                                },
                            }}
                        >
                            <ChatIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1.5 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                                Messages
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                View conversations and chat history
                            </Typography>
                        </Paper>
                    </Box>
                </Paper>

                {/* --- 5. Account Settings Section --- */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
                        <SettingsIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Account Settings</Typography>
                    </Stack>

                    <Stack spacing={3}>
                        {/* Preferences Section */}
                        <Box>
                            <Box
                                onClick={() => setExpandPreferences(!expandPreferences)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    p: 2,
                                    borderRadius: 1,
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.03)' 
                                            : 'rgba(0, 0, 0, 0.02)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(144, 202, 249, 0.08)' 
                                                : 'rgba(25, 118, 210, 0.04)',
                                    },
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <TuneIcon color="primary" />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Privacy & Preferences
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Manage your privacy settings
                                        </Typography>
                                    </Box>
                                </Stack>
                                {expandPreferences ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </Box>
                            <Collapse in={expandPreferences}>
                                <Box 
                                    sx={{ 
                                        mt: 2, 
                                        p: 2.5, 
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.02)' 
                                                : 'rgba(0, 0, 0, 0.01)',
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <PreferencesSection preferences={user.preferences} />
                                </Box>
                            </Collapse>
                        </Box>

                        {/* Password Section */}
                        <Box>
                            <Box
                                onClick={() => setExpandPassword(!expandPassword)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    p: 2,
                                    borderRadius: 1,
                                    backgroundColor: (theme) => 
                                        theme.palette.mode === 'dark' 
                                            ? 'rgba(255, 255, 255, 0.03)' 
                                            : 'rgba(0, 0, 0, 0.02)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(144, 202, 249, 0.08)' 
                                                : 'rgba(25, 118, 210, 0.04)',
                                    },
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <LockIcon color="primary" />
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            Change Password
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Update your account password
                                        </Typography>
                                    </Box>
                                </Stack>
                                {expandPassword ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                            </Box>
                            <Collapse in={expandPassword}>
                                <Box 
                                    sx={{ 
                                        mt: 2, 
                                        p: 2.5, 
                                        backgroundColor: (theme) => 
                                            theme.palette.mode === 'dark' 
                                                ? 'rgba(255, 255, 255, 0.02)' 
                                                : 'rgba(0, 0, 0, 0.01)',
                                        borderRadius: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                    }}
                                >
                                    <PasswordForm onSuccess={() => setExpandPassword(false)} />
                                </Box>
                            </Collapse>
                        </Box>
                    </Stack>
                </Paper>

                {/* --- 6. Active Sessions (per-device session management) --- */}
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 3,
                        backgroundColor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                    }}
                >
                    <SessionManager />
                </Paper>

                </Stack>
            </Box>
        </Container>
    );
};

export default ProfilePage;
