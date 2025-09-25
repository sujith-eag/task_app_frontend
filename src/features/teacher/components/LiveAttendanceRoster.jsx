import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, Chip, List, ListItem, ListItemText, Switch, Button, CircularProgress } from '@mui/material';
import { getSessionRoster, finalizeAttendance } from '../teacherSlice.js';
import { toast } from 'react-toastify';

const LiveAttendanceRoster = ({ session }) => {
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState(60);
    const [isWindowOpen, setIsWindowOpen] = useState(true);
    const [roster, setRoster] = useState(session.attendanceRecords || []);
    
    // Countdown Timer
    useEffect(() => {
        if (!isWindowOpen) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        if (timeLeft === 0) {
            setIsWindowOpen(false);
            clearInterval(timer);
            toast.info("Attendance window is now closed. Manual changes enabled.");
        }
        return () => clearInterval(timer);
    }, [timeLeft, isWindowOpen]);

    // Roster Polling
    useEffect(() => {
        const polling = setInterval(() => {
            if (isWindowOpen) {
                dispatch(getSessionRoster(session._id));
            }
        }, 5000); // Poll every 5 seconds
        return () => clearInterval(polling);
    }, [dispatch, session._id, isWindowOpen]);
    
    useEffect(() => {
        setRoster(session.attendanceRecords || []);
    }, [session.attendanceRecords]);

    const handleToggle = (studentId) => {
        setRoster(roster.map(r => r.student._id === studentId ? { ...r, status: !r.status } : r));
    };

    const handleFinalize = () => {
        const updatedRoster = roster.map(({ student, status }) => ({ studentId: student._id, status }));
        dispatch(finalizeAttendance({ sessionId: session._id, updatedRoster }))
            .unwrap()
            .then(() => toast.success("Attendance has been finalized successfully."))
            .catch((err) => toast.error(err));
    };

    return (
        <Box>
            <Typography variant="h5">Live Class Session</Typography>
            <Typography variant="subtitle1" gutterBottom>{session.subject.name}</Typography>
            <Chip
                label={`Attendance Code: ${session.attendanceCode}`}
                color="primary"
                sx={{ fontSize: '1.5rem', padding: '20px', height: 'auto', mb: 2 }}
            />
            <Typography variant="h4" color={isWindowOpen ? 'secondary' : 'text.disabled'}>
                {isWindowOpen ? `Time left: ${timeLeft}s` : "Window Closed"}
            </Typography>

            <List sx={{ maxHeight: 400, overflow: 'auto', mt: 2 }}>
                {roster.map(({ student, status }) => (
                    <ListItem key={student._id} secondaryAction={
                        <Switch
                            edge="end"
                            onChange={() => handleToggle(student._id)}
                            checked={status}
                            disabled={isWindowOpen}
                        />
                    }>
                        <ListItemText primary={student.name} secondary={`USN: ${student.studentDetails.usn.slice(-4)}`} />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" onClick={handleFinalize} disabled={isWindowOpen} sx={{ mt: 2 }}>
                Finalize Attendance
            </Button>
        </Box>
    );
};

export default LiveAttendanceRoster;