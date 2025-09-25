import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { getTeacherSessionsHistory } from '../teacherSlice.js';

const ClassHistory = () => {
    const dispatch = useDispatch();
    const { sessionHistory, isLoading, isError, message } = useSelector((state) => state.teacher);

    useEffect(() => {
        dispatch(getTeacherSessionsHistory());
    }, [dispatch]);

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{message}</Alert>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Recent Class History</Typography>
            <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
                {sessionHistory.length > 0 ? (
                    sessionHistory.map((session) => (
                        <ListItem key={session._id}>
                            <ListItemText
                                primary={`${session.subject.name} (${session.subject.subjectCode})`}
                                secondary={`On: ${new Date(session.startTime).toLocaleDateString()}`}
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography>No past sessions found.</Typography>
                )}
            </List>
        </Box>
    );
};

export default ClassHistory;