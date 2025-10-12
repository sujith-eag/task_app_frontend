import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { getPublicDownloadLink, resetPublicState } from '../publicSlice.js';

const PublicDownloadPage = () => {
    const dispatch = useDispatch();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const { status, downloadUrl } = useSelector((state) => state.public);

    // Automatically trigger download and show toast on success
    useEffect(() => {
        if (downloadUrl) {
            toast.success('Your download is starting...');
            window.open(downloadUrl, '_blank');
        }
    }, [downloadUrl]);

    // Cleanup effect to reset the slice's state when the component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetPublicState());
        };
    }, [dispatch]);

    const handleCodeChange = (e) => {
        const value = e.target.value.trim();
        setCode(value);
        if (value && value.length !== 8) {
            setError('Share code must be 8 characters long.');
        } else {
            setError('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (error || !code) {
            toast.error('Please enter a valid 8-character share code.');
            return;
        }

        dispatch(getPublicDownloadLink({ code }))
            .unwrap()
            .catch((err) => {
                // Show the specific error message from the backend
                toast.error(err || 'An unknown error occurred.');
            });
    };

    const isButtonDisabled = status === 'loading' || !!error || !code;

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
                <Typography variant="h4" gutterBottom>
                    Download File
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                    Enter the 8-character share code you received to download the file.
                </Typography>
                <TextField
                    label="Enter Share Code"
                    value={code}
                    onChange={handleCodeChange}
                    fullWidth
                    error={!!error}
                    helperText={error}
                    inputProps={{ maxLength: 8 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, width: '150px', height: '40px' }}
                    disabled={isButtonDisabled}
                >
                    {status === 'loading' ? <CircularProgress size={24} color="inherit" /> : 'Get File'}
                </Button>
            </Box>
        </Container>
    );
};

export default PublicDownloadPage;