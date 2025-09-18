import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, FormGroup, FormControlLabel, Switch, Paper, Stack } from '@mui/material';
import { updateProfile } from '../profileSlice';

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


    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Account Preferences
            </Typography>
            <Stack spacing={2} sx={{ mt: 2 }}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel
                        control={<Switch checked={preferences.canRecieveFiles} onChange={handlePreferenceChange} name="canRecieveFiles" />}
                        label={<Typography variant="subtitle1">File Sharing</Typography>}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        Allow other users to share files with you. If disabled, you won't appear in their sharing lists.
                    </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel
                        control={<Switch checked={preferences.isDiscoverable} onChange={handlePreferenceChange} name="isDiscoverable" />}
                        label={<Typography variant="subtitle1">Discoverability</Typography>}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        Allow other users to find you in the application for collaboration features like messaging and sharing.
                    </Typography>
                </Paper>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <FormControlLabel
                        control={
	                        <Switch 
		                    checked={preferences.canRecieveMessages}
	                        onChange={handlePreferenceChange} 
	                        name="isDiscoverable" 
	                        disabled // Lets get the feature first
	                        />}
                        label={<Typography variant="subtitle1">Messaging</Typography>}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
                        Allowing others to message you. (Feature  in development)
                    </Typography>
                </Paper>
            </Stack>
        </Box>
    );
};

export default PreferencesSection;