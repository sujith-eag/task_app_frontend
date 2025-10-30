# UI/UX Enhancements - Admin Feature Upgrade

**Phase:** 1 & 3  
**Priority:** High  
**Timeline:** 3-4 weeks  
**Dependencies:** Theme system, component library

---

## Table of Contents

1. [Current UI/UX Issues](#current-uiux-issues)
2. [Design System & Tokens](#design-system--tokens)
3. [Component Library Enhancements](#component-library-enhancements)
4. [Dashboard Redesign](#dashboard-redesign)
5. [Responsive Design Strategy](#responsive-design-strategy)
6. [Accessibility Improvements](#accessibility-improvements)
7. [Animation & Micro-interactions](#animation--micro-interactions)
8. [Implementation Checklist](#implementation-checklist)

---

## Current UI/UX Issues

### Critical Problems

1. **Poor Confirmation UX**
   ```javascript
   // ❌ CURRENT: Native browser alert
   if(window.confirm('Are you sure you want to delete this subject?')) {
       dispatch(deleteSubject(subjectId))
   }
   ```
   **Issues:**
   - No context about consequences
   - Can't be styled or customized
   - No undo mechanism
   - Blocks the UI thread
   - Poor accessibility

2. **Basic Modal Design**
   - Uses `<Modal>` instead of `<Dialog>`
   - No slide/fade animations
   - Abrupt open/close
   - No drawer alternatives for mobile

3. **Limited Feedback**
   - Toast notifications only
   - No skeleton loaders
   - No empty states
   - No loading states on buttons
   - No success animations

4. **Inconsistent Spacing**
   - Hard-coded spacing values
   - Inconsistent padding/margins
   - Not using theme spacing scale

5. **Poor DataGrid UX**
   - No column resizing
   - No column reordering
   - No density options
   - No row height options
   - Limited filtering UI

### User Experience Pain Points

**Admin Dashboard:**
- No visual analytics or charts
- No quick action buttons
- No recent activity feed
- Tab switching doesn't preserve state
- No customizable layout

**Forms:**
- Basic HTML5 validation only
- Errors appear too late (on submit)
- No inline validation
- No field-level error messages
- No success indicators

**Navigation:**
- No breadcrumbs
- No keyboard shortcuts
- No command palette
- Manual tab navigation only

---

## Design System & Tokens

### Step 1: Extend Theme Configuration

**File:** `src/theme.js`

```javascript
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#90caf9' : '#1976d2',
      light: mode === 'dark' ? '#e3f2fd' : '#42a5f5',
      dark: mode === 'dark' ? '#42a5f5' : '#1565c0',
      contrastText: '#fff',
    },
    secondary: {
      main: mode === 'dark' ? '#ce93d8' : '#9c27b0',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: mode === 'dark' ? '#0a1929' : '#f5f5f5',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
      elevation1: mode === 'dark' ? '#2d2d2d' : '#fafafa',
      elevation2: mode === 'dark' ? '#3d3d3d' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#fff' : 'rgba(0, 0, 0, 0.87)',
      secondary: mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
      disabled: mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.38)',
    },
    divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
  },
  
  // ✨ NEW: Spacing scale
  spacing: 8, // Base unit (8px)
  
  // ✨ NEW: Typography enhancements
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none', // ✨ Remove uppercase
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
  },
  
  // ✨ NEW: Shadows
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    // ... rest of MUI shadow scale
  ],
  
  // ✨ NEW: Border radius scale
  shape: {
    borderRadius: 8,
    borderRadiusLg: 12,
    borderRadiusSm: 4,
  },
  
  // ✨ NEW: Z-index scale
  zIndex: {
    mobileStepper: 1000,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  
  // ✨ NEW: Transitions
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  
  // ✨ NEW: Custom design tokens
  custom: {
    cardElevation: mode === 'dark' ? 2 : 1,
    hoverElevation: mode === 'dark' ? 4 : 2,
    gridGap: 2, // 16px
    sectionGap: 3, // 24px
    containerPadding: { xs: 2, sm: 3, md: 4 },
  },
});
```

### Step 2: Create Reusable Style Utilities

**New File:** `src/utils/styleHelpers.js`

```javascript
/**
 * Consistent card styling
 */
export const cardStyles = (theme) => ({
  p: theme.custom.containerPadding,
  borderRadius: theme.shape.borderRadiusLg,
  bgcolor: 'background.paper',
  boxShadow: theme.shadows[theme.custom.cardElevation],
  transition: theme.transitions.create(['box-shadow', 'transform'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    boxShadow: theme.shadows[theme.custom.hoverElevation],
  },
});

/**
 * Section container styling
 */
export const sectionStyles = (theme) => ({
  mb: theme.custom.sectionGap,
});

/**
 * Responsive grid container
 */
export const gridContainerStyles = (theme) => ({
  display: 'grid',
  gap: theme.custom.gridGap,
  gridTemplateColumns: {
    xs: '1fr',
    sm: 'repeat(2, 1fr)',
    md: 'repeat(3, 1fr)',
    lg: 'repeat(4, 1fr)',
  },
});

/**
 * Flex center utility
 */
export const flexCenter = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * Flex between utility
 */
export const flexBetween = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

/**
 * Truncate text utility
 */
export const truncateText = (lines = 1) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
});
```

---

## Component Library Enhancements

### 1. Enhanced Confirmation Dialog

**New File:** `src/components/ConfirmDialog.jsx`

```jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';

/**
 * Professional confirmation dialog replacing window.confirm()
 * 
 * @param {boolean} open - Dialog open state
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Confirm handler
 * @param {string} title - Dialog title
 * @param {string} message - Main message
 * @param {string} confirmText - Confirm button text
 * @param {string} severity - 'error' | 'warning' | 'info'
 * @param {string} details - Additional details/consequences
 * @param {boolean} isLoading - Loading state
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning', // 'error' | 'warning' | 'info'
  details = null,
  isLoading = false,
}) => {
  const severityConfig = {
    error: {
      icon: <DeleteIcon />,
      color: 'error',
      bgcolor: 'error.lighter',
    },
    warning: {
      icon: <WarningAmberIcon />,
      color: 'warning',
      bgcolor: 'warning.lighter',
    },
    info: {
      icon: <InfoIcon />,
      color: 'info',
      bgcolor: 'info.lighter',
    },
  };

  const config = severityConfig[severity];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              color: `${config.color}.main`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {config.icon}
          </Box>
          <Typography variant="h6" component="span">
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ mb: details ? 2 : 0 }}>
          {message}
        </DialogContentText>

        {details && (
          <Alert severity={severity} sx={{ mt: 2 }}>
            {details}
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          disabled={isLoading}
          variant="outlined"
          color="inherit"
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isLoading}
          variant="contained"
          color={config.color}
          autoFocus
        >
          {isLoading ? 'Processing...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
```

**Usage Example:**

```jsx
// ✅ IMPROVED: Professional confirmation
import ConfirmDialog from '@/components/ConfirmDialog';

const SubjectList = ({ onEdit }) => {
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    subjectId: null,
    subjectName: '',
  });

  const handleDelete = (subject) => {
    setDeleteDialog({
      open: true,
      subjectId: subject._id,
      subjectName: subject.name,
    });
  };

  const confirmDelete = () => {
    dispatch(deleteSubject(deleteDialog.subjectId))
      .unwrap()
      .then(() => {
        toast.success('Subject deleted successfully');
        setDeleteDialog({ open: false, subjectId: null, subjectName: '' });
      })
      .catch((err) => toast.error(err));
  };

  return (
    <>
      {/* DataGrid with delete button */}
      <Button onClick={() => handleDelete(row)}>Delete</Button>

      <ConfirmDialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, subjectId: null, subjectName: '' })}
        onConfirm={confirmDelete}
        title="Delete Subject"
        message={`Are you sure you want to delete "${deleteDialog.subjectName}"?`}
        details="This action cannot be undone. All associated data will be permanently removed."
        confirmText="Delete Subject"
        severity="error"
        isLoading={isLoading}
      />
    </>
  );
};
```

### 2. Skeleton Loaders

**New File:** `src/components/admin/SkeletonLoaders.jsx`

```jsx
import React from 'react';
import { Box, Paper, Skeleton, Stack } from '@mui/material';

/**
 * DataGrid skeleton loader
 */
export const DataGridSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <Paper sx={{ p: 2, height: 400 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={40} sx={{ flex: 1 }} />
          ))}
        </Box>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box key={rowIndex} sx={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} variant="text" sx={{ flex: 1, fontSize: '1rem' }} />
            ))}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

/**
 * Stats card skeleton
 */
export const StatsCardSkeleton = () => {
  return (
    <Paper sx={{ p: 3, height: 120 }}>
      <Stack spacing={1}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="rectangular" width="40%" height={32} />
        <Skeleton variant="text" width="50%" height={20} />
      </Stack>
    </Paper>
  );
};

/**
 * Chart skeleton
 */
export const ChartSkeleton = ({ height = 300 }) => {
  return (
    <Paper sx={{ p: 2, height }}>
      <Skeleton variant="rectangular" width="100%" height="100%" />
    </Paper>
  );
};
```

### 3. Empty States

**New File:** `src/components/admin/EmptyState.jsx`

```jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

/**
 * Empty state component for DataGrids and lists
 */
const EmptyState = ({
  icon: Icon = InboxIcon,
  title = 'No data found',
  description = 'There are no items to display',
  actionLabel = null,
  onAction = null,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Icon
        sx={{
          fontSize: 64,
          color: 'text.disabled',
          mb: 2,
        }}
      />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
```

### 4. Enhanced DataGrid Component

**New File:** `src/components/admin/EnhancedDataGrid.jsx`

```jsx
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Box } from '@mui/material';
import EmptyState from './EmptyState';
import { DataGridSkeleton } from './SkeletonLoaders';

/**
 * Wrapper around MUI DataGrid with consistent styling and UX enhancements
 */
const EnhancedDataGrid = ({
  rows,
  columns,
  isLoading,
  emptyStateProps = {},
  showSkeleton = true,
  sx = {},
  ...dataGridProps
}) => {
  // Show skeleton on initial load
  if (isLoading && rows.length === 0 && showSkeleton) {
    return <DataGridSkeleton />;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        disableRowSelectionOnClick
        autoHeight
        pageSizeOptions={[5, 10, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
        }}
        slots={{
          noRowsOverlay: () => <EmptyState {...emptyStateProps} />,
        }}
        {...dataGridProps}
      />
    </Paper>
  );
};

export default EnhancedDataGrid;
```

---

## Dashboard Redesign

### Statistics Cards Component

**New File:** `src/features/admin/components/dashboard/StatsCard.jsx`

```jsx
import React from 'react';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { motion } from 'framer-motion';

/**
 * Dashboard statistics card with trend indicator
 */
const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = null, // { value: 12, direction: 'up' | 'down' }
  color = 'primary',
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Paper sx={{ p: 3, height: 140 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="rectangular" width="50%" height={40} sx={{ my: 1 }} />
        <Skeleton variant="text" width="70%" height={20} />
      </Paper>
    );
  }

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        p: 3,
        height: 140,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          bgcolor: `${color}.main`,
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>

          {trend && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 1,
                color: trend.direction === 'up' ? 'success.main' : 'error.main',
              }}
            >
              {trend.direction === 'up' ? (
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 16, mr: 0.5 }} />
              )}
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {trend.value}% from last month
              </Typography>
            </Box>
          )}
        </Box>

        {Icon && (
          <Box
            sx={{
              bgcolor: `${color}.lighter`,
              color: `${color}.main`,
              p: 1.5,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ fontSize: 32 }} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatsCard;
```

### Dashboard Overview Component

**Updated File:** `src/features/admin/components/dashboard/DashboardOverview.jsx`

```jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Typography, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StatsCard from './StatsCard';

const DashboardOverview = () => {
  const dispatch = useDispatch();
  
  // Mock data - replace with actual Redux selectors
  const stats = {
    pendingApplications: 12,
    totalStudents: 1250,
    totalTeachers: 48,
    totalSubjects: 32,
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pending Applications"
            value={stats.pendingApplications}
            subtitle="Awaiting review"
            icon={AssignmentIcon}
            color="warning"
            trend={{ value: 8, direction: 'up' }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            subtitle="Active enrollments"
            icon={SchoolIcon}
            color="primary"
            trend={{ value: 3.2, direction: 'up' }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Faculty Members"
            value={stats.totalTeachers}
            subtitle="Active teachers"
            icon={PeopleIcon}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Subjects"
            value={stats.totalSubjects}
            subtitle="Across all semesters"
            icon={LibraryBooksIcon}
            color="info"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
```

---

## Responsive Design Strategy

### Mobile-First Breakpoints

```javascript
// Theme breakpoint strategy
const breakpoints = {
  xs: 0,     // Mobile (320px+)
  sm: 600,   // Tablet (600px+)
  md: 900,   // Small laptop (900px+)
  lg: 1200,  // Desktop (1200px+)
  xl: 1536,  // Large desktop (1536px+)
};
```

### Responsive Patterns

**1. Stack on Mobile, Grid on Desktop:**

```jsx
<Box
  sx={{
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',                    // Single column on mobile
      sm: 'repeat(2, 1fr)',        // 2 columns on tablet
      md: 'repeat(3, 1fr)',        // 3 columns on small laptop
      lg: 'repeat(4, 1fr)',        // 4 columns on desktop
    },
  }}
>
  {/* Cards */}
</Box>
```

**2. Hide/Show Elements:**

```jsx
<Box
  sx={{
    display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
  }}
>
  {/* Desktop-only content */}
</Box>
```

**3. Responsive Typography:**

```jsx
<Typography
  variant="h4"
  sx={{
    fontSize: {
      xs: '1.5rem',   // 24px on mobile
      sm: '1.75rem',  // 28px on tablet
      md: '2rem',     // 32px on desktop
    },
  }}
>
  Responsive Heading
</Typography>
```

### Mobile Navigation Drawer

**New File:** `src/features/admin/components/layout/AdminMobileNav.jsx`

```jsx
import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import { Link as RouterLink } from 'react-router-dom';

const AdminMobileNav = ({ open, onClose }) => {
  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Reporting', path: '/admin/reporting', icon: <PeopleIcon /> },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ fontWeight: 600, fontSize: '1.25rem' }}>Admin Panel</Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={RouterLink}
            to={item.path}
            onClick={onClose}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default AdminMobileNav;
```

---

## Accessibility Improvements

### WCAG 2.1 AA Compliance Checklist

- [ ] **Color Contrast:** Ensure 4.5:1 ratio for normal text, 3:1 for large text
- [ ] **Keyboard Navigation:** All interactive elements accessible via Tab
- [ ] **Focus Indicators:** Visible focus outlines on all focusable elements
- [ ] **ARIA Labels:** Descriptive labels for screen readers
- [ ] **Semantic HTML:** Use proper heading hierarchy, landmarks
- [ ] **Form Labels:** All inputs have associated labels
- [ ] **Error Messages:** Clear, descriptive error messages linked to fields
- [ ] **Skip Links:** "Skip to main content" link at top
- [ ] **Alt Text:** Images have descriptive alt attributes

### Implementation Examples

**1. Enhanced Button Accessibility:**

```jsx
<Button
  aria-label="Delete subject Computer Science"
  onClick={handleDelete}
>
  Delete
</Button>
```

**2. Form Field with Error:**

```jsx
<TextField
  label="Subject Name"
  error={!!errors.name}
  helperText={errors.name?.message}
  inputProps={{
    'aria-describedby': errors.name ? 'name-error' : undefined,
  }}
/>
```

**3. Loading State Announcement:**

```jsx
<Box role="status" aria-live="polite" aria-atomic="true">
  {isLoading && <span className="sr-only">Loading data...</span>}
</Box>
```

---

## Animation & Micro-interactions

### Framer Motion Enhancements

**1. Page Transitions:**

```jsx
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

**2. Stagger List Animation:**

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

<motion.div variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      <Card>{item.name}</Card>
    </motion.div>
  ))}
</motion.div>
```

**3. Success Animation:**

```jsx
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
>
  <CheckCircleIcon color="success" sx={{ fontSize: 64 }} />
</motion.div>
```

---

## Implementation Checklist

### Phase 1: Foundation (Week 1)

- [ ] Update `theme.js` with extended design tokens
- [ ] Create `styleHelpers.js` utility file
- [ ] Install required dependencies:
  ```bash
  npm install react-hook-form yup recharts
  ```
- [ ] Set up component library folder structure

### Phase 2: Core Components (Week 2)

- [ ] Build `ConfirmDialog` component
- [ ] Create skeleton loader components
- [ ] Build `EmptyState` component
- [ ] Create `EnhancedDataGrid` wrapper
- [ ] Replace all `window.confirm()` calls

### Phase 3: Dashboard Enhancement (Week 3)

- [ ] Build `StatsCard` component
- [ ] Create `DashboardOverview` with stats
- [ ] Integrate charts (attendance trends, feedback distribution)
- [ ] Add recent activity feed
- [ ] Quick action shortcuts

### Phase 4: Mobile Optimization (Week 4)

- [ ] Implement responsive grid layouts
- [ ] Create mobile navigation drawer
- [ ] Test all screens on mobile devices
- [ ] Optimize touch targets (min 44x44px)
- [ ] Add swipe gestures where appropriate

### Phase 5: Accessibility & Polish (Week 5)

- [ ] Accessibility audit with axe DevTools
- [ ] Fix all color contrast issues
- [ ] Add ARIA labels and roles
- [ ] Keyboard navigation testing
- [ ] Screen reader testing
- [ ] Add focus trap in modals

---

## Success Metrics

- [ ] All pages load in < 1.5 seconds
- [ ] Lighthouse Accessibility score > 95
- [ ] Mobile usability score > 90
- [ ] Zero `window.confirm()` usage
- [ ] All forms have inline validation
- [ ] Skeleton loaders on all async data

---

**Next:** [02-SECURITY-HARDENING.md](./02-SECURITY-HARDENING.md)  
**Previous:** [00-ROADMAP-OVERVIEW.md](./00-ROADMAP-OVERVIEW.md)
