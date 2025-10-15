import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, 
    TextField, DialogActions, Button, CircularProgress 
} from '@mui/material';

const CreateFolderModal = ({ open, onClose, onCreate }) => {
    const [folderName, setFolderName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Reset state when the modal is opened/closed to avoid stale data
    useEffect(() => {
        if (!open) {
            setFolderName('');
            setIsLoading(false);
            setApiError(null);
        }
    }, [open]);

    const handleCreate = () => {
        setIsLoading(true);
        setApiError(null); // Clear previous errors
        try {
            // Wait for the async onCreate function to complete
            onCreate(folderName);
            onClose(); // Only close on success
        } catch (err) {
            // If it fails, set the error message to display it
            setApiError(err.message || 'Could not create folder.');
        } finally {
            // Always stop loading, whether it succeeded or failed
            setIsLoading(false);
        }
    };

    const handleTextChange = (e) => {
        // Clear error as soon as the user starts typing again
        if (apiError) {
            setApiError(null);
        }
        setFolderName(e.target.value);
    };
    
    return (
        <Dialog open={open} onClose={isLoading ? null : onClose} fullWidth maxWidth="xs">
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Folder Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={folderName}
                    onChange={handleTextChange}
                    // Display the error state and message
                    error={!!apiError}
                    helperText={apiError}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    onClick={handleCreate}
                    // Disable button if no name, or if loading
                    disabled={!folderName || isLoading}
                    variant="contained"
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};


export default CreateFolderModal;