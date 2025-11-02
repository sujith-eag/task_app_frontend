import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Modal, Box, Typography, List, ListItem, ListItemAvatar,
    Avatar, ListItemText, Button, IconButton, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useManageShareAccess } from '../../useFileQueries.js';
import fileService from '../../fileService.js';

// A simple styled box for the modal
const style = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)', width: 400,
    bgcolor: 'background.paper', boxShadow: 24, p: 3, borderRadius: 2
};

const ManageShareModal = ({ open, onClose, file }) => {
    const [revokingUserId, setRevokingUserId] = useState(null);
    const [sharedList, setSharedList] = useState([]);
    // local retry tracker to avoid infinite retry loops
    const [retriedFor, setRetriedFor] = useState(null);
    const currentParentId = useSelector((state) => state.files.currentParentId);

    const { mutateAsync: manageShareAccessMutate } = useManageShareAccess();

    const handleRevoke = async (userIdToRevoke) => {
        setRevokingUserId(userIdToRevoke);
        // Guard: ensure we have a valid userId and it's not the owner themself
        if (!userIdToRevoke) {
            toast.error('Invalid user selected for revoke.');
            setRevokingUserId(null);
            return;
        }
        if (String(userIdToRevoke) === String(file?.user?._id)) {
            toast.error('Cannot revoke access for file owner.');
            setRevokingUserId(null);
            return;
        }

        try {
            await manageShareAccessMutate({ fileId: file._id, userIdToRemove: userIdToRevoke });
            // onSuccess invalidates queries and shows toast
        } catch (err) {
            // If desired, implement a single refresh+retry logic here. For now the mutation will surface errors.
            console.warn('Revoke failed:', err);
        } finally {
            setRevokingUserId(null);
        }
    };

    // When modal opens, attempt to refresh the current folder's data to ensure names are populated
    const didRefreshRef = useRef(false);
    useEffect(() => {
        if (open && !didRefreshRef.current) {
            didRefreshRef.current = true;
            // No explicit refresh required; React Query mutations will invalidate queries on success.
        }

        if (!open) {
            didRefreshRef.current = false;
        }
    }, [open, currentParentId]);

    // Fetch current shares for the file when modal opens
    useEffect(() => {
        let mounted = true;
        if (open && file?._id) {
            (async () => {
                try {
                    const shares = await fileService.getFileShares(file._id);
                    // Normalize shares into a list of user objects where possible
                    const normalized = shares.map(s => s.user || s.userId || s);
                    if (mounted) setSharedList(normalized);
                } catch (e) {
                    if (mounted) setSharedList([]);
                }
            })();
        } else if (!open) {
            setSharedList([]);
        }
        return () => { mounted = false; };
    }, [open, file?._id]);

    // Clean up local state on close
    const handleClose = () => {
        setRevokingUserId(null);
        setRetriedFor(null);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6">Sharing settings for "{file?.fileName}"</Typography>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
                <Box sx={{ maxHeight: 300, overflow: 'auto', my: 2 }}>
                    {Array.isArray(sharedList) && sharedList.length > 0 ? (
                        <List>
                            {sharedList.map((entry, idx) => {
                                const user = entry?.user ?? entry;
                                const key = user?._id ?? user?.id ?? user?.email ?? `shared-${idx}`;
                                const avatar = user?.avatar || undefined;
                                const name = user?.name || (typeof user === 'string' ? user : String(user?._id ?? user?.id ?? 'Unknown')) || 'Unknown user';
                                const displayId = user?._id ?? user?.id ?? user;

                                return (
                                    <ListItem key={key} role="listitem" secondaryAction>
                                        <ListItemAvatar>
                                            {avatar ? <Avatar src={avatar} /> : <Avatar>{(name || 'U').split(' ').map(n => n[0]).join('').slice(0,2)}</Avatar>}
                                        </ListItemAvatar>
                                        <ListItemText primary={name} />
                                        {revokingUserId === String(displayId) ? (
                                            <CircularProgress size={24} />
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleRevoke(displayId)}
                                                disabled={!!revokingUserId}
                                                aria-label={`Revoke access for ${name}`}>
                                                Revoke
                                            </Button>
                                        )}
                                    </ListItem>
                                );
                            })}
                        </List>
                    ) : (
                        <Typography color="text.secondary">Not shared with any users.</Typography>
                    )}
                </Box>
                <Button onClick={handleClose} sx={{ mt: 2 }} aria-label="Close sharing modal">Done</Button>
            </Box>
        </Modal>
    );
};

export default ManageShareModal;