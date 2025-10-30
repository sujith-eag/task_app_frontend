# Admin Feature Upgrade - Developer Experience

**Document:** 05 of 07  
**Focus:** Tooling, testing, documentation, debugging  
**Timeline:** 1.5 weeks (Week 10 of implementation)  
**Priority:** Medium  
**Impact:** Long-term maintainability and productivity

---

## Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Development Tools](#development-tools)
4. [Code Quality & Standards](#code-quality--standards)
5. [Documentation](#documentation)
6. [Debugging Tools](#debugging-tools)
7. [CI/CD Integration](#cicd-integration)
8. [Performance Monitoring](#performance-monitoring)

---

## Overview

Strong developer experience (DX) accelerates development, reduces bugs, and makes the codebase maintainable. This document focuses on tools and practices that improve the admin feature development workflow.

### Success Metrics

- ✅ Test coverage > 80%
- ✅ Build time < 30 seconds
- ✅ Hot reload < 1 second
- ✅ Zero ESLint errors
- ✅ TypeScript errors caught at compile time (if migrating)
- ✅ Documentation coverage for all components

---

## Testing Strategy

### 1. Testing Pyramid

```
           /\
          /E2E\        End-to-End Tests (10%)
         /------\      - Critical user flows
        /Integration\ Integration Tests (30%)
       /------------\ - Component + Redux + API
      /   Unit Tests \ Unit Tests (60%)
     /----------------\ - Pure functions, utilities
```

### 2. Unit Tests with Vitest

**Setup:** `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.spec.jsx',
        '**/*.test.jsx',
      ],
    },
  },
});
```

**Test Setup:** `src/test/setup.js`

```javascript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
```

**Example Unit Test:** `src/utils/exportHelpers.test.js`

```javascript
import { describe, it, expect, vi } from 'vitest';
import { exportToCSV } from './exportHelpers';
import { saveAs } from 'file-saver';

// Mock file-saver
vi.mock('file-saver');

describe('exportHelpers', () => {
  describe('exportToCSV', () => {
    it('should export data to CSV format', () => {
      const data = [
        { name: 'John', age: 30, city: 'NYC' },
        { name: 'Jane', age: 25, city: 'LA' },
      ];

      exportToCSV(data, 'test');

      expect(saveAs).toHaveBeenCalled();
      const blob = saveAs.mock.calls[0][0];
      expect(blob.type).toBe('text/csv;charset=utf-8;');
    });

    it('should handle special characters', () => {
      const data = [
        { name: 'John, Jr.', comment: 'Test "quoted" value' },
      ];

      exportToCSV(data, 'test');
      
      // Verify special characters are escaped
      expect(saveAs).toHaveBeenCalled();
    });

    it('should throw error for empty data', () => {
      expect(() => exportToCSV([], 'test')).toThrow('No data to export');
    });
  });
});
```

### 3. Component Tests with React Testing Library

**Example:** `src/components/ConfirmationDialog.test.jsx`

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ConfirmationDialog from './ConfirmationDialog';

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ConfirmationDialog', () => {
  it('should render when open', () => {
    renderWithTheme(
      <ConfirmationDialog
        open={true}
        title="Confirm Action"
        message="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button clicked', async () => {
    const onConfirm = vi.fn();
    
    renderWithTheme(
      <ConfirmationDialog
        open={true}
        title="Delete"
        message="Delete this item?"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('should show loading state', () => {
    renderWithTheme(
      <ConfirmationDialog
        open={true}
        title="Delete"
        message="Deleting..."
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        loading={true}
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display danger variant styling', () => {
    const { container } = renderWithTheme(
      <ConfirmationDialog
        open={true}
        title="Delete"
        message="This action is irreversible"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        variant="danger"
      />
    );

    // Check for error color styling
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    expect(confirmButton).toHaveClass('MuiButton-colorError');
  });
});
```

### 4. Integration Tests with Redux

**Test Helper:** `src/test/testUtils.jsx`

```jsx
import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

// Import your reducers
import authReducer from '@/features/auth/authSlice';
import adminUserReducer from '@/features/admin/adminSlice/adminUserSlice';

const theme = createTheme();

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        adminUsers: adminUserReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            {children}
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
```

**Integration Test Example:** `src/features/admin/components/users/UserList.test.jsx`

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '@/test/testUtils';
import UserList from './UserList';
import * as userService from '@/features/admin/adminService/userService';

// Mock the service
vi.mock('@/features/admin/adminService/userService');

describe('UserList Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and display users on mount', async () => {
    const mockUsers = [
      { _id: '1', name: 'John Doe', email: 'john@example.com', role: 'student' },
      { _id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'teacher' },
    ];

    userService.getAllUsers.mockResolvedValue(mockUsers);

    render(<UserList />, {
      preloadedState: {
        auth: { user: { role: 'admin' }, token: 'test-token' },
        adminUsers: { userList: [], loading: false },
      },
    });

    // Should show loading initially
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    expect(userService.getAllUsers).toHaveBeenCalledWith('test-token');
  });

  it('should handle delete user action', async () => {
    userService.deleteUser.mockResolvedValue({ success: true });

    render(<UserList />, {
      preloadedState: {
        auth: { user: { role: 'admin' }, token: 'test-token' },
        adminUsers: {
          userList: [
            { _id: '1', name: 'John Doe', email: 'john@example.com' },
          ],
          loading: false,
        },
      },
    });

    // Find and click delete button
    const deleteButton = screen.getByLabelText('Delete John Doe');
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(userService.deleteUser).toHaveBeenCalledWith('test-token', '1');
    });
  });
});
```

### 5. E2E Tests with Playwright

**Install:**

```bash
npm install -D @playwright/test
npx playwright install
```

**Playwright Config:** `playwright.config.js`

```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**E2E Test Example:** `e2e/admin-workflow.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/admin/dashboard');
  });

  test('should create a new user', async ({ page }) => {
    // Navigate to users page
    await page.click('text=Users');
    await page.waitForURL('/admin/users');

    // Click add user button
    await page.click('button:has-text("Add User")');

    // Fill form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.selectOption('select[name="role"]', 'student');

    // Submit
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator('text=User created successfully')).toBeVisible();
    await expect(page.locator('text=Test User')).toBeVisible();
  });

  test('should delete a user with confirmation', async ({ page }) => {
    await page.goto('/admin/users');

    // Find user row and click delete
    const userRow = page.locator('tr:has-text("John Doe")');
    await userRow.locator('button[aria-label*="Delete"]').click();

    // Confirm deletion
    await page.click('button:has-text("Confirm")');

    // Verify deletion
    await expect(page.locator('text=User deleted successfully')).toBeVisible();
    await expect(page.locator('text=John Doe')).not.toBeVisible();
  });

  test('should handle bulk operations', async ({ page }) => {
    await page.goto('/admin/users');

    // Select multiple users
    await page.check('input[type="checkbox"][data-id="1"]');
    await page.check('input[type="checkbox"][data-id="2"]');

    // Perform bulk action
    await page.click('button:has-text("Bulk Actions")');
    await page.click('text=Delete Selected');

    // Confirm
    await page.click('button:has-text("Confirm")');

    // Verify
    await expect(page.locator('text=2 users deleted')).toBeVisible();
  });
});
```

### Testing Checklist

- [ ] Unit tests for all utilities and helpers (> 90% coverage)
- [ ] Component tests for reusable components (> 80% coverage)
- [ ] Integration tests for Redux slices and async thunks
- [ ] E2E tests for critical admin workflows
- [ ] Visual regression tests (optional, with Percy/Chromatic)
- [ ] Accessibility tests (with @axe-core/react)

---

## Development Tools

### 1. Redux DevTools Integration

**Enhanced Store Configuration:** `src/app/store.js`

```javascript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    // ... your reducers
  },
  devTools: {
    name: 'Admin Dashboard',
    trace: true, // Enable action tracing
    traceLimit: 25,
    features: {
      pause: true, // Pause recording
      lock: true, // Lock/unlock dispatching
      persist: true, // Persist state
      export: true, // Export state as JSON
      import: 'custom', // Import state
      jump: true, // Jump to state
      skip: true, // Skip actions
      reorder: true, // Reorder actions
      dispatch: true, // Dispatch custom actions
      test: true, // Generate tests
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore socket instances
        ignoredActions: ['socket/connect'],
        ignoredPaths: ['socket.instance'],
      },
    }),
});

