import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Grid, Paper, Box, Typography } from '@mui/material';
import { getConversations } from '../features/chat/chatSlice.js';
import ConversationList from '../features/chat/components/ConversationList.jsx';
import ChatWindow from '../features/chat/components/ChatWindow.jsx';

const ChatPage = () => {
    const dispatch = useDispatch();
    const { activeConversationId } = useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(getConversations());
    }, [dispatch]);
return (
    <Container maxWidth="xl" sx={{ height: 'calc(100vh - 120px)', p: 2 }}>
        <Paper sx={{ height: '100%', display: 'flex' }}>
            <Grid container sx={{ height: '100%' }}>
                <Grid item xs={12} sm={4} sx={{ borderRight: '1px solid', borderColor: 'divider', height: '100%' }}>
                    <ConversationList /> 
                </Grid>
                <Grid item xs={12} sm={8} sx={{ height: '100%' }}>
                    {activeConversationId ? (
                        <ChatWindow />
                    ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h6" color="text.secondary">
                                Select a conversation to start chatting
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Paper>
    </Container>
    );
};
export default ChatPage;