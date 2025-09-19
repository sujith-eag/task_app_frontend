import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Modal, Box, Typography, Button, CircularProgress, Alert,
    Stack, TextField, Paper, Divider, Chip, Dialog, DialogActions,
    DialogContent, DialogContentText, DialogTitle,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { getAIPlanPreview, saveAIPlan, discardAIPlan } from '../../ai/aiTaskSlice.js';
import { v4 as uuidv4 } from 'uuid';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: '80%', md: 700 },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '90vh',
};

const AIPlannerModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { status, previewTasks, refinementCount, refinementLimit, error } = useSelector((state) => state.ai);

    const [refinementPrompt, setRefinementPrompt] = useState('');
    // Local state to allow users to edit the plan before saving
    const [editableTasks, setEditableTasks] = useState([]);
    const [isDiscardConfirmOpen, setDiscardConfirmOpen] = useState(false);

    // Sync Redux state to local editable state when a new preview is generated
    useEffect(() => {
        setEditableTasks(previewTasks);
    }, [previewTasks]);

    // useEffect(() => {
    //     setEditableTasks(previewTasks.map(task => ({
    //         ...task,
    //         dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    //     })));
    // }, [previewTasks]);

    useEffect(() => {
        if (status === 'succeeded') {
            dispatch(discardAIPlan()); // Now we reset the state
            onClose(); // And close the modal
        }
    }, [status, dispatch, onClose]);

    
    // const handleEditableChange = (index, field, value) => {
    //     const newTasks = [...editableTasks];
    //     newTasks[index][field] = value;
    //     setEditableTasks(newTasks);
    // };

const handleEditableChange = (index, field, value) => {
    const newTasks = editableTasks.map((task, i) => {
        // If this is the task we want to update...
        if (i === index) {
            // ...return a NEW object with the updated field.
            return { ...task, [field]: value };
        }
        // Otherwise, return the original, unchanged task.
        return task;
    });
    setEditableTasks(newTasks);
};
    const handleRefine = (e) => {
        e.preventDefault();
        if(!refinementPrompt.trim()) return;
        
        // const currentPlan = `The user has edited the current plan to this: 
            // ${JSON.stringify(editableTasks)}. `;
        // const newPrompt = currentPlan + `Now apply this refinement: ${refinementPrompt}`;

        dispatch(getAIPlanPreview({ 
            prompt: refinementPrompt,
            editedPlan : editableTasks,
        }));
        setRefinementPrompt('');
    };

    const handleSave = () => {
        dispatch(saveAIPlan({ tasks: editableTasks }));
    };

    const handleDiscard = () => {
        dispatch(discardAIPlan());
        setDiscardConfirmOpen(false);
        onClose();
    };

    const isLoading = status === 'generating' || status === 'refining' || status === 'saving';
    const canRefine = refinementCount < refinementLimit;

const renderContent = () => {
    // --- Priority 1: Handle error state ---
    if (status === 'error') {
            return( 
                <Box sx={{ my: 2, textAlign: 'center' }}>
                    <Alert severity="error">{error || 'An unexpected error occurred.'}</Alert>
                    <Button 
                        variant="outlined" 
                        onClick={() => dispatch(discardAIPlan())} // Resets the AI state
                        sx={{ mt: 2 }}
                    >
                        Try Again
                    </Button>
                </Box>);
    }

    // --- Priority 2: Handle loading states ---
    if (isLoading && editableTasks.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>
                    {status === 'generating' ? 'Generating your initial plan...' : 'Refining your plan...'}
                </Typography>
            </Box>
        );
    }

    // --- Priority 3: Display the preview if available ---
    if (editableTasks.length > 0) {
        return (
            <Stack spacing={2} sx={{ mt: 1 }}>
                {editableTasks.map((task, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                        <TextField
                            fullWidth
                            label="Task Title"
                            value={task.title}
                            onChange={(e) => handleEditableChange(index, 'title', e.target.value)}
                            variant="standard"
                        />
                        <TextField
                            fullWidth
                            label="Description"
                            value={task.description}
                            onChange={(e) => handleEditableChange(index, 'description', e.target.value)}
                            variant="standard"
                            multiline
                            sx={{ mt: 1 }}
                        />
                        {/* Display subtasks as non-editable for simplicity */}
                        {task.subTasks && task.subTasks.length > 0 && (
                                <Typography variant="body2" sx={{mt: 1, pl: 1}}>
                                Sub-tasks: {task.subTasks.map(st => st.text).join(', ')}
                                </Typography>
                        )}


                        {task.tags && task.tags.length > 0 && (
                            <Box sx={{ mt: 2 }}>
                                {task.tags.map(tag => <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />)}
                            </Box>
                        )}
                    </Paper>
                ))}
            </Stack>
        );
    }
    return null;
};

