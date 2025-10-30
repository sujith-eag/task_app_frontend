import React from 'react';
import { ListItem, ListItemText, Switch, Avatar, Box, Typography, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const StudentRosterItem = ({ student, status, onToggle, isWindowOpen, index }) => {
    // Generate consistent avatar color based on student name
    const getAvatarColor = (name) => {
        const colors = [
            '#1976d2', '#d32f2f', '#388e3c', '#f57c00', 
            '#7b1fa2', '#0097a7', '#c2185b', '#5d4037'
        ];
        const charCode = name.charCodeAt(0);
        return colors[charCode % colors.length];
    };

    const avatarColor = getAvatarColor(student.name);
    const initials = student.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <ListItem 
            sx={{
                mb: 1,
                p: { xs: 1.5, sm: 2 },
                borderRadius: 1.5,
                background: (theme) => {
                    if (status) {
                        return theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(56, 142, 60, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(76, 175, 80, 0.08) 0%, rgba(76, 175, 80, 0.05) 100%)';
                    }
                    return theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.03)'
                        : 'rgba(255, 255, 255, 0.6)';
                },
                border: '1px solid',
                borderColor: status ? 'success.main' : 'divider',
                transition: 'all 0.2s ease',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: { xs: 1.5, sm: 2 },
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    background: (theme) => {
                        if (status) {
                            return theme.palette.mode === 'dark'
                                ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(56, 142, 60, 0.15) 100%)'
                                : 'linear-gradient(135deg, rgba(76, 175, 80, 0.12) 0%, rgba(76, 175, 80, 0.08) 100%)';
                        }
                        return theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(255, 255, 255, 0.9)';
                    },
                    transform: 'translateX(4px)',
                    boxShadow: status ? 3 : 1,
                },
                // Animated check-in effect
                ...(status && {
                    animation: 'pulseIn 0.5s ease-out',
                    '@keyframes pulseIn': {
                        '0%': {
                            transform: 'scale(0.95)',
                            opacity: 0.8,
                        },
                        '50%': {
                            transform: 'scale(1.02)',
                        },
                        '100%': {
                            transform: 'scale(1)',
                            opacity: 1,
                        },
                    },
                }),
            }}
        >
            {/* Edge indicator for present students */}
            {status && (
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        background: 'linear-gradient(180deg, #4caf50 0%, #66bb6a 100%)',
                        boxShadow: '2px 0 8px rgba(76, 175, 80, 0.5)',
                    }}
                />
            )}

            {/* Avatar and Info */}
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                flex: 1,
                width: { xs: '100%', sm: 'auto' },
                pl: status ? 1 : 0,
            }}>
                <Avatar
                    sx={{
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        bgcolor: avatarColor,
                        border: status ? '2px solid' : '1px solid',
                        borderColor: status ? 'success.main' : 'divider',
                        boxShadow: status ? `0 0 12px ${avatarColor}40` : 'none',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 700,
                    }}
                >
                    {initials}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography 
                            fontWeight={600} 
                            fontSize={{ xs: '0.9rem', sm: '1rem' }}
                            sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {student.name}
                        </Typography>
                        {status && (
                            <CheckCircleIcon 
                                sx={{ 
                                    fontSize: '1rem', 
                                    color: 'success.main',
                                    display: { xs: 'none', sm: 'block' },
                                }} 
                            />
                        )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            fontSize={{ xs: '0.75rem', sm: '0.875rem' }}
                        >
                            USN: {student.studentDetails.usn.slice(-4)}
                        </Typography>
                        
                        {status ? (
                            <Chip
                                icon={<CheckCircleIcon sx={{ fontSize: '0.875rem' }} />}
                                label="Present"
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    display: { xs: 'flex', sm: 'none' },
                                }}
                            />
                        ) : (
                            <Chip
                                icon={<AccessTimeIcon sx={{ fontSize: '0.875rem' }} />}
                                label="Absent"
                                size="small"
                                color="error"
                                variant="outlined"
                                sx={{
                                    height: 20,
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    display: { xs: 'flex', sm: 'none' },
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </Box>

            {/* Toggle Switch */}
            <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                alignSelf: { xs: 'flex-end', sm: 'center' },
            }}>
                <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                    {isWindowOpen ? 'Auto' : 'Manual'}
                </Typography>
                <Switch
                    edge="end"
                    onChange={onToggle}
                    checked={status}
                    disabled={isWindowOpen}
                    color={status ? 'success' : 'default'}
                    sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                            color: 'success.main',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                            backgroundColor: 'success.main',
                        },
                    }}
                />
            </Box>
        </ListItem>
    );
};

export default StudentRosterItem;
