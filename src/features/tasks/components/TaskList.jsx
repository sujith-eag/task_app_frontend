import TaskItem from './TaskItem.jsx';
import { getTasks } from '../taskSlice.js';

import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { Box, Typography, Paper, FormControl, InputLabel, 
  Select, MenuItem, CircularProgress, Stack } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';


const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);
  
  const taskIds = useMemo(()=> tasks.map((t=> t._id)), [tasks] );   // Creating array of ids to pass to TaskItem
  // This ensures the taskIds array is stable unless the tasks themselves change.
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const [sortBy, setSortBy] = useState('createdAt:desc');

  // Testing Block
useEffect(() => {
  console.log('%cTaskList MOUNTED', 'color: green; font-weight: bold;');
  return () => {
    console.log('%cTaskList UNMOUNTED', 'color: red; font-weight: bold;');
  };
}, []); // The empty array [] ensures this runs only on mount and unmount
  
  
  useEffect(() => {
    const filterData = { sortBy };
    if (filters.status) filterData.status = filters.status;
    if (filters.priority) filterData.priority = filters.priority;

    dispatch(getTasks(filterData));
    
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
    return (
      <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 4 
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>

      {/* --- FILTER SECTION --- */}
        <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
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
                id="status-select"
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
                id="priority-select"
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
                id="sort-by-select"
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
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {taskIds.map((id) => (
                <Box
                  key={id}
                  sx={{
                    flexGrow: 1, // Allows the item to grow to fill space
                    width: { xs: '90%', md: 'calc(50% - 8px)' } // Defines the base width for the two-column layout
                  }}
                >
                  <TaskItem taskId={id} /> 
                </Box>
              ))}
          </Box>

) : (
        
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ mt: 4 }}>
            No tasks found. Create one to get started!
          </Typography>
        )}        
      </Box>

    </Box>
  );
};

export default TaskList;