import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box, Paper, Typography, TextField,
  FormControl, InputLabel, Select, MenuItem,
  Button, Stack
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { toast } from "react-toastify";

import { createTask, addTaskOptimistic } from "../taskSlice.js";

const TaskForm = () => {
  const { user } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
    priority: 'Medium',
    status: 'To Do',
    tags: '',
  });
  const { title, description, dueDate, priority, status, tags } = formData;

  const [errors, setErrors] = useState({}); // for live feedback

  const validateField = (name, value) => {
    let error = "";

    if (name === "title") {
      if (!value.trim()) error = "Title is required.";
      else if (value.length > 100) error = "Title cannot exceed 100 characters.";
    }

    if (name === "description") {
      if (value.length > 500) error = "Description cannot exceed 500 characters.";
    }

    if (name === "tags") {
      const rawTags = value.split(",").map(t => t.trim());
      if (rawTags.length > 6) error = "Maximum of 6 tags allowed.";
      if (rawTags.some(t => t.length > 20)) error = "Tags must be 20 characters or fewer.";
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return error === "";
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ 
        ...prevState, 
        [name]: value 
    }));
    validateField(name, value);
  };

  const handleDateChange = (newDate) => {
    if (newDate && newDate < new Date()) {
      toast.error("Unless you can time travel, Due date cannot be in the past.");
      return;
    }
    setFormData((prevState) => ({ 
        ...prevState, 
        dueDate: newDate ? new Date(newDate) : null
    }));
  };

  const isFormValid = () => {
    return (
      title.trim().length > 0 &&
      !Object.values(errors).some(e => e) // no active errors
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please fix form errors before submitting.");
      return;
    }

    const sanitizedTags = tags
      .split(',')
      .map(tag => tag.trim().replace(/[^a-zA-Z0-9_-]/g, ''))
      .filter(tag => tag.length > 0 && tag.length <= 20)
      .slice(0, 6);

    const taskData = { 
        title, 
        description, 
        dueDate: dueDate ? dueDate.toISOString() : null,
        priority,
        status,
        tags: sanitizedTags 
    };

    dispatch(addTaskOptimistic({ taskData, user }));
    dispatch(createTask(taskData));
    toast.success('Task created successfully!');

    setFormData({ 
        title: '', 
        description: '', 
        dueDate: null, 
        priority: 'Medium',
        status: 'To Do',
        tags: '' 
      });
      setErrors({});
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create a New Task
      </Typography>

      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2}>

          {/* Title */}
          <TextField
            fullWidth
            required
            name="title"
            label="Task Title"
            id="title"
            value={title}
            onChange={onChange}
            error={!!errors.title}
            helperText={errors.title}
            slotProps={{
              input: {
                maxLength: 100,
                pattern: "^[a-zA-Z0-9\\s.,!?-]+$",
              },
            }}
          />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={3}
            name="description"
            label="Description"
            id="description"
            value={description}
            onChange={onChange}
            error={!!errors.description}
            helperText={errors.description}
            slotProps={{
              input: { maxLength: 500 },
            }}
          />

          {/* Date + Priority */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={handleDateChange}
              format="dd/MM/yyyy"
              sx={{ width: '100%' }}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={priority}
                label="Priority"
                onChange={onChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Tags */}
          <TextField
            fullWidth
            name="tags"
            label="Tags (comma-separated)"
            id="tags"
            value={tags}
            onChange={onChange}
            error={!!errors.tags}
            helperText={errors.tags}
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<AddCircleOutlineIcon />}
            disabled={!isFormValid() || isLoading}
            sx={{ mt: 1 }}
          >
            Add Task
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TaskForm;