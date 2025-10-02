import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Typography, Paper, Alert } from '@mui/material';

import AttendanceEntry from '../components/AttendanceEntry.jsx';
import MyAttendanceStats from '../components/MyAttendanceStats.jsx';
import StudentApplication from '../components/StudentApplication.jsx';
import PastSessionsList from '../components/PastSessionsList.jsx';


const StudentDashboardPage = () => {
    const { user } = useSelector((state) => state.auth);

    const renderContent = () => {
        // Case 1: User is an approved student
        if (user && user.role === 'student') {
            return (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                             <AttendanceEntry />
                        </Paper>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <MyAttendanceStats />
                        </Paper>
                    </Box>
                    <Box>
                         <PastSessionsList />
                    </Box>
                </Box>
            );
        }

        // Case 2: User is a general user with a pending application
        if (user && user.studentDetails?.applicationStatus === 'pending') {
            return (
                <Alert severity="info" variant="filled">
                    Your application to become a student is currently pending review by an administrator.
                </Alert>
            );
        }

        // Case 3: User is a general user who can apply
        if (user && (user.studentDetails?.applicationStatus === 'not_applied' || user.studentDetails?.applicationStatus === 'rejected')) {
            return <StudentApplication />;
        }

        // Fallback for any other state
        return <Typography>Loading student information...</Typography>;
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Student Dashboard
            </Typography>
            <Box sx={{ mt: 2 }}>
                {renderContent()}
            </Box>
        </Container>
    );
};

export default StudentDashboardPage;