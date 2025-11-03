import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, 
    TextField, DialogActions, Button, CircularProgress 
} from '@mui/material';

const RenameModal = ({ open, onClose, onRename, itemToRename }) => {
    const [newName, setNewName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        if (!open) {
            setNewName('');
            setIsLoading(false);
            setApiError(null);
        } else {
            setNewName(itemToRename?.fileName || '');
        }
    }, [open, itemToRename]);

    const handleRename = async () => {
        setIsLoading(true);
        setApiError(null);
        try {
            await onRename(itemToRename._id, newName);
            onClose();
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || 'Could not rename item.';
            setApiError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={isLoading ? null : onClose} fullWidth maxWidth="xs">
            <DialogTitle>Rename Item</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="New name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newName}
                    onChange={(e) => { if (apiError) setApiError(null); setNewName(e.target.value); }}
                    error={!!apiError}
                    helperText={apiError}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleRename}
                    disabled={!newName || isLoading}
                    variant="contained"
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RenameModal;
