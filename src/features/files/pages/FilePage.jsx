import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Container, Typography, Box, CircularProgress, Alert, Button, Collapse, Paper
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

import FileTable from '../features/FileList/FileTable.jsx';
import FileUpload from '../features/FileUpload/FileUpload.jsx'
import StorageQuota from '../components/ui/StorageQuota.jsx';
import CreateFolderModal from '../components/modals/CreateFolderModal.jsx'
import { FileOperationProvider } from '../hooks/FileOperationContext.jsx';
import { useGetFiles, useCreateFolder, useGetStorageUsage } from '../useFileQueries.js';

const FilesPage = () => {
    const { currentParentId } = useSelector((state) => state.files);
    const filesQuery = useGetFiles(currentParentId);
    const createFolderMutation = useCreateFolder();
    const [isCreateFolderModalOpen, setCreateFolderModalOpen] = useState(false);

    // State to manage the visibility of the uploader
    const [isUploaderOpen, setIsUploaderOpen] = useState(false);

    // React Query handles fetching; no manual dispatch required.

    
    const handleCreateFolder = async (folderName) => {
        try {
            await createFolderMutation.mutateAsync({ folderName, parentId: currentParentId });
        } catch (err) {
            // mutateAsync will surface errors; toast handled in mutation hook
        }
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