import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, TableRow, TableCell, Checkbox, Box, Typography, CircularProgress } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

import { useFileActions } from '../../hooks/useFileActions.js';
import FileActionMenu from './FileActionMenu.jsx';
import ShareModal from '../../components/modals/ShareModal.jsx';
import PublicShareModal from '../../components/modals/PublicShareModal.jsx'
import ManageShareModal from '../../components/modals/ManageShareModal.jsx';
import { getFileIcon } from '../../components/ui/fileUtils.jsx';

const FileTableRow = ({ file, isSelected, onSelectFile, onDeleteClick, onNavigate, context }) => {
    // Local state for modals is perfectly fine here
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [isPublicShareModalOpen, setPublicShareModalOpen] = useState(false);
    const [isManageShareModalOpen, setManageShareModalOpen] = useState(false);

    const { status, itemStatus } = useSelector((state) => state.files); // Granular status
    const isProcessing = itemStatus && itemStatus[file._id]; // Check if THIS specific file is processing

    // Get all action handlers from our clean hook
    const { downloadSingleFile, removeSharedAccess, revokePublicLink } = useFileActions();

    const { user } = useSelector((state) => state.auth);
    const isOwner = file.user._id === user._id;

    // --- Function to render the share status ---
    const renderShareStatus = () => {
        const shareCount = file.sharedWith.length;
        const isPublic = file.publicShare?.isActive;

        if (isPublic && shareCount > 0) {
            return `Publicly & with ${shareCount} user(s)`;
        }
        if (isPublic) {
            return 'Publicly Shared';
        }
        if (shareCount > 0) {
            return `Shared with ${shareCount} user(s)`;
        }
        return ''; // Should not happen in this tab, but as a fallback
    };


    return (
        <>
            <TableRow
                onClick={file.isFolder ? () => onNavigate(file._id) : undefined}
                sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: file.isFolder ? 'pointer' : 'default',
                    // Add a visual indicator when selected
                    backgroundColor: isSelected ? 'action.selected' : 'transparent',
                    // Dim the row when it's being processed
                    opacity: isProcessing ? 0.6 : 1,
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                <TableCell padding="checkbox">
					{/* Visible in All tabs */}
                    <Checkbox 
	                    checked={isSelected} 
	                    onChange={() => onSelectFile(file._id)} 
					/>
                </TableCell>

                <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
	                        variant="rounded" 
	                        sx={{ bgcolor: 'transparent', mr: 2 }}>
                            {file.isFolder 
	                            ? <FolderIcon 
	                            sx={{ color: 'text.primary' }} /> 
	                            : getFileIcon(file.fileType)}
                        </Avatar>
                        {/* Truncate long filenames */}
                        <Typography noWrap>{file.fileName}</Typography>
                    </Box>
                </TableCell>

                {/* --- INTEGRATE Data --- */}
                <TableCell>
                {/* Switch statement for clear, context-aware rendering */}
                {(() => {
                    switch (context) {
                        case 'myFiles':
                            return new Date(file.createdAt).toLocaleDateString();
                        case 'sharedWithMe':
                            return (
                                <Typography variant="body2" color="text.secondary">
                                    {`Shared by: ${file.user.name}`}
                                </Typography>
                            );
                        case 'myShares':
                            return (
                                <Typography variant="body2" color="text.secondary">
                                    {renderShareStatus()}
                                </Typography>
                            );
                        default:
                            return new Date(file.createdAt).toLocaleDateString();
                    }
                })()}
                </TableCell>

                <TableCell align="right">
                    {isProcessing ? (
                        <CircularProgress size={24} />
                    ) : (
                        <FileActionMenu
                            file={file}
                            onManageShare={() => setManageShareModalOpen(true)}
                            onDelete={() => onDeleteClick(file)}
                            onShare={() => setShareModalOpen(true)}
                            onPublicShare={() => setPublicShareModalOpen(true)}
                            onRemove={() => removeSharedAccess(file._id)}
                            onRevokePublic={() => revokePublicLink(file._id)}
                            onDownload={() => downloadSingleFile(file._id)}
                        />
                    )}
                </TableCell>
            </TableRow>

            {/* Modals are controlled by this component's state */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setShareModalOpen(false)}
                file={file}
            />

            {isOwner && (
	            <PublicShareModal
	                open={isPublicShareModalOpen}
	                onClose={() => setPublicShareModalOpen(false)}
	                file={file}
	            />
            )}
            <ManageShareModal
                open={isManageShareModalOpen}
                onClose={() => setManageShareModalOpen(false)}
                file={file}
            />
        </>
    );
};

export default FileTableRow;