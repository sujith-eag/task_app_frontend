import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, CircularProgress, Collapse } from "@mui/material";
import { TransitionGroup } from 'react-transition-group';
import { toast } from 'react-toastify';

import { getTasks } from '../taskSlice.js';
import TaskItem from './TaskItem.jsx';
import TaskFilters from './TaskFilters.jsx';


const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading, isError, message } = useSelector((state) => state.tasks);

  // State for filters and sorting. Keep shape predictable so downstream
  // components (TaskFilters) can rely on `filters.status` and `filters.priority`.
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [sortBy, setSortBy] = useState('createdAt:desc');

  // Track whether the initial load completed (used only for UX decisions).
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Fetch tasks whenever filters or sort change. We build a small `filterData`
  // object and only include keys that are set to avoid sending empty params.
  useEffect(() => {
    const filterData = { sortBy };
    if (filters.status) filterData.status = filters.status;
    if (filters.priority) filterData.priority = filters.priority;

    // Dispatch the thunk; mark initial load done when the promise settles.
    dispatch(getTasks(filterData)).finally(() => setInitialLoadDone(true));
  }, [dispatch, filters.status, filters.priority, sortBy]);


  // Error handling
  useEffect(() => {
    if (isError) { toast.error(message); }
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
    setFilters((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleFilterChange = useCallback((e) => {
    // This component expects the same synthetic event shape as before so
    // child components can still call onFilterChange(e).
    const { name, value } = e.target || {};
    if (name) setFilter(name, value);
  }, [setFilter]);

  const handleSortChange = useCallback((e) => setSortBy(e.target.value), []);

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