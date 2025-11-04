import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, TableContainer, Table, TableHead, 
    TableRow, TableCell, Checkbox, TableBody, 
    Paper, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setBreadcrumbs, setCurrentFolder } from '../../fileSlice.js';

// Import selectors and hooks
import { useFileActions } from '../../hooks/useFileActions.js';
import { useGetFiles, useGetSharedWithMe, useGetMySharedFiles } from '../../useFileQueries.js';

import FileTableRow from './FileTableRow.jsx';
import ConfirmationDialog from '../../../../components/ConfirmationDialog.jsx';
import FileBreadcrumbs from './FileBreadcrumbs.jsx';
import BulkActionBar from './BulkActionBar.jsx';
import FileListTabs from './FileListTabs.jsx';
import ShareModal from '../../components/modals/ShareModal.jsx';
import PublicShareModal from '../../components/modals/PublicShareModal.jsx';
import ManageShareModal from '../../components/modals/ManageShareModal.jsx';
import RenameModal from '../../components/modals/RenameModal.jsx';
import MoveModal from '../../components/modals/MoveModal.jsx';

const FileTable = () => {
    // auth user is intentionally not used for token forwarding anymore
    const [tabValue, setTabValue] = useState('myFiles');
    const [selectedFiles, setSelectedFiles] = useState([]);
    
	// Single state object to control the confirmation dialog
    const [dialogConfig, setDialogConfig] = useState({ 
	    open: false, 
	    title: '', 
	    message: '', 
	    onConfirm: () => {} 
	});

    // Client state
    const currentParentId = useSelector((state) => state.files.currentParentId);

    // Server state via React Query
    const filesQuery = useGetFiles(currentParentId);
    const sharedWithMeQuery = useGetSharedWithMe();
    const mySharedQuery = useGetMySharedFiles();

    const currentList = (() => {
        if (tabValue === 'myFiles') return filesQuery.data?.files || [];
        if (tabValue === 'sharedWithMe') return sharedWithMeQuery.data || [];
        if (tabValue === 'myShares') return mySharedQuery.data || [];
        return [];
    })();

    // Hook for actions
    const { navigateToFolder, deleteSingleItem, 
        deleteBulkItems, downloadItems, removeBulkSharedAccess, renameItem, moveItemToFolder, bulkMoveItems } = useFileActions();

    // Centralized modal state to avoid mounting per-row modals
    // activeModal.file will store the fileId (not the object) so we can derive the latest file
    const [activeModal, setActiveModal] = useState({ type: null, fileId: null });

    const openModal = (type, fileId) => setActiveModal({ type, fileId });
    const closeModal = () => setActiveModal({ type: null, fileId: null });
    
    // Clear selection when the tab or the data list changes
    useEffect(() => {
        setSelectedFiles([]);
    }, [tabValue, currentList]);

    // Sync breadcrumbs and current folder from server data into UI slice
    const dispatch = useDispatch();
    useEffect(() => {
        // Only sync when we're on the main 'myFiles' tab
        if (tabValue !== 'myFiles') return;
        const data = filesQuery.data;
        if (!data) {
            dispatch(setBreadcrumbs([]));
            dispatch(setCurrentFolder(null));
            return;
        }
        dispatch(setBreadcrumbs(data.breadcrumbs || []));
        dispatch(setCurrentFolder(data.currentFolder || null));
    }, [tabValue, filesQuery.data, dispatch]);

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
            onConfirm: () => deleteSingleItem(file)
        });
    };
    
    const openBulkDeleteDialog = () => {
        setDialogConfig({
            open: true,
            title: 'Confirm Bulk Deletion',
            message: `You want to permanently delete these ${selectedFiles.length} files?`,
                onConfirm: () => {
                deleteBulkItems(selectedFiles);
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

    const openBulkMoveModal = () => setActiveModal({ type: 'move', fileId: '__bulk__' });

    return (
        <Box>
			{/* Conditionally rendered bulk action bar */}
                <BulkActionBar
                    selectedItems={currentList.filter(f => selectedFiles.includes(f._id))}
                    currentTab={tabValue}
                    onDownload={() => downloadItems(currentList.filter(f => selectedFiles.includes(f._id)))}
                    onDelete={openBulkDeleteDialog}
                    onRemove={openBulkRemoveDialog}
                    onMove={openBulkMoveModal}
                />

            <FileBreadcrumbs onNavigate={navigateToFolder} />
            
            <FileListTabs
                tabValue={tabValue}
                onTabChange={(e, newValue) => setTabValue(newValue)}
                myFilesCount={filesQuery.data?.files?.length || 0}
                sharedFilesCount={sharedWithMeQuery.data?.length || 0}
                mySharesCount={mySharedQuery.data?.length || 0}
            />

            <Box sx={{ mt: 2 }}>
                {currentList.length > 0 ? (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: 72, textAlign: 'center' }}>Actions</TableCell>

                                    <TableCell sx={{ width: '55%' }}>Name</TableCell>

                                    <TableCell sx={{ width: '25%' }}>Date / Source</TableCell>

                                    <TableCell padding="checkbox" sx={{ width: '5%' }}>
                                        {/* "Select All" checkbox */}
                                        <Checkbox
                                            indeterminate={selectedFiles.length > 0 && selectedFiles.length < currentList.length}
                                            checked={currentList.length > 0 && selectedFiles.length === currentList.length}
                                            onChange={handleSelectAll}
                                        />
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
                                            onOpenShare={() => openModal('share', file._id)}
                                            onOpenPublicShare={() => openModal('public', file._id)}
                                            onOpenManageShare={() => openModal('manage', file._id)}
                                            onOpenRename={() => openModal('rename', file._id)}
                                            onOpenMove={() => openModal('move', file._id)}
                                        />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                ) : (
                    <Typography>No files in this view.</Typography>
                )}
            </Box>

                {/* Centralized modals rendered once for the table */}
                {activeModal.type === 'share' && (
                    <ShareModal
                        isOpen={true}
                        onClose={closeModal}
                        file={currentList.find(f => f._id === activeModal.fileId) || null}
                    />
                )}

                {activeModal.type === 'public' && activeModal.fileId && (
                    <PublicShareModal
                        open={true}
                        onClose={closeModal}
                        file={currentList.find(f => f._id === activeModal.fileId) || null}
                    />
                )}

                {activeModal.type === 'manage' && activeModal.fileId && (
                    <ManageShareModal
                        open={true}
                        onClose={closeModal}
                        file={currentList.find(f => f._id === activeModal.fileId) || null}
                    />
                )}

                {activeModal.type === 'rename' && activeModal.fileId && (
                    <RenameModal
                        open={true}
                        onClose={closeModal}
                        itemToRename={currentList.find(f => f._id === activeModal.fileId) || null}
                        onRename={renameItem}
                    />
                )}

                {activeModal.type === 'move' && (
                    (() => {
                        const isBulk = activeModal.fileId === '__bulk__';
                        const itemToMove = isBulk ? currentList.filter(f => selectedFiles.includes(f._id)) : (currentList.find(f => f._id === activeModal.fileId) || null);
                        const onMoveHandler = isBulk ? ((itemIds, destination) => bulkMoveItems(itemIds, destination)) : moveItemToFolder;

                        return (
                            <MoveModal
                                open={true}
                                onClose={closeModal}
                                itemToMove={itemToMove}
                                onMove={onMoveHandler}
                            />
                        );
                    })()
                )}
            
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