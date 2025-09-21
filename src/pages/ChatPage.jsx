import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Paper, Box, Typography } from '@mui/material';
import { getConversations, selectActiveConversation } from '../features/chat/chatSlice.js';
import ConversationList from '../features/chat/components/ConversationList.jsx';
import ChatWindow from '../features/chat/components/ChatWindow.jsx';

const ChatPage = () => {
    const dispatch = useDispatch();
    const activeConversation = useSelector(selectActiveConversation);

    useEffect(() => {
        dispatch(getConversations());
    }, [dispatch]);

    return (
        <Container maxWidth="xl" sx={{ height: 'calc(100vh - 120px)', p: 2 }}>
            <Paper sx={{ height: '100%', display: 'flex' }}>
                {/* Sidebar */}
                <Box
                    sx={{
                        flex: { xs: '1 1 100%', md: '0 0 33.33%' },
                        borderRight: { md: '1px solid' },
                        borderColor: 'divider',
                        height: '100%',
                        display: { xs: activeConversation ? 'none' : 'block', md: 'block' },
                    }}
                >
                    <ConversationList />
                </Box>

                {/* Chat Window */}
                <Box
                    sx={{
                        flex: { xs: '1 1 100%', md: '0 0 66.66%' },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {activeConversation ? (
                        <ChatWindow />
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                Select a conversation to start chatting
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ChatPage;
