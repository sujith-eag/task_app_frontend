import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    List, ListItemButton, ListItemAvatar, Avatar,
    ListItemText, Typography, Box, TextField, InputAdornment,
    IconButton, Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

import profileService from '../../../profile/profileService.js';
import { getMessages, 
    setActiveConversationId, 
    startConversation, 
    selectAllConversations } from '../../chatSlice.js';
import ConversationItem from './ConversationItem.jsx';
import EmptyState from '../shared/EmptyState.jsx';
import ChatSkeleton from '../shared/ChatSkeleton.jsx';
import { conversationListVariants, conversationItemStagger } from '../../utils/chatAnimations.js';

const ConversationList = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const conversations = useSelector(selectAllConversations);
    const { status, activeConversationId } = useSelector((state) => state.chat);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleConversationClick = (conversationId) => {
        dispatch(setActiveConversationId(conversationId));
        dispatch(getMessages(conversationId));
    };

    const handleStartConversation = (recipientId) => {
        dispatch(startConversation(recipientId));
        setSearchTerm('');
        setSearchResults([]);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
    };

    // Debounced search effect
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        
        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const users = await profileService.getDiscoverableUsers(user.token);
                setSearchResults(
                    users.filter((u) =>
                        u.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
            } catch (err) {
                toast.error('Failed to search for users.');
            }
            setIsSearching(false);
        }, 500);
        
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, user.token]);

    return (
        <Box 
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
            }}
        >
            {/* Header */}
            <Paper
                elevation={2}
                sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 0,
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'linear-gradient(180deg, #1a1a1a 0%, #141414 100%)'
                        : 'linear-gradient(180deg, #ffffff 0%, #f5f5f5 100%)',
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
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: { xs: '1.1rem', sm: '1.25rem' },
                        background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: 0.5,
                    }}
                >
                    Messages
                </Typography>
                
                {/* Search Bar */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: (theme) => theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.08)' 
                                : 'rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.2s ease',
                            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                            '& fieldset': {
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.15)' 
                                    : 'rgba(0, 0, 0, 0.12)',
                            },
                            '&:hover': {
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.12)' 
                                    : 'rgba(0, 0, 0, 0.06)',
                                '& fieldset': {
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.25)' 
                                        : 'rgba(0, 0, 0, 0.2)',
                                },
                            },
                            '&.Mui-focused': {
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.12)' 
                                    : 'rgba(0, 0, 0, 0.06)',
                                boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' 
                                    ? 'rgba(33, 150, 243, 0.25)' 
                                    : 'rgba(33, 150, 243, 0.2)'}`,
                                '& fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        },
                    }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color={searchTerm ? 'primary' : 'action'} />
                                </InputAdornment>
                            ),
                            endAdornment: searchTerm && (
                                <InputAdornment position="end">
                                    <IconButton 
                                        size="small" 
                                        onClick={handleClearSearch}
                                        sx={{ 
                                            transition: 'all 0.2s ease',
                                            '&:hover': { 
                                                transform: 'rotate(90deg)',
                                                bgcolor: 'action.hover',
                                            } 
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </Paper>

            {/* Content Area */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto', position: 'relative' }}>
                <AnimatePresence mode="wait">
                    {/* Search Results */}
                    {searchTerm && (
                        <motion.div
                            key="search-results"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Box sx={{ p: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ px: 1, mb: 1, display: 'block' }}>
                                    {isSearching ? 'Searching...' : `${searchResults.length} user(s) found`}
                                </Typography>
                                
                                {isSearching ? (
                                    <ChatSkeleton variant="conversation" />
                                ) : searchResults.length > 0 ? (
                                    <List sx={{ p: 0 }}>
                                        {searchResults.map((foundUser) => (
                                            <ListItemButton
                                                key={foundUser._id}
                                                onClick={() => handleStartConversation(foundUser._id)}
                                                sx={{
                                                    borderRadius: 2,
                                                    mb: 0.5,
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        transform: 'translateX(4px)',
                                                        bgcolor: 'action.hover',
                                                    },
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar src={foundUser.avatar} alt={foundUser.name} />
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={foundUser.name}
                                                    secondary="Start new conversation"
                                                    primaryTypographyProps={{ fontWeight: 600 }}
                                                    secondaryTypographyProps={{ fontSize: '0.8rem' }}
                                                />
                                            </ListItemButton>
                                        ))}
                                    </List>
                                ) : (
                                    <EmptyState
                                        icon={PeopleAltIcon}
                                        title="No Users Found"
                                        subtitle={`No users match "${searchTerm}"`}
                                    />
                                )}
                            </Box>
                        </motion.div>
                    )}

                    {/* Conversation List */}
                    {!searchTerm && (
                        <motion.div
                            key="conversation-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {status.getConversations === 'loading' ? (
                                <ChatSkeleton variant="conversation" />
                            ) : status.getConversations === 'failed' ? (
                                <Box sx={{ p: 2 }}>
                                    <Typography color="error" align="center">
                                        Failed to load conversations. Please try again.
                                    </Typography>
                                </Box>
                            ) : conversations.length === 0 ? (
                                <EmptyState
                                    title="No Conversations Yet"
                                    subtitle="Start a conversation by searching for users above"
                                />
                            ) : (
                                <Box
                                    component={motion.div}
                                    variants={conversationListVariants}
                                    initial="hidden"
                                    animate="visible"
                                    sx={{ py: 1 }}
                                >
                                    {conversations.map((convo) => (
                                        <motion.div
                                            key={convo._id}
                                            variants={conversationItemStagger}
                                        >
                                            <ConversationItem
                                                conversation={convo}
                                                isActive={activeConversationId === convo._id}
                                                onClick={() => handleConversationClick(convo._id)}
                                            />
                                        </motion.div>
                                    ))}
                                </Box>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default ConversationList;
