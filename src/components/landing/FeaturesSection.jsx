import { containerVariants, itemVariants } from '../../utils/animations.js';
import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

// --- Import the new icons ---
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import ContrastIcon from '@mui/icons-material/Contrast';
import GroupsIcon from '@mui/icons-material/Groups';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';


const FeaturesSection = () => {
    // --- UPDATED features array ---
    const features = [
        {
            title: 'Comprehensive Task Management',
            description: 'Organize your workflow with priorities, due dates, sub-tasks, and powerful filtering options.',
            icon: <PlaylistAddCheckIcon fontSize="large" />,
        },
        {
            title: 'AI-Powered Planning',
            description: 'Describe a goal, and let our AI assistant generate a detailed, actionable plan for you to review, refine, and adopt.',
            icon: <AutoAwesomeIcon fontSize="large" />,
        },
        {
            title: 'Secure File Storage & Sharing',
            description: 'Upload documents to the cloud and securely share them with other users, with full control over who has access.',
            icon: <FolderSharedIcon fontSize="large" />,
        },
        {
            title: 'Robust Security',
            description: 'Your account is protected with mandatory email verification, brute-force login detection, and secure password management.',
            icon: <SecurityIcon fontSize="large" />,
        },
        {
            title: 'Customizable Profiles',
            description: 'Personalize your account with a profile picture, a detailed bio, and individual collaboration preferences.',
            icon: <AccountCircleIcon fontSize="large" />,
        },
        {
            title: 'Real-Time Collaboration (Coming Soon)',
            description: 'Communicate directly with team members via private messaging and collaborate on projects in real-time.',
            icon: <GroupsIcon fontSize="large" />,
        },
        {
            title: 'Advanced Security (Coming Soon)',
            description: 'Log in with Google (OAuth 2.0) and httpOnly cookie for an extra layer of security.',
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