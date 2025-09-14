import { updateTask } from '../taskSlice.js';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

const EditTaskModal = ({ task, open, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    tags: '',
  });

  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tasks);

  // When the 'task' prop changes (i.e., when the user clicks edit on a task),
  // pre-populate the form with that task's data.
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        // Format date correctly for the date input field
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority || 'Medium',
        tags: task.tags?.join(', ') || '',
      });
    }
  }, [task]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    dispatch(updateTask({ taskId: task._id, taskData }));
    onClose(); // Close the modal after submitting
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Task</DialogTitle>
      <Box component="form" onSubmit={onSubmit}>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              required
              fullWidth
              name="title"
              label="Task Title"
              value={formData.title}
              onChange={onChange}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              label="Description"
              value={formData.description}
              onChange={onChange}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                type="date"
                name="dueDate"
                label="Due Date"
                value={formData.dueDate}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select name="priority" value={formData.priority} label="Priority" onChange={onChange}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth
              name="tags"
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={onChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Save Changes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditTaskModal;