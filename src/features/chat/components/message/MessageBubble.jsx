import { Box, Paper, Avatar, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { formatMessageTime } from '../../utils/dateHelpers.js';
import { messageBubbleVariants } from '../../utils/chatAnimations.js';

const MessageBubble = ({ message, isSender, showAvatar, showTimestamp, isFirstInGroup, isLastInGroup }) => {
    const sanitizedContent = DOMPurify.sanitize(message.content);
    
    // Status icon component
    const StatusIcon = () => {
        if (!isSender) return null;
        
        const iconSx = {
            fontSize: 14,
            ml: 0.5,
        };
        
        switch (message.status) {
            case 'sending':
                return <ScheduleIcon sx={{ ...iconSx, color: 'rgba(255,255,255,0.7)' }} />;
            case 'sent':
                return <DoneIcon sx={{ ...iconSx, color: 'rgba(255,255,255,0.9)' }} />;
            case 'delivered':
                return <DoneAllIcon sx={{ ...iconSx, color: 'rgba(255,255,255,0.9)' }} />;
            case 'read':
                return <DoneAllIcon sx={{ ...iconSx, color: '#4fc3f7' }} />;
            default:
                return null;
        }
    };
    
    return (
        <Box
            component={motion.div}
            variants={messageBubbleVariants}
            initial="hidden"
            animate="visible"
            sx={{
                display: 'flex',
                justifyContent: isSender ? 'flex-end' : 'flex-start',
                mb: isLastInGroup ? 1.5 : 0.3,
                px: { xs: 1.5, sm: 2 },
                opacity: message.status === 'sending' ? 0.7 : 1,
            }}
        >
            {/* Avatar for received messages (only on last message in group) */}
            {!isSender && showAvatar && (
                <Avatar
                    src={message.sender.avatar}
                    alt={message.sender.name}
                    sx={{
                        width: { xs: 28, sm: 32 },
                        height: { xs: 28, sm: 32 },
                        mr: 1,
                        alignSelf: 'flex-end',
                        boxShadow: 1,
                    }}
                />
            )}
            
            {/* Spacer for grouped messages without avatar */}
            {!isSender && !showAvatar && <Box sx={{ width: { xs: 28, sm: 32 }, mr: 1 }} />}
            
            <Box sx={{ maxWidth: { xs: '80%', sm: '75%', md: '65%' } }}>
                {/* Sender name (only for first message in group, received messages only) */}
                {!isSender && isFirstInGroup && (
                    <Typography
                        variant="caption"
                        sx={{
                            color: 'text.secondary',
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            ml: 1.5,
                            mb: 0.3,
                            display: 'block',
                        }}
                    >
                        {message.sender.name}
                    </Typography>
                )}
                
                <Paper
                    elevation={isSender ? 2 : 1}
                    sx={{
                        p: { xs: 1.2, sm: 1.5 },
                        px: { xs: 1.5, sm: 2 },
                            background: isSender
                                ? (theme) => theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)'
                                    : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
                                : (theme) => theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.08) 100%)'
                                    : 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                            color: isSender ? 'white' : 'text.primary',
                            borderRadius: 2.5,
                            borderTopRightRadius: isSender && isFirstInGroup ? 0.5 : 2.5,
                            borderTopLeftRadius: !isSender && isFirstInGroup ? 0.5 : 2.5,
                            borderBottomRightRadius: isSender && isLastInGroup ? 0.5 : 2.5,
                            borderBottomLeftRadius: !isSender && isLastInGroup ? 0.5 : 2.5,
                            border: isSender 
                                ? 'none'
                                : (theme) => theme.palette.mode === 'dark' 
                                    ? '1px solid rgba(255, 255, 255, 0.15)' 
                                    : '1px solid rgba(0, 0, 0, 0.08)',
                            boxShadow: isSender 
                                ? (theme) => theme.palette.mode === 'dark'
                                    ? '0 3px 10px rgba(33, 150, 243, 0.4), 0 1px 3px rgba(0, 0, 0, 0.3)'
                                    : '0 3px 10px rgba(33, 150, 243, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)'
                                : (theme) => theme.palette.mode === 'dark'
                                    ? '0 2px 6px rgba(0, 0, 0, 0.4)'
                                    : '0 2px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                boxShadow: isSender 
                                    ? (theme) => theme.palette.mode === 'dark'
                                        ? '0 5px 15px rgba(33, 150, 243, 0.5), 0 2px 5px rgba(0, 0, 0, 0.4)'
                                        : '0 5px 15px rgba(33, 150, 243, 0.4), 0 2px 5px rgba(0, 0, 0, 0.15)'
                                    : (theme) => theme.palette.mode === 'dark'
                                        ? '0 4px 10px rgba(0, 0, 0, 0.5)'
                                        : '0 4px 10px rgba(0, 0, 0, 0.15)',
                                transform: 'translateY(-1px)',
                            },
                        }}
                    >
                        {/* Message content */}
                        <Typography
                            variant="body2"
                            sx={{
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                fontSize: { xs: '0.875rem', sm: '0.925rem' },
                                lineHeight: 1.5,
                                letterSpacing: 0.2,
                            }}
                            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                        />
                        
                        {/* Timestamp and status (only on last message in group) */}
                        {showTimestamp && (
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                                sx={{
                                    mt: 0.5,
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{
                                        fontSize: '0.65rem',
                                        color: isSender ? 'rgba(255,255,255,0.85)' : 'text.secondary',
                                        fontWeight: 500,
                                    }}
                                >
                                    {formatMessageTime(message.createdAt)}
                                </Typography>
                                <StatusIcon />
                            </Stack>
                        )}
                    </Paper>
            </Box>
            
            {/* Spacer for sent messages */}
            {isSender && <Box sx={{ width: { xs: 0, sm: 32 } }} />}
        </Box>
    );
};

export default MessageBubble;
