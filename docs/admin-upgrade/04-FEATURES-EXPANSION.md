# Admin Feature Upgrade - Features Expansion

**Document:** 04 of 07  
**Focus:** New features, bulk operations, advanced filtering, exports  
**Timeline:** 3 weeks (Weeks 8-9 of implementation)  
**Priority:** High  
**Dependencies:** Phase 1 (Security), Phase 2 (Performance)

---

## Table of Contents

1. [Overview](#overview)
2. [Bulk Operations](#bulk-operations)
3. [Advanced Filtering System](#advanced-filtering-system)
4. [Export & Reporting](#export--reporting)
5. [Real-time Collaboration](#real-time-collaboration)
6. [Search Enhancements](#search-enhancements)
7. [Data Import](#data-import)
8. [Implementation Guide](#implementation-guide)

---

## Overview

This document outlines **power-user features** that significantly enhance admin productivity. These features transform the admin panel from a basic CRUD interface into a professional data management system.

### Success Metrics

- ✅ Bulk operations reduce task time by 80%
- ✅ Advanced filters used in 70% of admin sessions
- ✅ Export feature used weekly by all admins
- ✅ Real-time updates eliminate refresh confusion
- ✅ Search results appear in < 200ms

---

## Bulk Operations

### Problem Statement

**Current:** Admins must process items one-by-one  
**Impact:** Processing 50 applications takes ~30 minutes  
**Solution:** Multi-select with bulk actions

### 1. Multi-Select DataGrid Enhancement

**File:** `src/components/admin/BulkActionDataGrid.jsx`

```jsx
import React, { useState, useMemo } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Enhanced DataGrid with bulk operation support
 */
const BulkActionDataGrid = ({
  rows,
  columns,
  bulkActions = [],
  onBulkAction,
  loading = false,
  checkboxSelection = true,
  ...props
}) => {
  const [selectionModel, setSelectionModel] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const selectedCount = selectionModel.length;
  const hasSelection = selectedCount > 0;

  const handleBulkAction = async (action) => {
    setAnchorEl(null);
    
    if (onBulkAction) {
      await onBulkAction(action.key, selectionModel);
      setSelectionModel([]); // Clear selection after action
    }
  };

  // Custom toolbar with bulk actions
  const CustomToolbar = () => (
    <GridToolbarContainer sx={{ justifyContent: 'space-between', p: 1 }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </Box>

      <AnimatePresence>
        {hasSelection && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <Chip
              label={`${selectedCount} selected`}
              color="primary"
              size="small"
              onDelete={() => setSelectionModel([])}
            />

            {/* Quick action buttons */}
            {bulkActions.slice(0, 2).map((action) => (
              <Button
                key={action.key}
                size="small"
                startIcon={action.icon}
                onClick={() => handleBulkAction(action)}
                color={action.color || 'primary'}
                variant="outlined"
              >
                {action.label}
              </Button>
            ))}

            {/* More actions menu */}
            {bulkActions.length > 2 && (
              <>
                <Button
                  size="small"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  endIcon={<MoreVertIcon />}
                >
                  More
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {bulkActions.slice(2).map((action) => (
                    <MenuItem
                      key={action.key}
                      onClick={() => handleBulkAction(action)}
                    >
                      <ListItemIcon>{action.icon}</ListItemIcon>
                      <ListItemText>{action.label}</ListItemText>
                    </MenuItem>
                  ))}
                </Menu>
              </>
            )}
          </Box>
        )}
      </AnimatePresence>
    </GridToolbarContainer>
  );

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      checkboxSelection={checkboxSelection}
      disableRowSelectionOnClick
      rowSelectionModel={selectionModel}
      onRowSelectionModelChange={setSelectionModel}
      loading={loading}
      slots={{
        toolbar: CustomToolbar,
      }}
      sx={{
        '& .MuiDataGrid-row.Mui-selected': {
          bgcolor: 'action.selected',
        },
      }}
      {...props}
    />
  );
};

export default BulkActionDataGrid;
```

### 2. Bulk Action Hook

**File:** `src/hooks/useBulkActions.js`

```javascript
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ConfirmationDialog from '@/components/ConfirmationDialog';

/**
 * Hook for handling bulk operations with confirmation
 */
export const useBulkActions = () => {
  const dispatch = useDispatch();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Execute bulk action with progress tracking
   */
  const executeBulkAction = async (
    actionFn,
    ids,
    options = {}
  ) => {
    const {
      successMessage = 'Bulk action completed',
      errorMessage = 'Bulk action failed',
      showProgress = true,
      batchSize = 10, // Process in batches
    } = options;

    setIsProcessing(true);
    setProgress(0);

    try {
      const total = ids.length;
      const results = {
        success: [],
        failed: [],
      };

      // Process in batches to avoid overwhelming the server
      for (let i = 0; i < ids.length; i += batchSize) {
        const batch = ids.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (id) => {
          try {
            await actionFn(id);
            results.success.push(id);
          } catch (error) {
            results.failed.push({ id, error: error.message });
          }
        });

        await Promise.allSettled(batchPromises);

        // Update progress
        if (showProgress) {
          const completed = Math.min(i + batchSize, total);
          setProgress((completed / total) * 100);
        }
      }

      // Show results
      if (results.failed.length === 0) {
        toast.success(`${successMessage} (${results.success.length} items)`);
      } else if (results.success.length === 0) {
        toast.error(`${errorMessage}: All items failed`);
      } else {
        toast.warning(
          `Partial success: ${results.success.length} succeeded, ${results.failed.length} failed`
        );
      }

      return results;

    } catch (error) {
      toast.error(`${errorMessage}: ${error.message}`);
      throw error;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return {
    executeBulkAction,
    isProcessing,
    progress,
  };
};
```

### 3. Usage Example - Bulk Application Approval

**File:** `src/features/admin/components/applications/ApplicationList.jsx`

```jsx
import { useBulkActions } from '@/hooks/useBulkActions';
import { approveApplication, rejectApplication } from '@/features/admin/adminService/teacherService';
import BulkActionDataGrid from '@/components/admin/BulkActionDataGrid';
import ConfirmationDialog from '@/components/ConfirmationDialog';

const ApplicationList = () => {
  const { applications, loading } = useSelector(state => state.adminTeacher);
  const { executeBulkAction, isProcessing } = useBulkActions();
  const [confirmDialog, setConfirmDialog] = useState(null);

  const bulkActions = [
    {
      key: 'approve',
      label: 'Approve',
      icon: <CheckCircleIcon />,
      color: 'success',
    },
    {
      key: 'reject',
      label: 'Reject',
      icon: <CancelIcon />,
      color: 'error',
    },
  ];

  const handleBulkAction = async (action, selectedIds) => {
    // Show confirmation dialog
    setConfirmDialog({
      open: true,
      title: `Bulk ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      message: `Are you sure you want to ${action} ${selectedIds.length} applications?`,
      onConfirm: async () => {
        const actionFn = action === 'approve' ? approveApplication : rejectApplication;
        
        await executeBulkAction(
          (id) => actionFn(token, id),
          selectedIds,
          {
            successMessage: `Applications ${action}d successfully`,
            errorMessage: `Failed to ${action} applications`,
          }
        );

        // Refresh data
        dispatch(fetchApplications());
      },
    });
  };

  return (
    <>
      <BulkActionDataGrid
        rows={applications}
        columns={columns}
        bulkActions={bulkActions}
        onBulkAction={handleBulkAction}
        loading={loading || isProcessing}
      />

      <ConfirmationDialog
        open={confirmDialog?.open}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        onConfirm={confirmDialog?.onConfirm}
        onCancel={() => setConfirmDialog(null)}
      />
    </>
  );
};
```

---

## Advanced Filtering System

### Problem Statement

**Current:** Basic search only  
**Impact:** Difficult to find specific records in large datasets  
**Solution:** Filter builder with saved presets

### 1. Filter Builder Component

**File:** `src/components/admin/FilterBuilder.jsx`

```jsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import FilterListIcon from '@mui/icons-material/FilterList';

/**
 * Advanced filter builder with multiple conditions
 */
const FilterBuilder = ({ fields, onApplyFilters, savedFilters = [] }) => {
  const [filters, setFilters] = useState([createEmptyFilter()]);
  const [filterName, setFilterName] = useState('');
  
  function createEmptyFilter() {
    return {
      id: Date.now(),
      field: '',
      operator: 'equals',
      value: '',
    };
  }

  const operators = {
    text: [
      { value: 'equals', label: 'Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'startsWith', label: 'Starts with' },
      { value: 'endsWith', label: 'Ends with' },
    ],
    number: [
      { value: 'equals', label: 'Equals' },
      { value: 'greaterThan', label: 'Greater than' },
      { value: 'lessThan', label: 'Less than' },
      { value: 'between', label: 'Between' },
    ],
    date: [
      { value: 'equals', label: 'On' },
      { value: 'before', label: 'Before' },
      { value: 'after', label: 'After' },
      { value: 'between', label: 'Between' },
    ],
    select: [
      { value: 'equals', label: 'Is' },
      { value: 'notEquals', label: 'Is not' },
      { value: 'in', label: 'Is one of' },
    ],
  };

  const addFilter = () => {
    setFilters([...filters, createEmptyFilter()]);
  };

  const removeFilter = (id) => {
    setFilters(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id, field, value) => {
    setFilters(filters.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const handleApply = () => {
    const validFilters = filters.filter(f => f.field && f.value);
    onApplyFilters(validFilters);
  };

  const handleClear = () => {
    setFilters([createEmptyFilter()]);
    onApplyFilters([]);
  };

  const getOperatorsForField = (fieldName) => {
    const field = fields.find(f => f.name === fieldName);
    return field ? operators[field.type] : operators.text;
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon />
          Advanced Filters
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button size="small" onClick={handleClear}>
            Clear All
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleApply}
            disabled={filters.every(f => !f.field || !f.value)}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>

      {filters.map((filter, index) => (
        <Grid container spacing={2} key={filter.id} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Field</InputLabel>
              <Select
                value={filter.field}
                onChange={(e) => updateFilter(filter.id, 'field', e.target.value)}
                label="Field"
              >
                {fields.map(field => (
                  <MenuItem key={field.name} value={field.name}>
                    {field.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Operator</InputLabel>
              <Select
                value={filter.operator}
                onChange={(e) => updateFilter(filter.id, 'operator', e.target.value)}
                label="Operator"
                disabled={!filter.field}
              >
                {getOperatorsForField(filter.field).map(op => (
                  <MenuItem key={op.value} value={op.value}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={5}>
            <TextField
              fullWidth
              size="small"
              label="Value"
              value={filter.value}
              onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
              disabled={!filter.field}
            />
          </Grid>

          <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="small"
              onClick={() => removeFilter(filter.id)}
              disabled={filters.length === 1}
            >
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Button
        startIcon={<AddIcon />}
        onClick={addFilter}
        size="small"
      >
        Add Filter
      </Button>

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Saved Filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {savedFilters.map(saved => (
              <Chip
                key={saved.id}
                label={saved.name}
                onClick={() => setFilters(saved.filters)}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default FilterBuilder;
```

### 2. Filter Hook

**File:** `src/hooks/useAdvancedFilter.js`

```javascript
import { useState, useMemo } from 'react';

/**
 * Hook for client-side advanced filtering
 */
export const useAdvancedFilter = (data, defaultFilters = []) => {
  const [filters, setFilters] = useState(defaultFilters);

  const filteredData = useMemo(() => {
    if (!filters || filters.length === 0) return data;

    return data.filter(item => {
      return filters.every(filter => {
        const value = item[filter.field];
        const filterValue = filter.value;

        switch (filter.operator) {
          case 'equals':
            return String(value).toLowerCase() === String(filterValue).toLowerCase();
          
          case 'contains':
            return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
          
          case 'startsWith':
            return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
          
          case 'endsWith':
            return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
          
          case 'greaterThan':
            return Number(value) > Number(filterValue);
          
          case 'lessThan':
            return Number(value) < Number(filterValue);
          
          case 'in':
            const values = filterValue.split(',').map(v => v.trim());
            return values.includes(String(value));
          
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  return {
    filteredData,
    filters,
    setFilters,
    activeFilterCount: filters.length,
    clearFilters: () => setFilters([]),
  };
};
```

---

## Export & Reporting

**See:** [EXPORT-GUIDE.md](./EXPORT-GUIDE.md) for complete implementation

### Quick Implementation Checklist

- [ ] Create `src/utils/exportHelpers.js` with ExcelJS functions
- [ ] Create `src/components/admin/ExportButton.jsx` component
- [ ] Add export buttons to all admin list pages
- [ ] Implement column customization for exports
- [ ] Add audit logging for export operations
- [ ] Test with large datasets (1000+ rows)

### Export Features Summary

✅ **Excel (.xlsx)** - Styled with colors, borders, frozen headers  
✅ **CSV (.csv)** - Simple text format  
✅ **PDF (.pdf)** - Formatted documents (optional)  
✅ **Multi-sheet** - Export multiple datasets  
✅ **Custom columns** - Select fields to export  
✅ **Filters applied** - Export filtered data only

---

## Real-time Collaboration

### Problem Statement

**Current:** Admins work in isolation, no visibility into concurrent edits  
**Impact:** Data conflicts, confusion about latest state  
**Solution:** Socket.IO-based real-time updates

### 1. Admin Socket Events

**File:** `src/context/AdminSocketContext.jsx`

```jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const AdminSocketContext = createContext(null);

export const useAdminSocket = () => {
  const context = useContext(AdminSocketContext);
  if (!context) {
    throw new Error('useAdminSocket must be used within AdminSocketProvider');
  }
  return context;
};

export const AdminSocketProvider = ({ children }) => {
  const { socket, isConnected } = useSocket();
  const dispatch = useDispatch();
  const [activeAdmins, setActiveAdmins] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Join admin room
    socket.emit('admin:join');

    // Listen for admin presence
    socket.on('admin:presence', (admins) => {
      setActiveAdmins(admins);
    });

    // Listen for data updates from other admins
    socket.on('admin:dataUpdate', (update) => {
      const { type, action, data, adminName } = update;
      
      toast.info(`${adminName} ${action} a ${type}`, {
        autoClose: 2000,
      });

      // Refresh relevant data
      // dispatch(refreshData(type));
    });

    // Listen for activity feed
    socket.on('admin:activity', (activity) => {
      setRecentActivity(prev => [activity, ...prev].slice(0, 20));
    });

    return () => {
      socket.emit('admin:leave');
      socket.off('admin:presence');
      socket.off('admin:dataUpdate');
      socket.off('admin:activity');
    };
  }, [socket, isConnected, dispatch]);

  const broadcastUpdate = (type, action, data) => {
    if (socket && isConnected) {
      socket.emit('admin:update', { type, action, data });
    }
  };

  return (
    <AdminSocketContext.Provider
      value={{
        activeAdmins,
        recentActivity,
        broadcastUpdate,
      }}
    >
      {children}
    </AdminSocketContext.Provider>
  );
};
```

### 2. Active Admins Indicator

**File:** `src/components/admin/ActiveAdminsIndicator.jsx`

```jsx
import React from 'react';
import {
  Box,
  Avatar,
  AvatarGroup,
  Tooltip,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAdminSocket } from '@/context/AdminSocketContext';

const ActiveAdminsIndicator = () => {
  const { activeAdmins } = useAdminSocket();

  if (activeAdmins.length === 0) return null;

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      <Chip
        label={`${activeAdmins.length} admin${activeAdmins.length > 1 ? 's' : ''} online`}
        size="small"
        color="success"
        variant="outlined"
      />
      
      <AvatarGroup max={4}>
        {activeAdmins.map(admin => (
          <Tooltip key={admin.id} title={admin.name}>
            <Avatar
              sx={{ width: 32, height: 32 }}
              alt={admin.name}
              src={admin.avatar}
            >
              {admin.name[0]}
            </Avatar>
          </Tooltip>
        ))}
      </AvatarGroup>
    </Box>
  );
};

export default ActiveAdminsIndicator;
```

### 3. Activity Feed

**File:** `src/components/admin/ActivityFeed.jsx`

```jsx
import React from 'react';
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Chip,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { useAdminSocket } from '@/context/AdminSocketContext';
import { motion } from 'framer-motion';

const ActivityFeed = () => {
  const { recentActivity } = useAdminSocket();

  const getActivityColor = (action) => {
    switch (action) {
      case 'created': return 'success';
      case 'updated': return 'info';
      case 'deleted': return 'error';
      case 'approved': return 'success';
      case 'rejected': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 2, maxHeight: 400, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      
      <List>
        {recentActivity.map((activity, index) => (
          <ListItem
            key={`${activity.timestamp}-${index}`}
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ListItemAvatar>
              <Avatar sx={{ width: 32, height: 32 }}>
                {activity.adminName[0]}
              </Avatar>
            </ListItemAvatar>
            
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2">
                    {activity.adminName}
                  </Typography>
                  <Chip
                    label={activity.action}
                    size="small"
                    color={getActivityColor(activity.action)}
                  />
                  <Typography variant="body2">
                    {activity.resourceType}
                  </Typography>
                </Box>
              }
              secondary={formatDistanceToNow(new Date(activity.timestamp), {
                addSuffix: true,
              })}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ActivityFeed;
```

---

## Search Enhancements

### 1. Global Search with Keyboard Shortcut

**File:** `src/components/admin/GlobalSearch.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Chip,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

/**
 * Command+K / Ctrl+K global search
 */
const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const debouncedQuery = useDebouncedValue(query, 300);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      
      // ESC to close
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search across all admin resources
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      try {
        // Call search API
        // const data = await adminService.globalSearch(debouncedQuery);
        // setResults(data);
        
        // Mock results
        setResults([
          { type: 'user', id: 1, name: 'John Doe', email: 'john@example.com' },
          { type: 'subject', id: 2, name: 'Data Structures', code: 'CS201' },
          { type: 'teacher', id: 3, name: 'Dr. Smith', department: 'CSE' },
        ]);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const handleSelect = (result) => {
    // Navigate to detail page
    const routes = {
      user: `/admin/users/${result.id}`,
      subject: `/admin/subjects/${result.id}`,
      teacher: `/admin/faculty/${result.id}`,
    };
    
    navigate(routes[result.type]);
    setOpen(false);
    setQuery('');
  };

  const getIcon = (type) => {
    const icons = {
      user: <PersonIcon />,
      subject: <BookIcon />,
      teacher: <SchoolIcon />,
    };
    return icons[type];
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { position: 'fixed', top: 100, m: 0 },
      }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          autoFocus
          placeholder="Search users, subjects, teachers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip label="⌘K" size="small" />
              </InputAdornment>
            ),
          }}
        />

        {results.length > 0 && (
          <List sx={{ mt: 1 }}>
            {results.map(result => (
              <ListItemButton
                key={`${result.type}-${result.id}`}
                onClick={() => handleSelect(result)}
              >
                <ListItemIcon>
                  {getIcon(result.type)}
                </ListItemIcon>
                <ListItemText
                  primary={result.name}
                  secondary={result.email || result.code || result.department}
                />
                <Chip label={result.type} size="small" />
              </ListItemButton>
            ))}
          </List>
        )}

        {loading && (
          <Typography sx={{ p: 2, textAlign: 'center' }} color="text.secondary">
            Searching...
          </Typography>
        )}

        {!loading && query && results.length === 0 && (
          <Typography sx={{ p: 2, textAlign: 'center' }} color="text.secondary">
            No results found
          </Typography>
        )}
      </Box>
    </Dialog>
  );
};

export default GlobalSearch;
```

---

## Data Import

### CSV/Excel Import Component

**File:** `src/components/admin/DataImportDialog.jsx`

```jsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExcelJS from 'exceljs';

const DataImportDialog = ({ open, onClose, onImport, template }) => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [step, setStep] = useState(0);
  const [importing, setImporting] = useState(false);

  const steps = ['Upload File', 'Validate Data', 'Import'];

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    await parseFile(selectedFile);
  };

  const parseFile = async (file) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const buffer = await file.arrayBuffer();
      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];
      const rows = [];
      const headers = [];

      // Get headers from first row
      worksheet.getRow(1).eachCell((cell) => {
        headers.push(cell.value);
      });

      // Get data from remaining rows
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header
        
        const rowData = {};
        row.eachCell((cell, colNumber) => {
          rowData[headers[colNumber - 1]] = cell.value;
        });
        rows.push(rowData);
      });

      setData(rows);
      validateData(rows);
      setStep(1);
    } catch (error) {
      setErrors([{ row: 0, message: 'Failed to parse file' }]);
    }
  };

  const validateData = (rows) => {
    const validationErrors = [];

    rows.forEach((row, index) => {
      // Validate required fields
      template.requiredFields.forEach(field => {
        if (!row[field]) {
          validationErrors.push({
            row: index + 2, // +2 because of header and 0-index
            message: `Missing required field: ${field}`,
          });
        }
      });

      // Custom validation
      if (template.validate) {
        const error = template.validate(row);
        if (error) {
          validationErrors.push({
            row: index + 2,
            message: error,
          });
        }
      }
    });

    setErrors(validationErrors);
  };

  const handleImport = async () => {
    if (errors.length > 0) return;

    setImporting(true);
    try {
      await onImport(data);
      onClose();
    } catch (error) {
      setErrors([{ row: 0, message: error.message }]);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Data from Excel</DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {step === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <input
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
                size="large"
              >
                Choose File
              </Button>
            </label>
            
            {file && (
              <Typography sx={{ mt: 2 }}>
                Selected: {file.name}
              </Typography>
            )}
          </Box>
        )}

        {step === 1 && (
          <Box>
            {errors.length === 0 ? (
              <Alert severity="success">
                Validation passed! Found {data.length} valid records.
              </Alert>
            ) : (
              <>
                <Alert severity="error" sx={{ mb: 2 }}>
                  Found {errors.length} validation errors
                </Alert>
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {errors.map((error, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Row ${error.row}`}
                        secondary={error.message}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Box>
        )}

        {importing && <LinearProgress />}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {step === 1 && (
          <Button
            onClick={handleImport}
            variant="contained"
            disabled={errors.length > 0 || importing}
          >
            Import {data.length} Records
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DataImportDialog;
```

---

## Implementation Guide

### Week 8: Bulk Operations & Filtering

**Day 1-2: Bulk Operations**
- [ ] Create `BulkActionDataGrid` component
- [ ] Create `useBulkActions` hook
- [ ] Update ApplicationList with bulk approve/reject
- [ ] Add bulk operations to UserManagement
- [ ] Add progress indicators

**Day 3-4: Advanced Filtering**
- [ ] Create `FilterBuilder` component
- [ ] Create `useAdvancedFilter` hook
- [ ] Implement saved filter presets
- [ ] Add filter persistence (localStorage)
- [ ] Test with large datasets

**Day 5: Testing**
- [ ] Unit tests for bulk operations
- [ ] Integration tests for filtering
- [ ] Performance testing with 1000+ records
- [ ] UX testing and refinements

### Week 9: Export, Real-time, Search

**Day 1-2: Export System**
- [ ] Implement ExcelJS export utilities
- [ ] Create ExportButton component
- [ ] Add export to all admin pages
- [ ] Test with various data formats
- [ ] Add audit logging for exports

**Day 3: Real-time Collaboration**
- [ ] Create AdminSocketContext
- [ ] Implement presence tracking
- [ ] Add activity feed component
- [ ] Test concurrent admin sessions
- [ ] Add conflict resolution UI

**Day 4: Search Enhancements**
- [ ] Create GlobalSearch component
- [ ] Implement keyboard shortcuts
- [ ] Add search API endpoints (backend)
- [ ] Test search across all resources
- [ ] Optimize search performance

**Day 5: Data Import**
- [ ] Create DataImportDialog component
- [ ] Implement Excel parsing with ExcelJS
- [ ] Add validation rules
- [ ] Create import templates
- [ ] Test with sample data

---

## Testing Checklist

### Bulk Operations
- [ ] Select multiple items (10, 50, 100+)
- [ ] Perform bulk actions (approve, reject, delete)
- [ ] Verify progress indicators
- [ ] Test error handling (partial failures)
- [ ] Check audit logs for bulk actions

### Advanced Filtering
- [ ] Create filters with multiple conditions
- [ ] Test all operator types
- [ ] Save and load filter presets
- [ ] Clear filters
- [ ] Test performance with large datasets

### Export
- [ ] Export to Excel (styled)
- [ ] Export to CSV
- [ ] Export filtered data
- [ ] Export with custom columns
- [ ] Test large datasets (1000+ rows)

### Real-time
- [ ] Multiple admins online simultaneously
- [ ] Activity feed updates in real-time
- [ ] Presence indicators accurate
- [ ] No conflicts on concurrent edits
- [ ] Reconnection handling

### Search
- [ ] Keyboard shortcut works (Cmd+K)
- [ ] Search returns relevant results
- [ ] Search is fast (< 200ms)
- [ ] Navigate to search results
- [ ] Search across all resource types

---

## Performance Targets

| Feature | Target | Measurement |
|---------|--------|-------------|
| Bulk operation (50 items) | < 5 seconds | Time to completion |
| Filter application | < 100ms | UI response time |
| Export (1000 rows) | < 3 seconds | File generation time |
| Real-time update | < 500ms | Message latency |
| Global search | < 200ms | Results display time |

---

## Security Considerations

1. **Bulk Operations** - Require confirmation for destructive actions
2. **Export** - Log all export operations for audit
3. **Real-time** - Authenticate socket connections
4. **Search** - Sanitize search queries to prevent injection
5. **Import** - Validate all imported data thoroughly

---

## Next Steps

1. Review and prioritize features with stakeholders
2. Allocate development resources
3. Set up feature flags for gradual rollout
4. Create user documentation
5. Plan training sessions for admins

---

**Document Navigation:**

📄 [← Previous: 03-PERFORMANCE-OPTIMIZATION.md](./03-PERFORMANCE-OPTIMIZATION.md)  
📄 **Current:** 04-FEATURES-EXPANSION.md  
📄 [Next: 05-DEVELOPER-EXPERIENCE.md →](./05-DEVELOPER-EXPERIENCE.md)

---

**Last Updated:** October 30, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
