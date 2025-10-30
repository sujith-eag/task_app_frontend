import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { emptyStateVariants } from '../../utils/chatAnimations.js';

const EmptyState = ({ 
    icon: Icon = ChatBubbleOutlineIcon,
    title = 'No Conversations Yet',
    subtitle = 'Start a conversation by searching for users above',
    actionText,
    onAction
}) => {
    return (
        <Box
            component={motion.div}
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                p: 4,
                textAlign: 'center',
            }}
        >
            <Box
                sx={{
                    width: { xs: 80, sm: 100 },
                    height: { xs: 80, sm: 100 },
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'action.hover',
                    mb: 3,
                    border: '2px dashed',
                    borderColor: 'divider',
                }}
            >
                <Icon 
                    sx={{ 
                        fontSize: { xs: 40, sm: 50 },
                        color: 'text.secondary',
                        opacity: 0.5
                    }} 
                />
            </Box>
            
            <Typography 
                variant="h6" 
                sx={{ 
                    mb: 1,
                    fontWeight: 700,
                    color: 'text.primary',
                    fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
            >
                {title}
            </Typography>
            
            <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                    maxWidth: '400px',
                    mb: actionText ? 3 : 0,
                    fontSize: { xs: '0.85rem', sm: '0.9rem' }
                }}
            >
                {subtitle}
            </Typography>
            
            {actionText && onAction && (
                <motion.button
                    onClick={onAction}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        padding: '10px 24px',
                        borderRadius: '24px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    }}
                >
                    {actionText}
                </motion.button>
            )}
        </Box>
    );
};

export default EmptyState;
