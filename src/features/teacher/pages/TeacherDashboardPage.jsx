import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Typography, Paper } from '@mui/material';
import { CreateClassForm } from '../components/shared';
import { LiveAttendanceRoster } from '../components/attendance';
import { ClassHistory } from '../components/history';

const TeacherDashboardPage = () => {
    const { activeSession } = useSelector((state) => state.teacher);

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
            <Typography 
                variant="h4" 
                component="h1"
                fontWeight={700}
                fontSize={{ xs: '1.75rem', sm: '2.125rem' }}
                sx={{ 
                    mb: 3,
                    background: (theme) => 
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                Teacher Dashboard
            </Typography>

            {/* Box with Flexbox for the main layout */}
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: { xs: 2, sm: 3 }
                }}
            >
                {/* --- Left Column / Main Content --- */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Paper 
                        elevation={4}
                        sx={{ 
                            p: { xs: 2.5, sm: 3 }, 
                            borderRadius: { xs: 2, sm: 3 },
                            height: '100%',
                            background: (theme) => 
                                theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.9) 100%)'
                                    : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                            boxShadow: (theme) => theme.palette.mode === 'dark'
                                ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                                : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                            border: '2px solid',
                            borderColor: 'divider',
                        }}
                    >
                        {activeSession ? (
                            <LiveAttendanceRoster session={activeSession} />
                        ) : (
                            <CreateClassForm />
                        )}
                    </Paper>
                </Box>

                {/* --- Right Column (Class History) --- */}
                {!activeSession && (
                    <Box sx={{ 
                        width: { xs: '100%', md: '60%' },
                        flexShrink: 0 
                    }}>
                        <Paper 
                            elevation={4}
                            sx={{ 
                                p: { xs: 2.5, sm: 3 }, 
                                borderRadius: { xs: 2, sm: 3 },
                                height: '100%',
                                background: (theme) => 
                                    theme.palette.mode === 'dark'
                                        ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.9) 100%)'
                                        : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                                boxShadow: (theme) => theme.palette.mode === 'dark'
                                    ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                                    : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                                border: '2px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <ClassHistory />
                        </Paper>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default TeacherDashboardPage;