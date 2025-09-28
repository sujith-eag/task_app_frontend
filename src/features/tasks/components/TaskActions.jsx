import React, { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// MUI Components & Icons
import { Box, IconButton, Dialog, DialogActions, 
    DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';

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

  const handleDeleteConfirm = useCallback(() => {
    dispatch(removeTaskOptimistic(taskId));
    setOpenDeleteDialog(false);

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
  }, [dispatch, taskId, taskTitle]);

  return (
    <>
      <Box>
        <IconButton 
            size="small" 
            onClick={onOpenEdit} 
            aria-label="edit task">
            <EditIcon />
        </IconButton>
        
        <IconButton 
            size="small" 
            onClick={() => setOpenDeleteDialog(true)} 
            aria-label="delete task">
            <CloseIcon />
        </IconButton>
      </Box>

      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"      
        >
        <DialogTitle id="alert-dialog-title"
            >{"Confirm Deletion"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText 
            id="alert-dialog-description">
            Are you sure you want to delete the task: "{taskTitle}"?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            >Cancel
          </Button>
          
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            autoFocus
            >Delete
        </Button>
        </DialogActions>

      </Dialog>
    </>
  );
};

export default TaskActions;