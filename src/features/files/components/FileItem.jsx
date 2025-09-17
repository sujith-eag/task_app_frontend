import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    Typography
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import fileService from '../fileService';
import { deleteFile, manageShareAccess } from '../fileSlice.js';
import ShareModal from './ShareModal.jsx';

import { toast } from 'react-toastify';




const FileItem = ({ file }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);

    const isOwner = file.user._id === user._id;

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
        if (window.confirm('Are you sure you want to permanently delete this file?')) {
            dispatch(deleteFile(file._id));
        }
        handleMenuClose();
    };

    const handleRemoveAccess = () => {
        dispatch(manageShareAccess({ fileId: file._id }));
        handleMenuClose();
    };

    return (
        <>
            <ListItem
                secondaryAction={
                    <IconButton edge="end" aria-label="actions" onClick={handleMenuClick}>
                        <MoreVertIcon />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <Avatar>
                        <FolderIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={file.fileName}
                    secondary={!isOwner ? `Shared by: ${file.user.name}` : null}
                />
            </ListItem>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDownload}>
                    <ListItemIcon><DownloadIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Download</ListItemText>
                </MenuItem>

                {/* --- Contextual Actions Based on Ownership --- */}

                {isOwner && (
                    <MenuItem onClick={() => { setShareModalOpen(true); handleMenuClose(); }}>
                        <ListItemIcon><ShareIcon fontSize="small" /></ListItemIcon>
                        <ListItemText>Share</ListItemText>
                    </MenuItem>
                )}

                {isOwner && (
                    <MenuItem onClick={handleDelete}>
                        <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
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

            {/* The ShareModal will be controlled by this component's state */}
            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setShareModalOpen(false)}
                file={file}
            />
        </>
    );
};

export default FileItem;