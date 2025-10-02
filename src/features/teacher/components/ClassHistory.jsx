import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, List, ListItem, ListItemText, 
    CircularProgress, Alert, Button, Stack } from '@mui/material';
import { getTeacherSessionsHistory } from '../teacherSlice.js';
import TeacherReflectionModal from './TeacherReflectionModal.jsx';
import FeedbackSummaryModal from './FeedbackSummaryModal.jsx';


const ClassHistory = () => {
    const dispatch = useDispatch();
    const { sessionHistory, isLoading, isError, message } = useSelector((state) => state.teacher);

    
    // State for modals
    const [selectedSession, setSelectedSession] = useState(null);
    const [isReflectionModalOpen, setReflectionModalOpen] = useState(false);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);

    useEffect(() => {
        dispatch(getTeacherSessionsHistory());
    }, [dispatch]);

    const openReflectionModal = (session) => {
        setSelectedSession(session);
        setReflectionModalOpen(true);
    };

    const openSummaryModal = (session) => {
        setSelectedSession(session);
        setSummaryModalOpen(true);
    };

    if (isLoading) return <CircularProgress />;
    if (isError) return <Alert severity="error">{message}</Alert>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom>Recent Class History</Typography>
            <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
                {sessionHistory.length > 0 ? (
                    sessionHistory.map((session) => (
                        <ListItem key={session._id} 
	                        secondaryAction={
	                            <Stack direction="row" spacing={1}>
                                <Button size="small" variant="outlined" onClick={() => openReflectionModal(session)}>
                                    Add Reflection
                                </Button>
                                <Button size="small" variant="contained" onClick={() => openSummaryModal(session)}>
                                    View Summary
                                </Button>
                            </Stack>
                        }>
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

            {/* Modals */}
            {selectedSession && (
                <>
                    <TeacherReflectionModal
                        open={isReflectionModalOpen}
                        onClose={() => setReflectionModalOpen(false)}
                        session={selectedSession}
                    />
                    <FeedbackSummaryModal
                        open={isSummaryModalOpen}
                        onClose={() => setSummaryModalOpen(false)}
                        session={selectedSession}
                    />
                </>
            )}
        </Box>
    );
};

export default ClassHistory;