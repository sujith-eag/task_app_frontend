import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    Box, Paper, Table, TableBody, TableCell, Checkbox,
    TableContainer, TableHead, TableRow, Typography, Tabs, 
    Tab, Button
    } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DownloadIcon from '@mui/icons-material/Download'; 

import fileService from '../fileService.js';
import { getFiles, deleteFile, bulkDeleteFiles } from '../fileSlice.js';

import FileItem from './FileItem.jsx';
import ConfirmationDialog from '../../../components/ConfirmationDialog.jsx';
import FileBreadcrumbs from './FileBreadcrumbs.jsx';

import { toast } from 'react-toastify';

const FileList = ({ files }) => {
    const dispatch = useDispatch();
    
    const [tabValue, setTabValue] = useState('myFiles');
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Single state object to control the confirmation dialog
    const [dialogConfig, setDialogConfig] = useState({
        open: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });
    
    // Get current user's ID to filter the files
    const { user } = useSelector((state) => state.auth);
    const userId = user._id;

    // Filter files into three separate arrays
    const myFiles = files.filter(file => file.user && file.user._id === userId);
    const sharedFiles = files.filter(file => file.user && file.user._id !== userId);

    // A file is in "My Shares" if the user owns it AND it's shared with someone or publicly
    const mySharedFiles = files.filter(f =>
        f.user && f.user._id === userId &&
        (f.sharedWith.length > 0 || (f.publicShare && f.publicShare.isActive))
    );
    
    // Clear selection when the tab changes
    useEffect(() => {
        setSelectedFiles([]);
    }, [tabValue]);
        
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // --- HANDLER: Opens the dialog for a single file deletion ---
    const handleOpenSingleDeleteDialog = (file) => {
        setDialogConfig({
            open: true,
            title: 'Confirm Deletion',
            message: `Are you sure you want to permanently delete "${file.fileName}"?`,
            onConfirm: () => {
                if (file) {
                    dispatch(deleteFile(file._id))
                        .unwrap()
                        .then(() => toast.success(`"${file.fileName}" deleted.`))
                        .catch((err) => toast.error(err || 'Failed to delete file.'));
                }
            }
        });
    };

    const handleOpenBulkDeleteDialog = () => {
        setDialogConfig({
            open: true,
            title: 'Confirm Bulk Deletion',
            message: `Are you sure you want to permanently delete these ${selectedFiles.length} files?`,
            onConfirm: () => {
                dispatch(bulkDeleteFiles(selectedFiles))
                    .unwrap()
                    .then(() => toast.success(`${selectedFiles.length} files deleted.`))
                    .catch((err) => toast.error(err || 'Failed to delete files.'))
                    .finally(() => setSelectedFiles([]));
            }
        });
    };

    // --- HANDLER: to toggle file selection
    const handleSelectFile = (fileId) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };    

    const handleNavigate = (folderId) => {
        dispatch(getFiles(folderId));
    };

    // Select all files currently visible in the active tab.
    let currentList = [];
    switch (tabValue) {
        case 'myFiles':
            currentList = myFiles;
            break;
        case 'sharedWithMe': // Use the new, consistent tab value
            currentList = sharedFiles;
            break;
        case 'myShares':
            currentList = mySharedFiles;
            break;
        default:
            currentList = myFiles;
    }

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedFiles(currentList.map(file => file._id));
        } else {
            setSelectedFiles([]);
        }
    };

    // Removing multiple files shared with me
    const handleBulkRemove = () => {
        // This will require a new thunk and backend endpoint, similar to bulkDelete
        // For now, let's add the UI and placeholder logic
        if (window.confirm(`Remove ${selectedFiles.length} files from your list?`)) {
            console.log("Dispatching bulk remove for IDs:", selectedFiles);
            // dispatch(bulkRemoveAccess(selectedFiles));
            setSelectedFiles([]);
        }
    };

    const closeDialog = () => {
        setDialogConfig({ open: false, title: '', message: '', onConfirm: () => {} });
    };

    
    // Bulk Download Section
    //  Handles downloading a single file by getting a secure pre-signed URL.
    const handleSingleDownload = async () => {
        const fileId = selectedFiles[0];
        try {
            // Get the user's token from the auth state
            const token = user.token; 
            const { url } = await fileService.getDownloadLink(fileId, token);
            window.open(url, '_blank'); // Trigger download in a new tab
        } catch (error) {
            toast.error('Could not get download link for the file.');
        }
    };

    
    //  Handles bulk downloading multiple files as a zip archive by creating and submitting a hidden form.     
    const handleBulkDownload = () => {
        const token = user.token;
        fileService.bulkDownloadFiles(selectedFiles, token);
    };
    
    // --- Main Click Handler for Bulk Download to dispatch different calls ---
    const handleDownloadClick = () => {
        if (selectedFiles.length === 1) {
            handleSingleDownload();
        } else if (selectedFiles.length > 1) {
            handleBulkDownload();
        }
    };    
    
    const renderFileTable = (fileArray) => (
        <TableContainer component={Paper} variant="outlined">

            <Table aria-label="file list table">

                <TableHead>
                    <TableRow>
                        <TableCell 
                            padding="checkbox"
                            sx={{ width: '5%' }}
                            >
                            {/* "Select All" checkbox */}
                            <Checkbox
                                // Dynamic props based on the current list
                                indeterminate={selectedFiles.length > 0 && selectedFiles.length < currentList.length}
                                checked={currentList.length > 0 && selectedFiles.length === currentList.length}
                                onChange={handleSelectAll}
                            />
                        </TableCell>

                        <TableCell 
                            sx={{ width: '55%' }}>Name
                        </TableCell>

                        <TableCell 
                            sx={{ width: '25%' }}>Date / Source
                        </TableCell>

                        <TableCell 
                            align="right" 
                            sx={{ width: '20%' }}>Actions
                        </TableCell>

                    </TableRow>
                </TableHead>                
                
                <TableBody>
                    {fileArray.map(file => (
                        <FileItem 
                            key={file._id}
                            file={file}
                            // Pass down Props for selection
                            isSelected={selectedFiles.includes(file._id)}
                            onSelectFile={handleSelectFile}
                            onDeleteClick={handleOpenSingleDeleteDialog}
                            onNavigate={handleNavigate}
                            context={tabValue}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );    


    return (
        <Box>
            {/* Conditionally render bulk action bar */}
            {selectedFiles.length > 0 && (
                <Paper
                    sx={{ p: 2, mb: 2, display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between' }}>
                    <Typography>
                        {selectedFiles.length} selected
                    </Typography>

                <Box>
                    {/* --- Dynamic Download Button --- */}
                    {/* This button is NOT shown on the 'My Shares' tab */}
                    {tabValue !== 'myShares' && (
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleDownloadClick}
                            sx={{ mr: 2 }} // Margin to separate from other buttons
                        >
                            {selectedFiles.length > 1 ? 'Download as Zip' : 'Download'}
                        </Button>
                    )}
                    
                    {/* Context-aware buttons for Delete/Remove */}
                    {tabValue === 'myFiles' && (
                        <Button
                            variant="contained" 
                            color="error" 
                            startIcon={<DeleteIcon />} 
                            onClick={handleOpenBulkDeleteDialog}
                            >
                            Delete Selected
                        </Button>
                    )}
                    {tabValue === 'sharedWithMe' && (
                        <Button 
                            variant="contained" 
                            color="warning" 
                            startIcon={<ExitToAppIcon />} 
                            onClick={handleBulkRemove}>
                            Remove From My List
                        </Button>
                    )}
                </Box>
            </Paper>
            )}

            <FileBreadcrumbs onNavigate={handleNavigate} />
            {/* ... Tabs (consider disabling/hiding for sub-folders) ... */}


            {/* Tabs for User file and Shared Files */}
            <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="file list tabs"
            >
                <Tab 
                    label={`My Files (${myFiles.length})`}
                    value="myFiles" />
                <Tab
                    label={`Shared With Me (${sharedFiles.length})`} 
                    value="sharedWithMe" />
                    
                <Tab
                    label={`My Shares (${mySharedFiles.length})`}
                    value="myShares"
                />                    
            </Tabs>


            <Box sx={{ mt: 2 }}>
                {tabValue === 'myFiles' && (
                    myFiles.length > 0
                        ? renderFileTable(myFiles)
                        : <Typography>You haven't uploaded any files yet.</Typography>
                )}
                {tabValue === 'sharedWithMe' && (
                    sharedFiles.length > 0
                        ? renderFileTable(sharedFiles)
                        : <Typography>No files have been shared with you.</Typography>
                )}
                {tabValue === 'myShares' && (
                    mySharedFiles.length > 0 
                    ? renderFileTable(mySharedFiles)
                    : <Typography>You have not shared any files yet.</Typography>
                )}
            </Box>
            
            {/* --- Dynamic Confirmation DIALOG --- */}
            <ConfirmationDialog
                open={dialogConfig.open}
                onClose={closeDialog}
                onConfirm={() => {
                    dialogConfig.onConfirm();
                    closeDialog();
                }}
                title={dialogConfig.title}
                message={dialogConfig.message}
            />
        </Box>
    );
};

export default FileList;