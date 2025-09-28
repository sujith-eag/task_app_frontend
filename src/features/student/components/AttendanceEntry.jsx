import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

import { markAttendance } from '../studentSlice.js';

const AttendanceEntry = () => {
    const [attendanceCode, setAttendanceCode] = useState('');
    const { isLoading } = useSelector((state) => state.student);
    const dispatch = useDispatch();

    const isCodeValid = attendanceCode.trim().length === 8;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isCodeValid) {
            toast.error("Please enter a valid 8-digit code.");
            return;
        }
        dispatch(markAttendance({ attendanceCode }))
            .unwrap()
            .then((result) => toast.success(result.message))
            .catch((error) => toast.error(error))
            .finally(() => {
                setAttendanceCode('')});
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>Mark Your Attendance</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Enter the 8-digit code provided by your teacher. You have 60 seconds.
            </Typography>
            <TextField
                label="Attendance Code"
                value={attendanceCode}
                onChange={(e) => setAttendanceCode(e.target.value)}
                fullWidth
                required
                slotProps={{
                    input: {
                        maxLength: 8,
                        style: {
                            fontSize: '1.5rem',
                            letterSpacing: '0.2rem',
                            textAlign: 'center',
                        },
                    },
                }}
            />
            <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading || !isCodeValid}
                sx={{ mt: 2, py: 1.5, position: 'relative' }}
            >
                Check In
                {isLoading && <CircularProgress size={24} sx={{ position: 'absolute' }} />}
            </Button>
        </Box>
    );
};

export default AttendanceEntry;