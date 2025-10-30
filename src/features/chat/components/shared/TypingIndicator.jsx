import { Box, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { typingDotVariants } from '../../utils/chatAnimations.js';

const TypingIndicator = ({ userName = 'User' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                px: 2,
                py: 1,
            }}
        >
            <Box
                sx={{
                    maxWidth: '70%',
                    bgcolor: 'background.paper',
                    borderRadius: 3,
                    borderTopLeftRadius: 0,
                    px: 2,
                    py: 1.5,
                    boxShadow: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        {userName} is typing
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                        {[0, 1, 2].map((index) => (
                            <Box
                                key={index}
                                component={motion.div}
                                variants={typingDotVariants}
                                initial="initial"
                                animate="animate"
                                sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: 'text.secondary',
                                }}
                                style={{
                                    animationDelay: `${index * 0.2}s`,
                                }}
                            />
                        ))}
                    </Stack>
                </Stack>
            </Box>
        </Box>
    );
};

export default TypingIndicator;
