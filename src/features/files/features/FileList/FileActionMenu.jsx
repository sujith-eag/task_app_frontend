import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Menu, MenuItem, ListItemIcon, ListItemText, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PublicIcon from '@mui/icons-material/Public';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import PeopleIcon from '@mui/icons-material/People';

// This component receives the file and simple on<Action> handlers
const FileActionMenu = ({ file, onDelete, onShare, onManageShare, onPublicShare, onRemove, onRevokePublic, onDownload }) => {
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

    return (
        <>
            <IconButton onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem 
	                onClick={handleAction(onDownload)}>
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
                    <MenuItem onClick={handleAction(onShare)}>
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
                    <MenuItem onClick={handleAction(onPublicShare)}>
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