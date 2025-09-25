import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, LinearProgress, CircularProgress, Alert } from '@mui/material';
import { getStudentDashboardStats } from '../studentSlice.js';

const SubjectStat = ({ subject }) => (
    <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {subject.subjectName} ({subject.subjectCode})
            </Typography>
            <Typography variant="body2">
                {subject.attendedClasses}/{subject.totalClasses} Classes
            </Typography>
        </Box>
        <LinearProgress
            variant="determinate"
            value={subject.attendancePercentage}
            sx={{ height: 10, borderRadius: 5 }}
        />
        <Typography variant="caption" color="text.secondary" align="right" component="div">
            {subject.attendancePercentage.toFixed(2)}%
        </Typography>
    </Box>
);

const MyAttendanceStats = () => {
    const dispatch = useDispatch();
    const { dashboardStats, isLoading, isError, message } = useSelector((state) => state.student);

    useEffect(() => {
        dispatch(getStudentDashboardStats());
    }, [dispatch]);

    if (isLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></Box>;
    }

    if (isError) {
        return <Alert severity="error">{message}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>My Attendance Record</Typography>
            {dashboardStats && dashboardStats.length > 0 ? (
                dashboardStats.map((subject) => (
                    <SubjectStat key={subject.subjectId} subject={subject} />
                ))
            ) : (
                <Typography variant="body2" color="text.secondary">
                    No attendance data available yet. Attend a class to see your stats.
                </Typography>
            )}
        </Box>
    );
};

export default MyAttendanceStats;