import React from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, 
        Select, MenuItem, Stack } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const TaskFilters = ({ filters, sortBy, onFilterChange, onSortChange }) => {
  return (
    
    <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 4 }}>       {/* --- FILTER SECTION --- */}
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
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="sort-by-select-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-select-label"
              id="sort-by-select"
              name="sortBy"
              value={sortBy}
              label="Sort By"
              onChange={onSortChange}
            >
              <MenuItem value="createdAt:desc">Newest First</MenuItem>
              <MenuItem value="createdAt:asc">Oldest First</MenuItem>
              <MenuItem value="dueDate:asc">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              name="status"
              value={filters.status}
              label="Status"
              onChange={onFilterChange}
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
              id="priority-select"
              name="priority"
              value={filters.priority}
              label="Priority"
              onChange={onFilterChange}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TaskFilters;