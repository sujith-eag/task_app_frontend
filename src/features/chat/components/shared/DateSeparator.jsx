import { Box, Typography, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { getDateSeparatorLabel } from '../../utils/dateHelpers.js';
import { dateSeparatorVariants } from '../../utils/chatAnimations.js';

const DateSeparator = ({ date }) => {
    const label = getDateSeparatorLabel(date);
    
    return (
        <Box
            component={motion.div}
            variants={dateSeparatorVariants}
            initial="hidden"
            animate="visible"
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                my: 3,
                px: 2,
            }}
        >
            <Divider sx={{ 
                flex: 1, 
                borderColor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgba(0, 0, 0, 0.12)',
                borderWidth: '1px',
            }} />
            <Typography
                variant="caption"
                sx={{
                    px: 2,
                    py: 0.6,
                    borderRadius: 3,
                    bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(33, 150, 243, 0.15)' 
                        : 'rgba(33, 150, 243, 0.1)',
                    color: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(33, 150, 243, 0.9)' 
                        : 'primary.main',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(33, 150, 243, 0.3)' 
                        : 'rgba(33, 150, 243, 0.2)',
                    boxShadow: (theme) => theme.palette.mode === 'dark'
                        ? '0 2px 4px rgba(0, 0, 0, 0.3)'
                        : '0 1px 3px rgba(0, 0, 0, 0.08)',
                }}
            >
                {label}
            </Typography>
            <Divider sx={{ 
                flex: 1, 
                borderColor: (theme) => theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.15)' 
                    : 'rgba(0, 0, 0, 0.12)',
                borderWidth: '1px',
            }} />
        </Box>
    );
};

export default DateSeparator;
