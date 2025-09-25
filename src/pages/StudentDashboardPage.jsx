import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Typography, Paper, Alert } from '@mui/material';
import StudentApplication from '../features/student/components/StudentApplication.jsx';
import AttendanceEntry from '../features/student/components/AttendanceEntry.jsx';
import MyAttendanceStats from '../features/student/components/MyAttendanceStats.jsx';

const StudentDashboardPage = () => {
    const { user } = useSelector((state) => state.auth);

    const renderContent = () => {
        // Case 1: User is an approved student
        if (user && user.role === 'student') {
            return (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <AttendanceEntry />
                    <MyAttendanceStats />
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
            <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: 2 }}>
                {renderContent()}
            </Paper>
        </Container>
    );
};

export default StudentDashboardPage;