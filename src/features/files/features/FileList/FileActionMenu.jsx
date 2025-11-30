import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { Menu, MenuItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PublicIcon from '@mui/icons-material/Public';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import PeopleIcon from '@mui/icons-material/People';
import fileService from '../../fileService.js';

// This component receives the file and simple on<Action> handlers
const FileActionMenu = ({ file, onDelete, onShare, onManageShare, onPublicShare, onRemove, onRevokePublic, onDownload, onOpenRename, onOpenMove }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const { user } = useSelector((state) => state.auth);
    // Normalize id comparison to strings to avoid mismatches between ObjectId and string
    const fileOwnerId = file?.user?._id || file?.user || null;
    const isOwner = fileOwnerId && user && String(fileOwnerId) === String(user._id);

    const handleClick = (event) => {
        event.stopPropagation(); // Prevent row click event
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action) => () => {
        action();
        handleClose();
    };

    // IMPROVED: Use React Query for caching folder stats
    // Only fetch when menu is open AND file is a folder
    // Cache for 60 seconds to avoid repeated API calls
    const { data: folderDetails } = useQuery({
        queryKey: ['folderDetails', file?._id],
        queryFn: () => fileService.getFolderDetails(file._id),
        enabled: Boolean(anchorEl) && file?.isFolder,
        staleTime: 60000, // Cache for 1 minute
        gcTime: 300000, // Keep in cache for 5 minutes (formerly cacheTime)
    });

    const folderStats = folderDetails?.stats || null;
    const isFolderEmpty = file?.isFolder && (!folderStats || folderStats.fileCount === 0);

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem 
                    onClick={(e) => { e.stopPropagation(); 
                        if (!isFolderEmpty) { onDownload(); handleClose(); } 
                        else handleClose(); }}
                    disabled={isFolderEmpty}
                    title={isFolderEmpty ? 'Folder is empty — cannot download.' : ''}
                    >
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
                    <MenuItem
                        onClick={(e) => { e.stopPropagation(); 
                            if (!isFolderEmpty) { onShare(); handleClose(); } 
                            else handleClose(); }}
                        disabled={file?.isFolder && isFolderEmpty}
                        title={file?.isFolder && isFolderEmpty ? 'Folder is empty — nothing to share.' : ''}
                    >
                        <ListItemIcon>
                            <ShareIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Share with Users</ListItemText>
                    </MenuItem>
                )}
                {/* menu item to remove shared people */}
                {isOwner && Array.isArray(file.sharedWith) && file.sharedWith.length > 0 && (
                    <MenuItem onClick={handleAction(onManageShare)}>
                        <ListItemIcon>
                            <PeopleIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            Manage Sharing
                        </ListItemText>
                    </MenuItem>
                )}


				{/* --- menu item for public sharing --- */}
                {isOwner && (
                    <MenuItem onClick={(e) => { e.stopPropagation(); if (!isFolderEmpty) { onPublicShare(); handleClose(); } else handleClose(); }}
                        disabled={file?.isFolder && isFolderEmpty}
                        title={file?.isFolder && isFolderEmpty ? 'Folder is empty — cannot create public link.' : ''}
                    >
                        <ListItemIcon>
                            <PublicIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            {file.publicShare?.isActive 
                                ? 'Manage Public Share' 
                                : 'Share Publicly'}
                        </ListItemText>
                    </MenuItem>
                )}
                {isOwner && (
                    <MenuItem onClick={handleAction(onOpenRename)}>
                        <ListItemIcon>
                            {/* rename icon */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor"/><path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
                        </ListItemIcon>
                        <ListItemText>Rename</ListItemText>
                    </MenuItem>
                )}
                {isOwner && (
                    <MenuItem onClick={handleAction(onOpenMove)}>
                        <ListItemIcon>
                            {/* move icon */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4v3H5v10h10v-5h3v8H4V4h6z" fill="currentColor"/></svg>
                        </ListItemIcon>
                        <ListItemText>Move</ListItemText>
                    </MenuItem>
                )}
                
                {isOwner && file.publicShare?.isActive && (
                    <MenuItem onClick={handleAction(onRevokePublic)}>
                        <ListItemIcon>
                            <LinkOffIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography color="error">
                            Revoke Public Link
                        </Typography>
                    </MenuItem>
                )}
                
                {isOwner && (
                    <MenuItem onClick={handleAction(onDelete)}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography color="error">
                            Delete
                        </Typography>
                    </MenuItem>
                )}

                {!isOwner && (
                    <MenuItem onClick={handleAction(onRemove)}>
                        <ListItemIcon>
                            <ExitToAppIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            Remove From My List
                        </ListItemText>
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};

export default FileActionMenu;