# Tasks Feature — Frontend

This README documents the frontend Tasks feature including components, state management, and API integration.

## Directory Structure

```
tasks/
├── components/
│   ├── TaskList.jsx       # Main task list with filtering
│   ├── TaskItem.jsx       # Individual task card
│   ├── TaskActions.jsx    # Edit/delete action buttons
│   └── ...
├── services/
│   └── taskService.js     # API client for task endpoints
├── slices/
│   └── taskSlice.js       # Redux slice for task state
└── README.md
```

## Features

- **Task CRUD**: Create, read, update, delete tasks
- **Filtering**: Filter by status (pending, completed, all)
- **Sorting**: Sort by due date, priority, creation date
- **Status Updates**: Quick status toggle with loading feedback
- **Bulk Creation**: AI-generated task import support
- **Subtasks**: Nested subtask management with progress tracking
- **Logging**: Structured development logging for debugging

## API Service

Base URL: `import.meta.env.VITE_API_BASE_URL` (includes `/api` when running locally)
Tasks API root: `${VITE_API_BASE_URL}/tasks/`

### Exported Functions

- createTask(taskData, token)
  - POST /api/tasks
  - Creates a single task. Body: task fields (title, description, dueDate, priority, etc.)

- createBulkTasks(tasksData, token)
  - POST /api/tasks/bulk
  - Creates multiple tasks at once, used by AI-generated task imports. Body: { tasks: [...] }

- getTasks(filterData = {}, token)
  - GET /api/tasks?status=...&priority=...&sortBy=...
  - Returns a list of tasks for the authenticated user. `filterData` is passed as query params.

- getTask(taskId, token)
  - GET /api/tasks/:id
  - Fetches a specific task by ID.

- updateTask(taskId, taskData, token)
  - PUT /api/tasks/:id
  - Updates a task with the provided fields.

- deleteTask(taskId, token)
  - DELETE /api/tasks/:id
  - Removes a task.

- getTaskStats(token)
  - GET /api/tasks/stats
  - Returns aggregated task statistics for the authenticated user.

### Subtasks

- `addSubTask(taskId, subTaskData, token)` → POST /api/tasks/:id/subtasks
- `updateSubTask(taskId, subTaskId, subTaskData, token)` → PUT /api/tasks/:id/subtasks/:subTaskId
- `deleteSubTask(taskId, subTaskId, token)` → DELETE /api/tasks/:id/subtasks/:subTaskId
- `getSubTaskStats(taskId, token)` → GET /api/tasks/:id/subtasks/stats

## Components

### TaskList.jsx

Main container component for displaying and filtering tasks.

**Features:**
- Fetches tasks on mount with logging
- Filter controls for status/priority
- Error handling with user-friendly alerts
- Loading state management

**Logging:**
```javascript
import { createLogger } from '@/utils/logger';
const logger = createLogger('TaskList');

// Logs: mount/unmount, fetch operations, filter changes, errors
```

### TaskItem.jsx

Individual task card with status management.

**Features:**
- Quick status toggle (pending ↔ completed)
- Loading indicator during status updates
- Priority badge display
- Due date formatting

**Logging:**
```javascript
const logger = createLogger('TaskItem');
// Logs: status changes, update success/failure
```

### TaskActions.jsx

Edit and delete action buttons.

**Features:**
- Edit navigation
- Delete confirmation dialog
- Undo support for deletes

**Logging:**
```javascript
const logger = createLogger('TaskActions');
// Logs: edit clicks, delete actions, undo operations
```

## State Management (Redux)

### taskSlice.js

Redux Toolkit slice managing task state.

**State Shape:**
```javascript
{
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  stats: null
}
```

**Actions:**
- `fetchTasks` - Load tasks with filters
- `fetchTask` - Load single task
- `addTask` - Create new task
- `modifyTask` - Update existing task
- `removeTask` - Delete task
- `fetchTaskStats` - Load statistics

## Logging Pattern

Components use the shared `createLogger` utility for structured development logging:

```javascript
import { createLogger } from '@/utils/logger';

const logger = createLogger('ComponentName');

// Available methods:
logger.debug('detailed info', data);
logger.info('general info');
logger.warn('warning message');
logger.error('error occurred', error);
logger.success('operation completed');
logger.action('user action');
logger.api('API call', { method, url });
logger.render('component rendered');
```

Logs are only active in development mode (`import.meta.env.DEV`).

## Notes & Implementation Details

- All routes are protected with httpOnly cookie authentication
- Server-set `jwt` cookie used with `withCredentials: true`
- Validation performed server-side (see `backend/src/api/tasks/validators/`)
- Frontend uses axios with centralized `apiClient`

## Testing

**Unit Tests:**
- Use `axios-mock-adapter` for API mocking
- Jest requires `--experimental-vm-modules` for ESM
- Mock `taskService` for component tests

**Integration Tests:**
- Test filter interactions
- Test status updates with loading states
- Test error handling flows

## Recent Enhancements

### v2.0 Updates (Latest)
- ✅ Added structured logging to TaskList, TaskItem, TaskActions
- ✅ Added loading state for status updates in TaskItem
- ✅ Added error Alert display in TaskList
- ✅ Improved error handling throughout

### Backend Test Coverage
- 27 unit tests added for task service
- Full CRUD operation coverage
- Bulk creation tests (max 15 tasks)
- Filtering and sorting tests
- Statistics aggregation tests

## Next Steps

- [ ] Add unit tests for taskService helpers
- [ ] Add component integration tests
- [ ] Add E2E tests for task workflows
- [ ] Implement optimistic updates

