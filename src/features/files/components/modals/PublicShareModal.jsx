import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box, Typography, Select, MenuItem, FormControl, InputLabel,
    TextField, IconButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { useCreatePublicShare } from '../../useFileQueries.js';
import fileService from '../../fileService.js';

const PublicShareModal = ({ open, onClose, file }) => {
    const [duration, setDuration] = useState('1-hour');
    const [shareData, setShareData] = useState(null);

    useEffect(() => {
        if (open && file?.publicShare?.isActive) {
            setShareData(file.publicShare);
        }
    }, [open, file]);

    const { mutateAsync: createPublicShareMutate } = useCreatePublicShare();

    // If this is a folder, fetch its details to know if it's empty
    const [folderStats, setFolderStats] = useState(null);
    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            if (!file || !file.isFolder) return;
            try {
                const res = await fileService.getFolderDetails(file._id);
                if (mounted) setFolderStats(res.stats || null);
            } catch (e) {
                if (mounted) setFolderStats(null);
            }
        };
        fetch();
        return () => { mounted = false; };
    }, [file]);

    const isFolderEmpty = file?.isFolder && (folderStats ? folderStats.fileCount === 0 : false);

    const handleCreateShare = async () => {
        try {
            const payload = await createPublicShareMutate({ fileId: file._id, duration });
            setShareData(payload);
            // success toast is handled by the mutation hook
        } catch (err) {
            // Show friendly message based on server response
            const msg = err?.response?.data?.message || err?.message || 'Failed to create public link.';
            toast.error(msg);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(shareData.code);
        toast.info('Code copied to clipboard!');
    };
    
    // Reset state when the modal is closed
    const handleClose = () => {
        setShareData(null);
        setDuration('1-hour');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Share "{file?.fileName}" Publicly</DialogTitle>
            <DialogContent>
                {shareData ? (
                    <Box>
                        <Typography variant="body2" gutterBottom>
                            Share this code with anyone:
                        </Typography>
                        <TextField
                            value={shareData.code}
                            fullWidth
                            slotProps={{
                                input: {
                                    readOnly: true,
                                    endAdornment: (
                                        <IconButton onClick={handleCopyToClipboard}>
                                            <ContentCopyIcon />
                                        </IconButton>
                                    )
                                }
                            }}
                        />
                        {file?.isFolder && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Recipients can download all folder contents as a ZIP file.
                            </Typography>
                        )}
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                            Expires: {new Date(shareData.expiresAt).toLocaleString()}
                        </Typography>
                    </Box>
                ) : (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Link Duration</InputLabel>
                        <Select
                            value={duration}
                            label="Link Duration"
                            onChange={(e) => setDuration(e.target.value)}
                        >
                            <MenuItem value="1-hour">1 Hour</MenuItem>
                            <MenuItem value="1-day">1 Day</MenuItem>
                            <MenuItem value="7-days">7 Days</MenuItem>
                        </Select>
                    </FormControl>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                {!shareData && (
                    <Button onClick={handleCreateShare} variant="contained" disabled={isFolderEmpty}>
                        Create Link
                    </Button>
                )}
                {isFolderEmpty && (
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                        Folder is empty — cannot create public link.
                    </Typography>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default PublicShareModal;