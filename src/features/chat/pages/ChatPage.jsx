import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Paper, Box, Typography, Stack } from '@mui/material';
// framer-motion was imported previously but not used in this module
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

import { getConversations, selectActiveConversation } from '../chatSlice.js';
import ConversationList from '../components/conversation/ConversationList.jsx';
import ChatWindow from '../components/ChatWindow.jsx';
import EmptyState from '../components/shared/EmptyState.jsx';

const ChatPage = () => {
    const dispatch = useDispatch();
    const activeConversation = useSelector(selectActiveConversation);

    useEffect(() => {
        dispatch(getConversations());
    }, [dispatch]);

    return (
        <Container 
            maxWidth="xl" 
            sx={{ 
                height: { xs: 'calc(100vh - 70px)', sm: 'calc(100vh - 80px)', md: 'calc(100vh - 100px)' },
                py: { xs: 1.5, sm: 2, md: 3 },
                px: { xs: 1, sm: 2, md: 3 },
            }}
        >
            <Paper 
                elevation={4}
                sx={{ 
                    height: '100%', 
                    display: 'flex',
                    borderRadius: { xs: 2, sm: 3 },
                    overflow: 'hidden',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1)'
                        : '0 10px 40px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? '#1a1a1a' 
                        : '#ffffff',
                }}
            >
                {/* Sidebar */}
                <Box
                    sx={{
                        flex: { xs: '1 1 100%', md: '0 0 35%', lg: '0 0 30%' },
                        borderRight: { md: '1px solid' },
                        borderColor: (theme) => theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.12)' 
                            : 'rgba(0, 0, 0, 0.12)',
                        height: '100%',
                        display: { xs: activeConversation ? 'none' : 'block', md: 'block' },
                        transition: 'all 0.3s ease',
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                            ? '#121212' 
                            : '#f8f9fa',
                    }}
                >
                    <ConversationList />
                </Box>

                {/* Chat Window */}
                <Box
                    sx={{
                        flex: { xs: '1 1 100%', md: '0 0 65%', lg: '0 0 70%' },
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                            ? '#1e1e1e' 
                            : '#ffffff',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {activeConversation ? (
                        <ChatWindow />
                    ) : (
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                p: 3,
                            }}
                        >
                            <EmptyState
                                icon={ChatBubbleOutlineIcon}
                                title="Select a Conversation"
                                subtitle="Choose a conversation from the sidebar to start chatting"
                            />
                        </Box>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default ChatPage;
