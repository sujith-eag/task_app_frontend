import { Box, Skeleton, Stack } from '@mui/material';

const ChatSkeleton = ({ variant = 'conversation' }) => {
    if (variant === 'conversation') {
        // Skeleton for conversation list items
        return (
            <Box sx={{ p: 2 }}>
                {[1, 2, 3, 4, 5].map((item) => (
                    <Stack 
                        key={item} 
                        direction="row" 
                        spacing={2} 
                        sx={{ mb: 2 }}
                        alignItems="center"
                    >
                        <Skeleton variant="circular" width={50} height={50} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={24} />
                            <Skeleton variant="text" width="80%" height={20} />
                        </Box>
                        <Skeleton variant="text" width={50} height={16} />
                    </Stack>
                ))}
            </Box>
        );
    }
    
    if (variant === 'messages') {
        // Skeleton for message list
        return (
            <Box sx={{ p: 2 }}>
                {[1, 2, 3, 4].map((item) => (
                    <Box 
                        key={item}
                        sx={{
                            display: 'flex',
                            justifyContent: item % 2 === 0 ? 'flex-end' : 'flex-start',
                            mb: 2,
                        }}
                    >
                        <Skeleton 
                            variant="rounded" 
                            width={item % 2 === 0 ? 250 : 300} 
                            height={60}
                            sx={{ borderRadius: 3 }}
                        />
                    </Box>
                ))}
            </Box>
        );
    }
    
    // Default skeleton
    return (
        <Box sx={{ p: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2 }} />
        </Box>
    );
};

export default ChatSkeleton;
