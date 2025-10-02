import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import { getSessionsForFeedback } from '../studentSlice';
import FeedbackModal from './FeedbackModal.jsx';

const PastSessionsList = () => {
    const dispatch = useDispatch();
    const { sessionsAwaitingFeedback, isLoading, isError, message } = useSelector((state) => state.student);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);

    useEffect(() => {
        dispatch(getSessionsForFeedback());
    }, [dispatch]);

    const handleOpenModal = (session) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
    };

    if (isLoading && !sessionsAwaitingFeedback.length) {
        return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    }

    if (isError) {
        return <Alert severity="error">{message}</Alert>;
    }

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>Pending Feedback</Typography>
            {sessionsAwaitingFeedback && sessionsAwaitingFeedback.length > 0 ? (
                <List>
                    {sessionsAwaitingFeedback.map((session) => (
                        <ListItem key={session._id} secondaryAction={
                            <Button variant="outlined" size="small" onClick={() => handleOpenModal(session)}>
                                Submit Feedback
                            </Button>
                        }>
                            <ListItemText
                                primary={session.subject.name}
                                secondary={`Taught by ${session.teacher.name} on ${new Date(session.startTime).toLocaleDateString()}`}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    You have no pending feedback requests. Great job!
                </Typography>
            )}
            {selectedSession && (
                <FeedbackModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    session={selectedSession}
                />
            )}
        </Paper>
    );
};

export default PastSessionsList;