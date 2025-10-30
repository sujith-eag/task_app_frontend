import { ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, Box, Badge, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { formatConversationTime } from '../../utils/dateHelpers.js';
import { truncateMessage } from '../../utils/messageFormatters.js';
import { conversationItemVariants, badgeVariants, onlineIndicatorVariants } from '../../utils/chatAnimations.js';

const ConversationItem = ({ conversation, isActive, onClick }) => {
    const { user } = useSelector((state) => state.auth);
    const { onlineUsers } = useSelector((state) => state.chat);
    
    // Find the other participant
    const otherParticipant = conversation.participants.find(p => p._id !== user._id);
    
    if (!otherParticipant) return null;
    
    // Check if user is online
    const isOnline = onlineUsers.includes(otherParticipant._id);
    
    // Get last message info
    const lastMessage = conversation.lastMessage;
    const lastMessageText = lastMessage ? truncateMessage(lastMessage.content, 40) : 'No messages yet';
    const timestamp = lastMessage ? formatConversationTime(lastMessage.createdAt) : '';
    
    // Calculate unread count (this would come from backend in real app)
    const unreadCount = 0; // TODO: Get from conversation data when backend provides it
    
    return (
        <ListItemButton
            component={motion.div}
            variants={conversationItemVariants}
            whileHover="hover"
            selected={isActive}
            onClick={onClick}
            sx={{
                py: { xs: 1.3, sm: 1.5 },
                px: { xs: 1.5, sm: 2 },
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                transition: 'all 0.2s ease',
                background: isActive
                    ? (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(21, 101, 192, 0.15) 100%)'
                        : 'linear-gradient(135deg, rgba(33, 150, 243, 0.12) 0%, rgba(21, 101, 192, 0.08) 100%)'
                    : (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.02)'
                        : 'rgba(0, 0, 0, 0.02)',
                borderLeft: '4px solid',
                borderColor: isActive ? 'primary.main' : 'transparent',
                boxShadow: isActive 
                    ? (theme) => theme.palette.mode === 'dark'
                        ? '0 2px 8px rgba(33, 150, 243, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                        : '0 2px 8px rgba(33, 150, 243, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)'
                    : 'none',
                '&:hover': {
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.08)' 
                        : 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateX(4px)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                        : '0 2px 8px rgba(0, 0, 0, 0.08)',
                },
            }}
        >
            <ListItemAvatar>
                <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        isOnline && (
                            <Box
                                component={motion.div}
                                variants={onlineIndicatorVariants}
                                animate="pulse"
                                sx={{
                                    width: 10,
                                    height: 10,
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
                            width: { xs: 42, sm: 46 }, 
                            height: { xs: 42, sm: 46 },
                            border: '1px solid',
                            borderColor: (theme) => theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.1)' 
                                : 'rgba(0, 0, 0, 0.08)',
                        }}
                    />
                </Badge>
            </ListItemAvatar>
            
            <ListItemText
                primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.3 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: unreadCount > 0 ? 700 : 600,
                                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                color: 'text.primary',
                            }}
                        >
                            {otherParticipant.name}
                        </Typography>
                        
                        {timestamp && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: isActive ? 'primary.main' : 'text.secondary',
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    fontWeight: unreadCount > 0 ? 600 : 400,
                                    ml: 1,
                                    flexShrink: 0,
                                }}
                            >
                                {timestamp}
                            </Typography>
                        )}
                    </Box>
                }
                secondary={
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography
                            component="span"
                            variant="body2"
                            sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.8rem', sm: '0.85rem' },
                                fontWeight: unreadCount > 0 ? 500 : 400,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                pr: 1,
                            }}
                        >
                            {lastMessageText}
                        </Typography>
                        
                        {unreadCount > 0 && (
                            <Chip
                                component={motion.div}
                                variants={badgeVariants}
                                initial="hidden"
                                animate="visible"
                                label={unreadCount}
                                size="small"
                                color="primary"
                                sx={{
                                    height: 20,
                                    minWidth: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    '& .MuiChip-label': {
                                        px: 0.75,
                                    },
                                }}
                            />
                        )}
                    </Box>
                }
                sx={{ m: 0 }}
            />
        </ListItemButton>
    );
};

export default ConversationItem;
