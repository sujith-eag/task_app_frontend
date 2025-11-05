import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, 
  Select, MenuItem, Stack, Badge, IconButton, Tooltip, Drawer, Divider, Button, useMediaQuery } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const TaskFilters = ({ filters, sortBy, onFilterChange, onSortChange }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);
  const [tempSort, setTempSort] = useState(sortBy);

  // When opening the drawer, initialize temporary state from current props
  React.useEffect(() => {
    if (drawerOpen) {
      setTempFilters(filters || { status: '', priority: '' });
      setTempSort(sortBy);
    }
  }, [drawerOpen, filters, sortBy]);

  const activeFiltersCount = [filters?.status, filters?.priority].filter(Boolean).length;

  const handleClearFilters = () => {
    onFilterChange({ target: { name: 'status', value: '' } });
    onFilterChange({ target: { name: 'priority', value: '' } });
  };

  // Render the full controls (used in both desktop layout and inside drawer)
  const Controls = (
    <Stack direction={isXs ? 'column' : 'row'} spacing={2} sx={{ flexWrap: 'wrap', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 150 }, '& .MuiOutlinedInput-root': { transition: 'all 0.2s' } }}>
        <InputLabel id="sort-by-select-label">Sort By</InputLabel>
        <Select
          labelId="sort-by-select-label"
          id="sort-by-select"
          name="sortBy"
          value={isXs ? tempSort : sortBy}
          label="Sort By"
          onChange={isXs ? (e) => setTempSort(e.target.value) : onSortChange}
        >
          <MenuItem value="createdAt:desc">Newest First</MenuItem>
          <MenuItem value="createdAt:asc">Oldest First</MenuItem>
          <MenuItem value="dueDate:asc">Due Date</MenuItem>
          <MenuItem value="priority">Priority</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 }, '& .MuiOutlinedInput-root': { transition: 'all 0.2s' } }}>
        <Badge badgeContent={(isXs ? tempFilters?.status : filters.status) ? 1 : undefined} color="primary" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}>
          <Box sx={{ width: '100%' }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              name="status"
              value={isXs ? tempFilters?.status : filters.status}
              label="Status"
              onChange={isXs ? (e) => setTempFilters((s) => ({ ...s, status: e.target.value })) : onFilterChange}
              sx={{ minWidth: { xs: '100%', sm: 120 } }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </Box>
        </Badge>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 120 }, '& .MuiOutlinedInput-root': { transition: 'all 0.2s' } }}>
        <Badge badgeContent={(isXs ? tempFilters?.priority : filters.priority) ? 1 : undefined} color="primary" sx={{ '& .MuiBadge-badge': { right: -3, top: 3 } }}>
          <Box sx={{ width: '100%' }}>
            <InputLabel id="priority-select-label">Priority</InputLabel>
            <Select
              labelId="priority-select-label"
              id="priority-select"
              name="priority"
              value={isXs ? tempFilters?.priority : filters.priority}
              label="Priority"
              onChange={isXs ? (e) => setTempFilters((s) => ({ ...s, priority: e.target.value })) : onFilterChange}
              sx={{ minWidth: { xs: '100%', sm: 120 } }}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="Low"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'info.main' }} />Low</Box></MenuItem>
              <MenuItem value="Medium"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'warning.main' }} />Medium</Box></MenuItem>
              <MenuItem value="High"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'error.main' }} />High</Box></MenuItem>
            </Select>
          </Box>
        </Badge>
      </FormControl>
    </Stack>
  );

  return (
    <>
      <Paper elevation={2} sx={{ p: { xs: 1.25, sm: 3 }, mb: 4, transition: 'all 0.3s ease', '&:hover': { boxShadow: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          {/* LEFT SIDE: Title with Badge */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Compact filter button for xs screens */}
            <Badge badgeContent={activeFiltersCount} color="primary" invisible={activeFiltersCount === 0}>
              <IconButton aria-label="Open filters" onClick={() => setDrawerOpen(true)} sx={{ display: { xs: 'inline-flex', sm: 'none' } }}>
                <FilterListIcon color="action" />
              </IconButton>
            </Badge>

              <FilterListIcon color="action" sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Filter & Sort</Typography>
              {/* On xs show a concise summary of selections next to the icon */}
              <Typography variant="caption" sx={{ display: { xs: 'inline-flex', sm: 'none' }, ml: 1, color: 'text.secondary' }}>
                {([filters?.status, filters?.priority].filter(Boolean).join(' · ') || 'All')}
              </Typography>

            {/* Clear button (visible on desktop) */}
            {activeFiltersCount > 0 && (
              <Tooltip title="Clear all filters" arrow>
                <IconButton size="small" onClick={handleClearFilters} sx={{ ml: 1, transition: 'all 0.2s', '&:hover': { color: 'error.main', transform: 'rotate(90deg)' } }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {/* RIGHT SIDE: Controls grouped together (hidden on xs) */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{Controls}</Box>
        </Box>
      </Paper>

      {/* Mobile Drawer: bottom sheet with the same controls */}
      <Drawer anchor="bottom" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { px: 2, pt: 1, pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Filters</Typography>
          <Box>
            <Button size="small" onClick={handleClearFilters} sx={{ mr: 1 }}>Clear</Button>
            <IconButton aria-label="Close filters" onClick={() => setDrawerOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />
        {Controls}
        {/* Drawer actions: Apply / Cancel */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button size="small" onClick={() => { setTempFilters(filters); setTempSort(sortBy); setDrawerOpen(false); }}>Cancel</Button>
          <Button size="small" variant="contained" onClick={() => {
            // Apply temporary values
            onFilterChange({ target: { name: 'status', value: tempFilters?.status || '' } });
            onFilterChange({ target: { name: 'priority', value: tempFilters?.priority || '' } });
            onSortChange({ target: { name: 'sortBy', value: tempSort } });
            setDrawerOpen(false);
          }}>Apply</Button>
        </Box>
      </Drawer>
    </>
  );
};

export default TaskFilters;