import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Box, CircularProgress, Alert, Button, Collapse, Paper
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import { useNavigate } from 'react-router-dom';

import FileTable from '../features/FileList/FileTable.jsx';
import FileUpload from '../features/FileUpload/FileUpload.jsx'
import StorageQuota from '../components/ui/StorageQuota.jsx';
import CreateFolderModal from '../components/modals/CreateFolderModal.jsx'
import { FileOperationProvider } from '../hooks/FileOperationContext.jsx';
import { useGetFiles, useCreateFolder, useGetStorageUsage } from '../useFileQueries.js';

const FilesPage = () => {
    const { currentParentId } = useSelector((state) => state.files);
    const navigate = useNavigate();
    const filesQuery = useGetFiles(currentParentId);
    const createFolderMutation = useCreateFolder();
    const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);

    // State to manage the visibility of the uploader
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);

    // React Query handles fetching; no manual dispatch required.

    
    const handleCreateFolder = (folderName) => {
        // Return the mutateAsync promise so callers can await it and handle errors
        return createFolderMutation.mutateAsync({ folderName, parentId: currentParentId });
    };
    
    let content;
    if (filesQuery.isLoading && (filesQuery.data?.files || []).length === 0) {
        content = (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    } else if (filesQuery.isError) {
        content = <Alert severity="error">{filesQuery.error?.message || 'Failed to load files.'}</Alert>;
    } else {
        content = <FileTable files={filesQuery.data?.files || []} />;
    }

    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="h4" component="h1">File Manager</Typography>
                </Box>

                {/* Move storage quota up */}
                <Box sx={{ mb: 2 }}>
                    <StorageQuota />
                </Box>

                {/* Action buttons below the quota */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mb: 2,
                        alignItems: 'center',
                        justifyContent: { xs: 'flex-start', md: 'flex-end' }
                    }}
                >
                    {/* Link to Trash page */}
                    <Button
                        variant="outlined"
                        startIcon={<RestoreFromTrashIcon />}
                        onClick={() => navigate('/trash')}
                        size={isSmall ? 'small' : 'medium'}
                    >
                        Trash
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => setCreateFolderModalOpen(true)}
                        size={isSmall ? 'small' : 'medium'}
                    >
                        New Folder
                    </Button>

                    {/* --- Upload Button --- */}
                    <Button
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        onClick={() => setIsUploaderOpen(!isUploaderOpen)}
                        size={isSmall ? 'small' : 'medium'}
                    >
                        {isSmall ? 'Upload' : 'Upload Files'}
                    </Button>
                </Box>
                {/* --- Collapsible Uploader --- */}
                <Collapse in={isUploaderOpen}>
                    <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
                        <FileUpload />
                    </Paper>
                </Collapse>

                <FileOperationProvider>
                    {content}
                </FileOperationProvider>
                
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