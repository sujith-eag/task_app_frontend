import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Box, Container, Typography, Alert, Stack } from '@mui/material';
import { toast } from 'react-toastify';

import StudentProfileCard from '../components/StudentProfileCard.jsx';
import AttendanceEntry from '../components/AttendanceEntry.jsx';
import MyAttendanceStats from '../components/MyAttendanceStats.jsx';
import StudentApplication from '../components/StudentApplication.jsx';
import PastSessionsList from '../components/PastSessionsList.jsx';

import { resetProfileStatus } from '../../profile/profileSlice.js';

const StudentDashboardPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { user } = useSelector((state) => state.auth);
    const { profileStatus, message } = useSelector((state) => state.profile);

    // useEffect in the PARENT now handles the side effects
    useEffect(() => {
        // When the applyAsStudent action succeeds...
        if (profileStatus === 'succeeded') {
            // ...show the toast and navigate to the profile page.
            toast.success("Your application has been submitted successfully!");
            navigate('/profile');
            // Reset the status to prevent this from running again
            dispatch(resetProfileStatus());
        }

        // Handle the error case as well
        if (profileStatus === 'failed') {
            toast.error(message);
            dispatch(resetProfileStatus());
        }
    }, [profileStatus, message, navigate, dispatch]);
    
    
    const renderContent = () => {
        // Case 1: User is an approved student
        // if (user && user.role === 'student') {
        //     return (
        //         <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        //             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        //                 <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        //                      <AttendanceEntry />
        //                 </Paper>
        //                 <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        //                     <MyAttendanceStats />
        //                 </Paper>
        //             </Box>
        //             <Box>
        //                  <PastSessionsList />
        //             </Box>
        //         </Box>
        //     );
        // }

        
        // Case 1: User is an approved student
        if (user?.role === 'student') {
            return (
                // Main container stack. Behaves as a row on medium screens and up, a column on small screens.
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={3}
                    alignItems="flex-start"
                >
                    {/* --- Left Column: Profile & Stats --- */}
                    <Stack
                        spacing={3}
                        sx={{ width: { xs: '100%', md: '40%' } }} // Takes 40% width on medium screens
                    >
                        <StudentProfileCard />
                        <MyAttendanceStats />
                    </Stack>

                    {/* --- Right Column: Actions --- */}
                    <Stack
                        spacing={3}
                        sx={{ width: { xs: '100%', md: '60%' } }} // Takes 60% width on medium screens
                    >
                        <AttendanceEntry />
                        <PastSessionsList />
                    </Stack>
                </Stack>
            );
        }
        
        // Case 2: User is a general user with a pending application
        if (user && user.studentDetails?.applicationStatus === 'pending') {
            return (
                <Alert severity="info" variant="filled">
                    Your application to become a student is currently pending review by an administrator.
                </Alert>
            );
        }

        // Case 3: User is a general user who can apply
        if (user && (user.studentDetails?.applicationStatus === 'not_applied' || user.studentDetails?.applicationStatus === 'rejected')) {
            return <StudentApplication />;
        }

        // Fallback for any other state
        return <Typography>Loading student information...</Typography>;
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Student Dashboard
            </Typography>
            <Box sx={{ mt: 2 }}>
                {renderContent()}
            </Box>
        </Container>
    );
};

export default StudentDashboardPage;