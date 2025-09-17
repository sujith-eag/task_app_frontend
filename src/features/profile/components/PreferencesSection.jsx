import React from 'react';
import { useDispatch } from 'react-redux';
import { Box, Typography, FormGroup, FormControlLabel, Switch } from '@mui/material';
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
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            checked={preferences.canRecieveFiles}
                            onChange={handlePreferenceChange}
                            name="canRecieveFiles"
                        />
                    }
                    label="Allow other users to share files with you"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={preferences.isDiscoverable}
                            onChange={handlePreferenceChange}
                            name="isDiscoverable"
                        />
                    }
                    label="Allow other users to find you for collaboration"
                />
                {/* A placeholder for the future messaging feature */}
                <FormControlLabel
                    control={
                        <Switch
                            checked={preferences.canRecieveMessages}
                            onChange={handlePreferenceChange}
                            name="canRecieveMessages"
                            disabled // Disabled until messaging feature is built
                        />
                    }
                    label="Allow other users to send you messages (Coming Soon)"
                />
            </FormGroup>
        </Box>
    );
};

export default PreferencesSection;