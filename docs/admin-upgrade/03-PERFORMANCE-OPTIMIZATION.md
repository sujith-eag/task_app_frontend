# Performance Optimization - Admin Feature Upgrade

**Phase:** 2  
**Priority:** High  
**Timeline:** 2 weeks  
**Dependencies:** Backend pagination APIs, caching strategy

---

## Table of Contents

1. [Performance Audit](#performance-audit)
2. [Data Fetching Strategy](#data-fetching-strategy)
3. [Client-Side Caching](#client-side-caching)
4. [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
5. [Virtual Scrolling](#virtual-scrolling)
6. [Optimistic Updates](#optimistic-updates)
7. [Bundle Size Optimization](#bundle-size-optimization)
8. [Implementation Checklist](#implementation-checklist)

---

## Performance Audit

### Current Performance Issues

1. **❌ No Pagination**
   - All data fetched at once (100+ records)
   - Large payloads (500KB+ responses)
   - Slow initial load (3-5 seconds)
   - Memory issues with large datasets

2. **❌ No Caching**
   - Data refetched on every component mount
   - Same API called multiple times
   - Unnecessary network requests
   - High server load

3. **❌ Bundle Size**
   - Single large bundle (~800KB)
   - All routes loaded upfront
   - No code splitting
   - Long TTI (Time to Interactive)

4. **❌ Re-renders**
   - Inline object creation in `sx` props
   - Functions recreated on every render
   - No React.memo optimization
   - Unnecessary component updates

### Performance Metrics (Current)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **First Contentful Paint** | 2.1s | < 1.2s | ❌ |
| **Time to Interactive** | 4.5s | < 2.5s | ❌ |
| **Bundle Size** | 850KB | < 500KB | ❌ |
| **API Response Time** | 800ms | < 300ms | ❌ |
| **Re-render Count** | 12+ | < 5 | ❌ |

---

## Data Fetching Strategy

### 1. Server-Side Pagination

**Backend Requirements:**

```javascript
// GET /api/admin/users?page=1&limit=10&role=student&search=john
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1250,
    "totalPages": 125,
    "hasMore": true
  }
}
```

**Frontend Implementation:**

**Updated Service:** `src/features/admin/adminService/userService.js`

```javascript
/**
 * Get users by role with pagination and search
 */
const getUsersByRole = async (role, token, params = {}) => {
  const { page = 1, limit = 10, search = '' } = params;
  
  const config = {
    headers: { Authorization: `Bearer ${token}` },
    params: { role, page, limit, search }
  };
  
  const response = await axios.get(API_URL + 'users', config);
  return response.data; // { data: [...], pagination: {...} }
};
```

**Updated Slice:** `src/features/admin/adminSlice/adminUserSlice.js`

```javascript
const initialState = {
  userList: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasMore: false,
  },
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

export const getUsersByRole = createAsyncThunk(
  'adminUsers/getByRole',
  async ({ role, page = 1, limit = 10, search = '' }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await adminService.getUsersByRole(role, token, { page, limit, search });
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// In extraReducers
.addCase(getUsersByRole.fulfilled, (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;
  state.userList = action.payload.data;
  state.pagination = action.payload.pagination;
})
```

**Component with Pagination:**

```jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { debounce } from 'lodash-es';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { userList, pagination, isLoading } = useSelector((state) => state.adminUsers);
  const [activeTab, setActiveTab] = useState('student');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch data when tab, page, or search changes
  useEffect(() => {
    dispatch(getUsersByRole({
      role: activeTab,
      page: pagination.page,
      limit: pagination.limit,
      search: searchTerm,
    }));
  }, [dispatch, activeTab, pagination.page, pagination.limit, searchTerm]);
  
  // Debounced search
  const handleSearch = debounce((value) => {
    setSearchTerm(value);
  }, 500);
  
  const handlePageChange = (newPage) => {
    dispatch(getUsersByRole({
      role: activeTab,
      page: newPage + 1, // MUI uses 0-based indexing
      limit: pagination.limit,
      search: searchTerm,
    }));
  };
  
  return (
    <Box>
      <TextField
        placeholder="Search users..."
        onChange={(e) => handleSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2, maxWidth: 400 }}
      />
      
      <DataGrid
        rows={userList}
        columns={columns}
        loading={isLoading}
        pagination
        paginationMode="server"
        rowCount={pagination.total}
        page={pagination.page - 1}
        pageSize={pagination.limit}
        onPageChange={handlePageChange}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
};
```

### 2. Debounced Search

**Utility Function:**

```javascript
import { useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for debounced value
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

/**
 * Usage
 */
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    dispatch(fetchData({ search: debouncedSearch }));
  }
}, [debouncedSearch]);
```

---

## Client-Side Caching

### Option 1: React Query (Recommended)

**Install:**
```bash
npm install @tanstack/react-query
```

**Setup:** `src/main.jsx`

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

**Convert to React Query:**

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService from '../adminService';

/**
 * Hook for fetching subjects
 */
export const useSubjects = (params = {}) => {
  const { user } = useSelector((state) => state.auth);
  
  return useQuery({
    queryKey: ['subjects', params],
    queryFn: () => adminService.getSubjects(user.token, params),
    enabled: !!user?.token,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });
};

/**
 * Hook for creating subject
 */
export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);
  
  return useMutation({
    mutationFn: (data) => adminService.createSubject(data, user.token),
    onSuccess: () => {
      // Invalidate and refetch subjects
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
      toast.success('Subject created successfully');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

/**
 * Usage in component
 */
const SubjectManager = () => {
  const { data: subjects, isLoading, error } = useSubjects();
  const createMutation = useCreateSubject();
  
  const handleCreate = (formData) => {
    createMutation.mutate(formData);
  };
  
  if (isLoading) return <Skeleton />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  
  return (
    <Box>
      {subjects.map((subject) => (
        <SubjectCard key={subject._id} subject={subject} />
      ))}
    </Box>
  );
};
```

### Option 2: RTK Query (Alternative)

**Already available in Redux Toolkit**

**Setup:** `src/features/admin/adminApi.js`

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL + '/admin',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Subjects', 'Users', 'Teachers', 'Applications'],
  endpoints: (builder) => ({
    // Subjects
    getSubjects: builder.query({
      query: (params) => ({
        url: '/college/subjects',
        params,
      }),
      providesTags: ['Subjects'],
    }),
    
    createSubject: builder.mutation({
      query: (data) => ({
        url: '/college/subjects',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),
    
    updateSubject: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/college/subjects/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Subjects'],
    }),
    
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/college/subjects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subjects'],
    }),
    
    // Users
    getUsersByRole: builder.query({
      query: ({ role, page = 1, limit = 10, search = '' }) => ({
        url: '/users',
        params: { role, page, limit, search },
      }),
      providesTags: ['Users'],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
  useGetUsersByRoleQuery,
} = adminApi;
```

**Register in Store:**

```javascript
import { adminApi } from '../features/admin/adminApi';

export const store = configureStore({
  reducer: {
    // ... existing reducers
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminApi.middleware),
});
```

**Usage:**

```jsx
import { useGetSubjectsQuery, useDeleteSubjectMutation } from '../../adminApi';

const SubjectList = () => {
  const { data: subjects, isLoading, error } = useGetSubjectsQuery({ semester: 5 });
  const [deleteSubject] = useDeleteSubjectMutation();
  
  const handleDelete = async (id) => {
    try {
      await deleteSubject(id).unwrap();
      toast.success('Subject deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };
  
  if (isLoading) return <Skeleton />;
  
  return <DataGrid rows={subjects} columns={columns} />;
};
```

---

## Code Splitting & Lazy Loading

### 1. Route-Level Code Splitting

**Updated:** `src/App.jsx`

```jsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';

// Eager load critical routes
import LandingPage from './features/landing/pages/LandingPage';
import LoginPage from './features/auth/pages/LoginPage';

// Lazy load admin routes
const AdminDashboardPage = lazy(() => 
  import('./features/admin/pages/AdminDashboardPage')
);
const ReportingPage = lazy(() => 
  import('./features/admin/pages/ReportingPage')
);
const TeacherReportPage = lazy(() => 
  import('./features/admin/pages/TeacherReportPage')
);
const StudentReportPage = lazy(() => 
  import('./features/admin/pages/StudentReportPage')
);

// Loading fallback
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Admin routes with lazy loading */}
      <Route element={<PrivateRoute roles={['admin', 'hod']} />}>
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboardPage />
            </Suspense>
          }
        />
        <Route
          path="/admin/reporting"
          element={
            <Suspense fallback={<PageLoader />}>
              <ReportingPage />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
```

### 2. Component-Level Code Splitting

**Lazy load heavy components:**

```jsx
const ChartComponent = lazy(() => import('./ChartComponent'));

<Suspense fallback={<ChartSkeleton />}>
  <ChartComponent data={data} />
</Suspense>
```

### 3. Dynamic Imports

```javascript
// Load chart library only when needed
const handleExportChart = async () => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  // Export logic
};
```

---

## Virtual Scrolling

For large lists (1000+ items), implement virtual scrolling:

**Install:**
```bash
npm install @tanstack/react-virtual
```

**Implementation:**

```jsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualizedList = ({ items }) => {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Row height
    overscan: 5, // Render 5 extra items above/below
  });
  
  return (
    <Box
      ref={parentRef}
      sx={{
        height: '600px',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <Box
            key={virtualItem.key}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ListItem data={items[virtualItem.index]} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
```

---

## Optimistic Updates

### Implementation Pattern

**With Redux:**

```javascript
export const deleteSubject = createAsyncThunk(
  'adminSubjects/delete',
  async (subjectId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      
      // Optimistically remove from state
      thunkAPI.dispatch(adminSubjectSlice.actions.optimisticDelete(subjectId));
      
      await adminService.deleteSubject(subjectId, token);
      
      return subjectId;
    } catch (error) {
      // Rollback on error
      thunkAPI.dispatch(adminSubjectSlice.actions.rollbackDelete(subjectId));
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// In slice
reducers: {
  optimisticDelete: (state, action) => {
    const id = action.payload;
    state.deletedSubject = state.subjects.find(s => s._id === id);
    state.subjects = state.subjects.filter(s => s._id !== id);
  },
  rollbackDelete: (state, action) => {
    if (state.deletedSubject) {
      state.subjects.push(state.deletedSubject);
      state.deletedSubject = null;
    }
  },
}
```

**With React Query:**

```javascript
const deleteMutation = useMutation({
  mutationFn: deleteSubject,
  onMutate: async (subjectId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['subjects'] });
    
    // Snapshot previous value
    const previousSubjects = queryClient.getQueryData(['subjects']);
    
    // Optimistically update
    queryClient.setQueryData(['subjects'], (old) =>
      old.filter((s) => s._id !== subjectId)
    );
    
    // Return rollback function
    return { previousSubjects };
  },
  onError: (err, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(['subjects'], context.previousSubjects);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
  },
});
```

---

## Bundle Size Optimization

### 1. Analyze Bundle

```bash
npm run build
npx vite-bundle-visualizer
```

### 2. Tree Shaking

**Use named imports:**

```javascript
// ❌ Bad: Imports entire library
import _ from 'lodash';

// ✅ Good: Only imports what you need
import { debounce, throttle } from 'lodash-es';

// ✅ Even better: Individual imports
import debounce from 'lodash-es/debounce';
```

### 3. Remove Unused Dependencies

```bash
npx depcheck
```

### 4. Optimize Material-UI Imports

**Use auto-import plugin:**

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-core': ['@mui/material', '@mui/icons-material'],
          'mui-data': ['@mui/x-data-grid'],
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
  },
});
```

---

## Performance Best Practices

### React Optimization

**1. Memo Expensive Components:**

```jsx
import React, { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Heavy rendering logic
  return <div>{/* ... */}</div>;
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.data.id === nextProps.data.id;
});
```

**2. Use useCallback for Functions:**

```jsx
const handleDelete = useCallback((id) => {
  dispatch(deleteSubject(id));
}, [dispatch]);
```

**3. Use useMemo for Computed Values:**

```jsx
const filteredSubjects = useMemo(() => {
  return subjects.filter(s => s.semester === selectedSemester);
}, [subjects, selectedSemester]);
```

**4. Avoid Inline Object/Array Creation:**

```jsx
// ❌ Bad: Creates new object on every render
<Box sx={{ p: 2, bgcolor: 'background.paper' }}>

// ✅ Good: Define outside component or use useMemo
const boxStyles = { p: 2, bgcolor: 'background.paper' };
<Box sx={boxStyles}>
```

---

## Implementation Checklist

### Week 1: Data Fetching & Caching

- [ ] Implement backend pagination for all endpoints
- [ ] Add React Query or RTK Query
- [ ] Convert all data fetching to use caching
- [ ] Implement debounced search
- [ ] Add loading skeletons

### Week 2: Code Splitting & Optimization

- [ ] Lazy load admin routes
- [ ] Lazy load heavy components
- [ ] Optimize bundle size (< 500KB)
- [ ] Implement virtual scrolling for large lists
- [ ] Add optimistic updates
- [ ] Performance testing with Lighthouse

---

## Performance Targets

| Metric | Current | Week 1 | Week 2 | Target |
|--------|---------|--------|--------|--------|
| FCP | 2.1s | 1.5s | 1.1s | < 1.2s |
| TTI | 4.5s | 3.2s | 2.3s | < 2.5s |
| Bundle Size | 850KB | 650KB | 480KB | < 500KB |
| API Calls | 15+ | 8 | 3 | < 5 |
| Memory Usage | 180MB | 120MB | 90MB | < 100MB |

---

**Next:** [04-FEATURES-EXPANSION.md](./04-FEATURES-EXPANSION.md)  
**Previous:** [02-SECURITY-HARDENING.md](./02-SECURITY-HARDENING.md)
