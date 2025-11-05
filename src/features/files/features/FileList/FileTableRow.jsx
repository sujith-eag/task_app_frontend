import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, TableRow, TableCell, Checkbox, Box, Typography, CircularProgress, Tooltip, Chip } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import Badge from '@mui/material/Badge';

import { useFileActions } from '../../hooks/useFileActions.js';
import FileActionMenu from './FileActionMenu.jsx';
import { getFileIcon, getFileColor, formatBytes, formatFileType } from '../../components/ui/fileUtils.jsx';
import { useFileOperations } from '../../hooks/FileOperationContext.jsx';

const FileTableRow = ({ file, isSelected, onSelectFile, onDeleteClick, onNavigate, context, onOpenShare, onOpenPublicShare, onOpenManageShare, onOpenRename, onOpenMove }) => {

    // Read per-file processing status from the FileOperationContext
    const { operationStatus } = useFileOperations();
    const status = operationStatus[file._id]; // e.g., 'deleting', 'moving'
    const isProcessing = Boolean(status);

    // Get all action handlers from our clean hook
    const { downloadItems, removeSharedAccess, revokePublicLink } = useFileActions();

    const { user } = useSelector((state) => state.auth);
    // Use string comparison and guard missing owner to handle mixed shapes
    const fileOwnerId = file?.user?._id || file?.user || null;
    const isOwner = fileOwnerId && user && String(fileOwnerId) === String(user._id);

    // --- Function to render the share status ---
    const renderShareStatus = () => {
        const shareCount = Array.isArray(file.sharedWith) ? file.sharedWith.length : 0;
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

    // formatBytes and formatFileType now live in fileUtils and are imported above.


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
                    // Dim the row when it's being processed (disabled until per-file mutation wiring)
                    opacity: isProcessing ? 0.6 : 1,
                    transition: 'all 0.2s ease-in-out',
                }}
            >

                {/* Actions moved to the start of the row so they're easy to reach */}
                <TableCell sx={{ width: 72, textAlign: 'center' }}>
                    {/* Prevent opening menu from triggering row navigation */}
                    <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center' }}>
                        {status ? (
                            <Chip label={`${status}...`} size="small" />
                        ) : (
                            <FileActionMenu
                                file={file}
                                onManageShare={() => onOpenManageShare && onOpenManageShare(file._id)}
                                onDelete={() => onDeleteClick(file)}
                                onShare={() => onOpenShare && onOpenShare(file._id)}
                                onPublicShare={() => onOpenPublicShare && onOpenPublicShare(file._id)}
                                onRemove={() => removeSharedAccess(file._id)}
                                onRevokePublic={() => revokePublicLink(file._id)}
                                onDownload={() => downloadItems([file])}
                                onOpenRename={() => onOpenRename && onOpenRename(file._id)}
                                onOpenMove={() => onOpenMove && onOpenMove(file._id)}
                            />
                        )}
                    </Box>
                </TableCell>

                <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge
                            overlap="circular"
                            badgeContent={file.isFolder && file.descendantCount ? file.descendantCount : null}
                            color="primary"
                            sx={{ mr: { xs: 1.5, sm: 2 } }}
                        >
                            <Avatar
                                variant="rounded"
                                sx={{
                                    bgcolor: file.isFolder ? 'warning.main' : getFileColor(file.fileType),
                                    mr: { xs: 1.5, sm: 2 },
                                    width: { xs: 36, sm: 44 },
                                    height: { xs: 36, sm: 44 },
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: file.isFolder ? 2 : 'none',
                                    border: file.isFolder ? `1px solid rgba(0,0,0,0.08)` : 'none'
                                }}
                            >
                                {file.isFolder
                                    ? <FolderOpenIcon sx={{ color: 'common.white', fontSize: { xs: 18, sm: 20 } }} />
                                    : getFileIcon(file.fileType)}
                            </Avatar>
                        </Badge>
                        {/* Truncate long filenames, show full name on hover/focus */}
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Tooltip title={file.fileName} placement="top" enterDelay={400}>
                                <Typography noWrap sx={{ maxWidth: { xs: 120, sm: 320, md: 420 }, fontWeight: 500 }}>{file.fileName}</Typography>
                            </Tooltip>

                            {/* Show file type and size under the filename for files (not folders) */}
                            {!file.isFolder && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {formatFileType(file.fileType)}{file.size ? ` • ${formatBytes(file.size)}` : ''}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </TableCell>

                {/* --- INTEGRATE Data --- */}
                    <TableCell sx={{ px: { xs: 1, sm: 2 } }}>
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

                <TableCell padding="checkbox" sx={{ px: { xs: 0.5, sm: 1 } }}>
                    {/* Visible in All tabs */}
                    <Checkbox
                        size="small"
                        checked={isSelected}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => { e.stopPropagation(); onSelectFile(file._id); }}
                    />
                </TableCell>
            </TableRow>

            {/* Modals are now owned by the parent `FileTable` to avoid mounting many instances per row */}
        </>
    );
};

export default FileTableRow;