import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, FormGroup, FormControlLabel, Switch, Paper, Stack } from '@mui/material';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MessageIcon from '@mui/icons-material/Message';

import { updateProfile } from '../profileSlice.js';

const PreferencesSection = ({ preferences }) => {
    const dispatch = useDispatch();

    // This single handler manages all preference toggles dynamically.
    const handlePreferenceChange = (e) => {
        const { name, checked } = e.target;

        // Create a payload with the specific preference that changed.
        const preferenceData = {
            preferences: {
                [name]: checked,
            },
        };
        
        // Dispatch the thunk to update the backend immediately.
        dispatch(updateProfile(preferenceData));
    };

    const preferenceItems = [
        {
            name: 'canRecieveFiles',
            icon: <FolderSharedIcon />,
            title: 'File Sharing',
            description: 'Allow other users to share files with you. If disabled, you won\'t appear in their sharing lists.',
            color: 'primary',
        },
        {
            name: 'isDiscoverable',
            icon: <VisibilityIcon />,
            title: 'Discoverability',
            description: 'Allow other users to find you in the application for collaboration features like messaging and sharing.',
            color: 'secondary',
        },
        {
            name: 'canRecieveMessages',
            icon: <MessageIcon />,
            title: 'Messaging',
            description: 'Allowing others to message you. (Beta Testing)',
            color: 'success',
        },
    ];

    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Account Preferences
            </Typography>
            <Stack spacing={2}>
                {preferenceItems.map((item) => (
                    <Paper 
                        key={item.name}
                        variant="outlined" 
                        sx={{ 
                            p: 2.5,
                            transition: 'all 0.3s',
                            borderColor: preferences[item.name] 
                                ? `${item.color}.main` 
                                : 'divider',
                            backgroundColor: (theme) => 
                                preferences[item.name]
                                    ? theme.palette.mode === 'dark'
                                        ? `rgba(${item.color === 'primary' ? '144, 202, 249' : item.color === 'secondary' ? '206, 147, 216' : '102, 187, 106'}, 0.08)`
                                        : `rgba(${item.color === 'primary' ? '25, 118, 210' : item.color === 'secondary' ? '156, 39, 176' : '46, 125, 50'}, 0.04)`
                                    : 'transparent',
                            '&:hover': {
                                boxShadow: 2,
                                borderColor: `${item.color}.main`,
                            },
                        }}
                    >
                        <Stack direction="row" spacing={2} alignItems="flex-start">
                            {/* Icon Box */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    backgroundColor: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? `rgba(${item.color === 'primary' ? '144, 202, 249' : item.color === 'secondary' ? '206, 147, 216' : '102, 187, 106'}, 0.15)`
                                            : `rgba(${item.color === 'primary' ? '25, 118, 210' : item.color === 'secondary' ? '156, 39, 176' : '46, 125, 50'}, 0.1)`,
                                    color: `${item.color}.main`,
                                    flexShrink: 0,
                                    transition: 'all 0.3s',
                                    ...(preferences[item.name] && {
                                        transform: 'scale(1.05)',
                                        boxShadow: 2,
                                    }),
                                }}
                            >
                                {item.icon}
                            </Box>

                            {/* Content */}
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <FormControlLabel
                                    control={
                                        <Switch 
                                            checked={preferences[item.name]} 
                                            onChange={handlePreferenceChange} 
                                            name={item.name}
                                            color={item.color}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    '& + .MuiSwitch-track': {
                                                        opacity: 0.7,
                                                    },
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography 
                                            variant="subtitle1" 
                                            sx={{ 
                                                fontWeight: 600,
                                                color: preferences[item.name] 
                                                    ? 'text.primary' 
                                                    : 'text.secondary',
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                    }
                                    sx={{ mb: 0.5, mt: 0.5 }}
                                />
                                <Typography 
                                    variant="body2" 
                                    color="text.secondary" 
                                    sx={{ 
                                        ml: 0,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    {item.description}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                ))}
            </Stack>
        </Box>
    );
};

export default PreferencesSection;