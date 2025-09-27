import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // FIX: Import useSelector
import { Box, Typography, Chip, List, ListItem, ListItemText, Switch, Button, CircularProgress } from '@mui/material';
import { getSessionRoster, finalizeAttendance, updateRosterOnSocketEvent } from '../teacherSlice.js';
import { toast } from 'react-toastify';
import { useSocket } from '../../../context/SocketContext.jsx';

const LiveAttendanceRoster = ({ session }) => {
    const dispatch = useDispatch();
    const socket = useSocket();

    const { activeSession } = useSelector((state) => state.teacher);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isWindowOpen, setIsWindowOpen] = useState(true);
    const [localRoster, setLocalRoster] = useState(session?.attendanceRecords || []);

    // Roster Polling
    // useEffect(() => {
    //     const polling = setInterval(() => {
    //         if (isWindowOpen) {
    //             dispatch(getSessionRoster(session._id));
    //         }
    //     }, 5000);
    //     return () => clearInterval(polling);
    // }, [dispatch, session._id, isWindowOpen]);

    // Runs only ONCE on mount to get the initial roster state.
    useEffect(() => {
        dispatch(getSessionRoster(session._id));
    }, [dispatch, session._id]);

    // Update local roster when Redux state changes
    useEffect(() => {
        // Ensure activeSession and its records exist before updating
        if (activeSession && activeSession.attendanceRecords) {
            setLocalRoster(activeSession.attendanceRecords);
        }
    }, [activeSession?.attendanceRecords]);

	// This useEffect handles all real-time communication
	useEffect(() => {
	    // Have the teacher's client join a private "room" for this session
	    if (socket) {
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
	    }
	}, [dispatch, session._id, socket]);
    
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


    const handleToggle = (studentId) => {
        setLocalRoster(localRoster.map(r => r.student._id === studentId ? { ...r, status: !r.status } : r));
    };

    const handleFinalize = () => {
        const updatedRoster = localRoster.map(({ student, status }) => ({ studentId: student._id, status }));
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
                {localRoster.map(({ student, status }) => (
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