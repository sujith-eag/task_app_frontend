# AI Coding Agent Instructions - Task Management App

## Project Architecture

**Tech Stack:** React 19.1 + Vite + Material-UI v7 + Redux Toolkit + Socket.IO  
**Structure:** Feature-based organization (`/features/{feature}/`) with Redux slices, services, and components  
**Backend:** Express API at `localhost:8000` (proxied through Vite)

### Core Patterns

**Feature Structure:**
```
features/{feature}/
├── {feature}Service.js    # Axios API calls
├── {feature}Slice.js      # Redux state + async thunks
├── components/            # Feature-specific components
├── pages/                 # Route-level pages
└── utils/                 # Feature utilities
```

**Example:** Chat feature follows this pattern with organized subfolders (`conversation/`, `message/`, `shared/`) for better separation of concerns.

## Critical Developer Workflows

### Development Commands
```bash
npm run dev          # Start Vite dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint check
```

### Proxy Configuration
- API calls to `/api/*` proxy to `http://localhost:8000`
- Socket.IO connections to `/socket.io` use WebSocket proxy
- Environment variables: `.env.development` and `.env.production`

### State Management Rules
1. **Always** use Redux Toolkit with `createSlice` and `createAsyncThunk`
2. **Never** store socket instance in Redux (use SocketContext instead)
3. **Always** use `createSelector` for derived state (avoid inline selectors in components)
4. Register all slices in `src/app/store.js`

Example pattern:
```javascript
// {feature}Slice.js
export const fetchData = createAsyncThunk(
  'feature/fetchData',
  async (params, { rejectWithValue }) => {
    try {
      return await featureService.getData(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error message');
    }
  }
);

// Use selectors for derived state
export const selectFilteredData = createSelector(
  [(state) => state.feature.items, (state) => state.feature.filter],
  (items, filter) => items.filter(item => /* filtering logic */)
);
```

## Project-Specific Conventions

### Component Patterns

**Material-UI Styling:**
- **ALWAYS** use `sx` prop (never `styled-components` or `makeStyles`)
- Use theme-aware values: `(theme) => theme.palette.mode === 'dark' ? ... : ...`
- Access theme in `sx`: `bgcolor: 'primary.main'`, `color: 'text.secondary'`

**Theme System:**
- Theme defined in `src/theme.js` with `getDesignTokens(mode)`
- Dark/light mode managed by `ColorModeContext` (persists to localStorage)
- Use `useContext(ColorModeContext)` for theme toggle

**Framer Motion Animations:**
- Use pre-defined animation variants from `src/utils/animations.js`
- Pattern: `containerVariants` + `itemVariants` for stagger animations
- Feature-specific animations in feature's utils (e.g., `chat/utils/chatAnimations.js`)

Example:
```jsx
<Box
  component={motion.div}
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map(item => (
    <Box component={motion.div} variants={itemVariants} key={item.id}>
      {/* content */}
    </Box>
  ))}
</Box>
```

### Real-time Communication (Socket.IO)

**Context Pattern:**
- Socket instance from `SocketContext` (never create socket in components)
- Connection status: `isConnected`, `isReconnecting` from context
- Automatic reconnection with toast notifications

**Usage:**
```javascript
const { socket, isConnected } = useSocket();

useEffect(() => {
  if (!socket) return;
  
  socket.on('eventName', handleEvent);
  
  return () => {
    socket.off('eventName', handleEvent);
  };
}, [socket]);

// Emit with acknowledgment
socket.emit('sendMessage', data, (ack) => {
  if (ack.success) {
    // Handle success
  }
});
```

### Routing & Protected Routes

**PrivateRoute Pattern:**
- Wraps protected routes in `<PrivateRoute roles={['admin', 'teacher']} />`
- Role-based access control with automatic redirect
- Loading skeleton during auth check (prevents flash)
- Preserves return URL for post-login redirect

**Route Structure:**
```jsx
<Route element={<PrivateRoute roles={['admin', 'hod']} />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />
</Route>
```

### Error Handling

**Toast Notifications:**
- Use `react-toastify` for all user feedback
- Position: `bottom-center`, autoClose: `2500ms`
- Use `toastId` to prevent duplicate toasts
- Pattern: `toast.error(error.message, { toastId: 'unique-id' })`

**API Error Handling:**
- All services catch errors and return structured error objects
- AsyncThunks use `rejectWithValue` for consistent error state
- Display errors via toast, never alert()

### Responsive Design

**Breakpoints:**
- `xs` (0px), `sm` (600px), `md` (900px), `lg` (1200px), `xl` (1536px)
- Always provide responsive values: `{ xs: value1, sm: value2, md: value3 }`
- Mobile-first approach (design for `xs` first, then scale up)

**Common Pattern:**
```jsx
sx={{
  fontSize: { xs: '0.875rem', sm: '0.95rem', md: '1rem' },
  p: { xs: 1.5, sm: 2, md: 3 },
  width: { xs: '100%', md: '50%' },
}}
```

## Integration Points

### Backend Communication

**API Service Pattern:**
```javascript
// {feature}Service.js
import axios from 'axios';

const API_URL = '/api/feature';

// Prefer a central apiClient that sends cookies automatically.
// Example: const apiClient = axios.create({ baseURL: '/api', withCredentials: true });
const getData = async () => {
  const response = await apiClient.get(API_URL);
  return response.data;
};

export default { getData };
```

