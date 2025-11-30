import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, CircularProgress, Collapse, Alert } from "@mui/material";
import { TransitionGroup } from 'react-transition-group';
import { toast } from 'react-toastify';

import { getTasks, reset } from '../taskSlice.js';
import TaskItem from './TaskItem.jsx';
import TaskFilters from './TaskFilters.jsx';
import { createLogger } from '../../../utils/logger.js';

const logger = createLogger('TaskList');

const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);

  // State for filters and sorting. Keep shape predictable so downstream
  // components (TaskFilters) can rely on `filters.status` and `filters.priority`.
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [sortBy, setSortBy] = useState('createdAt:desc');

  // Track whether the initial load completed (used only for UX decisions).
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Log component mount
  useEffect(() => {
    logger.mount({ tasksCount: tasks.length });
    return () => logger.unmount();
  }, []);

  // Fetch tasks whenever filters or sort change. We build a small `filterData`
  // object and only include keys that are set to avoid sending empty params.
  useEffect(() => {
    const filterData = { sortBy };
    if (filters.status) filterData.status = filters.status;
    if (filters.priority) filterData.priority = filters.priority;

    logger.api('Fetching tasks', filterData);
    
    // Dispatch the thunk; mark initial load done when the promise settles.
    dispatch(getTasks(filterData))
      .unwrap()
      .then((result) => {
        logger.success('Tasks fetched', { count: Array.isArray(result) ? result.length : result?.tasks?.length || 0 });
      })
      .catch((err) => {
        logger.error('Failed to fetch tasks', { error: err });
      })
      .finally(() => setInitialLoadDone(true));
  }, [dispatch, filters.status, filters.priority, sortBy]);


  // Error handling
  useEffect(() => {
    if (isError && message) { 
      logger.error('Task error displayed', { message });
      toast.error(message); 
    }
  }, [isError, message]);

  // In-memory filtering + sorting. We keep this client-side so the UI can be
  // responsive even when the server returns an unfiltered list. The memo
  // prevents re-computation unless `tasks`, `filters` or `sortBy` change.
  const filteredTasks = useMemo(() => {
    let result = Array.isArray(tasks) ? [...tasks] : [];

    // Apply filters (exact match semantics). If your backend supports
    // server-side filtering it may be preferable for large datasets.
    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    // Sorting variations.
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
      result.sort((a, b) => (order[a.priority] || 99) - (order[b.priority] || 99));
    }

    return result;
  }, [tasks, filters, sortBy]);

  // Handlers
  // setFilter and setSort use stable function identities (useCallback) to
  // avoid unnecessary re-renders in child components.
  const setFilter = useCallback((name, value) => {
    logger.action('Filter changed', { name, value });
    setFilters((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleFilterChange = useCallback((e) => {
    // This component expects the same synthetic event shape as before so
    // child components can still call onFilterChange(e).
    const { name, value } = e.target || {};
    if (name) setFilter(name, value);
  }, [setFilter]);

  const handleSortChange = useCallback((e) => {
    logger.action('Sort changed', { sortBy: e.target.value });
    setSortBy(e.target.value);
  }, []);

  // Handle dismiss error
  const handleDismissError = useCallback(() => {
    dispatch(reset());
  }, [dispatch]);

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
      {/* Error Alert */}
      {isError && message && (
        <Alert 
          severity="error" 
          onClose={handleDismissError}
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}
      
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