export default store;
```

### 2. React DevTools Profiler

**Wrap performance-critical components:**

```jsx
import { Profiler } from 'react';

function onRenderCallback(
  id, // component name
  phase, // "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time without memoization
  startTime,
  commitTime,
  interactions // interactions that caused this render
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="AdminDashboard" onRender={onRenderCallback}>
  <AdminDashboard />
</Profiler>
```

### 3. Custom DevTools Panel (Optional)

**File:** `src/dev/AdminDevTools.jsx`

```jsx
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';

/**
 * Custom dev tools for debugging admin features
 * Only available in development mode
 */
const AdminDevTools = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const state = useSelector(state => state);
  const dispatch = useDispatch();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 9999,
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpen(!open)}
        >
          🛠️ Dev Tools
        </Button>
      </Box>

      {/* Dev panel */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: 400 } }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Admin Dev Tools
          </Typography>

          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="State" />
            <Tab label="Actions" />
            <Tab label="Performance" />
          </Tabs>

          {tab === 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Redux State</Typography>
              <pre style={{ fontSize: 10, overflow: 'auto' }}>
                {JSON.stringify(state, null, 2)}
              </pre>
            </Box>
          )}

          {tab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Quick Actions</Typography>
              <List>
                <ListItem>
                  <Button
                    fullWidth
                    onClick={() => {
                      // Dispatch test action
                      console.log('Test action dispatched');
                    }}
                  >
                    Clear Cache
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Clear Storage & Reload
                  </Button>
                </ListItem>
              </List>
            </Box>
          )}

          {tab === 2 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Performance</Typography>
              <ListItemText
                primary="Bundle Size"
                secondary="Check browser network tab"
              />
              <ListItemText
                primary="Render Count"
                secondary="Use React DevTools Profiler"
              />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default AdminDevTools;
```

---

## Code Quality & Standards

### 1. ESLint Configuration

**Update:** `.eslintrc.cjs`

```javascript
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};
```

### 2. Prettier Configuration

**File:** `.prettierrc.json`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

### 3. Pre-commit Hooks with Husky

```bash
npm install -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

