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

import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description'; // For Word
import SlideshowIcon from '@mui/icons-material/Slideshow'; // For PowerPoint
import GridOnIcon from '@mui/icons-material/GridOn'; // For Excel
import FolderZipIcon from '@mui/icons-material/FolderZip'; // For Archives
import CodeIcon from '@mui/icons-material/Code'; // For Code/Text
import ArticleIcon from '@mui/icons-material/Article'; // The backup icon


import { toast } from 'react-toastify';

import fileService from '../fileService.js';
import { deleteFile, manageShareAccess } from '../fileSlice.js';
import ShareModal from './ShareModal.jsx';



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

    // Helper function to get the right icon based on the file's MIME type
    const getFileIcon = (mimeType) => {
        if (mimeType.startsWith('image/')) return <ImageIcon />;
        
        switch (mimeType) {
            case 'application/pdf':
                return <PictureAsPdfIcon />;
            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return <DescriptionIcon />;
            case 'application/vnd.ms-powerpoint':
            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                return <SlideshowIcon />;
            case 'application/vnd.ms-excel':
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                return <GridOnIcon />;
            case 'application/zip':
            case 'application/x-rar-compressed':
                return <FolderZipIcon />;
            case 'text/javascript':
            case 'text/html':
            case 'text/css':
            case 'application/json':
                return <CodeIcon />;
            default:
                // This is the backup for .txt, .csv, and any other type
                return <ArticleIcon />; 
        }
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
                        {getFileIcon(file.fileType)}                        
                        {/* <FolderIcon /> */}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={file.fileName}
                    secondary={
                        isOwner 
                        ? `Uploaded on: ${new Date(file.createdAt).toLocaleDateString()}`
                        : `Shared by: ${file.user.name}`
                    }
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