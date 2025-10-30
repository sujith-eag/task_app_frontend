# Security Hardening - Admin Feature Upgrade

**Phase:** 1 (Critical Priority)  
**Timeline:** 2 weeks  
**Risk Level:** High  
**Dependencies:** Audit logging backend APIs

---

## Table of Contents

1. [Security Audit Findings](#security-audit-findings)
2. [Authentication Enhancements](#authentication-enhancements)
3. [Authorization & Access Control](#authorization--access-control)
4. [Audit Logging System](#audit-logging-system)
5. [Input Validation & Sanitization](#input-validation--sanitization)
6. [Session Management](#session-management)
7. [CSRF Protection](#csrf-protection)
8. [Security Best Practices](#security-best-practices)
9. [Implementation Checklist](#implementation-checklist)

---

## Security Audit Findings

### Critical Vulnerabilities

1. **❌ No Audit Trail**
   - Sensitive operations (delete, approve, reject) have no logging
   - Cannot track WHO made changes and WHEN
   - No way to investigate incidents
   - **Impact:** High - Compliance and accountability issues

2. **❌ No Session Timeout**
   - User session stays active indefinitely
   - Stolen token can be used forever
   - No idle timeout mechanism
   - **Impact:** High - Unauthorized access risk

3. **❌ No CSRF Protection Indicators**
   - Frontend doesn't validate CSRF tokens (assuming backend handles it)
   - No visual indicators of secure connections
   - **Impact:** Medium - Depends on backend implementation

4. **❌ No Rate Limiting UI**
   - No client-side rate limiting
   - No feedback when backend rate limits kick in
   - **Impact:** Medium - Poor UX during attacks

### Medium Severity Issues

5. **⚠️ Weak Input Validation**
   - Basic HTML5 validation only
   - No comprehensive schema validation
   - Client-side validation can be bypassed
   - **Impact:** Medium - Data integrity issues

6. **⚠️ No XSS Protection**
   - User input not sanitized before display
   - DOMPurify installed but not used consistently
   - **Impact:** Medium - Script injection risk

7. **⚠️ No Sensitive Data Masking**
   - Email addresses fully visible in DataGrids
   - No option to mask sensitive information
   - **Impact:** Low-Medium - Privacy concerns

8. **⚠️ No Operation Confirmation Delays**
   - Destructive actions execute immediately after confirmation
   - No "cooling off" period for critical operations
   - **Impact:** Low - Accidental deletions

---

## Authentication Enhancements

### 1. Token Refresh Mechanism

**Current Issue:** Token stored in Redux, no automatic refresh

**Solution:** Implement token refresh before expiry

**New File:** `src/utils/authHelpers.js`

```javascript
import axios from 'axios';
import { store } from '@/app/store';
import { setCredentials, logout } from '@/features/auth/authSlice';

/**
 * Check if token is expiring soon (within 5 minutes)
 */
export const isTokenExpiringSoon = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    return (expiryTime - currentTime) < fiveMinutes;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

/**
 * Refresh token if needed
 */
export const refreshTokenIfNeeded = async () => {
  const state = store.getState();
  const { user } = state.auth;
  
  if (!user?.token) return null;
  
  if (isTokenExpiringSoon(user.token)) {
    try {
      const response = await axios.post('/api/auth/refresh', {
        refreshToken: user.refreshToken, // Assuming you have refresh token
      });
      
      const { token, refreshToken } = response.data;
      
      // Update Redux store
      store.dispatch(setCredentials({ ...user, token, refreshToken }));
      
      return token;
    } catch (error) {
      // Refresh failed, logout user
      store.dispatch(logout());
      return null;
    }
  }
  
  return user.token;
};

/**
 * Axios interceptor to refresh token
 */
axios.interceptors.request.use(
  async (config) => {
    const token = await refreshTokenIfNeeded();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

### 2. Session Timeout Warning

**New Component:** `src/components/auth/SessionTimeoutWarning.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  LinearProgress,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { logout } from '@/features/auth/authSlice';

const SessionTimeoutWarning = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds warning
  
  const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes
  const WARNING_TIME = 1 * 60 * 1000; // 1 minute before timeout
  
  useEffect(() => {
    if (!user) return;
    
    let idleTimer;
    let warningTimer;
    let countdownInterval;
    
    const resetTimers = () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      setShowWarning(false);
      setCountdown(60);
      
      // Start idle timer
      idleTimer = setTimeout(() => {
        // Show warning
        setShowWarning(true);
        
        // Start countdown
        let timeLeft = 60;
        countdownInterval = setInterval(() => {
          timeLeft--;
          setCountdown(timeLeft);
          
          if (timeLeft <= 0) {
            handleLogout();
          }
        }, 1000);
      }, IDLE_TIMEOUT - WARNING_TIME);
    };
    
    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      window.addEventListener(event, resetTimers);
    });
    
    resetTimers();
    
    return () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      clearInterval(countdownInterval);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimers);
      });
    };
  }, [user]);
  
  const handleStayLoggedIn = () => {
    setShowWarning(false);
    setCountdown(60);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    setShowWarning(false);
  };
  
  if (!showWarning) return null;
  
  return (
    <Dialog open={showWarning} maxWidth="sm" fullWidth disableEscapeKeyDown>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color="warning" />
        Session Timeout Warning
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Your session is about to expire due to inactivity.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You will be automatically logged out in <strong>{countdown} seconds</strong>.
        </Typography>
        <LinearProgress 
          variant="determinate" 
          value={(countdown / 60) * 100}
          color="warning"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} color="inherit">
          Logout Now
        </Button>
        <Button onClick={handleStayLoggedIn} variant="contained" autoFocus>
          Stay Logged In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionTimeoutWarning;
```

### 3. Password Requirements Validation

**New Component:** `src/components/auth/PasswordStrengthMeter.jsx`

```jsx
import React from 'react';
import { Box, Typography, LinearProgress, Chip, Stack } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * Password strength validator and visual indicator
 */
const PasswordStrengthMeter = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'Contains uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'Contains lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'Contains number', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'Contains special character', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ];
  
  const passedRequirements = requirements.filter((req) => req.test(password));
  const strength = (passedRequirements.length / requirements.length) * 100;
  
  const getStrengthLabel = () => {
    if (strength <= 40) return { label: 'Weak', color: 'error' };
    if (strength <= 70) return { label: 'Fair', color: 'warning' };
    if (strength < 100) return { label: 'Good', color: 'info' };
    return { label: 'Strong', color: 'success' };
  };
  
  const strengthInfo = getStrengthLabel();
  
  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <LinearProgress
          variant="determinate"
          value={strength}
          color={strengthInfo.color}
          sx={{ flex: 1, height: 8, borderRadius: 4 }}
        />
        <Chip
          label={strengthInfo.label}
          color={strengthInfo.color}
          size="small"
        />
      </Box>
      
      <Stack spacing={0.5}>
        {requirements.map((req, index) => {
          const passed = req.test(password);
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: passed ? 'success.main' : 'text.secondary',
              }}
            >
              {passed ? (
                <CheckCircleIcon sx={{ fontSize: 16 }} />
              ) : (
                <CancelIcon sx={{ fontSize: 16 }} />
              )}
              <Typography variant="caption">{req.label}</Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default PasswordStrengthMeter;
```

---

## Authorization & Access Control

### 1. Permission-Based UI Rendering

**New File:** `src/utils/permissions.js`

```javascript
/**
 * Permission checks for admin features
 */

export const PERMISSIONS = {
  // Application Management
  VIEW_APPLICATIONS: 'view_applications',
  APPROVE_APPLICATIONS: 'approve_applications',
  REJECT_APPLICATIONS: 'reject_applications',
  
  // User Management
  VIEW_USERS: 'view_users',
  EDIT_USERS: 'edit_users',
  PROMOTE_USERS: 'promote_users',
  DELETE_USERS: 'delete_users',
  
  // Subject Management
  VIEW_SUBJECTS: 'view_subjects',
  CREATE_SUBJECTS: 'create_subjects',
  EDIT_SUBJECTS: 'edit_subjects',
  DELETE_SUBJECTS: 'delete_subjects',
  
  // Teacher Management
  VIEW_TEACHERS: 'view_teachers',
  ASSIGN_SUBJECTS: 'assign_subjects',
  REMOVE_ASSIGNMENTS: 'remove_assignments',
  
  // Reporting
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',
  VIEW_AUDIT_LOGS: 'view_audit_logs',
};

/**
 * Role-based permission mapping
 */
const ROLE_PERMISSIONS = {
  admin: Object.values(PERMISSIONS), // All permissions
  hod: [
    PERMISSIONS.VIEW_APPLICATIONS,
    PERMISSIONS.APPROVE_APPLICATIONS,
    PERMISSIONS.REJECT_APPLICATIONS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.VIEW_SUBJECTS,
    PERMISSIONS.CREATE_SUBJECTS,
    PERMISSIONS.EDIT_SUBJECTS,
    PERMISSIONS.VIEW_TEACHERS,
    PERMISSIONS.ASSIGN_SUBJECTS,
    PERMISSIONS.REMOVE_ASSIGNMENTS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
  ],
};

/**
 * Check if user has permission
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.role) return false;
  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission);
};

/**
 * Check if user has any of the permissions
 */
export const hasAnyPermission = (user, permissions) => {
  return permissions.some((permission) => hasPermission(user, permission));
};

/**
 * Check if user has all permissions
 */
export const hasAllPermissions = (user, permissions) => {
  return permissions.every((permission) => hasPermission(user, permission));
};
```

**Permission-Based Component Wrapper:**

```jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission } from '@/utils/permissions';

/**
 * Wrapper component to show/hide based on permissions
 */
const PermissionGuard = ({ permission, children, fallback = null }) => {
  const { user } = useSelector((state) => state.auth);
  
  if (!hasPermission(user, permission)) {
    return fallback;
  }
  
  return <>{children}</>;
};

export default PermissionGuard;
```

**Usage Example:**

```jsx
import PermissionGuard from '@/components/PermissionGuard';
import { PERMISSIONS } from '@/utils/permissions';

<PermissionGuard permission={PERMISSIONS.DELETE_SUBJECTS}>
  <Button color="error" onClick={handleDelete}>
    Delete
  </Button>
</PermissionGuard>
```

---

## Audit Logging System

### 1. Client-Side Audit Logger

**New File:** `src/utils/auditLogger.js`

```javascript
import axios from 'axios';
import { store } from '@/app/store';

/**
 * Audit log categories
 */
export const AUDIT_CATEGORIES = {
  USER_MANAGEMENT: 'user_management',
  SUBJECT_MANAGEMENT: 'subject_management',
  TEACHER_MANAGEMENT: 'teacher_management',
  APPLICATION_REVIEW: 'application_review',
  REPORT_ACCESS: 'report_access',
  SYSTEM_CONFIG: 'system_config',
};

/**
 * Audit log actions
 */
export const AUDIT_ACTIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  REJECT: 'reject',
  VIEW: 'view',
  EXPORT: 'export',
  LOGIN: 'login',
  LOGOUT: 'logout',
};