**File:** `.lintstagedrc.json`

```json
{
  "*.{js,jsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{json,md,css}": [
    "prettier --write"
  ]
}
```

### 4. Code Review Checklist

**Create:** `.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Description
<!-- Describe your changes -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Code Quality
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] No console.log statements
- [ ] PropTypes defined (or TypeScript types)
- [ ] Accessibility considerations addressed

## Performance
- [ ] Large lists use virtualization
- [ ] Images optimized and lazy loaded
- [ ] Expensive calculations memoized
- [ ] Bundle size impact checked

## Security
- [ ] User input sanitized
- [ ] Sensitive data not logged
- [ ] Audit logs added for sensitive operations
- [ ] Permission checks implemented

## Documentation
- [ ] Code comments added where necessary
- [ ] README updated (if applicable)
- [ ] API documentation updated (if applicable)

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->
```

---

## Documentation

### 1. Component Documentation Template

**Example:** Component file header

```jsx
/**
 * ConfirmationDialog Component
 * 
 * A reusable confirmation dialog for destructive actions.
 * Replaces window.confirm() with better UX.
 * 
 * @component
 * @example
 * ```jsx
 * <ConfirmationDialog
 *   open={true}
 *   title="Delete User"
 *   message="Are you sure you want to delete this user?"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 *   variant="danger"
 * />
 * ```
 * 
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility
 * @param {string} props.title - Dialog title
 * @param {string} props.message - Confirmation message
 * @param {Function} props.onConfirm - Called when user confirms
 * @param {Function} props.onCancel - Called when user cancels
 * @param {string} [props.variant='primary'] - 'primary' | 'danger'
 * @param {boolean} [props.loading=false] - Shows loading state
 * 
 * @see {@link https://mui.com/material-ui/react-dialog/}
 */
```

### 2. Storybook (Optional)

**Install:**

```bash
npx storybook@latest init
```

**Story Example:** `src/components/ConfirmationDialog.stories.jsx`

```jsx
import ConfirmationDialog from './ConfirmationDialog';

export default {
  title: 'Components/ConfirmationDialog',
  component: ConfirmationDialog,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'danger'],
    },
  },
};

export const Primary = {
  args: {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed?',
    variant: 'primary',
  },
};

export const Danger = {
  args: {
    open: true,
    title: 'Delete Item',
    message: 'This action cannot be undone.',
    variant: 'danger',
  },
};

export const WithLoading = {
  args: {
    open: true,
    title: 'Processing',
    message: 'Please wait...',
    loading: true,
  },
};
```

