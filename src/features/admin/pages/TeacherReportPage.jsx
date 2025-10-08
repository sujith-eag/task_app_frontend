import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Autocomplete, TextField, Box } from '@mui/material';
import { toast } from 'react-toastify';

import { getAllTeachers } from '../adminSlice/adminTeacherSlice';
import { getTeacherReport, reset } from '../adminSlice/adminReportingSlice';
import TeacherReportDisplay from '../components/reports/TeacherReportDisplay';

const TeacherReportPage = () => {
    const dispatch = useDispatch();
    // Add isError and message to the selector
    const { teachers } = useSelector((state) => state.adminTeachers);
    const { teacherReport, isTeacherReportLoading, isError, message } = useSelector((state) => state.adminReporting);
    const [selectedTeacher, setSelectedTeacher] = useState(null);

    useEffect(() => {
        dispatch(getAllTeachers());
    }, [dispatch]);

    // --- ADD THIS useEffect FOR ERROR HANDLING ---
    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset()); // Reset the error state
        }
    }, [isError, message, dispatch]);

    const handleTeacherChange = (event, newValue) => {
        setSelectedTeacher(newValue);
        if (newValue?._id) {
            dispatch(getTeacherReport(newValue._id));
        }
    };

    return (
        // ... JSX remains the same
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Teacher-Centric Report
            </Typography>

            <Autocomplete
                options={teachers}
                getOptionLabel={(option) => option.name || ''}
                value={selectedTeacher}
                onChange={handleTeacherChange}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => <TextField {...params} label="Search and Select a Teacher" />}
                sx={{ maxWidth: 500, mb: 2 }}
            />

            <TeacherReportDisplay report={teacherReport} isLoading={isTeacherReportLoading} />
        </Container>
    );
};

export default TeacherReportPage;