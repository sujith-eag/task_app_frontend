import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Autocomplete, TextField } from '@mui/material';
import { toast } from 'react-toastify';

import { getUsersByRole } from '../adminSlice/adminUserSlice';
import { getStudentReport, reset } from '../adminSlice/adminReportingSlice';
import StudentReportDisplay from '../components/reports/StudentReportDisplay.jsx';


const StudentReportPage = () => {
    const dispatch = useDispatch();
    // Note: The list of students comes from the 'adminUsers' slice
    const { userList: students } = useSelector((state) => state.adminUsers); 
    const { studentReport, isStudentReportLoading, isError, message } = useSelector((state) => state.adminReporting);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        // Fetch all users with the 'student' role for the dropdown
        dispatch(getUsersByRole('student'));
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    const handleStudentChange = (event, newValue) => {
        setSelectedStudent(newValue);
        if (newValue?._id) {
            dispatch(getStudentReport(newValue._id));
        }
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Student-Centric Report
            </Typography>

            <Autocomplete
                options={students}
                getOptionLabel={(option) => `${option.name} (${option.studentDetails?.usn || 'N/A'})`}
                value={selectedStudent}
                onChange={handleStudentChange}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderInput={(params) => <TextField {...params} label="Search Student by Name or USN" />}
                sx={{ maxWidth: 500, mb: 2 }}
            />

            <StudentReportDisplay report={studentReport} isLoading={isStudentReportLoading} />
        </Container>
    );
};

export default StudentReportPage;