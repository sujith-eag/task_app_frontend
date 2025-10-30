import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Stack, Paper, IconButton, Avatar, Typography, Badge, Chip } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircleIcon from '@mui/icons-material/Circle';

import { useSocket } from '../../../context/SocketContext.jsx';
import { addOptimisticMessage, 
        reconcileMessage,
        selectActiveConversation,
        clearActiveConversation } from '../chatSlice.js';
import MessageList from './message/MessageList.jsx';
import MessageInput from './message/MessageInput.jsx';

const ChatWindow = () => {
    const dispatch = useDispatch();
    const { socket } = useSocket();
    const { user } = useSelector((state) => state.auth);
    const { onlineUsers } = useSelector((state) => state.chat);
    const activeConversation = useSelector(selectActiveConversation);
    
    const [isTyping, setIsTyping] = useState(false);
    const [typingTimeout, setTypingTimeout] = useState(null);

    // Derive data from the active conversation object
    const otherParticipant = activeConversation?.participants.find(p => p._id !== user._id);
    const isOnline = otherParticipant ? onlineUsers.includes(otherParticipant._id) : false;

    // Listen for typing events
    useEffect(() => {
        if (!socket || !activeConversation) return;

        const handleTyping = ({ conversationId, from }) => {
            if (conversationId === activeConversation._id && from !== user._id) {
                setIsTyping(true);
                
                // Clear any existing timeout
                if (typingTimeout) clearTimeout(typingTimeout);
                
                // Set new timeout to stop typing indicator
                const timeout = setTimeout(() => {
                    setIsTyping(false);
                }, 3000);
                
                setTypingTimeout(timeout);
            }
        };

        const handleStopTyping = ({ conversationId, from }) => {
            if (conversationId === activeConversation._id && from !== user._id) {
                setIsTyping(false);
                if (typingTimeout) clearTimeout(typingTimeout);
            }
        };

        socket.on('typing', handleTyping);
        socket.on('stopTyping', handleStopTyping);

        return () => {
            socket.off('typing', handleTyping);
            socket.off('stopTyping', handleStopTyping);
            if (typingTimeout) clearTimeout(typingTimeout);
        };
    }, [socket, activeConversation, user._id, typingTimeout]);

    const handleBackClick = () => {
        dispatch(clearActiveConversation());
    };

    const handleTypingStart = () => {
        if (socket && otherParticipant && activeConversation) {
            socket.emit('startTyping', {
                recipientId: otherParticipant._id,
                conversationId: activeConversation._id,
            });
        }
    };

    const handleTypingStop = () => {
        if (socket && otherParticipant && activeConversation) {
            socket.emit('stopTyping', {
                recipientId: otherParticipant._id,
                conversationId: activeConversation._id,
            });
        }
    };

    const handleSendMessage = (content) => {
        if (!socket || !otherParticipant) {
            toast.error('Unable to send message. Please try again.');
            return;
        }

        // Create an optimistic message with a temporary ID and 'sending' status
        const optimisticMessage = {
            tempId: uuidv4(),
            sender: { _id: user._id, name: user.name, avatar: user.avatar },
            content,
            conversation: activeConversation._id,
            createdAt: new Date().toISOString(),
            status: 'sending',
        };

        // Immediately add the optimistic message to the UI
        dispatch(addOptimisticMessage(optimisticMessage));

        // Emit the message to the server with an acknowledgment callback
        socket.emit('sendMessage', 
            { 
                recipientId: otherParticipant._id, 
                content,
                tempId: optimisticMessage.tempId
            },  
            (ack) => {
                if (ack.success) {
                    // When the server confirms, reconcile the message in the state
                    dispatch(reconcileMessage(ack.message));
                } else {
                    toast.error('Message failed to send.');
                    // You could add logic here to update the message status to 'failed'
                }
            }
        );
    };

    if (!activeConversation || !otherParticipant) {
        return <Box />; // Safety check
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Premium Header */}
            <Paper
                elevation={3}
                sx={{
                    flexShrink: 0,
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(180deg, #1e1e1e 0%, #1a1a1a 100%)'
                        : 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
                    borderBottom: '2px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(33, 150, 243, 0.3)' 
                        : 'rgba(33, 150, 243, 0.2)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 4px 12px rgba(0, 0, 0, 0.5)'
                        : '0 2px 8px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    zIndex: 10,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: { xs: 1.5, sm: 2 } }}>
                    {/* Back Button (Mobile only) */}
                    <IconButton
                        onClick={handleBackClick}
                        size="small"
                        sx={{ 
                            display: { xs: 'inline-flex', md: 'none' },
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateX(-2px)',
                                bgcolor: 'action.hover',
                            }
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>

                    {/* Avatar with Online Status */}
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            isOnline && (
                                <Box
                                    sx={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: '50%',
                                        bgcolor: 'success.main',
                                        border: '2px solid',
                                        borderColor: 'background.paper',
                                        boxShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)',
                                    }}
                                />
                            )
                        }
                    >
                        <Avatar 
                            src={otherParticipant.avatar}
                            alt={otherParticipant.name}
                            sx={{ 
                                width: { xs: 40, sm: 44 }, 
                                height: { xs: 40, sm: 44 },
                                border: '2px solid',
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.1)' 
                                    : 'rgba(0, 0, 0, 0.08)',
                                boxShadow: 1,
                            }}
                        />
                    </Badge>

                    {/* User Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '0.95rem', sm: '1.1rem' },
                                color: 'text.primary',
                                letterSpacing: 0.2,
                            }}
                        >
                            {otherParticipant.name}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            {isOnline ? (
                                <>
                                    <CircleIcon sx={{ fontSize: 8, color: 'success.main' }} />
                                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, fontSize: '0.7rem' }}>
                                        Online
                                    </Typography>
                                </>
                            ) : (
                                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                    Offline
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </Stack>
            </Paper>

            {/* Message List */}
            <MessageList
                conversationId={activeConversation._id}
                isTyping={isTyping}
                typingUserName={otherParticipant.name}
            />

            {/* Message Input */}
            <MessageInput
                onSendMessage={handleSendMessage}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
                disabled={!socket}
            />
        </Box>
    );
};

export default ChatWindow;
