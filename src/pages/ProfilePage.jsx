import React from 'react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Box, Button, Divider } from '@mui/material';

// We will create these components in the next steps
import UpdateProfileForm from '../features/profile/components/UpdateProfileForm.jsx';
import PreferencesSection from '../features/profile/components/PreferencesSection.jsx';
import PasswordForm from '../features/profile/components/PasswordForm.jsx';

const ProfilePage = () => {
    // Get the latest user data from the authSlice in the Redux store
    const { user } = useSelector((state) => state.auth);

    // Display a loading or placeholder state if user data isn't available yet
    if (!user) {
        return <Typography>Loading profile...</Typography>;
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My Profile
                </Typography>
                
                {/* Component for updating name, bio, and avatar */}
                <UpdateProfileForm user={user} />

                <Divider sx={{ my: 4 }} />

                {/* Component for managing user preferences */}
                <PreferencesSection preferences={user.preferences} />
                
                <Divider sx={{ my: 4 }} />

                {/* Component for changing password */}
                <PasswordForm />

                <Divider sx={{ my: 4 }} />

                {/* Section for conditional navigation links */}
                <Box>
                    <Typography variant="h6" gutterBottom>My Content</Typography>
                    {user.preferences.canRecieveFiles && (
                        <Button component={RouterLink} to="/files" variant="outlined">
                            Manage My Files
                        </Button>
                    )}
                    {/* A similar button for Messages can be added here later */}
                </Box>
            </Box>
        </Container>
    );
};

export default ProfilePage;