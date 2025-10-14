import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Modal, Box, Typography, List, ListItem, ListItemAvatar,
    Avatar, ListItemText, Button, IconButton, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { manageShareAccess } from '../../fileSlice.js';

// A simple styled box for the modal
const style = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: 400,
    bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: 2
};

const ManageShareModal = ({ open, onClose, file }) => {
    const dispatch = useDispatch();
    const [revokingUserId, setRevokingUserId] = useState(null);

    const handleRevoke = (userIdToRevoke) => {
        setRevokingUserId(userIdToRevoke);
        dispatch(manageShareAccess({ fileId: file._id, userIdToRemove: userIdToRevoke }))
            .unwrap()
            .then(() => {
                toast.success('User access revoked.');
            })
            .catch((err) => {
                toast.error(err || 'Failed to revoke access.');
            })
            .finally(() => {
                setRevokingUserId(null); // Clear the loading state for this user
            });
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6">Sharing settings for "{file?.fileName}"</Typography>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Box sx={{ maxHeight: 300, overflow: 'auto', my: 2 }}>
                    {file?.sharedWith.length > 0 ? (
                        <List>
                            {file.sharedWith.map(({ user }) => (
                                <ListItem key={user._id}>
                                    <ListItemAvatar><Avatar src={user.avatar} /></ListItemAvatar>
                                    <ListItemText primary={user.name} />
                                    {revokingUserId === user._id ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleRevoke(user._id)}
                                        >
                                            Revoke
                                        </Button>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="text.secondary">Not shared with any users.</Typography>
                    )}
                </Box>
                <Button onClick={onClose} sx={{ mt: 2 }}>Done</Button>
            </Box>
        </Modal>
    );
};

export default ManageShareModal;