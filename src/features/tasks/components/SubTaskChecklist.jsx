import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
// MUI Components & Icons
import {
  Box, Typography, List, ListItem, ListItemText,
  Checkbox, TextField, IconButton, Popover, Stack, Button
} from '@mui/material';
import { DeleteOutline as DeleteOutlineIcon, Add as AddIcon } from '@mui/icons-material';

import {
  addSubTask,
  updateSubTask,
  deleteSubTask,
  addSubTaskOptimistic,
  toggleSubTaskOptimistic,
  removeSubTaskOptimistic
} from '../taskSlice.js';


const MAX_SUBTASK_LENGTH = 120;

const SubTaskChecklist = ({ taskId, subTasks }) => {
  const [subTaskText, setSubTaskText] = useState('');
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [subTaskIdToDelete, setSubTaskIdToDelete] = useState(null);

  const dispatch = useDispatch();

  const handleSubTaskSubmit = useCallback((e) => {
    e.preventDefault();

    const trimmed = subTaskText.trim();

    if (!trimmed) {
      setError("Sub-task cannot be empty.");
      return;
    }
    if (trimmed.length > MAX_SUBTASK_LENGTH) {
      setError(`Sub-task cannot exceed ${MAX_SUBTASK_LENGTH} characters.`);
      return;
    }

    const payload = { taskId, subTaskData: { text: trimmed } };
    dispatch(addSubTaskOptimistic(payload));
    dispatch(addSubTask(payload));

    setSubTaskText('');
    setError('');
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

      {subTasks && subTasks.length === 0 ? (
        <Box 
          sx={{ 
            p: 2, 
            mt: 1, 
            mb: 1,
            backgroundColor: 'action.hover',
            borderRadius: 1,
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            No subtasks yet. Add one to break down this task!
          </Typography>
        </Box>
      ) : (
        <List dense>
          {subTasks?.map((subTask) => (
            <ListItem
              key={subTask._id}
              disablePadding
              sx={{ 
                mb: 0.5,
                alignItems: 'flex-start'
              }}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-describedby={id} 
                  onClick={(e) => handleSubTaskDeleteClick(e, subTask._id)}
                  sx={{ mt: 0.5 }}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              }>
              <Checkbox
                edge="start"
                checked={subTask.completed}
                onChange={(e) => handleToggleSubTask(subTask._id, e.target.checked)}
                sx={{ pt: 0.5 }}
              />
              <ListItemText
                primary={subTask.text}
                sx={{ 
                  textDecoration: subTask.completed ? 'line-through' : 'none',
                  pr: 1,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word'
                }}
                primaryTypographyProps={{
                  sx: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Add SubTask Field */}
      <Box component="form" onSubmit={handleSubTaskSubmit} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <TextField
          fullWidth
          variant="standard"
          size="small"
          placeholder="Add a new sub-task..."
          value={subTaskText}
          onChange={(e) => {
            setSubTaskText(e.target.value);
            if (e.target.value.length > MAX_SUBTASK_LENGTH) {
              setError(`Max ${MAX_SUBTASK_LENGTH} characters allowed.`);
            } else {
              setError('');
            }
          }}
          error={!!error}
          helperText={error ? error : subTaskText.length > 1 ? `${subTaskText.length}/${MAX_SUBTASK_LENGTH}` : ""
        }/>
        <IconButton type="submit" color="primary" disabled={!subTaskText.trim() || !!error}>
          <AddIcon />
        </IconButton>
      </Box>

      {/* Delete confirmation */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleSubTaskDeleteClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2 }}>
          <Typography sx={{ mb: 2 }}>Are you sure?</Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" variant="outlined" 
                    onClick={handleSubTaskDeleteClose}>Cancel</Button>
            <Button size="small" variant="contained" color="error" 
                    onClick={handleSubTaskDeleteConfirm}>Confirm</Button>
          </Stack>
        </Box>
      </Popover>
    </Box>
  );
};

export default SubTaskChecklist;
