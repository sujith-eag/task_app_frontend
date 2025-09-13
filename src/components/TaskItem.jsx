import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask, addSubTask, 
          updateSubTask, deleteSubTask, addSubTaskOptimistic,
          toggleSubTaskOptimistic, removeSubTaskOptimistic 
        } from '../features/tasks/taskSlice.js';
import EditTaskModal from './EditTaskModal.jsx';

// MUI Components
import { 
  Card, CardContent, Box, Typography, IconButton, Chip, Select, MenuItem, FormControl, 
  List, ListItem, ListItemText, Checkbox, TextField,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button,
  Popover, Stack
} from '@mui/material';

import { Close as CloseIcon, DeleteOutline as DeleteOutlineIcon, Add as AddIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';

const TaskItem = ({ task }) => {
  const [subTaskText, setSubTaskText] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [subTaskIdToDelete, setSubTaskIdToDelete] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const dispatch = useDispatch();

  const handleStatusChange = (e) => {
    dispatch(updateTask({ taskId: task._id, taskData: { status: e.target.value } }));
  };

  const handleSubTaskSubmit = (e) => {
    e.preventDefault();
    if (!subTaskText) return;
    const payload = { 
        taskId: task._id, 
        subTaskData: { text: subTaskText } 
      };
    // Dispatch the optimistic action FIRST for an instant UI update  
    dispatch(addSubTaskOptimistic(payload));
    // Then, dispatch the thunk to sync with the server
    dispatch(addSubTask(payload));
    setSubTaskText('');
  };
  
  const handleDeleteConfirm = () => {
    dispatch(deleteTask(task._id));
    setOpenDeleteDialog(false);
  };
  
  // Helper to determine chip color based on priority
  const priorityColor = {
    High: 'error',
    Medium: 'warning',
    Low: 'info',
  };
  
  const handleSubTaskDeleteClick = (event, subTaskId) => {
    setAnchorEl(event.currentTarget); // Anchor the popover to the button that was clicked
    setSubTaskIdToDelete(subTaskId); // Remember which sub-task we are deleting
  };

  const handleSubTaskDeleteClose = () => {
    setAnchorEl(null);
    setSubTaskIdToDelete(null);
  };

  const handleSubTaskDeleteConfirm = () => {
    const payload = { taskId: task._id, subTaskId: subTaskIdToDelete };
    dispatch(removeSubTaskOptimistic(payload));
    dispatch(deleteSubTask(payload));
    handleSubTaskDeleteClose(); // Close the popover
  };
  
  const open = Boolean(anchorEl);
  const id = open ? 'delete-confirmation-popover' : undefined;

  return (
    <>
    <Card sx={{ marginBottom: 2, textAlign: 'left' }}>
      <CardContent>
        {/* --- HEADER --- */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          
          {/* ... typography for dates ... */}
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(task.createdAt).toLocaleDateString('en-US')}
            {task.dueDate && ` | Due: ${new Date(task.dueDate).toLocaleDateString('en-US')}`}
          </Typography>

          {/* --- ACTION BUTTONS (Edit + Delete) --- */}
          <Box>
            {/* Edit Button */}
            <IconButton size="small" onClick={() => setIsEditModalOpen(true)}>
              <EditIcon />
            </IconButton>
            {/* Delete Button */}
            <IconButton size="small" onClick={() => setOpenDeleteDialog(true)}>
              <CloseIcon />
            </IconButton>
          </Box>
        
        </Box>

        {/* --- TITLE & DESCRIPTION --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 1 }}>{task.title}</Typography>
        {task.description && (
            <Typography variant="body2" color="text.secondary" 
            sx={{ mt: 1 }}>{task.description}</Typography>
        )}

        {/* --- METADATA (PRIORITY & STATUS) --- */}
        <Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
          <Chip label={task.priority} color={priorityColor[task.priority]} size="small" />
          <FormControl size="small">
            <Select value={task.status} onChange={handleStatusChange}>
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* --- SUB-TASKS --- */}
        <Box sx={{ mt: 2 }}>
          <Typography 
              variant="subtitle1">Checklist
          </Typography>

          <List dense>
            
            {task.subTasks?.map((subTask) => (
              <ListItem key={subTask._id} disablePadding secondaryAction={
                <IconButton edge="end" 
                  aria-describedby={id} 
                  onClick={(e) => handleSubTaskDeleteClick(e, subTask._id)}>
                  <DeleteOutlineIcon />
                </IconButton>
              }>                
              <Checkbox
                edge="start"
                checked={subTask.completed}
                onChange={(e) => {
                  const payload = { taskId: task._id, subTaskId: subTask._id };
                  // 2. Dispatch the optimistic action FIRST for an instant UI update
                  dispatch(toggleSubTaskOptimistic(payload));
                  // 3. Then, dispatch the async thunk to sync with the server
                  dispatch(updateSubTask({ ...payload, subTaskData: { completed: e.target.checked } }));
                }}
              />
              <ListItemText 
                  primary={subTask.text} 
                  sx={{ textDecoration: subTask.completed ? 'line-through' : 'none' }} />
              </ListItem>
              
            ))
            }
          </List>
 
          <Box component="form" onSubmit={handleSubTaskSubmit} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TextField
              fullWidth
              variant="standard"
              size="small"
              placeholder="Add a new sub-task..."
              value={subTaskText}
              onChange={(e) => setSubTaskText(e.target.value)}
            />
            <IconButton type="submit" color="primary"><AddIcon /></IconButton>
          </Box>
        </Box>
        
        {/* --- TAGS --- */}
        {task.tags?.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {task.tags.map((tag, index) => <Chip key={index} label={tag} size="small" />)}
          </Box>
        )}
      </CardContent>
    </Card>
    
      {/* EditTaskModal component */}
      <EditTaskModal 
        task={task} 
        open={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    
    {/* The Popover component */}
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleSubTaskDeleteClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      >
      <Box sx={{ p: 2 }}>
        <Typography sx={{ mb: 2 }}>Are you sure?</Typography>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={handleSubTaskDeleteClose}>Cancel</Button>
          <Button size="small" variant="contained" color="error" onClick={handleSubTaskDeleteConfirm}>Confirm</Button>
        </Stack>
      </Box>
    </Popover>
    
      {/* The Dialog component */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Deletion"}
        </DialogTitle>
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

export default TaskItem;