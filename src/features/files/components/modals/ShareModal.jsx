import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal, Box, Typography,List, ListItem, ListItemButton, ListItemAvatar,
Avatar, ListItemText,Button, CircularProgress, TextField
} from '@mui/material';
import profileService from '../../../profile/profileService.js';
import { shareFile } from '../../fileSlice.js';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const ShareModal = ({ isOpen, onClose, file }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Effect to fetch discoverable users when the modal opens
    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                setIsLoading(true);
                try {
                    const discoverableUsers = await profileService.getDiscoverableUsers(user.token);
                    setUsers(discoverableUsers);
                } catch (error) {
                    toast.error('Could not fetch users to share with.');
                }
                setIsLoading(false);
            };
            fetchUsers();
        }
    }, [isOpen, user.token]);

    const handleShare = () => {
        if (!selectedUserId) {
            toast.error('Please select a user to share with.');
            return;
        }
        dispatch(shareFile({ fileId: file._id, userIdToShareWith: selectedUserId }))
            .unwrap() // <--- Use unwrap
            .then(() => {
                toast.success(`File successfully shared!`);
                onClose(); // Close the modal after sharing
            })
            .catch((error) => {
                toast.error(error || 'Failed to share file.');
            });
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Share "{file?.fileName}"
                </Typography>
                <TextField
                    label="Search users..."
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Box sx={{ maxHeight: 300, overflow: 'auto', my: 2 }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
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
                <Button
                    variant="contained"
                    onClick={handleShare}
                    disabled={!selectedUserId}
                >
                    Share File
                </Button>
            </Box>
        </Modal>
    );
};

export default ShareModal;