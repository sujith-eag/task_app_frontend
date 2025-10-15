import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Box, CircularProgress, Alert, Button, Collapse, Paper
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import { getFiles, createFolder, getStorageUsage } from '../fileSlice.js';
import FileTable from '../features/FileList/FileTable.jsx';
import FileUpload from '../features/FileUpload/FileUpload.jsx'
import StorageQuota from '../components/ui/StorageQuota.jsx';
import CreateFolderModal from '../components/modals/CreateFolderModal.jsx'

const FilesPage = () => {
    const dispatch = useDispatch();
    const { files, status, message, currentParentId } = useSelector((state) => state.files);
    const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);

    // State to manage the visibility of the uploader
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);

    useEffect(() => {
        dispatch(getFiles(currentParentId));
        // dispatch(getStorageUsage()); // Fetch Files and quota on page load
    }, [currentParentId, dispatch]);

    useEffect(() => {
        dispatch(getStorageUsage()); // Fetch Files and quota on page load
    }, [dispatch]);

    
    const handleCreateFolder = (folderName) => {
        dispatch(createFolder({ folderName, parentId: currentParentId }));
    };
    
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
        content = <FileTable files={files} />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        File Manager
                    </Typography>

                    {/* Folder Creation */}
                <Box>
                    {/* <Button
                        variant="outlined"
                        onClick={() => setCreateFolderModalOpen(true)}
                        sx={{ mr: 2 }}
                    > 
                        New Folder
                    </Button> */}

                    {/* --- Upload Button --- */}
                    <Button
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        onClick={() => setIsUploaderOpen(!isUploaderOpen)}
                    >
                        Upload Files
                    </Button>
                </Box>
            </Box>


                <StorageQuota />

                {/* --- Collapsible Uploader --- */}
                <Collapse in={isUploaderOpen}>
                    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                        <FileUpload />
                    </Paper>
                </Collapse>
                
                {content}
                
            <CreateFolderModal
                open={isCreateFolderModalOpen}
                onClose={() => setCreateFolderModalOpen(false)}
                onCreate={handleCreateFolder}
            />
            </Box>
        </Container>
    );
};

export default FilesPage;