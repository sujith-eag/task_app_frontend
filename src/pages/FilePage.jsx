import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { getFiles } from '../features/files/fileSlice';

// We will create these components in the next steps
import FileUpload from '../features/files/components/FileUpload.jsx';
import FileList from '../features/files/components/FileList.jsx';

const FilesPage = () => {
    const dispatch = useDispatch();

    // Select the necessary state from the fileSlice
    const { files, status, message } = useSelector((state) => state.files);

    // Fetch the user's files when the component mounts
    useEffect(() => {
        dispatch(getFiles());
    }, [dispatch]);

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    File Manager
                </Typography>

                {/* The component for uploading new files */}
                <Box sx={{ mb: 4 }}>
                    <FileUpload />
                </Box>

                {/* Conditionally render the file list based on the API call status */}
                {status === 'loading' && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                {status === 'failed' && (
                    <Alert severity="error">{message}</Alert>
                )}
                {status === 'succeeded' && (
                    <FileList files={files} />
                )}
            </Box>
        </Container>
    );
};

export default FilesPage;