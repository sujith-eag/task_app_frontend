import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

import AttendanceReport from '../components/reports/AttendanceReport.jsx';
import FeedbackReport from '../components/reports/FeedbackReport.jsx';

const ReportingPage = () => {
    return (
        <Container maxWidth="xl">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Institutional Reports
            </Typography>
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