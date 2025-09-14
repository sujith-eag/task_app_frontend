import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addSubTask, updateSubTask, deleteSubTask, addSubTaskOptimistic, toggleSubTaskOptimistic, removeSubTaskOptimistic } from '../taskSlice.js';

// MUI Components & Icons
import { Box, Typography, List, ListItem, ListItemText, Checkbox, TextField, IconButton, Popover, Stack, Button } from '@mui/material';
import { DeleteOutline as DeleteOutlineIcon, Add as AddIcon } from '@mui/icons-material';

const SubTaskChecklist = ({ taskId, subTasks }) => {
  const [subTaskText, setSubTaskText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [subTaskIdToDelete, setSubTaskIdToDelete] = useState(null);

  const dispatch = useDispatch();

  const handleSubTaskSubmit = useCallback((e) => {
    e.preventDefault();
    if (!subTaskText) return;
    const payload = { taskId, subTaskData: { text: subTaskText } };
    dispatch(addSubTaskOptimistic(payload));
    dispatch(addSubTask(payload));
    setSubTaskText('');
  }, [dispatch, subTaskText, taskId]);


  const handleToggleSubTask = useCallback((subTaskId, checked) => {
    const payload = { taskId, subTaskId };
    dispatch(toggleSubTaskOptimistic(payload));
    dispatch(updateSubTask({ ...payload, subTaskData: { completed: checked } }));
  }, [dispatch, taskId]);


  const handleSubTaskDeleteClick = (event, subTaskId) => {
    setAnchorEl(event.currentTarget);
    setSubTaskIdToDelete(subTaskId);
  };

  const handleSubTaskDeleteClose = () => {
    if (anchorEl) anchorEl.focus();
    setAnchorEl(null);
    setSubTaskIdToDelete(null);
  };

  const handleSubTaskDeleteConfirm = () => {
    const payload = { taskId, subTaskId: subTaskIdToDelete };
    dispatch(removeSubTaskOptimistic(payload));
    dispatch(deleteSubTask(payload));
    handleSubTaskDeleteClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'delete-confirmation-popover' : undefined;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle1">Checklist</Typography>
      <List dense>
        {subTasks?.map((subTask) => (
          <ListItem key={subTask._id} disablePadding secondaryAction={
            <IconButton edge="end" aria-describedby={id} onClick={(e) => handleSubTaskDeleteClick(e, subTask._id)}>
              <DeleteOutlineIcon />
            </IconButton>
          }>
            <Checkbox
              edge="start"
              checked={subTask.completed}
              onChange={(e) => handleToggleSubTask(subTask._id, e.target.checked)}
            />
            <ListItemText primary={subTask.text} sx={{ textDecoration: subTask.completed ? 'line-through' : 'none' }} />
          </ListItem>
        ))}
      </List>
      <Box component="form" onSubmit={handleSubTaskSubmit} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <TextField fullWidth variant="standard" size="small" placeholder="Add a new sub-task..." value={subTaskText} onChange={(e) => setSubTaskText(e.target.value)} />
        <IconButton type="submit" color="primary"><AddIcon /></IconButton>
      </Box>

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
    </Box>
  );
};

export default SubTaskChecklist;