**Authentication (cookie-first):**
- Browser sessions use an httpOnly cookie named `jwt` set by the server. Do NOT read or forward the cookie value from client-side JS.
- Use a central `apiClient` configured with `withCredentials: true` so the browser sends the cookie automatically.
- For non-browser clients (scripts, curl), send the cookie header: `Cookie: jwt=YOUR_TOKEN` or use an Authorization header as a fallback for API clients.

### Cross-Component Communication

**Context Usage:**
- `SocketContext`: Socket.IO instance and connection status
- `ColorModeContext`: Theme mode and toggle function
- `ThemeProvider`: Material-UI theme access

**Redux Selectors:**
- Export selectors from slices for reuse
- Use `createSelector` for memoized derived state
- Access in components: `useSelector(selectFilteredData)`

### File Organization Rules

**Utilities:**
- Generic utilities in `src/utils/` (e.g., `animations.js`)
- Feature-specific utilities in `features/{feature}/utils/`
- Export utilities from `index.js` barrel files

**Component Exports:**
- Public API via `index.js` in each feature
- Example: `features/timetable/index.js` exports `{ TimetablePage, Timetable }`
- Import: `import { TimetablePage } from '@/features/timetable'`

**Naming Conventions:**
- Components: PascalCase (`UserProfile.jsx`)
- Services: camelCase with suffix (`userService.js`)
- Slices: camelCase with suffix (`userSlice.js`)
- Utils: camelCase (`dateHelpers.js`)

## Feature-Specific Knowledge

### Chat Feature (Recently Completed)
- **Architecture:** 9 components in organized folders (conversation/, message/, shared/)
- **Optimistic UI:** Temporary UUIDs for instant feedback, reconciled on server response
- **Message Grouping:** 5-minute window with smart avatar/timestamp display
- **Socket Events:** `sendMessage`, `startTyping`, `stopTyping`, `messagesRead`, `receiveMessage`
- **Status Tracking:** 4 states (Sending → Sent → Delivered → Read) with visual indicators

### Timetable Feature
- **View Modes:** ALL, SEMESTER_SECTION, FACULTY
- **Grid Calculation:** Custom hook `useSessionGrid` with colSpan support for 2-hour sessions
- **Two-pass Algorithm:** Build grid first, then mark occupied slots
- **React Hooks Compliance:** Pre-compute grids with useMemo (never call hooks in loops)
- **Responsive:** Separate row per semester in View All mode for cleaner rendering
- See `features/timetable/README.md` for comprehensive docs

### Admin Features
- Multiple slices: `adminSubjectSlice`, `adminUserSlice`, `adminTeacherSlice`, `adminReportingSlice`
- Role-based access: `['admin', 'hod']`
- Data grid patterns with MUI DataGrid component

## Critical "Don'ts"

1. **Don't** create socket instances in components (use SocketContext)
2. **Don't** use `makeStyles` or `styled-components` (use `sx` prop)
3. **Don't** call hooks inside loops or conditions (pre-compute with useMemo)
4. **Don't** store derived state in Redux (use selectors with createSelector)
5. **Don't** use `alert()` for notifications (use react-toastify)
6. **Don't** hardcode API URLs (use `/api/` prefix for proxy)
7. **Don't** create inline objects in `sx` props (causes re-renders)
8. **Don't** forget responsive values for sizing/spacing
9. **Don't** access `theme` outside `sx` prop or `useTheme` hook
10. **Don't** emit socket events without checking `socket` exists first

## Performance Best Practices

**Memoization:**
```javascript
// Memoize expensive calculations
const processedData = useMemo(() => {
  return data.map(/* transformation */);
}, [data]);

// Memoize callbacks passed to children
const handleClick = useCallback((id) => {
  // handler logic
}, [dependency]);
```

**Component Optimization:**
- Use `React.memo` for list items and frequently re-rendered components
- Keep dependency arrays minimal and accurate
- Extract static data outside components
- Use `key` prop correctly (stable IDs, not index)

**Redux Patterns:**
- Normalize state shape (avoid nested data)
- Use `createEntityAdapter` for collections
- Keep selectors simple or memoized with `createSelector`

## Documentation Standards

- Feature documentation in feature's `README.md` or `{feature}.md`
- Architecture decisions documented inline for complex logic
- PropTypes or TypeScript for component APIs (PropTypes currently used)
- JSDoc comments for utility functions

## Common Pitfalls

**Material-UI v7 Updates:**
- Use `slotProps` instead of deprecated `TransitionProps`/`PaperProps`
- Dialog with `keepMounted` for performance (faster re-open)
- Use theme breakpoints in `sx`, not `useMediaQuery` in render

**React 19 Specific:**
- Automatic batching (no need for `unstable_batchedUpdates`)
- Strict mode double-mounting in dev (handle cleanup properly)

**Socket.IO:**
- Always clean up listeners in useEffect return
- Use acknowledgment callbacks for critical events
- Handle reconnection gracefully (context provides status)

---

**Last Updated:** October 30, 2025  
**Reference:** See `features/timetable/README.md` and `features/chat/chat.md` for detailed feature docs
