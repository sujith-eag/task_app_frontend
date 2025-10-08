import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Typography, Paper } from '@mui/material';
import CreateClassForm from '../components/CreateClassForm.jsx';
import LiveAttendanceRoster from '../components/LiveAttendanceRoster.jsx';
import ClassHistory from '../components/ClassHistory.jsx';

const TeacherDashboardPage = () => {
    const { activeSession } = useSelector((state) => state.teacher);

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Typography 
                variant="h4" 
                component="h1" 
                gutterBottom 
                sx={{ fontWeight: 'bold', mb: 3 }}>
                Teacher Dashboard
            </Typography>

            {/* Box with Flexbox for the main layout */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on desktop
                    gap: 3 
                }}
            >
                {/* --- Left Column / Main Content --- */}
                {/* This Box will grow to full width if it's the only child */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        {activeSession ? (
                            <LiveAttendanceRoster session={activeSession} />
                        ) : (
                            <CreateClassForm />
                        )}
                    </Paper>
                </Box>

                {/* --- Right Column (Class History) --- */}
                {/* This Box is conditionally rendered */}
                {!activeSession && (
                    <Box sx={{ 
                        width: { xs: '100%', md: '60%' }, // Takes full width on mobile
                        flexShrink: 0 
                    }}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <ClassHistory />
                        </Paper>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default TeacherDashboardPage;