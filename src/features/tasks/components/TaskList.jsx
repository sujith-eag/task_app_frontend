import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getTasks } from '../taskSlice.js';
import { toast } from 'react-toastify';
import TaskItem from './TaskItem.jsx';
import TaskFilters from './TaskFilters.jsx';

import { Box, Typography, CircularProgress, Collapse } from "@mui/material";

import { TransitionGroup } from 'react-transition-group';

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);
  const taskIds = useMemo(() => tasks.map((t) => t._id), [tasks]);
  // This ensures the taskIds array is stable unless the tasks themselves change.

  // State and handlers live in the parent component
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const [sortBy, setSortBy] = useState('createdAt:desc');

  useEffect(() => {
    if (tasks.length === 0) {
      const filterData = { sortBy };
      if (filters.status) filterData.status = filters.status;
      if (filters.priority) filterData.priority = filters.priority;
    
      dispatch(getTasks(filterData));
  }
  }, [dispatch, tasks.length, filters.status, filters.priority, sortBy]);

  useEffect(() => {
    if (isError) { toast.error(message); }
  }, [isError, message]);

  const handleFilterChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Render the TaskFilters component and pass props */}
      <TaskFilters
        filters={filters}
        sortBy={sortBy}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* --- CONTENT SECTION --- */}
      <Box>
        {tasks.length > 0 ? (
          <TransitionGroup 
            component={Box} 
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
            >
            {taskIds.map((id) => (
              <Collapse 
                key={id} 
                sx={{
                  width: { xs: '100%', md: 'calc(50% - 8px)' },
                }}
                >
                <TaskItem taskId={id} />
              </Collapse>
            ))}
          </TransitionGroup>
          
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