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
import InsightsIcon from '@mui/icons-material/Insights';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import ScheduleIcon from '@mui/icons-material/Schedule';
import HistoryIcon from '@mui/icons-material/History';
import HttpsIcon from '@mui/icons-material/Https';
import BoltIcon from '@mui/icons-material/Bolt';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
const FeaturesSection = () => {
    const [selectedTab, setSelectedTab] = useState(0);

    const academicFeatures = [
        {
            title: 'The Modern Campus',
            description: 'Create hierarchical roles (admin, faculty, student), assign granular permissions, and manage profiles centrally with administrative controls and bulk-import/CSV support.',
            icon: <AssuredWorkloadIcon fontSize="large" />,
            badge: 'Academic',
        },
        {
            title: 'Attendance & Timetables',
            description: 'Real-time attendance tied to timetable data. Generate and export timetables, auto-sync sessions, and visualize attendance trends by class or semester.',
            icon: <ScheduleIcon fontSize="large" />,
            badge: 'Academic',
        },
        {
            title: 'Assignments & Submissions',
            description: 'Create assignments with deadlines, accept file submissions, manage grading and teacher feedback, and track late/ resubmissions with an easy-to-use workflow.',
            icon: <PlaylistAddCheckIcon fontSize="large" />,
            badge: 'Academic',
        },
        {
            title: '360° Feedback & Reflection',
            description: 'Collect anonymous student feedback alongside private teacher reflections to give administrators an actionable view of each session.',
            icon: <FactCheckIcon fontSize="large" />,
            badge: 'Academic',
        },
        {
            title: 'Reports & Analytics',
            description: 'Comprehensive exports and drill-down analytics for attendance, feedback, and teacher performance. Export CSV/Excel and filter by subject, teacher and semester.',
            icon: <InsightsIcon fontSize="large" />,
            badge: 'Academic',
        },
        {
            title: 'Timetable Automation & Interactive Editor',
            description: 'Automated timetable generation with an interactive editor for manual review and conflict resolution. Visualize session load, attendance heatmaps, export reports and schedules for distribution.',
            icon: <EventAvailableIcon fontSize="large" />,
            badge: 'Academic',
        },
    ];

    const securityFeatures = [
        {
            title: 'Enterprise-Grade Security',
            description: 'Security-first design: mandatory email verification, brute-force protection, httpOnly server-side sessions, and granular RBAC across admin surfaces.',
            icon: <SecurityIcon fontSize="large" />,
            badge: 'Security',
        },
        {
            title: 'Audit & Access Control',
            description: 'Comprehensive audit logs for sensitive actions, configurable retention policies, and easy export for compliance and investigations.',
            icon: <HistoryIcon fontSize="large" />,
            badge: 'Security',
        },
        {
            title: 'Data Protection & Encryption',
            description: 'At-rest and in-transit encryption, field-level protection for PII, and configurable data retention rules to meet compliance needs.',
            icon: <HttpsIcon fontSize="large" />,
            badge: 'Security',
        },
        {
            title: 'Rate Limiting & Abuse Protection',
            description: 'Per-endpoint rate-limits, IP throttling, and bot-detection heuristics to protect public endpoints, reduce abuse, and improve stability.',
            icon: <BoltIcon fontSize="large" />,
            badge: 'Security',
        },
        {
            title: 'Session Management',
            description: 'View and revoke active sessions with contextual device and location info; remote sign-out for lost devices and per-session activity history.',
            icon: <VisibilityOffIcon fontSize="large" />,
            badge: 'Security',
        },
        {
            title: 'Input Validation & Sanitization',
            description: 'Server-side validation, input sanitization, CSRF protections, helmet headers and Content Security Policy to reduce injection and XSS risks.',
            icon: <HistoryIcon fontSize="large" />,
            badge: 'Security',
        },
    ];

    const productivityFeatures = [
        {
            title: 'Cloud Drive & Filesystem',
            description: 'Hierarchical cloud storage with role-based quotas, secure private sharing, expiring links, and public access codes for controlled sharing and collaboration.',
            icon: <CloudUploadIcon fontSize="large" />,
            badge: 'Core',
        },
        {
            title: 'Task Management',
            description: 'Organize your workflow with nested sub-tasks, priorities, due dates, and filtering options to stay on top of your work.',
            icon: <PlaylistAddCheckIcon fontSize="large" />,
            badge: 'Core',
        },
        {
            title: 'Personal AI Planner',
            description: 'Transform high-level goals into structured task plans. Our conversational AI assistant interactively builds your task list with sub-tasks, priorities, and tags.',
            icon: <AutoAwesomeIcon fontSize="large" />,
            badge: 'New',
        },
        {
            title: 'Real-Time Messaging',
            description: 'Built-in real-time messaging with multi-device support. See who is online, send instant messages, get read receipts and offline sync. Optimistic UI for fast interactions.',
            icon: <ForumIcon fontSize="large" />,
            badge: null,
        },
        {
            title: 'Email Notifications',
            description: 'Stay informed with instant email alerts for critical events, password resets, status updates, task deadlines, messages and important events.',
            icon: <MarkEmailReadIcon fontSize="large" />,
            badge: null,
        },
        {
            title: 'Customizable Profiles',
            description: 'Personalize your account with a profile picture, detailed bio, and individual collaboration preferences.',
            icon: <AccountCircleIcon fontSize="large" />,
            badge: null,
        },
    ];

    const getDisplayedFeatures = () => {
        if (selectedTab === 0) return academicFeatures;
        if (selectedTab === 1) return securityFeatures;
        if (selectedTab === 2) return productivityFeatures;
        return academicFeatures;
    };

    const displayedFeatures = getDisplayedFeatures();

    // Theme-aware color helpers: use MUI theme palette to pick gradients per tab
    const tabGradient = (theme) => {
        if (selectedTab === 0) return `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`;
        if (selectedTab === 1) return `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 100%)`;
        return `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`;
    };

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
                                        px: { xs: 2, sm: 3 },
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
                                    bgcolor: 'transparent',
                                    px: { xs: 1, sm: 2 },
                                    '& .MuiTab-root': {
                                        fontWeight: 700,
                                        fontSize: { xs: '0.92rem', sm: '1rem' },
                                        textTransform: 'none',
                                        minHeight: { xs: 44, sm: 48 },
                                        px: { xs: 2, sm: 3 },
                                        borderRadius: 2,
                                        py: 0.5,
                                        transition: 'all 200ms ease',
                                        color: 'text.primary',
                                    },
                                    // selected tab as pill with primary background
                                    '& .MuiTab-root.Mui-selected': {
                                        color: 'primary.contrastText',
                                        bgcolor: 'primary.main',
                                        boxShadow: (theme) => theme.shadows[4],
                                        transform: 'translateY(-2px)',
                                    },
                                    // remove default indicator to keep pill look
                                    '& .MuiTabs-indicator': {
                                        display: 'none',
                                    },
                                }}
                            >
                                <Tab label={`Academic (${academicFeatures.length})`} />
                                <Tab label={`Security (${securityFeatures.length})`} />
                                <Tab label={`Productivity (${productivityFeatures.length})`} />
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
                                            border: '2px solid',
                                            borderColor: (theme) => selectedTab === 0 ? theme.palette.primary.light : selectedTab === 1 ? theme.palette.secondary.light : theme.palette.success.light,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                                
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
                                    // use theme-aware gradient based on active tab for a modern, consistent look
                                    background: (theme) => tabGradient(theme),
                                    color: (theme) => selectedTab === 0 ? theme.palette.primary.contrastText : selectedTab === 1 ? theme.palette.secondary.contrastText : theme.palette.success.contrastText,
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