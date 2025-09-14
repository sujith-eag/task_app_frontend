import { createTask } from "../taskSlice";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, Paper, Typography, 
    TextField, FormControl, InputLabel, 
    Select, MenuItem, Button, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TaskForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: null,
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

  // Handler for the DatePicker
  const handleDateChange = (newDate) => {
    setFormData((prevState) => ({
      ...prevState,
      dueDate: newDate,
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
      title: '', description: '', dueDate: null, priority: 'Medium', tags: '',
    });
  };

  return (
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Create a New Task
      </Typography>

      <Box component="form" onSubmit={onSubmit}>

        <Stack spacing={2}>
          <TextField
            fullWidth
            required
            name="title"
            id="title"
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
            id="description"
            value={description}
            onChange={onChange}
          />

          <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexDirection: { xs: 'column', sm: 'row' } }}>            

            <DatePicker
              label="Due Date"
              value={dueDate}
              onChange={handleDateChange}
              format="dd/MM/yyyy" // This sets the display format!
              sx={{ width: '100%' }}
            />

            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select 
                labelId="priority-form-label"
                id="priority-form-select"
                name="priority" 
                value={priority} 
                label="Priority" 
                onChange={onChange}>
                
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

          </Box>

          <TextField
            fullWidth
            name="tags"
            id="tags"
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