/**
 * Log audit event
 */
export const logAudit = async ({
  category,
  action,
  resourceType,
  resourceId,
  resourceName,
  details = {},
  severity = 'info', // 'info' | 'warning' | 'critical'
}) => {
  const state = store.getState();
  const { user } = state.auth;
  
  if (!user) return;
  
  const auditEntry = {
    userId: user._id,
    userName: user.name,
    userEmail: user.email,
    userRole: user.role,
    category,
    action,
    resourceType,
    resourceId,
    resourceName,
    details,
    severity,
    timestamp: new Date().toISOString(),
    ipAddress: null, // Backend will capture
    userAgent: navigator.userAgent,
  };
  
  try {
    // Send to backend audit log API
    await axios.post('/api/audit/log', auditEntry, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    
    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('[AUDIT]', auditEntry);
    }
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
};

/**
 * Wrapper for Redux actions with audit logging
 */
export const withAuditLog = (action, auditConfig) => {
  return async (dispatch) => {
    const result = await dispatch(action);
    
    if (result.type.endsWith('/fulfilled')) {
      await logAudit(auditConfig);
    }
    
    return result;
  };
};
```

**Usage in Components:**

```javascript
import { logAudit, AUDIT_CATEGORIES, AUDIT_ACTIONS } from '@/utils/auditLogger';

const handleDelete = (subject) => {
  dispatch(deleteSubject(subject._id))
    .unwrap()
    .then(async () => {
      // Log audit event
      await logAudit({
        category: AUDIT_CATEGORIES.SUBJECT_MANAGEMENT,
        action: AUDIT_ACTIONS.DELETE,
        resourceType: 'Subject',
        resourceId: subject._id,
        resourceName: subject.name,
        details: {
          subjectCode: subject.subjectCode,
          semester: subject.semester,
          department: subject.department,
        },
        severity: 'warning', // Deletions are critical
      });
      
      toast.success('Subject deleted successfully');
    })
    .catch((err) => toast.error(err));
};
```

### 2. Audit Log Viewer Component

**New File:** `src/features/admin/components/audit/AuditLogViewer.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';

const AuditLogViewer = () => {
  const [filters, setFilters] = useState({
    category: '',
    action: '',
    userId: '',
    startDate: null,
    endDate: null,
  });
  
  const columns = [
    {
      field: 'timestamp',
      headerName: 'Time',
      width: 180,
      renderCell: (params) => format(new Date(params.value), 'PPpp'),
    },
    {
      field: 'userName',
      headerName: 'User',
      width: 150,
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} size="small" />
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => {
        const color = {
          create: 'success',
          update: 'info',
          delete: 'error',
          approve: 'success',
          reject: 'warning',
        }[params.value] || 'default';
        
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
    {
      field: 'resourceType',
      headerName: 'Resource',
      width: 120,
    },
    {
      field: 'resourceName',
      headerName: 'Resource Name',
      flex: 1,
    },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 100,
      renderCell: (params) => {
        const color = {
          info: 'info',
          warning: 'warning',
          critical: 'error',
        }[params.value];
        
        return <Chip label={params.value} color={color} size="small" />;
      },
    },
  ];
  
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Audit Logs
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Category"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <MenuItem value="">All Categories</MenuItem>
              <MenuItem value="user_management">User Management</MenuItem>
              <MenuItem value="subject_management">Subject Management</MenuItem>
              {/* More categories */}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Action"
              value={filters.action}
              onChange={(e) => setFilters({ ...filters, action: e.target.value })}
            >
              <MenuItem value="">All Actions</MenuItem>
              <MenuItem value="create">Create</MenuItem>
              <MenuItem value="update">Update</MenuItem>
              <MenuItem value="delete">Delete</MenuItem>
              {/* More actions */}
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => setFilters({ ...filters, startDate: date })}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => setFilters({ ...filters, endDate: date })}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper>
        <DataGrid
          rows={[]} // Fetch from backend
          columns={columns}
          autoHeight
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
        />
      </Paper>
    </Box>
  );
};

