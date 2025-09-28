import { containerVariants, itemVariants } from '../../../utils/animations.js';

import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ForumIcon from '@mui/icons-material/Forum';
import SchoolIcon from '@mui/icons-material/School';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import RateReviewIcon from '@mui/icons-material/RateReview';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupsIcon from '@mui/icons-material/Groups';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';


const FeaturesSection = () => {
    const features = [
        {
            title: 'The Modern Campus',
            description: 'A dedicated suite for educational institutions. Manage role-based access, track attendance in real-time, and gather anonymous feedback, all in one place.',
            icon: <AssuredWorkloadIcon fontSize="large" />, // Changed Icon
        },
        // {
        //     title: 'Real-Time Attendance & Feedback',
        //     description: 'Teachers initiate a 60-second window with unique code for check in. Attendance is recorded instantly. Simple, secure, and fast.',
        //     icon: <FactCheckIcon fontSize="large" />, // Changed Icon
        // },
        {
            title: 'Anonymous Student Feedback',
            description: 'Empowers students to provide honest, anonymized feedback on classes they attend, with data aggregated for administrative review.',
            icon: <RateReviewIcon fontSize="large" />, // Changed Icon
        },
        {
            title: 'Comprehensive Task Management',
            description: 'Organize your workflow with priorities, due dates, sub-tasks, and powerful filtering options.',
            icon: <PlaylistAddCheckIcon fontSize="large" />,
        },
        {
            title: 'Personal AI Planner',
            description: 'Transform high-level goals into structured task plans. Our conversational AI assistant interactively builds your task list, complete with sub-tasks, priorities, and tags.',
            icon: <AutoAwesomeIcon fontSize="large" />,
        },
        {
            title: 'Secure Cloud Storage',
            description: 'Your personal file drive in the cloud. Upload, manage, and securely share files with other users with granular access controls.',
            icon: <CloudUploadIcon fontSize="large" />,
        },
        {
            title: 'Private Messaging & Collaboration',
            description: 'Real-time messaging is built right in with multi-device support. See who is online, send instant messages, and get read receipts without leaving the app.',
            // icon: <GroupsIcon fontSize="large" />,
            icon: <ForumIcon fontSize="large" />,
        },
        {
            title: 'Enterprise-Grade Security',
            description: 'Built with security first: mandatory email verification, brute-force lockwouts, role-based access control, JWT authentication, and granular rate limiting on all sensitive endpoints.',
            icon: <SecurityIcon fontSize="large" />,
        },
        {
            title: 'Customizable Profiles',
            description: 'Personalize your account with a profile picture, a detailed bio, and individual collaboration preferences.',
            icon: <AccountCircleIcon fontSize="large" />,
        },
        {
            title: 'Notifications & Email Alerts (Coming Soon)',
            description: 'Stay updated with real-time notifications for task deadlines, new messages, and other important events.',
            icon: <NotificationsActiveIcon fontSize="large" />,
        },
        {
            title: 'Advanced Security (Coming Soon)',
            description: 'Log in with Google (OAuth 2.0) and utilize httpOnly cookies for an extra layer of security and convenience.',
            icon: <VpnKeyIcon fontSize="large" />,
        },
  
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 10 }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: 'bold', mb: 8 }}
            >
                Features Built for Productivity and Collaboration
            </Typography>

            <Box
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible" // Animate when it scrolls into view
                viewport={{ once: true, amount: 0.2 }}
                sx={{
                    mt: 8,
                    display: 'grid', // Using grid for a more robust layout
                    gridTemplateColumns: {
                        xs: '1fr', // 1 column on extra-small screens
                        sm: 'repeat(2, 1fr)', // 2 columns on small screens
                        md: 'repeat(3, 1fr)', // 3 columns on medium screens
                    },
                    gap: 4,
                }}
            >
                {features.map((feature) => (
                    <Box
                        key={feature.title}
                        component={motion.div}
                        variants={itemVariants}
                    >
                        <Card
                            sx={{
                                height: '100%',
                                textAlign: 'center',
                                borderRadius: 3,
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-6px)',
                                    boxShadow: 6,
                                },
                            }}
                            elevation={3}
                        >
                            <Box
                                sx={{
                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                    mb: 2, width: 70, height: 70, mx: 'auto',
                                    borderRadius: '50%', bgcolor: 'primary.light', color: 'primary.contrastText',
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <CardContent>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Container>
    );
};

export default FeaturesSection;