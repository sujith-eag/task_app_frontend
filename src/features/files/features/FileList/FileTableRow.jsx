import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, TableRow, TableCell, Checkbox, Box, Typography, CircularProgress, Tooltip, Chip } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';

import { useFileActions } from '../../hooks/useFileActions.js';
import FileActionMenu from './FileActionMenu.jsx';
import { getFileIcon, getFileColor } from '../../components/ui/fileUtils.jsx';

const FileTableRow = ({ file, isSelected, onSelectFile, onDeleteClick, onNavigate, context, onOpenShare, onOpenPublicShare, onOpenManageShare }) => {

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
                role="row"
                aria-selected={isSelected}
                tabIndex={0}
                aria-label={`file-row-${file._id}`}
                onKeyDown={(e) => {
                    // Enter opens folders, Space toggles selection
                    if (e.key === 'Enter' && file.isFolder) {
                        onNavigate(file._id);
                    }
                    if (e.key === ' ') {
                        e.preventDefault();
                        onSelectFile(file._id);
                    }
                }}
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
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => { e.stopPropagation(); onSelectFile(file._id); }}
                    />
                </TableCell>

                <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                            variant="rounded" 
                            sx={{ bgcolor: file.isFolder ? 'transparent' : getFileColor(file.fileType), mr: 2 }}>
                            {file.isFolder 
                                ? <FolderIcon 
                                sx={{ color: 'text.primary' }} /> 
                                : getFileIcon(file.fileType)}
                        </Avatar>
                        {/* Truncate long filenames, show full name on hover/focus */}
                        <Tooltip title={file.fileName} placement="top" enterDelay={400}>
                            <Typography noWrap sx={{ maxWidth: { xs: 160, sm: 320, md: 420 } }}>{file.fileName}</Typography>
                        </Tooltip>
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
                        <Chip size="small" variant="outlined" icon={<CircularProgress size={16} />} label="Processing" />
                    ) : (
                        // Prevent opening menu from triggering row navigation
                        <Box onClick={(e) => e.stopPropagation()}>
                            <FileActionMenu
                                file={file}
                                onManageShare={() => onOpenManageShare && onOpenManageShare(file._id)}
                                onDelete={() => onDeleteClick(file)}
                                onShare={() => onOpenShare && onOpenShare(file._id)}
                                onPublicShare={() => onOpenPublicShare && onOpenPublicShare(file._id)}
                                onRemove={() => removeSharedAccess(file._id)}
                                onRevokePublic={() => revokePublicLink(file._id)}
                                onDownload={() => downloadSingleFile(file._id)}
                            />
                        </Box>
                    )}
                </TableCell>
            </TableRow>

            {/* Modals are now owned by the parent `FileTable` to avoid mounting many instances per row */}
        </>
    );
};

export default FileTableRow;