import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Box, Typography, Select, MenuItem, FormControl, InputLabel,
    TextField, IconButton
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { toast } from 'react-toastify';
import { createPublicShare } from '../../fileSlice.js';

const PublicShareModal = ({ open, onClose, file }) => {
    const dispatch = useDispatch();
    const [duration, setDuration] = useState('1-hour');
    const [shareData, setShareData] = useState(null);

    useEffect(() => {
        if (open && file?.publicShare?.isActive) {
            setShareData(file.publicShare);
        }
    }, [open, file]);

    const handleCreateShare = () => {
        dispatch(createPublicShare({ fileId: file._id, duration }))
            .unwrap()
            .then((payload) => {
                setShareData(payload);
                toast.success('Public share link created!');
            })
            .catch((err) => toast.error(err || 'Failed to create link.'));
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
                        <Typography>Share this code with anyone:</Typography>
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
                        <Typography variant="caption">
                            Link expires on: {new Date(shareData.expiresAt).toLocaleString()}
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
                    <Button onClick={handleCreateShare} variant="contained">
                        Create Link
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default PublicShareModal;