### 3. API Documentation

**File:** `docs/admin-upgrade/API.md`

```markdown
# Admin API Documentation

## User Management

### Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer <token>
Response: { users: User[] }
```

### Create User
```
POST /api/admin/users
Headers: Authorization: Bearer <token>
Body: { name, email, role, password }
Response: { user: User, message: string }
```

<!-- Document all endpoints -->
```

---

## Debugging Tools

### 1. Redux Logger (Development Only)

```bash
npm install redux-logger
```

**Update store:**

```javascript
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

const store = configureStore({
  reducer: {
    // ... reducers
  },
  middleware: (getDefaultMiddleware) =>
    process.env.NODE_ENV === 'development'
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware(),
});
```

### 2. React Query Devtools

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      <YourApp />
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  );
}
```

### 3. Why Did You Render

```bash
npm install -D @welldone-software/why-did-you-render
```

**File:** `src/wdyr.js`

```javascript
import React from 'react';

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: false,
    trackHooks: true,
    logOwnerReasons: true,
    collapseGroups: true,
  });
}
```

**Import in main.jsx:**

```javascript
import './wdyr'; // Must be first import
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
```

---

## CI/CD Integration

### 1. GitHub Actions Workflow

**File:** `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
      
      - name: Build
        run: npm run build
      
      - name: Run E2E tests
        run: npx playwright test
      
      - name: Upload E2E test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

### 2. Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:ci": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
  }
}
```

---

## Performance Monitoring

### 1. Web Vitals Tracking

```bash
npm install web-vitals
```

**File:** `src/utils/reportWebVitals.js`

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  console.log(metric);
  
  // Example: Send to Google Analytics
  // gtag('event', metric.name, {
  //   value: Math.round(metric.value),
  //   metric_id: metric.id,
  //   metric_value: metric.value,
  //   metric_delta: metric.delta,
  // });
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

**Use in main.jsx:**

```javascript
import { reportWebVitals } from './utils/reportWebVitals';

// ... your app setup

reportWebVitals();
```

### 2. Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer
```

**Update vite.config.js:**

```javascript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
```

---

## Implementation Timeline

### Week 10: Developer Experience Setup

**Day 1: Testing Infrastructure**
- [ ] Set up Vitest and React Testing Library
- [ ] Create test utilities and helpers
- [ ] Write first batch of unit tests
- [ ] Configure coverage reporting

**Day 2: Component & Integration Tests**
- [ ] Write component tests for reusable components
- [ ] Write integration tests for Redux slices
- [ ] Set up test data factories
- [ ] Document testing patterns

**Day 3: E2E Tests & CI/CD**
- [ ] Set up Playwright
- [ ] Write E2E tests for critical workflows
- [ ] Configure GitHub Actions CI
- [ ] Set up automated test runs

**Day 4: Code Quality Tools**
- [ ] Configure ESLint and Prettier
- [ ] Set up Husky pre-commit hooks
- [ ] Add lint-staged
- [ ] Create PR template

**Day 5: Documentation & Monitoring**
- [ ] Add JSDoc comments to components
- [ ] Create API documentation
- [ ] Set up web vitals tracking
- [ ] Configure bundle analyzer
- [ ] (Optional) Set up Storybook

---

## Success Criteria

- ✅ All new code has > 80% test coverage
- ✅ CI pipeline passes on all PRs
- ✅ ESLint shows 0 errors
- ✅ Bundle size tracked and optimized
- ✅ Core Web Vitals meet thresholds
- ✅ All components have JSDoc documentation
- ✅ PR template used consistently

---

## Next Steps

1. Install testing dependencies
2. Set up CI/CD pipeline
3. Write tests for critical features
4. Document code and APIs
5. Monitor performance metrics

---

**Document Navigation:**

📄 [← Previous: 04-FEATURES-EXPANSION.md](./04-FEATURES-EXPANSION.md)  
📄 **Current:** 05-DEVELOPER-EXPERIENCE.md  
📄 [Next: 06-IMPLEMENTATION-PLAN.md →](./06-IMPLEMENTATION-PLAN.md)

---

**Last Updated:** October 30, 2025  
**Version:** 1.0  
**Status:** Ready for Implementation
