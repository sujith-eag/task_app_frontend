import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import CreateClassForm from '../components/CreateClassForm.jsx';
import LiveAttendanceRoster from '../components/LiveAttendanceRoster.jsx';
import ClassHistory from '../components/ClassHistory.jsx';

const TeacherDashboardPage = () => {
    const { activeSession } = useSelector((state) => state.teacher);

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Teacher Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={activeSession ? 12 : 5}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        {activeSession ? (
                            <LiveAttendanceRoster session={activeSession} />
                        ) : (
                            <CreateClassForm />
                        )}
                    </Paper>
                </Grid>
                {!activeSession && (
                     <Grid item xs={12} md={7}>
                        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                            <ClassHistory />
                        </Paper>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default TeacherDashboardPage;