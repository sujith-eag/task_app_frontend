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

  // State for filters and sorting
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
  });
  const [sortBy, setSortBy] = useState('createdAt:desc');

const [initialLoadDone, setInitialLoadDone] = useState(false);

useEffect(() => {
  if (!initialLoadDone) {
    const filterData = { sortBy };
    if (filters.status) filterData.status = filters.status;
    if (filters.priority) filterData.priority = filters.priority;

    dispatch(getTasks(filterData)).finally(() => setInitialLoadDone(true));
  }
}, [dispatch, initialLoadDone, filters, sortBy]);

  // Initial fetch (only if no tasks yet)
  // useEffect(() => {
  //   if (tasks.length === 0) {
  //     const filterData = { sortBy };
  //     if (filters.status) filterData.status = filters.status;
  //     if (filters.priority) filterData.priority = filters.priority;

  //     dispatch(getTasks(filterData));
  //   }
  // }, [dispatch, tasks.length, filters.status, filters.priority, sortBy]);

  // Error handling
  useEffect(() => {
    if (isError) { toast.error(message); }
  }, [isError, message]);

  // In-memory filtering + sorting
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Sorting
    if (sortBy === 'createdAt:desc') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'createdAt:asc') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'dueDate:asc') {
      result.sort((a, b) => {
        if (!a.dueDate) return 1; // push tasks without dueDate to the bottom
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else if (sortBy === 'priority') {
      const order = { High: 1, Medium: 2, Low: 3 };
      result.sort((a, b) => order[a.priority] - order[b.priority]);
    }
    return result;
  }, [tasks, filters, sortBy]);

  // Handlers
  const handleFilterChange = (e) => {
    setFilters((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (isLoading && tasks.length === 0) {
    // Only show loader on initial load
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filters UI */}
      <TaskFilters
        filters={filters}
        sortBy={sortBy}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Task List */}
      <Box>
        {filteredTasks.length > 0 ? (
          <TransitionGroup 
            component={Box} 
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}
          >
            {filteredTasks.map((task) => (
              <Collapse 
                key={task._id} 
                sx={{
                  width: { xs: '100%', md: 'calc(50% - 8px)' },
                }}
              >
                <TaskItem taskId={task._id} />
              </Collapse>
            ))}
          </TransitionGroup>
        ) : (
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            sx={{ mt: 4 }}
          >
            No tasks found. Create one to get started!
          </Typography>
        )}        
      </Box>
    </Box>
  );
};

export default TaskList;