export default AuditLogViewer;
```

---

## Input Validation & Sanitization

### 1. React Hook Form + Yup Integration

**Install dependencies:**
```bash
npm install react-hook-form yup @hookform/resolvers
```

**Validation Schema Example:**

```javascript
import * as yup from 'yup';

export const subjectSchema = yup.object({
  name: yup
    .string()
    .required('Subject name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must not exceed 100 characters')
    .matches(/^[a-zA-Z0-9\s-]+$/, 'Name contains invalid characters'),
  
  subjectCode: yup
    .string()
    .required('Subject code is required')
    .matches(/^[A-Z]{2,4}[0-9]{3}$/, 'Invalid subject code format (e.g., CS301)'),
  
  semester: yup
    .number()
    .required('Semester is required')
    .min(1, 'Semester must be between 1 and 8')
    .max(8, 'Semester must be between 1 and 8')
    .integer('Semester must be a whole number'),
  
  department: yup
    .string()
    .required('Department is required')
    .oneOf(
      ['Computer Science', 'Electronics', 'Mechanical', 'Civil'],
      'Invalid department'
    ),
});
```

**Updated Modal with Validation:**

```jsx
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { subjectSchema } from './validationSchemas';

const SubjectModal = ({ open, handleClose, subject }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(subjectSchema),
    defaultValues: {
      name: '',
      subjectCode: '',
      semester: '',
      department: '',
    },
  });
  
  useEffect(() => {
    if (subject) {
      reset(subject); // Pre-fill form
    } else {
      reset({
        name: '',
        subjectCode: '',
        semester: '',
        department: '',
      });
    }
  }, [subject, reset, open]);
  
  const onSubmit = (data) => {
    const action = subject 
      ? updateSubject({ id: subject._id, ...data }) 
      : createSubject(data);
    
    dispatch(action)
      .unwrap()
      .then(() => {
        toast.success(`Subject ${subject ? 'updated' : 'created'} successfully!`);
        handleClose();
      })
      .catch((err) => toast.error(err));
  };
  
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {subject ? 'Edit Subject' : 'Create New Subject'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject Name"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                />
              )}
            />
            
            <Controller
              name="subjectCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Subject Code"
                  error={!!errors.subjectCode}
                  helperText={errors.subjectCode?.message}
                  placeholder="e.g., CS301"
                  fullWidth
                />
              )}
            />
            
            {/* More fields */}
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {subject ? 'Save Changes' : 'Create Subject'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

### 2. XSS Protection with DOMPurify

**Sanitize user input before rendering:**

```jsx
import DOMPurify from 'dompurify';

const sanitizeHTML = (html) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
};

// Usage
<Box dangerouslySetInnerHTML={{ __html: sanitizeHTML(userInput) }} />
```

---

## Session Management

### Features to Implement

1. **Concurrent Session Detection**
   - Detect when user logs in from another device
   - Show warning or force logout

2. **Activity Tracking**
   - Track last active timestamp
   - Show "Last active" in admin UI

3. **Session Persistence**
   - Remember user preference (remember me checkbox)
   - Store refresh token securely

---

## CSRF Protection

### Client-Side CSRF Token Handling

```javascript
// Axios interceptor to include CSRF token
axios.interceptors.request.use(
  (config) => {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## Security Best Practices

### Checklist

- [ ] All sensitive operations require confirmation
- [ ] Audit logs for all CRUD operations
- [ ] Session timeout after 15 minutes of inactivity
- [ ] Token refresh before expiry
- [ ] Input validation with Yup schemas
- [ ] XSS protection with DOMPurify
- [ ] Permission-based UI rendering
- [ ] HTTPS-only in production
- [ ] Secure cookie settings (httpOnly, secure, sameSite)
- [ ] Rate limiting feedback
- [ ] Password strength requirements
- [ ] Two-factor authentication (future)

---

## Implementation Checklist

### Week 1: Critical Security

- [ ] Implement audit logging system
- [ ] Add session timeout warning
- [ ] Replace `window.confirm()` with ConfirmDialog
- [ ] Set up permission system
- [ ] Add token refresh logic

### Week 2: Validation & Hardening

- [ ] Integrate React Hook Form + Yup
- [ ] Update all forms with validation
- [ ] Add XSS protection
- [ ] Build audit log viewer
- [ ] Security testing and audit

---

**Next:** [03-PERFORMANCE-OPTIMIZATION.md](./03-PERFORMANCE-OPTIMIZATION.md)  
**Previous:** [01-UI-UX-ENHANCEMENTS.md](./01-UI-UX-ENHANCEMENTS.md)
