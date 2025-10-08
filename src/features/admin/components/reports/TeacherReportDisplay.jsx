import React from 'react';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// A single, unified 'columns' definition for clarity and maintainability.
const columns = [
    { field: 'subjectName', headerName: 'Subject', flex: 1 },
    { field: 'sessionCount', headerName: 'Sessions Held', width: 150 },
    { 
        field: 'attendancePercentage', 
        headerName: 'Avg. Attendance %', 
        width: 200,
        renderCell: (params) => `${params.value?.toFixed(2) || 0}%`
    },
    { field: 'feedbackCount', headerName: 'Feedback Count', width: 150 },
    { 
        field: 'avgClarity', 
        headerName: 'Avg. Clarity', 
        width: 150,
        // Use renderCell as requested for robust display.
        renderCell: (params) => params.value === 'N/A' ? 'N/A' : params.value?.toFixed(2) || 'N/A'
    },
    { 
        field: 'avgEngagement', 
        headerName: 'Avg. Engagement', 
        width: 150,
        renderCell: (params) => params.value === 'N/A' ? 'N/A' : params.value?.toFixed(2) || 'N/A'
    },
];

const TeacherReportDisplay = ({ report, isLoading }) => {
    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    if (!report) {
        return <Typography sx={{ mt: 4, textAlign: 'center' }}>Select a teacher to view their report.</Typography>;
    }

    // This data merging logic is correct and remains the same.
    const combinedData = report.attendance.map(att => {
        const fb = report.feedback.find(f => f.subjectId === att.subjectId);
        return {
            id: att.subjectId,
            subjectName: att.subjectName,
            sessionCount: att.sessionCount,
            attendancePercentage: att.attendancePercentage,
            feedbackCount: fb?.feedbackCount || 0,
            avgClarity: fb?.avgClarity || 'N/A',
            avgEngagement: fb?.avgEngagement || 'N/A',
        };
    });

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>Performance Report for: {report.teacher.name}</Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item>
                    <Typography variant="body1"><strong>Staff ID:</strong> {report.teacher.staffId || 'N/A'}</Typography>
                </Grid>
                <Grid item>
                    <Typography variant="body1"><strong>Department:</strong> {report.teacher.department || 'N/A'}</Typography>
                </Grid>
            </Grid>
            
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={combinedData}
                    // Pass the single, correct columns definition.
                    columns={columns}
                    // REMOVED the incorrect .filter() call that was hiding the subject column.
                />
            </Box>
        </Paper>
    );
};

export default TeacherReportDisplay;