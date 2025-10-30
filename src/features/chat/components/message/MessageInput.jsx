import { useState, useCallback } from 'react';
import { Box, TextField, IconButton, Paper, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import { sendButtonVariants } from '../../utils/chatAnimations.js';

const MessageInput = ({ onSendMessage, onTypingStart, onTypingStop, disabled = false }) => {
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    // Debounced typing indicator
    let typingTimeout = null;
    
    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setNewMessage(value);
        
        // Start typing indicator
        if (!isTyping && value.trim()) {
            setIsTyping(true);
            onTypingStart?.();
        }
        
        // Reset typing timeout
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            setIsTyping(false);
            onTypingStop?.();
        }, 2000);
    }, [isTyping, onTypingStart, onTypingStop]);
    
    const handleSendMessage = (e) => {
        e.preventDefault();
        
        if (!newMessage.trim() || disabled) return;
        
        onSendMessage(newMessage);
        setNewMessage('');
        setIsTyping(false);
        onTypingStop?.();
        
        // Clear typing timeout
        clearTimeout(typingTimeout);
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };
    
    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 1.5, sm: 2 },
                bgcolor: 'background.paper',
                borderTop: '2px solid',
                borderColor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(0, 0, 0, 0.08)',
                background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)'
                    : 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? '0 -4px 12px rgba(0, 0, 0, 0.5)'
                    : '0 -2px 8px rgba(0, 0, 0, 0.08)',
                position: 'relative',
                zIndex: 10,
            }}
        >
            <Box
                component="form"
                onSubmit={handleSendMessage}
                sx={{ display: 'flex', gap: { xs: 1, sm: 1.5 }, alignItems: 'flex-end' }}
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    variant="outlined"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    disabled={disabled}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            bgcolor: (theme) => theme.palette.mode === 'dark' 
                                ? 'rgba(255, 255, 255, 0.08)' 
                                : '#ffffff',
                            transition: 'all 0.2s ease',
                            boxShadow: (theme) => theme.palette.mode === 'dark'
                                ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                                : 'inset 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(255, 255, 255, 0.8)',
                            '& fieldset': {
                                borderColor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.15)' 
                                    : 'rgba(0, 0, 0, 0.12)',
                            },
                            '&:hover': {
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.12)' 
                                    : '#ffffff',
                                boxShadow: (theme) => theme.palette.mode === 'dark'
                                    ? '0 2px 8px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                                    : '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 3px rgba(0, 0, 0, 0.08)',
                                '& fieldset': {
                                    borderColor: (theme) => theme.palette.mode === 'dark' 
                                        ? 'rgba(255, 255, 255, 0.25)' 
                                        : 'rgba(0, 0, 0, 0.2)',
                                },
                            },
                            '&.Mui-focused': {
                                bgcolor: (theme) => theme.palette.mode === 'dark' 
                                    ? 'rgba(255, 255, 255, 0.12)' 
                                    : '#ffffff',
                                boxShadow: (theme) => `0 0 0 3px ${theme.palette.mode === 'dark' 
                                    ? 'rgba(33, 150, 243, 0.25)' 
                                    : 'rgba(33, 150, 243, 0.2)'}, ${theme.palette.mode === 'dark'
                                        ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                                        : 'inset 0 1px 3px rgba(0, 0, 0, 0.08)'}`,
                                '& fieldset': {
                                    borderColor: 'primary.main',
                                    borderWidth: '2px',
                                },
                            },
                        },
                        '& .MuiOutlinedInput-input': {
                            fontSize: { xs: '0.9rem', sm: '0.95rem' },
                            py: { xs: 1, sm: 1.2 },
                        },
                    }}
                />
                
                <IconButton
                    component={motion.button}
                    variants={sendButtonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                    type="submit"
                    disabled={!newMessage.trim() || disabled}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: { xs: 42, sm: 46 },
                        height: { xs: 42, sm: 46 },
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                            ? '0 4px 12px rgba(33, 150, 243, 0.4), 0 0 0 1px rgba(33, 150, 243, 0.3)'
                            : '0 4px 12px rgba(33, 150, 243, 0.3), 0 1px 3px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                            boxShadow: (theme) => theme.palette.mode === 'dark'
                                ? '0 6px 16px rgba(33, 150, 243, 0.5), 0 0 0 1px rgba(33, 150, 243, 0.4)'
                                : '0 6px 16px rgba(33, 150, 243, 0.4), 0 2px 4px rgba(0, 0, 0, 0.15)',
                            transform: 'translateY(-1px)',
                        },
                        '&:disabled': {
                            bgcolor: 'action.disabledBackground',
                            color: 'action.disabled',
                            boxShadow: 'none',
                        },
                    }}
                >
                    <SendIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
                </IconButton>
            </Box>
            
            {/* Character counter (optional) */}
            {newMessage.length > 500 && (
                <Box
                    sx={{
                        mt: 0.5,
                        textAlign: 'right',
                        color: newMessage.length > 1000 ? 'error.main' : 'text.secondary',
                        fontSize: '0.7rem',
                    }}
                >
                    {newMessage.length} / 1000
                </Box>
            )}
        </Paper>
    );
};

export default MessageInput;
