import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box, Stack, Paper, TextField, IconButton, Avatar, Typography,
    List, ListItem, ListItemText, Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSocket } from '../../../context/SocketContext';
import { addMessage } from '../chatSlice';

const ChatWindow = () => {
    const dispatch = useDispatch();
    const socket = useSocket(); // Get the socket instance from our context
    const messagesEndRef = useRef(null); // Ref for auto-scrolling

    const [newMessage, setNewMessage] = useState('');

    const { user } = useSelector((state) => state.auth);
    const { conversations, messages, activeConversationId } = useSelector((state) => state.chat);

    // --- Derive data for the active chat ---
    const activeConversation = conversations.find(c => c._id === activeConversationId);
    const otherParticipant = activeConversation?.participants.find(p => p._id !== user._id);
    const messageList = messages[activeConversationId] || [];

    // --- Effect for auto-scrolling to the latest message ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !socket || !otherParticipant) return;

        const messageData = {
            sender: { _id: user._id, name: user.name, avatar: user.avatar },
            content: newMessage,
            conversation: activeConversationId,
            createdAt: new Date().toISOString(), // Temporary timestamp
        };

        // --- Optimistic UI Update ---
        // Add the message to our own UI immediately without waiting for the server.
        dispatch(addMessage(messageData));

        // --- Emit the message to the server ---
        socket.emit('sendMessage', {
            recipientId: otherParticipant._id,
            content: newMessage,
        });

        setNewMessage('');
    };
    
    if (!activeConversation || !otherParticipant) {
        // This can be a more elegant placeholder component
        return <Box />;
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
                <List>
                    {messageList.map((msg, index) => {
                        const isSender = msg.sender._id === user._id;
                        return (
                            <ListItem key={index} sx={{ justifyContent: isSender ? 'flex-end' : 'flex-start' }}>
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
                                    <ListItemText primary={msg.content} />
                                </Paper>
                            </ListItem>
                        );
                    })}
                    {/* Empty div to which we will scroll */}
                    <div ref={messagesEndRef} />
                </List>
            </Box>
            <Divider />

            {/* --- Message Input Form --- */}
            <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{ p: 2, flexShrink: 0, bgcolor: 'background.default' }}
            >
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