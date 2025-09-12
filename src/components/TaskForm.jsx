import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from '../features/tasks/taskSlice.js';

// MUI Components
import { Box, Paper, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    tags: '',
  });

  const { title, description, dueDate, priority, tags } = formData;
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tasks);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      title,
      description,
      dueDate,
      priority,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
    };
    dispatch(createTask(taskData));
    setFormData({
      title: '', description: '', dueDate: '', priority: 'Medium', tags: '',
    });
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create a New Task
      </Typography>
      <Box component="form" onSubmit={onSubmit}>
        {/* Use Stack for clean vertical spacing */}
        <Stack spacing={2}>
          <TextField
            fullWidth
            required
            name="title"
            label="Task Title"
            value={title}
            onChange={onChange}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            name="description"
            label="Description"
            value={description}
            onChange={onChange}
          />
          {/* Use a Box with flex display to group items side-by-side */}
          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              fullWidth
              type="date"
              name="dueDate"
              label="Due Date"
              value={dueDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select name="priority" value={priority} label="Priority" onChange={onChange}>
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
            value={tags}
            onChange={onChange}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            startIcon={<AddCircleOutlineIcon />}
            disabled={isLoading}
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