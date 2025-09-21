import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Stack, Paper, TextField, IconButton, Avatar, Typography,
    List, ListItem, ListItemText, Divider, CircularProgress
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '../../../context/SocketContext.jsx';
import { addOptimisticMessage, 
        reconcileMessage,
        selectActiveConversation } from '../chatSlice.js';

const ChatWindow = () => {
    const dispatch = useDispatch();
    const socket = useSocket();
    const messagesEndRef = useRef(null);
    const [newMessage, setNewMessage] = useState('');

    const { user } = useSelector((state) => state.auth);

    const activeConversation = useSelector(selectActiveConversation);
    const { messages, status } = useSelector((state) => state.chat);

    // --- Derive data from the active conversation object ---
    const otherParticipant = activeConversation?.participants.find(p => p._id !== user._id);
    const messageList = activeConversation ? messages[activeConversation._id] || [] : [];

    // Auto-scrolling effect
    useEffect(() => {
		// Scroll instantly on initial load, smoothly for new messages
        const behavior = messageList.length > 1 ? 'smooth' : 'auto';
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, [messageList]);

    useEffect(() => {
        if (socket && activeConversation) {
            // Find the last message that was not sent by the current user
            const lastReceivedMessage = messageList.slice().reverse().find(msg => msg.sender._id !== user._id);

            // If the last received message is not yet read, emit the event
            if (lastReceivedMessage && lastReceivedMessage.status !== 'read') {
                socket.emit('messagesRead', { 
                    conversationId: activeConversation._id,
                    readerId: user._id 
                });
            }
        }
    }, [socket, activeConversation, messageList, user._id]);
    
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !otherParticipant) return;

        // Create an optimistic message with a temporary ID and 'sending' status
        const optimisticMessage = {
            tempId: uuidv4(),
            sender: { _id: user._id, name: user.name, avatar: user.avatar },
            content: newMessage,
            conversation: activeConversation._id, // <-- FIX: Use the ID from the object
            createdAt: new Date().toISOString(),
            status: 'sending',
        };

        // Immediately add the optimistic message to the UI
        dispatch(addOptimisticMessage(optimisticMessage));


        // Emit the message to the server with an acknowledgment callback
        socket.emit('sendMessage', 
            { 
                recipientId: otherParticipant._id, 
                content: newMessage,
                tempId: optimisticMessage.tempId
            },  
            (ack) => {
                if (ack.success) {
                    // When the server confirms, reconcile the message in the state
                    // ack.message will have the tempId back from the server
                    dispatch(reconcileMessage(ack.message));
                } else {
                    toast.error('Message failed to send.');
                    // You could add logic here to update the message status to 'failed'
                }
            }
        );
        setNewMessage('');
    };
    
    if (!activeConversation || !otherParticipant) {
        return <Box />; // Safety check
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* --- Chat Header --- */}
            <Paper elevation={2} sx={{ flexShrink: 0 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
                    <Avatar src={otherParticipant.avatar} />
                    <Typography variant="h6">{otherParticipant.name}</Typography>
                </Stack>
            </Paper>
            <Divider />

            {/* --- Message List --- */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
    {status.getMessages === 'loading' ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
        </Box>
            ) : (
                <List>
                    {messageList.map((msg) => {
                        const isSender = msg.sender._id === user._id;
                        return (
                            <ListItem 
                                key={msg._id || msg.tempId} 
                                sx={{ 
                                    justifyContent: isSender ? 'flex-end' : 'flex-start',
                                    opacity: msg.status === 'sending' ? 0.7 : 1,
                                }}
                            >
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 1.5,
                                        bgcolor: isSender ? 'primary.main' : 'background.default',
                                        color: isSender ? 'primary.contrastText' : 'text.primary',
                                        borderRadius: 4,
                                        borderTopRightRadius: isSender ? 0 : 4,
                                        borderTopLeftRadius: isSender ? 4 : 0,
                                    }}
                                >
		                            {/* Sanitize content before rendering */}
                                    <ListItemText 
                                        primary={<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(msg.content) }} />} 
                                    />
                                </Paper>
                            </ListItem>
                        );
                    })}
                    {/* Empty div to which we will scroll */}
                    <div ref={messagesEndRef} />
                </List>
            )}
            </Box>

            <Divider />

            {/* --- Message Input Form --- */}
            <Box component="form" onSubmit={handleSendMessage} 
	            sx={{ p: 2, flexShrink: 0, bgcolor: 'background.default' }}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <IconButton type="submit" color="primary" disabled={!newMessage.trim()}>
                        <SendIcon />
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
};

export default ChatWindow;