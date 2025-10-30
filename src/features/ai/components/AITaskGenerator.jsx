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
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4,
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(144, 202, 249, 0.08) 0%, rgba(66, 165, 245, 0.05) 100%)'
                : 'linear-gradient(135deg, rgba(144, 202, 249, 0.1) 0%, rgba(255, 255, 255, 1) 100%)',
            border: 1,
            borderColor: 'primary.main',
            borderStyle: 'solid',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 6,
              borderColor: 'primary.dark'
            }
          }}
        >
            <Typography 
              variant="h6" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 2,
                fontWeight: 600
              }}
            >
                <AutoAwesomeIcon 
                  color="primary" 
                  sx={{ 
                    animation: 'pulse 2s ease-in-out infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.1)' }
                    }
                  }}
                />
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
                    label="Describe your goal..."
                    placeholder="e.g., Learning React in 2 weeks, Planning a trip to Japan"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    multiline
                    maxRows={4}
                    disabled={isGenerating}
                    helperText="Enter a goal and AI will break it into actionable tasks"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 2
                        }
                      }
                    }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isGenerating || !prompt.trim()}
                    sx={{
                        minWidth: { xs: '100%', sm: 150 },
                        height: 56,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 4
                        },
                        '&:active': {
                          transform: 'translateY(0)'
                        }
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