import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, Typography, CircularProgress, Paper } from '@mui/material';
import { toast } from 'react-toastify';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { markAttendance } from '../studentSlice.js';

const AttendanceEntry = () => {
    const [attendanceCode, setAttendanceCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const isCodeValid = attendanceCode.trim().length === 8;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isCodeValid) {
            toast.error("Please enter a valid 8-digit code.");
            return;
        }
        
        setIsSubmitting(true);
        dispatch(markAttendance({ attendanceCode }))
            .unwrap()
            .then((result) => toast.success(result.message))
            .catch((error) => toast.error(error))
            .finally(() => {
                setAttendanceCode('');
                setIsSubmitting(false);
            });
    };

    return (
        <Paper
            elevation={4}
            sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: { xs: 2, sm: 3 },
                background: (theme) => 
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.9) 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
                border: '2px solid',
                borderColor: 'divider',
            }}
        >
            <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h5" gutterBottom fontWeight={700} sx={{
                    background: (theme) => 
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    Mark Your Attendance
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
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
                                fontSize: '1.75rem',
                                letterSpacing: '0.3rem',
                                textAlign: 'center',
                                fontWeight: 700,
                            },
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.03)'
                                : 'rgba(255, 255, 255, 0.8)',
                            '&:hover': {
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: 'primary.main',
                                    borderWidth: 2,
                                },
                            },
                            '&.Mui-focused': {
                                boxShadow: (theme) => theme.palette.mode === 'dark'
                                    ? '0 0 0 3px rgba(144, 202, 249, 0.2)'
                                    : '0 0 0 3px rgba(25, 118, 210, 0.1)',
                            },
                        },
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isSubmitting || !isCodeValid}
                    startIcon={!isSubmitting && <CheckCircleIcon />}
                    sx={{ 
                        mt: 2.5, 
                        py: 1.75, 
                        position: 'relative',
                        borderRadius: 2,
                        fontWeight: 700,
                        fontSize: '1rem',
                        textTransform: 'none',
                        boxShadow: 3,
                        '&:hover': {
                            boxShadow: 6,
                            transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                    }}
                >
                    Check In
                    {isSubmitting && <CircularProgress size={24} sx={{ position: 'absolute', color: 'primary.contrastText' }} />}
                </Button>
            </Box>
        </Paper>
    );
};

export default AttendanceEntry;