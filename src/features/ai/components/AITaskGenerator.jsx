import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextField, Button, CircularProgress, Typography, Paper, Stack } from '@mui/material';
import ConfirmationDialog from '../../../components/ConfirmationDialog.jsx';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { startAIPlanSession, getAIPlanPreview, discardAIPlan } from "../aiTaskSlice.js";
import AIPlannerModal from './AIPlannerModal.jsx';


const AITaskGenerator = () => {
    const [prompt, setPrompt] = useState('');
    // State to control the modal's visibility
    const [isPlannerOpen, setIsPlannerOpen] = useState(false);

    const dispatch = useDispatch();


  const { status, sessionId, previewTasks } = useSelector((state) => state.ai);
  const isGenerating = status === 'generating' || status === 'refining';
  const hasPreview = Array.isArray(previewTasks) && previewTasks.length > 0;
  const [isDiscardConfirmOpen, setDiscardConfirmOpen] = useState(false);
    
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!prompt.trim()) return;

    // If there is already an active session (sessionId) and it hasn't
    // completed, don't wipe it — continue the existing session so the
    // user can close/re-open the modal without losing in-flight results.
    const shouldStartNew = !sessionId || status === 'succeeded' || (Array.isArray(previewTasks) && previewTasks.length === 0);
    if (shouldStartNew) {
      dispatch(startAIPlanSession());
    }

    // Open the modal (user may have closed it previously)
    setIsPlannerOpen(true);

    // Dispatch the thunk to get the first plan (thunk will attach sessionId from state)
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
                    disabled={isGenerating || hasPreview}
                    helperText={hasPreview ? 'An AI plan is ready — resume to view' : 'Enter a goal and AI will break it into actionable tasks'}
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
                    disabled={isGenerating || hasPreview || !prompt.trim()}
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

    {/* Persistent session indicator / recovery banner (placed below the generator) */}
    {sessionId && (isGenerating || hasPreview) && (
      <Paper elevation={6} sx={{ p: 2, mt: 2, mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: '4px solid', borderColor: 'primary.main', backgroundColor: (theme) => theme.palette.action.hover }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isGenerating ? <CircularProgress size={20} /> : null}
          <Box>
            <Typography variant="subtitle2">{isGenerating ? 'AI generation in progress' : hasPreview ? 'AI preview available' : 'AI session active'}</Typography>
            <Typography variant="body2" color="text.secondary">You have an active AI session — you can resume or discard it.</Typography>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="center">
          <Button size="small" variant="outlined" onClick={() => setIsPlannerOpen(true)} sx={{ width: { xs: '100%', sm: 'auto' } }}>Resume</Button>
          <Button size="small" color="error" variant="contained" onClick={() => setDiscardConfirmOpen(true)} sx={{ width: { xs: '100%', sm: 'auto' } }}>Discard</Button>
        </Stack>
      </Paper>
    )}

    {/* Render the modal, controlled by local state */}
    <AIPlannerModal
      isOpen={isPlannerOpen}
      onClose={() => setIsPlannerOpen(false)}
    />

    {/* Discard confirmation for the banner action (uses global ConfirmationDialog) */}
    <ConfirmationDialog
      open={isDiscardConfirmOpen}
      onClose={() => setDiscardConfirmOpen(false)}
      onConfirm={() => { dispatch(discardAIPlan()); setDiscardConfirmOpen(false); }}
      title="Discard AI Plan?"
      message="Discarding this AI session will remove the preview and count as one AI usage credit. Are you sure you want to discard?"
      variant="delete"
      confirmText="Discard"
      cancelText="Cancel"
      maxWidth="xs"
    />
    </>        
    );
};

export default AITaskGenerator;