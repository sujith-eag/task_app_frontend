import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, updateTask, removeTaskOptimistic } from '../taskSlice.js';
import EditTaskModal from './EditTaskModal.jsx';
import SubTaskChecklist from './SubTaskChecklist.jsx';
import { motion } from 'framer-motion'; 

// MUI Components & Icons
import { Card, CardContent, Box, Typography, IconButton, 
  Chip, Select, MenuItem, FormControl, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
  Button, InputLabel } from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';

const TaskItem = ({ taskId }) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dispatch = useDispatch();

  const task = useSelector((state) => state.tasks.tasks.find((t) => t._id === taskId));

  const handleStatusChange = useCallback((e) => {
    dispatch(updateTask({ taskId, taskData: { status: e.target.value } }));
  }, [dispatch, taskId]);

  const handleDeleteConfirm = useCallback(() => {
    dispatch(removeTaskOptimistic(taskId));
    dispatch(deleteTask(taskId));
    setOpenDeleteDialog(false);
  }, [dispatch, taskId]);

  const priorityColor = { High: 'error', Medium: 'warning', Low: 'info' };

  if (!task) return null;

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
    <Card sx={{ textAlign: 'left', height: '100%' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

        <Box display="flex" justifyContent="space-between" alignItems="center">
      
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(task.createdAt).toLocaleDateString('en-GB')}
            {task.dueDate && ` | Due: ${new Date(task.dueDate).toLocaleDateString('en-GB')}`}
          </Typography>
      
          <Box>
            <IconButton size="small" onClick={() => setIsEditModalOpen(true)}><EditIcon /></IconButton>
            <IconButton size="small" onClick={() => setOpenDeleteDialog(true)}><CloseIcon /></IconButton>
          </Box>

        </Box>

        <Typography variant="h5" component="h2" sx={{ mt: 1 }}>{task.title}</Typography>
        {task.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1, flexGrow: 1 }}>{task.description}</Typography>}

        <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
          <Chip label={task.priority} color={priorityColor[task.priority]} size="small" />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id={`status-label-${taskId}`}>Status</InputLabel>
            <Select
              labelId={`status-label-${taskId}`}
              id={`status-select-${taskId}`}
              value={task.status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <SubTaskChecklist taskId={task._id} subTasks={task.subTasks} />
        
        {task.tags?.length > 0 && (
          <Box sx={{ mt: 'auto', pt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {task.tags.map((tag) => <Chip key={tag} label={tag} size="small" />)}
          </Box>
        )}
      </CardContent>
    </Card>
  </motion.div>


  <EditTaskModal 
    task={task} 
    open={isEditModalOpen} 
    onClose={() => setIsEditModalOpen(false)} 
    />

    <Dialog
      open={openDeleteDialog}
      onClose={() => setOpenDeleteDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title"> {"Confirm Deletion"} </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete the task: "{task.title}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
        <Button onClick={handleDeleteConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default React.memo(TaskItem);