import React from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, 
        Select, MenuItem, Stack, Badge, IconButton, Tooltip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

const TaskFilters = ({ filters, sortBy, onFilterChange, onSortChange }) => {
  const activeFiltersCount = [filters.status, filters.priority].filter(Boolean).length;
  
  const handleClearFilters = () => {
    onFilterChange({ target: { name: 'status', value: '' } });
    onFilterChange({ target: { name: 'priority', value: '' } });
  };
  
  return (
    
    <Paper 
      elevation={2} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 4,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4
        }
      }}
    >
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
      }}>
        {/* LEFT SIDE: Title with Badge */}
        <Stack direction="row" spacing={1} alignItems="center">
          <Badge 
            badgeContent={activeFiltersCount} 
            color="primary"
            invisible={activeFiltersCount === 0}
          >
            <FilterListIcon color="action" />
          </Badge>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filter & Sort
          </Typography>
          {activeFiltersCount > 0 && (
            <Tooltip title="Clear all filters" arrow>
              <IconButton 
                size="small" 
                onClick={handleClearFilters}
                sx={{ 
                  ml: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'error.main',
                    transform: 'rotate(90deg)'
                  }
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>

          {/* RIGHT SIDE: Controls grouped together */}
        <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 150,
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 2
                }
              }
            }}
          >
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

          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 2
                }
              }
            }}
          >
            <Badge 
              badgeContent={filters.status ? '1' : null} 
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  right: -3,
                  top: 3,
                }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  id="status-select"
                  name="status"
                  value={filters.status}
                  label="Status"
                  onChange={onFilterChange}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </Select>
              </Box>
            </Badge>
          </FormControl>

          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: 2
                }
              }
            }}
          >
            <Badge 
              badgeContent={filters.priority ? '1' : null} 
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  right: -3,
                  top: 3,
                }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <InputLabel id="priority-select-label">Priority</InputLabel>
                <Select
                  labelId="priority-select-label"
                  id="priority-select"
                  name="priority"
                  value={filters.priority}
                  label="Priority"
                  onChange={onFilterChange}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value=""><em>All</em></MenuItem>
                  <MenuItem value="Low">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'info.main' }} />
                      Low
                    </Box>
                  </MenuItem>
                  <MenuItem value="Medium">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />
                      Medium
                    </Box>
                  </MenuItem>
                  <MenuItem value="High">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />
                      High
                    </Box>
                  </MenuItem>
                </Select>
              </Box>
            </Badge>
          </FormControl>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TaskFilters;