import React from 'react';
import { useNavigate } from 'react-router-dom';
import AITaskGenerator from '../../ai/components/AITaskGenerator.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { Box, Typography, Paper, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TaskCreation = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }} elevation={1}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Create Task</Typography>
            <Typography 
                variant="body2" 
                color="text.secondary"
                >Create tasks using AI generator or the usual way.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={() => navigate('/dashboard')}
            aria-label="Back to dashboard"
            sx={{
              textTransform: 'none',
              borderRadius: 1,
              px: 2,
              py: 0.5,
              minWidth: 140,
              boxShadow: 1,
            }}
          >
            Back to Dashboard
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <Box sx={{ width: { xs: '100%', md: 3600 } }}>
          <AITaskGenerator />
        </Box>
        <Box sx={{ flex: 1 }}>
          <TaskForm />
        </Box>
      </Box>
    </Box>
  );
};

export default TaskCreation;
