import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar, IconButton, Menu, MenuItem, Typography, Checkbox, 
    TableRow, TableCell, CircularProgress, Box, 
    ListItemText, ListItemIcon,
} from '@mui/material';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FolderIcon from '@mui/icons-material/Folder';
import PublicIcon from '@mui/icons-material/Public';
import LinkOffIcon from '@mui/icons-material/LinkOff';

import { toast } from 'react-toastify';

import fileService from '../fileService.js';
import { manageShareAccess, revokePublicShare } from '../fileSlice.js';
import ShareModal from './modals/ShareModal.jsx';
import PublicShareModal from '../components/modals/PublicShareModal.jsx'

import { getFileIcon } from '../../../utils/fileUtils.jsx'; // ALL ICONS for File Types

// Accepting props from the FileList
const FileTableRow = ({ file, isSelected, onSelectFile, onDeleteClick, onNavigate, context }) => {
    // --- HOOKS & STATE ---
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { status, pendingActionFileIds } = useSelector((state) => state.files);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [isPublicShareModalOpen, setPublicShareModalOpen] = useState(false);

    // --- VARIABLES ---
    const isOwner = file.user._id === user._id;
    const isProcessing = status === 'loading' && pendingActionFileIds.includes(file._id);

    // --- HANDLERS ---
    const handleMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDownload = async () => {
        try {
            const { url } = await fileService.getDownloadLink(file._id, user.token);
            window.open(url, '_blank'); // Open the secure link in a new tab to trigger download
        } catch (error) {
            toast.error('Could not get download link for the file.');
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        onDeleteClick(file)
        handleMenuClose();
    };

    const handleRemoveAccess = () => {
        dispatch(manageShareAccess({ fileId: file._id }));
        handleMenuClose();
    };

    const handleRevokePublicShare = () => {
        dispatch(revokePublicShare(file._id))
            .unwrap()
            .then(() => {
                toast.success('Public link has been revoked!');
            })
            .catch((err) => {
                toast.error(err || 'Failed to revoke link.');
            });
        handleMenuClose();
    };

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
                }}>

                <TableCell padding="checkbox">
                        {/* Visible in All tabs */}
                        <Checkbox
                            checked={isSelected}
                            onChange={() => onSelectFile(file._id)}
                        />

                </TableCell>

                <TableCell component="th" scope="row">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar variant="rounded" sx={{ bgcolor: 'transparent', mr: 2 }}>
                            {file.isFolder 
                                ? <FolderIcon sx={{ color: 'text.primary' }} /> 
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
                    {/* Spinner during actions */}
                    {isProcessing ? (
                        <CircularProgress size={24} />
                    ) : (
                        <IconButton onClick={handleMenuClick}>
                            <MoreVertIcon />
                        </IconButton>
                    )}
                </TableCell>

            </TableRow>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDownload}>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                        >Download
                    </ListItemText>
                </MenuItem>

                {/* --- Contextual Actions Based on Ownership --- */}

        {/* --- menu item for sharing with specific users --- */}
                {isOwner && (
                    // Share Button
                    <MenuItem 
                        onClick={() => { 
                            setShareModalOpen(true); 
                            handleMenuClose(); 
                        }}>
                        <ListItemIcon>
                            <ShareIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            >Share with Users
                        </ListItemText>
                    </MenuItem>
                )}

        {/* --- menu item for public sharing --- */}
                {isOwner && (
                    <MenuItem 
                        onClick={() => { 
                            setPublicShareModalOpen(true); 
                            handleMenuClose(); 
                        }}>
                        <ListItemIcon>
                            <PublicIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                            > {file.publicShare?.isActive 
                                ? 'Manage Public Share' 
                                : 'Share Publicly'}
                        </ListItemText>
                    </MenuItem>
                )}

                {isOwner && file.publicShare?.isActive && (
                    <MenuItem onClick={handleRevokePublicShare}>
                        <ListItemIcon><LinkOffIcon fontSize="small" /></ListItemIcon>
                        <Typography color="error">Revoke Public Link</Typography>
                    </MenuItem>
                )}
                
                {isOwner && (
                    <MenuItem onClick={handleDelete}> 
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography color="error">Delete</Typography>
                    </MenuItem>                    
                )}

                {!isOwner && (
                    <MenuItem onClick={handleRemoveAccess}>
                        <ListItemIcon><ExitToAppIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Remove From My List</ListItemText>
                    </MenuItem>
                )}
            </Menu>

            {/* ShareModal will be controlled by this component's state */}
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
        </>
    );
};

export default FileTableRow;