// This is the main return statement for the AIPlannerModal component
return (
    <>
        <Modal open={isOpen} onClose={onClose}>
            <Box sx={modalStyle}>
                
                {/* --- 1. NON-SCROLLABLE HEADER --- */}
                <Box sx={{ flexShrink: 0 }}>
                    <Typography variant="h5" component="h2">AI Task Planner</Typography>
                    {(status === 'previewing' || status === 'refining') && (
                        <Typography variant="caption" color="text.secondary">
                            Refinement {refinementCount} of {refinementLimit}. You can edit details below.
                        </Typography>
                    )}
                </Box>
                <Divider sx={{ my: 2 }} />

                {/* --- 2. SCROLLABLE CONTENT AREA --- */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
                    {renderContent()}
                </Box>
                
                <Divider sx={{ mt: 2 }} />
                {/* --- 3. NON-SCROLLABLE FOOTER --- */}
                <Box sx={{ flexShrink: 0, pt: 2 }}>
                    {(status === 'previewing' || status === 'refining') && canRefine && (
                        <Box component="form" onSubmit={handleRefine} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField 
                                fullWidth 
                                label="Enter a refinement... e.g., 'Make the first task high priority'" 
                                value={refinementPrompt} 
                                onChange={(e) => setRefinementPrompt(e.target.value)} 
                                disabled={status === 'refining'} 
                            />
                            <Button type="submit" 
                                variant="outlined" 
                                startIcon={status === 'refining' ? <CircularProgress size={20} /> : <AutoFixHighIcon />} 
                                disabled={status === 'refining' || !refinementPrompt.trim()}
                                > {status === 'refining' ? 'Refining...' : 'Refine'}
                            </Button>
                        </Box>
                    )}
                    <Stack direction="row" justifyContent="space-between">
                        <Button 
                            variant="text" color="error" 
                            startIcon={<DeleteForeverIcon />} 
                            onClick={() => setDiscardConfirmOpen(true)} 
                            disabled={isLoading}>
                            Discard Plan
                        </Button>
                        <Button variant="contained" color="primary" 
                            startIcon={status === 'saving' ? <CircularProgress size={20} /> : <CheckCircleIcon />} 
                            onClick={handleSave} disabled={isLoading || editableTasks.length === 0}>
                            {status === 'saving' ? 'Saving...' : 'Confirm & Create Tasks'}
                        </Button>
                    </Stack>
                </Box>

            </Box>
        </Modal>

        {/* --- Discard Confirmation Dialog (no changes needed here) --- */}
        <Dialog open={isDiscardConfirmOpen} onClose={() => setDiscardConfirmOpen(false)}>
            <DialogTitle>Discard Plan?</DialogTitle>
            <DialogContent><DialogContentText>Are you sure you want to discard this plan? This action cannot be undone and will count as one AI usage credit.</DialogContentText></DialogContent>
            <DialogActions>
                <Button onClick={() => setDiscardConfirmOpen(false)}>Cancel</Button>
                <Button onClick={handleDiscard} color="error">Discard</Button>
            </DialogActions>
        </Dialog>
    </>
);      
};

export default AIPlannerModal;