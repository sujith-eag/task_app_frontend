import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Chip, List, ListItem, ListItemText, Switch, Button } from '@mui/material';

import { toast } from 'react-toastify';

import { useSocket } from '../../../context/SocketContext.jsx';
import { finalizeAttendance, 
        updateRosterOnSocketEvent,
    toggleManualAttendance } from '../teacherSlice.js';


const LiveAttendanceRoster = ({ session }) => {
    const dispatch = useDispatch();
    const socket = useSocket();

    // activeSession from Redux is the single source of truth.
    const { activeSession, isRosterLoading } = useSelector((state) => state.teacher);

    // Helper function to calculate time left based on the server's timestamp
    const calculateTimeLeft = () => {
        const expirationTime = new Date(session.attendanceWindowExpires).getTime();
        const currentTime = new Date().getTime();
        const difference = expirationTime - currentTime;
        
        // Return seconds, ensuring it doesn't go below 0
        return Math.max(0, Math.floor(difference / 1000));
    };    
    
    // State for UI elements only    
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isWindowOpen, setIsWindowOpen] = useState(timeLeft > 0);

	// Handles all real-time communication
	useEffect(() => {
        // GUARD: Do not establish listeners until the initial roster has loaded and the socket is ready.
        if (isRosterLoading || !socket) {
            return;
        }
        // Have the teacher's client join a private "room" for this session
        socket.emit('join-session-room', session._id);

        // Define the handler for incoming check-in events
        const handleStudentCheckIn = (studentData) => {
            // Dispatch the synchronous reducer to instantly update the UI
            dispatch(updateRosterOnSocketEvent(studentData));
        };
        
        // Listen for the 'student-checked-in' event from the server
        socket.on('student-checked-in', handleStudentCheckIn);

        // Cleanup: Leave the room, remove the listener on component unmount
        return () => {
            socket.off('student-checked-in', handleStudentCheckIn);
            socket.emit('leave-session-room', session._id);
        };
	}, [dispatch, session._id, socket, isRosterLoading]);


    // Countdown Timer - Runs only once on mount
    useEffect(() => {
        // If the window is already closed on mount, do nothing.
        if (!isWindowOpen) return;
        
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);
            
            if (newTimeLeft <= 0 ){
                setIsWindowOpen(false);
                clearInterval(timer);
                toast.info("Attendance window is now closed. Manual changes enabled.");                
            }
        }, 1000);
        
        // Cleanup interval on component unmount
        return () => clearInterval(timer);

    }, [session.attendanceWindowExpires, isWindowOpen]);


    const handleToggle = (studentId) => {
        dispatch(toggleManualAttendance(studentId));
    };

    const handleFinalize = () => {
        const updatedRoster = activeSession.attendanceRecords.map(({ student, status }) => ({ studentId: student._id, status }));
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
                {activeSession?.attendanceRecords?.map(({ student, status }) => (
                    <ListItem key={student._id} secondaryAction={
                        <Switch
                            edge="end"
                            onChange={() => handleToggle(student._id)}
                            checked={status}
                            disabled={isWindowOpen}
                        />
                    }>
                        <ListItemText 
                            primary={student.name} 
                            secondary={`USN: ${student.studentDetails.usn.slice(-4)}`} 
                        />
                    </ListItem>
                ))}
            </List>
            <Button 
                variant="contained" 
                onClick={handleFinalize} 
                disabled={isWindowOpen} 
                sx={{ mt: 2 }}>
                Finalize Attendance
            </Button>
        </Box>
    );
};

export default LiveAttendanceRoster;