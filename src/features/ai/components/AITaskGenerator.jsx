import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, CircularProgress, Typography, Paper } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { startAIPlanSession, getAIPlanPreview } from "../aiTaskSlice.js";
import AIPlannerModal from './AIPlannerModal.jsx';


const AITaskGenerator = () => {
    const [prompt, setPrompt] = useState('');
    // State to control the modal's visibility
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);

    const dispatch = useDispatch();


    const { status } = useSelector((state) => state.ai);
    const isGenerating = status === 'generating' || status === 'refining';
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!prompt.trim()) return;
        
        // Prepare the AI slice for a new session
        dispatch(startAIPlanSession());
        // Open the modal
        setIsPlannerOpen(true);
        // Dispatch the thunk to get the first plan
        dispatch(getAIPlanPreview({ prompt }));
        
        setPrompt(''); // Clear the input field
    };
    return (
        <>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AutoAwesomeIcon color="primary" />
                Generate a New Plan with AI
            </Typography>

            <Box component="form" onSubmit={handleSubmit} 
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' } // Stacks vertically on mobile
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Describe your goal... e.g., 'Learning or Trip planning'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    multiline
                    maxRows={4}
                    disabled={isGenerating}
                    helperText="Enter a goal and AI will break it into tasks"
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isGenerating || !prompt.trim()}
                    sx={{
                        minWidth: { xs: '100%', sm: 150 }, // Full-width on mobile
                        height: 56
                    }}>
                    {isGenerating ? <CircularProgress size={24} /> : 'Create Plan'}
                </Button>
            </Box>
        </Paper>

        {/* Render the modal, controlled by local state */}
        <AIPlannerModal
            isOpen={isPlannerOpen}
            onClose={() => setIsPlannerOpen(false)}
        />
    </>        
    );
};

export default AITaskGenerator;