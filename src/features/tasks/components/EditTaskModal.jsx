import { updateTask } from '../taskSlice.js';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Stack, Select, MenuItem, Box
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const MAX_TITLE = 100;
const MAX_DESCRIPTION = 500;
const MAX_TAGS = 6;
const MAX_TAG_LENGTH = 20;

const EditTaskModal = ({ task, open, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority || 'Medium',
        tags: task.tags?.join(', ') || '',
      });
      setErrors({});
    }
  }, [task]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "title") {
      if (!value.trim()) error = "Title is required.";
      else if (value.length > MAX_TITLE) error = `Max ${MAX_TITLE} characters.`;
    }
    if (name === "description" && value.length > MAX_DESCRIPTION) {
      error = `Max ${MAX_DESCRIPTION} characters.`;
    }
    if (name === "tags") {
      const rawTags = value.split(",").map(t => t.trim()).filter(Boolean);
      if (rawTags.length > MAX_TAGS) error = `Max ${MAX_TAGS} tags allowed.`;
      if (rawTags.some(t => t.length > MAX_TAG_LENGTH)) error = `Each tag ≤ ${MAX_TAG_LENGTH} chars.`;
    }
    if (name === "dueDate" && value) {
      const picked = new Date(value);
      if (picked < new Date()) error = "Due date cannot be in the past.";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      formData.title.trim() &&
      Object.values(errors).every(err => !err)
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const sanitizedTags = formData.tags
      .split(',')
      .map(tag => tag.trim().replace(/[^a-zA-Z0-9_-]/g, ''))
      .filter(tag => tag.length > 0 && tag.length <= MAX_TAG_LENGTH)
      .slice(0, MAX_TAGS);

    const taskData = { ...formData, tags: sanitizedTags };
    dispatch(updateTask({ taskId: task._id, taskData }));
    onClose();
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
              error={!!errors.title}
              helperText={errors.title || `${formData.title.length}/${MAX_TITLE}`}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              name="description"
              label="Description"
              value={formData.description}
              onChange={onChange}
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/${MAX_DESCRIPTION}`}
            />


            <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
                <DatePicker
                label="Due Date"
                value={formData.dueDate ? new Date(formData.dueDate) : null}
                onChange={(newDate) => {
                    if (newDate && newDate < new Date()) {
                    setErrors((prev) => ({ ...prev, dueDate: "Due date cannot be in the past." }));
                    return;
                    }
                    setErrors((prev) => ({ ...prev, dueDate: "" }));
                    setFormData((prev) => ({
                    ...prev,
                    dueDate: newDate ? newDate.toISOString().split('T')[0] : '',
                    }));
                }}
                slotProps={{
                    textField: {
                    fullWidth: true,
                    error: !!errors.dueDate,
                    helperText: errors.dueDate,
                    },
                }}
                />
            </Box>

            <Box sx={{ flex: 1 }}>
                <Select
                fullWidth
                name="priority"
                value={formData.priority}
                onChange={onChange}
                >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
                </Select>
            </Box>
            </Box>

            <TextField
              fullWidth
              name="tags"
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={onChange}
              error={!!errors.tags}
              helperText={errors.tags}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={!isFormValid() || isLoading}>
            Save Changes
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditTaskModal;
