import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Paper, Tabs, Tab, Badge, Divider, CircularProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import { toast } from 'react-toastify';

import { useSocket } from '../../../../context/SocketContext.jsx';
import { finalizeAttendance, 
        updateRosterOnSocketEvent,
        toggleManualAttendance,
        getSessionRoster } from '../../teacherSlice.js';

// Import new subcomponents
import AttendanceStats from './AttendanceStats.jsx';
import AttendanceCodeDisplay from './AttendanceCodeDisplay.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import StudentRosterItem from './StudentRosterItem.jsx';


const LiveAttendanceRoster = ({ session }) => {
    const dispatch = useDispatch();
    const { socket } = useSocket();

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
    const [activeTab, setActiveTab] = useState(0); // 0 = All, 1 = Present, 2 = Absent

    // Fetch roster when component mounts if activeSession exists but no attendanceRecords
    useEffect(() => {
        if (session?._id && (!activeSession?.attendanceRecords || activeSession.attendanceRecords.length === 0)) {
            console.log('📋 Fetching initial roster for session:', session._id);
            dispatch(getSessionRoster(session._id));
        }
    }, [session?._id, activeSession?.attendanceRecords, dispatch]);

	// Handles all real-time communication
	useEffect(() => {
        // GUARD: Do not establish listeners until socket is ready
        if (!socket || !session?._id) {
            return;
        }
        
        console.log('🔌 Setting up socket listeners for session:', session._id);
        console.log('📋 Current attendance records:', activeSession?.attendanceRecords?.length || 0);
        
        // Have the teacher's client join a private "room" for this session
        socket.emit('join-session-room', session._id);

        // Define the handler for incoming check-in events
        const handleStudentCheckIn = (studentData) => {
            console.log('👤 Student checked in via socket:', studentData);
            
            // Only process if we have the roster loaded
            if (activeSession?.attendanceRecords && activeSession.attendanceRecords.length > 0) {
                dispatch(updateRosterOnSocketEvent(studentData));
            } else {
                console.warn('⚠️ Received check-in but roster not loaded yet. Fetching roster...');
                // Trigger roster fetch if not already loading
                if (!isRosterLoading) {
                    dispatch(getSessionRoster(session._id));
                }
            }
        };
        
        // Listen for the 'student-checked-in' event from the server
        socket.on('student-checked-in', handleStudentCheckIn);

        // Cleanup: Leave the room, remove the listener on component unmount
        return () => {
            console.log('🔌 Cleaning up socket listeners for session:', session._id);
            socket.off('student-checked-in', handleStudentCheckIn);
            socket.emit('leave-session-room', session._id);
        };
	}, [dispatch, session._id, socket, activeSession?.attendanceRecords, isRosterLoading]);


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

    // Calculate stats
    const totalStudents = activeSession?.attendanceRecords?.length || 0;
    const presentStudents = activeSession?.attendanceRecords?.filter(r => r.status) || [];
    const absentStudents = activeSession?.attendanceRecords?.filter(r => !r.status) || [];
    const presentCount = presentStudents.length;
    const absentCount = absentStudents.length;

    // Filter students based on active tab
    const getFilteredStudents = () => {
        if (!activeSession?.attendanceRecords) return [];
        
        switch (activeTab) {
            case 1: // Present
                return presentStudents;
            case 2: // Absent
                return absentStudents;
            default: // All
                return activeSession.attendanceRecords;
        }
    };

    const filteredStudents = getFilteredStudents();

    // Show loading skeleton during initial roster load
    if (isRosterLoading) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6 }}>
                <CircularProgress size={60} />
                <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
                    Loading attendance roster...
                </Typography>
            </Box>
        );
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography 
                    variant="h4" 
                    fontWeight={700}
                    fontSize={{ xs: '1.5rem', sm: '2rem' }}
                    sx={{
                        mb: 1,
                        background: (theme) => 
                            theme.palette.mode === 'dark'
                                ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Live Class Session
                </Typography>
                <Typography 
                    variant="h6" 
                    color="text.secondary"
                    fontSize={{ xs: '1rem', sm: '1.25rem' }}
                    fontWeight={500}
                >
                    {session.subject.name}
                </Typography>
            </Box>

            {/* Attendance Code Display */}
            <AttendanceCodeDisplay code={session.attendanceCode} />

            {/* Countdown Timer */}
            <CountdownTimer timeLeft={timeLeft} isWindowOpen={isWindowOpen} />

            {/* Attendance Stats */}
            <AttendanceStats 
                totalStudents={totalStudents}
                presentCount={presentCount}
                absentCount={absentCount}
            />

            {/* Tabs for filtering */}
            <Paper
                elevation={4}
                sx={{
                    mb: 2,
                    borderRadius: 2,
                    background: (theme) => 
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.9) 100%)'
                            : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 4px 16px rgba(0, 0, 0, 0.4)'
                        : '0 4px 16px rgba(0, 0, 0, 0.08)',
                    border: '2px solid',
                    borderColor: 'divider',
                }}
            >
                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    variant="fullWidth"
                    sx={{
                        '& .MuiTab-root': {
                            fontWeight: 600,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            textTransform: 'none',
                            py: { xs: 1.5, sm: 2 },
                        },
                    }}
                >
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>All Students</span>
                                <Badge 
                                    badgeContent={totalStudents} 
                                    color="primary"
                                    sx={{ '& .MuiBadge-badge': { position: 'static', transform: 'none' } }}
                                />
                            </Box>
                        }
                    />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CheckCircleIcon sx={{ fontSize: '1rem' }} />
                                <span>Present</span>
                                <Badge 
                                    badgeContent={presentCount} 
                                    color="success"
                                    sx={{ '& .MuiBadge-badge': { position: 'static', transform: 'none' } }}
                                />
                            </Box>
                        }
                    />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CancelIcon sx={{ fontSize: '1rem' }} />
                                <span>Absent</span>
                                <Badge 
                                    badgeContent={absentCount} 
                                    color="error"
                                    sx={{ '& .MuiBadge-badge': { position: 'static', transform: 'none' } }}
                                />
                            </Box>
                        }
                    />
                </Tabs>
            </Paper>

            {/* Student Roster List */}
            <Paper
                elevation={4}
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    background: (theme) => 
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(15, 20, 40, 0.9) 100%)'
                            : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4)'
                        : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
                    border: '2px solid',
                    borderColor: 'divider',
                    mb: 3,
                }}
            >
                <Box 
                    sx={{ 
                        maxHeight: { xs: 400, md: 500 }, 
                        overflow: 'auto',
                        // Custom scrollbar styling
                        '&::-webkit-scrollbar': {
                            width: 8,
                        },
                        '&::-webkit-scrollbar-track': {
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'rgba(0, 0, 0, 0.05)',
                            borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: (theme) => theme.palette.mode === 'dark'
                                ? 'linear-gradient(180deg, #90caf9 0%, #64b5f6 100%)'
                                : 'linear-gradient(180deg, #1976d2 0%, #42a5f5 100%)',
                            borderRadius: 4,
                            '&:hover': {
                                background: (theme) => theme.palette.mode === 'dark'
                                    ? '#90caf9'
                                    : '#1976d2',
                            },
                        },
                    }}
                >
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(({ student, status }, index) => (
                            <StudentRosterItem
                                key={student._id}
                                student={student}
                                status={status}
                                onToggle={() => handleToggle(student._id)}
                                isWindowOpen={isWindowOpen}
                                index={index}
                            />
                        ))
                    ) : (
                        <Box sx={{
                            textAlign: 'center',
                            py: 6,
                            px: 2,
                        }}>
                            <Typography variant="body1" color="text.secondary">
                                {activeTab === 1 && 'No students have marked attendance yet.'}
                                {activeTab === 2 && 'All students are present!'}
                                {activeTab === 0 && 'No students enrolled in this session.'}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Finalize Button */}
            <Button 
                variant="contained" 
                size="large"
                fullWidth
                onClick={handleFinalize} 
                disabled={isWindowOpen}
                startIcon={<SaveIcon />}
                sx={{ 
                    py: 1.75,
                    borderRadius: 2,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    boxShadow: 3,
                    '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.12)'
                            : 'rgba(0, 0, 0, 0.12)',
                    },
                    transition: 'all 0.2s ease',
                }}
            >
                {isWindowOpen ? 'Close Window to Finalize' : 'Finalize Attendance'}
            </Button>

            {isWindowOpen && (
                <Typography 
                    variant="caption" 
                    display="block" 
                    textAlign="center" 
                    color="text.secondary"
                    sx={{ mt: 1.5, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                >
                    You can finalize attendance after the window closes or manually toggle students
                </Typography>
            )}
        </Box>
    );
};

export default LiveAttendanceRoster;