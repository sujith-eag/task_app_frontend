import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
    Box, Paper, Table, TableBody, TableCell, Checkbox,
    TableContainer, TableHead, TableRow, Typography, Tabs, 
    Tab, Button
    } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import FileItem from './FileItem.jsx';
import { deleteFile, bulkDeleteFiles } from '../fileSlice.js';
import ConfirmationDialog from '../../../components/ConfirmationDialog.jsx';
import { toast } from 'react-toastify';

const FileList = ({ files }) => {
    const dispatch = useDispatch();
    
    const [tabValue, setTabValue] = useState('myFiles');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);

    // Get current user's ID to filter the files
    const { user } = useSelector((state) => state.auth);
    const userId = user._id;

    // Filter files into two separate arrays based on ownership
    const myFiles = files.filter(file => file.user._id === userId);
    const sharedFiles = files.filter(file => file.user._id !== userId);
       
    // Clear selection when the tab changes
    useEffect(() => {
        setSelectedFiles([]);
    }, [tabValue]);
        
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // --- HANDLER: Opens the dialog for a single file deletion ---
    const handleOpenDeleteDialog = (file) => {
        setFileToDelete(file);
    };

    // --- HANDLER: The actual delete logic for a single file ---
    const handleConfirmSingleDelete = () => {
        if (fileToDelete) {
            dispatch(deleteFile(fileToDelete._id))
                .unwrap()
                .then(() => toast.success(`"${fileToDelete.fileName}" deleted.`))
                .catch((err) => toast.error(err || 'Failed to delete file.'));
        }
        setFileToDelete(null); // Close the dialog by resetting the state
    };
    
    // --- HANDLER: to toggle file selection
    const handleSelectFile = (fileId) => {
        setSelectedFiles(prev =>
            prev.includes(fileId)
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };    

    // Select all files currently visible in the active tab.
    const currentList = tabValue === 'myFiles' ? myFiles : sharedFiles;

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedFiles(currentList.map(file => file._id));
        } else {
            setSelectedFiles([]);
        }
    };
    
    const handleBulkDelete = () => {
        setDialogOpen(false); // Close the dialog
        dispatch(bulkDeleteFiles(selectedFiles))
            .unwrap()
            .then(() => toast.success(`${selectedFiles.length} files deleted.`))
            .catch((err) => toast.error(err || 'Failed to delete files.'))
            .finally(() => setSelectedFiles([]));
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

                        {/* <TableCell sx={{ width: '20%' }}>Uploaded On </TableCell> */}

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
                            onDeleteClick={handleOpenDeleteDialog}
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
                <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography>{selectedFiles.length} selected</Typography>

                    {/* Context-aware buttons */}
                    {tabValue === 'myFiles' && (
                        <Button 
                            variant="contained" 
                            color="error" 
                            startIcon={<DeleteIcon />} 
                            onClick={() => setDialogOpen(true)}
                            >
                            Delete Selected
                        </Button>
                    )}
                    {tabValue === 'shared' && (
                        <Button 
                            variant="contained" 
                            color="warning" 
                            startIcon={<ExitToAppIcon />} 
                            onClick={handleBulkRemove}>
                            Remove From My List
                        </Button>
                    )}
                    
                    <ConfirmationDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        onConfirm={handleBulkDelete}
                        title="Confirm Deletion"
                        message={`Are you sure you want to permanently delete these ${selectedFiles.length} files?`}
                    />                    
                </Paper>
            )}

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
                    value="shared" />
            </Tabs>


            <Box sx={{ mt: 2 }}>
                {tabValue === 'myFiles' && (
                    myFiles.length > 0
                        ? renderFileTable(myFiles)
                        : <Typography>You haven't uploaded any files yet.</Typography>
                )}
                {tabValue === 'shared' && (
                    sharedFiles.length > 0
                        ? renderFileTable(sharedFiles)
                        : <Typography>No files have been shared with you.</Typography>
                )}
            </Box>
            
            {/* --- Delete Confirmation DIALOG --- */}
            <ConfirmationDialog
                open={!!fileToDelete} // Dialog is open if a file is set
                onClose={() => setFileToDelete(null)}
                onConfirm={handleConfirmSingleDelete}
                title="Confirm Deletion"
                message={`Are you sure you want to permanently delete "${fileToDelete?.fileName}"?`}
            />
        </Box>
    );
};

export default FileList;