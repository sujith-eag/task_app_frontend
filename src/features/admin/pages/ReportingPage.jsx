import React from 'react';
import { Box, Container, Typography, Paper, Stack, Button } from '@mui/material';
import AttendanceReport from '../components/reports/AttendanceReport.jsx';
import FeedbackReport from '../components/reports/FeedbackReport.jsx';
import { Link as RouterLink } from 'react-router-dom';

const ReportingPage = () => {
    return (
        <Container maxWidth="xl">

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Institutional Reports
            </Typography>

            {/* --- Navigation Section using Stack --- */}
            <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Detailed Reports</Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to="/admin/reports/teacher"
                    >
                        View Teacher-Centric Report
                    </Button>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to="/admin/reports/student"
                    >
                        View Student-Centric Report
                    </Button>
                </Stack>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mt: 2, mb: 3, borderRadius: 2 }}>
                <AttendanceReport />
            </Paper>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <FeedbackReport />
            </Paper>
        </Container>
    );
};

export default ReportingPage;