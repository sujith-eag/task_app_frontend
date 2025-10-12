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

import { toast } from 'react-toastify';

import fileService from '../fileService.js';
import { manageShareAccess } from '../fileSlice.js';
import ShareModal from './ShareModal.jsx';
import { getFileIcon } from '../../../utils/fileUtils.jsx';

// Accepting props from the FileList
const FileItem = ({ file, isSelected, onSelectFile, onDeleteClick }) => {
    // --- HOOKS & STATE ---
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { status, pendingActionFileIds } = useSelector((state) => state.files);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);

    // --- VARIABLES ---
    const isOwner = file.user._id === user._id;
    const isProcessing = status === 'loading' && pendingActionFileIds.includes(file._id);

    // --- HANDLERS ---
    const handleMenuClick = (event) => {
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
            toast.error('Could not get download link.');
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


    return (
        <>
            <TableRow 
                sx={{ 
                    '&:hover': { 
                        backgroundColor: 'action.hover' 
                    },
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
                            {getFileIcon(file.fileType)}
                        </Avatar>
                        {/* Truncate long filenames */}
                        <Typography noWrap>{file.fileName}</Typography>
                    </Box>
                </TableCell>

                {/* --- INTEGRATE SENDER'S NAME --- */}
                <TableCell>
                    {isOwner ? (
                        new Date(file.createdAt).toLocaleDateString()
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            {`Shared by: ${file.user.name}`}
                        </Typography>
                    )}
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
                            >Share
                        </ListItemText>
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
        </>
    );
};

export default FileItem;