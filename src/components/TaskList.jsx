import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTasks, reset } from '../features/tasks/taskSlice.js';
import { toast } from 'react-toastify';
import TaskItem from './TaskItem.jsx';

// MUI Components
import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, Stack } from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);

  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const [sortBy, setSortBy] = useState('createdAt:desc');

  useEffect(() => {
    const filterData = { sortBy };
    if (filters.status) filterData.status = filters.status;
    if (filters.priority) filterData.priority = filters.priority;

    dispatch(getTasks(filterData));
    
    // This is the cleanup function. It runs when the component unmounts.
    return () => {
      dispatch(reset());
    };

  }, [dispatch, filters.status, filters.priority, sortBy]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [isError, message]);

  const handleFilterChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  if (isLoading) {
    // Center the MUI spinner
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>

      {/* --- FILTER SECTION --- */}
      <Paper elevation={2} sx={{ p: 2, mb: 4 }}>
        {/* A parent Box using flexbox for a clean header-style layout */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap', // Allows controls to wrap onto the next line on small screens
          gap: 2, // Adds space between the title and controls when they wrap
        }}>
          
          {/* LEFT SIDE: Title */}
          <Stack direction="row" spacing={1} alignItems="center">
            <FilterListIcon color="action" />
            <Typography variant="h6">
              Filter & Sort
            </Typography>
          </Stack>

          {/* RIGHT SIDE: Controls grouped together */}
          <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                name="status"
                value={filters.status}
                label="Status"
                onChange={handleFilterChange}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="To Do">To Do</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="priority-select-label">Priority</InputLabel>
              <Select
                labelId="priority-select-label"
                name="priority"
                value={filters.priority}
                label="Priority"
                onChange={handleFilterChange}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="sort-by-select-label">Sort By</InputLabel>
              <Select
                labelId="sort-by-select-label"
                name="sortBy"
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="createdAt:desc">Newest First</MenuItem>
                <MenuItem value="createdAt:asc">Oldest First</MenuItem>
                <MenuItem value="dueDate:asc">Due Date</MenuItem>
                <MenuItem value="priority">Priority</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
      </Paper>

      {/* --- CONTENT SECTION --- */}
      <Box>
        {tasks.length > 0 ? (
          <Grid container spacing={2}>
            {tasks.map((task) => (
              <Grid item xs={12} md={6} key={task._id}>
                <TaskItem task={task} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" color="text.secondary">
            No tasks match your current filters
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TaskList;