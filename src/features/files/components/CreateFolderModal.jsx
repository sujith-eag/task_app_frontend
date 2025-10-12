import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, 
    TextField, DialogActions, Button } from '@mui/material';

const CreateFolderModal = ({ open, onClose, onCreate }) => {
    const [folderName, setFolderName] = useState('');

    const handleCreate = () => {
        onCreate(folderName);
        setFolderName('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
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
                    onChange={(e) => setFolderName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!folderName}>Create</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateFolderModal;