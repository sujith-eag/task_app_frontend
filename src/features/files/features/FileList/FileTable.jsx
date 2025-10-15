import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, TableContainer, Table, TableHead, 
	TableRow, TableCell, Checkbox, TableBody, 
	Paper, Typography } from '@mui/material';

// Import selectors and hooks
import { selectMyFiles, selectSharedFiles, selectMySharedFiles } from '../../fileSlice.js';
import { useFileActions } from '../../hooks/useFileActions.js';

import FileTableRow from './FileTableRow.jsx';
import ConfirmationDialog from '../../../../components/ConfirmationDialog.jsx';
import FileBreadcrumbs from './FileBreadcrumbs.jsx';
import BulkActionBar from './BulkActionBar.jsx';
import FileListTabs from './FileListTabs.jsx';

const fileSelectors = {
    myFiles: selectMyFiles,
    sharedWithMe: selectSharedFiles,
    myShares: selectMySharedFiles,
};

const FileTable = () => {
    const { user } = useSelector((state) => state.auth);
    const [tabValue, setTabValue] = useState('myFiles');
    const [selectedFiles, setSelectedFiles] = useState([]);
    
	// Single state object to control the confirmation dialog
    const [dialogConfig, setDialogConfig] = useState({ 
	    open: false, 
	    title: '', 
	    message: '', 
	    onConfirm: () => {} 
	});

    // Use the selector for the current tab to get the correct list of files
    const currentList = useSelector(fileSelectors[tabValue]);

    // Hook for actions
    const { navigateToFolder, deleteSingleFile, 
        deleteBulkFiles, downloadFiles, removeBulkSharedAccess } = useFileActions();
    
    // Clear selection when the tab or the data list changes
    useEffect(() => {
        setSelectedFiles([]);
    }, [tabValue, currentList]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedFiles(currentList.map(file => file._id));
        } else {
            setSelectedFiles([]);
        }
    };

    // --- HANDLER: to toggle file selection
    const handleSelectFile = (fileId) => {
        setSelectedFiles(prev =>
            prev.includes(fileId) 
	            ? prev.filter(id => id !== fileId) 
	            : [...prev, fileId]
        );
    };

    // --- HANDLER: Opens dialog for a single file deletion ---
    const openSingleDeleteDialog = (file) => {
        setDialogConfig({
            open: true,
            title: 'Confirm Deletion',
            message: `You want to permanently delete "${file.fileName}"?`,
            onConfirm: () => deleteSingleFile(file)
        });
    };
    
    const openBulkDeleteDialog = () => {
        setDialogConfig({
            open: true,
            title: 'Confirm Bulk Deletion',
            message: `You want to permanently delete these ${selectedFiles.length} files?`,
            onConfirm: () => {
                deleteBulkFiles(selectedFiles);
                setSelectedFiles([]);
            }
        });
    };
    
    const openBulkRemoveDialog = () => {
        setDialogConfig({
            open: true,
            title: 'Confirm Removal',
            message: `Are you sure you want to remove these ${selectedFiles.length} files from your list?`,
            onConfirm: () => {
                // Calling action from the hook
                removeBulkSharedAccess(selectedFiles)
                // The component handles UI state changes
                .finally(() => setSelectedFiles([])); 
            }
        });
    };

    const closeDialog = () => setDialogConfig({ ...dialogConfig, open: false });

    return (
        <Box>
			{/* Conditionally rendered bulk action bar */}
            <BulkActionBar
                selectedFiles={selectedFiles}
                currentTab={tabValue}
                onDownload={() => downloadFiles(selectedFiles, user.token)}
                onDelete={openBulkDeleteDialog}
                onRemove={openBulkRemoveDialog}
            />

            <FileBreadcrumbs onNavigate={navigateToFolder} />
            
            <FileListTabs
                tabValue={tabValue}
                onTabChange={(e, newValue) => setTabValue(newValue)}
                myFilesCount={useSelector(selectMyFiles).length}
                sharedFilesCount={useSelector(selectSharedFiles).length}
                mySharesCount={useSelector(selectMySharedFiles).length}
            />

            <Box sx={{ mt: 2 }}>
                {currentList.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
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
                                {currentList.map(file => (
                                    <FileTableRow
                                        key={file._id}
                                        file={file}
                                        isSelected={selectedFiles.includes(file._id)}
                                        onSelectFile={handleSelectFile}
                                        onDeleteClick={openSingleDeleteDialog}
                                        onNavigate={navigateToFolder}
                                        context={tabValue}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No files in this view.</Typography>
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

export default FileTable;