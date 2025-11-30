import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Box, 
    Typography, List, ListItemButton, ListItemAvatar, Avatar, 
    ListItemText, Button, CircularProgress, TextField, Alert
} from '@mui/material';

import profileService from '../../../profile/profileService.js';
import { toast } from 'react-toastify';
import fileService from '../../fileService.js';
import { useShareFile } from '../../useFileQueries.js';

const ShareModal = ({ isOpen, onClose, file }) => {
    const { user } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sharedUserIdsSet, setSharedUserIdsSet] = useState(new Set());

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
        // When modal opens, fetch current shares for this file so we can filter
        if (isOpen && file?._id) {
            (async () => {
                try {
                    const shares = await fileService.getFileShares(file._id);
                    // shares may be array of { userId/user } depending on backend; normalize to ids
                    const ids = shares.map(s => (s.user?._id || s.userId || s.user || s._id || s.id)).filter(Boolean).map(String);
                    setSharedUserIdsSet(new Set(ids));
                } catch (e) {
                    // ignore errors; we can still show all users
                }
            })();
        }

        if (!isOpen) {
            // Reset state when modal closes
            setUsers([]);
            setSearchTerm('');
            setSelectedUserId(null);
            didFetchRef.current = false;
        }
    }, [isOpen, user?._id]);

    const { mutateAsync: shareFileMutate } = useShareFile();

    const handleShare = async () => {
        if (!selectedUserId) {
            toast.error('Please select a user to share with.');
            return;
        }
        try {
            await shareFileMutate({ fileId: file._id, userIdToShareWith: selectedUserId });
            // success toast is provided by the mutation hook
            onClose();
        } catch (err) {
            // mutation hook shows toast on error already
        }
    };

    // Filter out users the file is already shared with (use fetched shares)
    const discoverableUsers = users.filter(u => !sharedUserIdsSet.has(u._id));
    
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
                {file?.isFolder && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        Sharing this folder will grant access to all files and subfolders inside it.
                    </Alert>
                )}
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