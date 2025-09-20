import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    List, ListItem, ListItemButton, ListItemAvatar, Avatar,
    ListItemText, Typography, Box, CircularProgress, Alert
} from '@mui/material';
import { setActiveConversation } from '../chatSlice';

const ConversationList = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { conversations, status, error, activeConversationId } = useSelector((state) => state.chat);

    const handleConversationClick = (conversationId) => {
        dispatch(setActiveConversation(conversationId));
    };

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (status === 'failed') {
        return <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>;
    }
    
    if (status === 'succeeded' && conversations.length === 0) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography color="text.secondary">You have no conversations yet.</Typography>
            </Box>
        );
    }

    return (
        <List sx={{ height: '100%', overflowY: 'auto', p: 0 }}>
            {conversations.map((convo) => {
                // Find the other participant in the conversation
                const otherParticipant = convo.participants.find(p => p._id !== user._id);
                
                // A safeguard in case data is malformed
                if (!otherParticipant) return null;

                return (
                    <ListItem key={convo._id} disablePadding>
                        <ListItemButton
                            selected={activeConversationId === convo._id}
                            onClick={() => handleConversationClick(convo._id)}
                        >
                            <ListItemAvatar>
                                <Avatar src={otherParticipant.avatar} />
                            </ListItemAvatar>
                            <ListItemText 
                                primary={otherParticipant.name} 
                                // We can add a preview of the last message here in the future
                                // secondary="Last message..." 
                            />
                        </ListItemButton>
                    </ListItem>
                );
            })}
        </List>
    );
};

export default ConversationList;