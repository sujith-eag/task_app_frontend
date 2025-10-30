import React, { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// MUI Components & Icons
import { Box, IconButton, Typography, Tooltip, Button } from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';

import ConfirmationDialog from '../../../components/ConfirmationDialog.jsx';
import { deleteTask, removeTaskOptimistic, 
  undoDeleteTask } from '../taskSlice.js';

const UndoToast = ({ onConfirmUndo, closeToast }) => {
  const handleConfirmAndClose = () => {
    onConfirmUndo();
    closeToast();
  };
  return (
    <Box 
        sx={{ display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            width: '100%' 
        }}>
      <Typography 
        variant="body1" 
        sx={{ color: 'inherit' }}
        >Task Deleted
      </Typography>
      <Button 
        size="small" 
        color="inherit" 
        onClick={handleConfirmAndClose} 
        sx={{ ml: 2, fontWeight: 'bold' }}
        >UNDO
      </Button>
    </Box>
  );
};

const TaskActions = ({ taskId, taskTitle, onOpenEdit }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const dispatch = useDispatch();
  const deleteTimeoutRef = useRef(null);

  const handleDeleteConfirm = useCallback(async () => {
    setOpenDeleteDialog(false);
    dispatch(removeTaskOptimistic(taskId));

    const undoAction = () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
      dispatch(undoDeleteTask(taskId));
    };

    toast.warning(
        <UndoToast onConfirmUndo={undoAction} />, {
            autoClose: 3500,
            hideProgressBar: false,
            closeButton: false,
            pauseOnHover: false,
            draggable: false,
        });
    
    deleteTimeoutRef.current = setTimeout(() =>{
      dispatch(deleteTask(taskId));
    }, 4500);
  }, [dispatch, taskId]);

  return (
    <>
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Edit task" arrow>
          <IconButton 
              size="small" 
              onClick={onOpenEdit} 
              aria-label="edit task"
              sx={{
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: 'primary.main'
                }
              }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Delete task" arrow>
          <IconButton 
              size="small" 
              onClick={() => setOpenDeleteDialog(true)} 
              aria-label="delete task"
              sx={{
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: 'error.main'
                }
              }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <ConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskTitle}"? You can undo this action within 4 seconds.`}
        variant="delete"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

export default TaskActions;