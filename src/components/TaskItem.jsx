import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask, updateTask, addSubTask, updateSubTask, deleteSubTask } from '../features/tasks/taskSlice.js';

// MUI Components
import { Card, CardContent, Box, Typography, IconButton, Chip, Select, MenuItem, FormControl, List, ListItem, ListItemText, Checkbox, TextField } from '@mui/material';
import { Close as CloseIcon, DeleteOutline as DeleteOutlineIcon, Add as AddIcon } from '@mui/icons-material';

const TaskItem = ({ task }) => {
  const [subTaskText, setSubTaskText] = useState('');
  const dispatch = useDispatch();

  const handleStatusChange = (e) => {
    dispatch(updateTask({ taskId: task._id, taskData: { status: e.target.value } }));
  };

  const handleSubTaskSubmit = (e) => {
    e.preventDefault();
    if (!subTaskText) return;
    dispatch(addSubTask({ taskId: task._id, subTaskData: { text: subTaskText } }));
    setSubTaskText('');
  };
  
  // Helper to determine chip color based on priority
  const priorityColor = {
    High: 'error',
    Medium: 'warning',
    Low: 'info',
  };

  return (
    <Card sx={{ marginBottom: 2, textAlign: 'left' }}>
      <CardContent>
        {/* --- HEADER --- */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            Created: {new Date(task.createdAt).toLocaleDateString('en-US')}
            {task.dueDate && ` | Due: ${new Date(task.dueDate).toLocaleDateString('en-US')}`}
          </Typography>
          <IconButton size="small" onClick={() => dispatch(deleteTask(task._id))}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* --- TITLE & DESCRIPTION --- */}
        <Typography variant="h5" component="h2" sx={{ mt: 1 }}>{task.title}</Typography>
        {task.description && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{task.description}</Typography>}

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
          <Typography variant="subtitle1">Checklist</Typography>
          <List dense>
            {task.subTasks?.map((subTask) => (
              <ListItem key={subTask._id} disablePadding secondaryAction={
                <IconButton edge="end" onClick={() => dispatch(deleteSubTask({ taskId: task._id, subTaskId: subTask._id }))}>
                  <DeleteOutlineIcon />
                </IconButton>
              }>
                <Checkbox
                  edge="start"
                  checked={subTask.completed}
                  onChange={(e) => dispatch(updateSubTask({
                    taskId: task._id,
                    subTaskId: subTask._id,
                    subTaskData: { completed: e.target.checked }
                  }))}
                />
                <ListItemText primary={subTask.text} sx={{ textDecoration: subTask.completed ? 'line-through' : 'none' }} />
              </ListItem>
            ))}
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
  );
};

export default TaskItem;