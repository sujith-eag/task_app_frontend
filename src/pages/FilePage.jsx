import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Box, CircularProgress, Alert, Button, Collapse, Paper
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { getFiles } from '../features/files/fileSlice';

import FileUpload from '../features/files/components/FileUpload';
import FileList from '../features/files/components/FileList';

const FilesPage = () => {
    const dispatch = useDispatch();
    const { files, status, message } = useSelector((state) => state.files);
    
    // State to manage the visibility of the uploader
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(getFiles());
        }
    }, [status, dispatch]);

    let content;
    if (status === 'loading' && files.length === 0) {
        content = (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    } else if (status === 'failed') {
        content = <Alert severity="error">{message}</Alert>;
    } else {
        content = <FileList files={files} />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        File Manager
                    </Typography>
                    {/* --- NEW: The Upload Button --- */}
                    <Button
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        onClick={() => setIsUploaderOpen(!isUploaderOpen)}
                    >
                        Upload Files
                    </Button>
                </Box>

                {/* --- NEW: The Collapsible Uploader --- */}
                <Collapse in={isUploaderOpen}>
                    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                        <FileUpload />
                    </Paper>
                </Collapse>
                
                {content}
            </Box>
        </Container>
    );
};

export default FilesPage;