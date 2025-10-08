import React from 'react';
import { Box, Typography, Paper, Grid, CircularProgress, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'subjectName', headerName: 'Subject', flex: 1 },
    { field: 'attendedClasses', headerName: 'Classes Attended', width: 180 },
    { field: 'totalClasses', headerName: 'Total Classes', width: 180 },
    { 
        field: 'attendancePercentage', 
        headerName: 'Attendance %', 
        width: 180,
        renderCell: (params) => `${params.value?.toFixed(2) || 0}%`
    },
];

const StudentReportDisplay = ({ report, isLoading }) => {
    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    if (!report) {
        return <Typography sx={{ mt: 4, textAlign: 'center' }}>Select a student to view their report.</Typography>;
    }

    return (
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>Attendance Report for: {report.student.name}</Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={`USN: ${report.student.studentDetails.usn}`} color="primary" />
                <Chip label={`Batch: ${report.student.studentDetails.batch}`} />
                <Chip label={`Semester: ${report.student.studentDetails.semester}`} />
                <Chip label={`Section: ${report.student.studentDetails.section}`} />
            </Box>
            
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                    rows={report.attendance}
                    columns={columns}
                    getRowId={(row) => row.subjectId} // Use subjectId as the unique row ID
                />
            </Box>
        </Paper>
    );
};

export default StudentReportDisplay;