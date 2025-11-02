import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box, 
    Typography, List, ListItemButton, ListItemAvatar, Avatar, 
    ListItemText, Button, CircularProgress, TextField
} from '@mui/material';

import profileService from '../../../profile/profileService.js';
import { shareFile } from '../../fileSlice.js';
import { toast } from 'react-toastify';

const ShareModal = ({ isOpen, onClose, file }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Effect to fetch discoverable users when the modal opens
    const didFetchRef = useRef(false);
    useEffect(() => {
        if (isOpen && !didFetchRef.current) {
            didFetchRef.current = true;
            const fetchUsers = async () => {
                setIsLoading(true);
                try {
                    const allUsers = await profileService.getDiscoverableUsers();
                    setUsers(allUsers);
                } catch (error) {
                    toast.error('Could not fetch users to share with.');
                }
                setIsLoading(false);
            };
            fetchUsers();
        }

        if (!isOpen) {
            // Reset state when modal closes
            setUsers([]);
            setSearchTerm('');
            setSelectedUserId(null);
            didFetchRef.current = false;
        }
    }, [isOpen, user?._id]);

    const handleShare = () => {
        if (!selectedUserId) {
            toast.error('Please select a user to share with.');
            return;
        }
        dispatch(shareFile({ fileId: file._id, userIdToShareWith: selectedUserId }))
            .unwrap()
            .then(() => {
                toast.success('File successfully shared!');
                onClose();
            })
            .catch((error) => {
                toast.error(error || 'Failed to share file.');
            });
    };

    // Filter out users the file is already shared with
    const sharedUserIds = new Set(file?.sharedWith.map(share => share.user._id));
    const discoverableUsers = users.filter(u => !sharedUserIds.has(u._id));
    
    // Filter based on the search term
    const filteredUsers = discoverableUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog 
            open={isOpen} 
            onClose={onClose} 
            fullWidth
            maxWidth="xs"
        >
            <DialogTitle>Share "{file?.fileName}"</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    label="Search users..."
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Box sx={{ height: 300, overflow: 'auto', my: 1 }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CircularProgress />
                        </Box>
                    ) : filteredUsers.length === 0 ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Typography color="text.secondary">
                                No new users to share with.
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {filteredUsers.map((u) => (
                                <ListItemButton
                                    key={u._id}
                                    selected={selectedUserId === u._id}
                                    onClick={() => setSelectedUserId(u._id)}
                                >
                                    <ListItemAvatar><Avatar src={u.avatar} /></ListItemAvatar>
                                    <ListItemText primary={u.name} />
                                </ListItemButton>
                            ))}
                        </List>
                    )}
                </Box>
            </DialogContent>
            
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleShare}
                    disabled={!selectedUserId}
                >
                    Share File
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShareModal;