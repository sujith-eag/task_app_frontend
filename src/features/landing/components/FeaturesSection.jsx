import { containerVariants, itemVariants } from '../../../utils/animations.js';

import { Box, Container, Typography, Card, CardContent, Chip, Tabs, Tab } from '@mui/material';
import { useState } from 'react';
import { motion } from 'framer-motion';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ForumIcon from '@mui/icons-material/Forum';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SecurityIcon from '@mui/icons-material/Security';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const FeaturesSection = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const coreFeatures = [
        {
            title: 'The Modern Campus',
            description: 'A dedicated suite for educational institutions. Manage role-based access, track attendance in real-time, and gather anonymous feedback with full administrative control over academic structures.',
            icon: <AssuredWorkloadIcon fontSize="large" />,
            badge: 'Core',
        },
        {
            title: '360° Feedback Loop',
            description: 'Combines anonymous student feedback on classes with private teacher reflections, providing a holistic view of every session for administrative review.',
            icon: <FactCheckIcon fontSize="large" />,
            badge: 'Core',
        },
        {
            title: 'Enterprise-Grade Security',
            description: 'Built with security first: mandatory email verification, brute-force lockouts, role-based access control (RBAC), JWT authentication, and granular rate limiting.',
            icon: <SecurityIcon fontSize="large" />,
            badge: 'Core',
        },
        {
            title: 'Personal AI Planner',
            description: 'Transform high-level goals into structured task plans. Our conversational AI assistant interactively builds your task list with sub-tasks, priorities, and tags.',
            icon: <AutoAwesomeIcon fontSize="large" />,
            badge: 'New',
        },
        {
            title: 'Advanced Cloud Drive',
            description: 'Complete cloud storage solution with hierarchical folders, role-based quotas, and powerful sharing options including private sharing with expiration and public codes.',
            icon: <CloudUploadIcon fontSize="large" />,
            badge: 'Core',
        },
        {
            title: 'Task Management',
            description: 'Organize your workflow with nested sub-tasks, assignable priorities, due dates, and powerful filtering options to stay on top of your work.',
            icon: <PlaylistAddCheckIcon fontSize="large" />,
            badge: 'Core',
        },        
    ];

    const advancedFeatures = [
        {
            title: 'Real-Time Messaging',
            description: 'Built-in real-time messaging with multi-device support. See who is online, send instant messages, and get read receipts without leaving the app.',
            icon: <ForumIcon fontSize="large" />,
            badge: 'Beta',
        },
        {
            title: 'Customizable Profiles',
            description: 'Personalize your account with a profile picture, detailed bio, and individual collaboration preferences.',
            icon: <AccountCircleIcon fontSize="large" />,
            badge: null,
        },
        {
            title: 'Email Notifications',
            description: 'Stay informed with instant email alerts for critical events, password resets, status updates, task deadlines, messages and important events.',
            icon: <MarkEmailReadIcon fontSize="large" />,
            badge: null,
        },
    ];

    const comingSoonFeatures = [
        {
            title: 'OAuth 2.0 Login',
            description: 'Log in seamlessly with Google (OAuth 2.0) and utilize httpOnly cookies for an extra layer of security and convenience.',
            icon: <VpnKeyIcon fontSize="large" />,
            badge: 'Coming Soon',
        },
    ];

    const allFeatures = [...coreFeatures, ...advancedFeatures, ...comingSoonFeatures];
    
    const getDisplayedFeatures = () => {
        if (selectedTab === 0) return coreFeatures;
        if (selectedTab === 1) return advancedFeatures;
        if (selectedTab === 2) return comingSoonFeatures;
        return coreFeatures;
    };
    
    const displayedFeatures = getDisplayedFeatures();

    return (
        <Box id="features-section" sx={{ bgcolor: 'background.default', py: { xs: 8, sm: 10, md: 12 } }}>
        <Container maxWidth="lg">
            {/* Section Header */}
            <Box sx={{ mb: { xs: 6, sm: 7, md: 8 } }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  variant="h3"
                  align="center"
                  sx={{
                    fontWeight: 800,
                    mb: { xs: 2, sm: 2.5 },
                    fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                    background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Features Built for Excellence
                </Typography>

                <Typography 
                  variant="h6" 
                  align="center" 
                  color="text.secondary"
                  sx={{ 
                    maxWidth: '750px', 
                    mx: 'auto', 
                    fontWeight: 400,
                    fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.25rem' },
                    px: { xs: 2, sm: 3 }
                  }}
                >
                  A complete suite of tools designed to streamline your workflow and enhance modern campus life
                </Typography>
              </motion.div>
            </Box>

            {/* Feature Tabs */}
            <Box sx={{ mb: { xs: 4, sm: 5 }, display: 'flex', justifyContent: 'center' }}>
              <Tabs
                value={selectedTab}
                onChange={(e, newValue) => setSelectedTab(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: { xs: '0.85rem', sm: '0.95rem' },
                    textTransform: 'none',
                    minHeight: { xs: 44, sm: 48 },
                    px: { xs: 2, sm: 3 },
                  },
                  '& .Mui-selected': {
                    color: 'primary.main',
                  },
                }}
              >
                <Tab label={`Core Features (${coreFeatures.length})`} />
                <Tab label={`Advanced (${advancedFeatures.length})`} />
                <Tab label={`Coming Soon (${comingSoonFeatures.length})`} />
              </Tabs>
            </Box>
            {/* Feature Cards Grid */}
            <Box
                key={selectedTab}
                component={motion.div}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                viewport={{ once: false, amount: 0.2 }}
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: { xs: 3, sm: 3.5, md: 4 },
                }}
            >
                {displayedFeatures.map((feature, index) => (
                    <Box
                        key={`${selectedTab}-${feature.title}`}
                        component={motion.div}
                        variants={itemVariants}
                    >
                        <Card
                            sx={{
                                height: '100%',
                                textAlign: 'center',
                                borderRadius: 3,
                                p: { xs: 2, sm: 2.5 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                border: '2px solid',
                                borderColor: 'divider',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: (theme) => theme.shadows[12],
                                    borderColor: 'primary.main',
                                    '& .feature-icon': {
                                        transform: 'scale(1.1) rotate(5deg)',
                                    }
                                },
                            }}
                            elevation={2}
                        >
                            {/* Number Badge */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    boxShadow: 2,
                                }}
                            >
                                {index + 1}
                            </Box>

                            {/* Status Badge */}
                            {feature.badge && (
                                <Chip
                                    label={feature.badge}
                                    size="small"
                                    color={
                                        feature.badge === 'New' ? 'success' :
                                        feature.badge === 'Beta' ? 'warning' :
                                        feature.badge === 'Coming Soon' ? 'default' :
                                        'primary'
                                    }
                                    sx={{
                                        position: 'absolute',
                                        top: 12,
                                        left: 12,
                                        fontWeight: 600,
                                        fontSize: '0.7rem',
                                    }}
                                />
                            )}

                            {/* Icon */}
                            <Box
                                className="feature-icon"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mb: 2.5,
                                    mt: feature.badge ? 3 : 0,
                                    width: { xs: 65, sm: 70 },
                                    height: { xs: 65, sm: 70 },
                                    mx: 'auto',
                                    borderRadius: '50%',
                                    background: (theme) => theme.palette.mode === 'light'
                                        ? 'linear-gradient(135deg, #29B6F6 0%, #1976D2 100%)'
                                        : 'linear-gradient(135deg, #0277BD 0%, #01579B 100%)',
                                    color: 'primary.contrastText',
                                    boxShadow: 3,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                {feature.icon}
                            </Box>

                            {/* Content */}
                            <CardContent sx={{ px: { xs: 1, sm: 2 } }}>
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        mb: 1.5, 
                                        fontWeight: 700,
                                        fontSize: { xs: '1rem', sm: '1.1rem' }
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{
                                        lineHeight: 1.6,
                                        fontSize: { xs: '0.85rem', sm: '0.9rem' }
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Container>
        </Box>
    );
};

export default FeaturesSection;