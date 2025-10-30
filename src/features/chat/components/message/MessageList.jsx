import { useEffect, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import MessageBubble from './MessageBubble.jsx';
import DateSeparator from '../shared/DateSeparator.jsx';
import TypingIndicator from '../shared/TypingIndicator.jsx';
import ChatSkeleton from '../shared/ChatSkeleton.jsx';
import { groupMessagesByDate, addMessageGrouping } from '../../utils/messageFormatters.js';

const MessageList = ({ conversationId, isTyping, typingUserName }) => {
    const messagesEndRef = useRef(null);
    const { user } = useSelector((state) => state.auth);
    const { messages, status } = useSelector((state) => state.chat);
    
    const messageList = conversationId ? messages[conversationId] || [] : [];
    
    // Group messages by date
    const groupedMessages = groupMessagesByDate(messageList);
    
    // Auto-scroll to bottom
    useEffect(() => {
        const behavior = messageList.length > 1 ? 'smooth' : 'auto';
        messagesEndRef.current?.scrollIntoView({ behavior });
    }, [messageList, isTyping]);
    
    if (status.getMessages === 'loading') {
        return <ChatSkeleton variant="messages" />;
    }
    
    if (status.getMessages === 'failed') {
        return (
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    p: 3,
                }}
            >
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress color="error" size={40} sx={{ mb: 2 }} />
                    <Box sx={{ color: 'error.main' }}>
                        Failed to load messages. Please try again.
                    </Box>
                </Box>
            </Box>
        );
    }
    
    return (
        <Box
            sx={{
                flexGrow: 1,
                overflowY: 'auto',
                overflowX: 'hidden',
                py: 2,
                background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(to bottom, #141414 0%, #0d0d0d 100%)'
                    : 'linear-gradient(to bottom, #fafafa 0%, #f0f0f0 100%)',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '20px',
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.2), transparent)'
                        : 'linear-gradient(to bottom, rgba(0, 0, 0, 0.04), transparent)',
                    pointerEvents: 'none',
                    zIndex: 1,
                },
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    bgcolor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.2)' 
                        : 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                    border: '2px solid transparent',
                    backgroundClip: 'padding-box',
                    '&:hover': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.3)' 
                            : 'rgba(0, 0, 0, 0.3)',
                    },
                },
            }}
        >
            {groupedMessages.map((group) => {
                // Add grouping metadata to messages in this date group
                const groupedMsgs = addMessageGrouping(group.messages);
                
                return (
                    <Box key={group.date}>
                        <DateSeparator date={group.dateObj} />
                        
                        {groupedMsgs.map((msg) => {
                            const isSender = msg.sender._id === user._id;
                            
                            return (
                                <MessageBubble
                                    key={msg._id || msg.tempId}
                                    message={msg}
                                    isSender={isSender}
                                    showAvatar={msg.showAvatar}
                                    showTimestamp={msg.showTimestamp}
                                    isFirstInGroup={msg.isFirstInGroup}
                                    isLastInGroup={msg.isLastInGroup}
                                />
                            );
                        })}
                    </Box>
                );
            })}
            
            {/* Typing Indicator */}
            {isTyping && typingUserName && (
                <TypingIndicator userName={typingUserName} />
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
        </Box>
    );
};

export default MessageList;
