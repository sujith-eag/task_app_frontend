# Tasks service — verification & mapping

This README documents the frontend `taskService` functions and the backend routes they call.

Base URL
- Frontend uses `import.meta.env.VITE_API_BASE_URL` as the API base (includes `/api` when running locally).
- Tasks API root: `${VITE_API_BASE_URL}/tasks/`

Exported functions and mapped backend endpoints

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

Subtasks

- addSubTask(taskId, subTaskData, token)
  - POST /api/tasks/:id/subtasks

- updateSubTask(taskId, subTaskId, subTaskData, token)
  - PUT /api/tasks/:id/subtasks/:subTaskId

- deleteSubTask(taskId, subTaskId, token)
  - DELETE /api/tasks/:id/subtasks/:subTaskId

- getSubTaskStats(taskId, token)
  - GET /api/tasks/:id/subtasks/stats
  - Returns counts of completed/pending subtasks and completion percentage.

Notes & implementation details
All routes are protected. Browser clients should rely on the server-set httpOnly cookie `jwt` and use a central `apiClient` configured with `withCredentials: true`. For non-browser clients, send `Cookie: jwt=YOUR_TOKEN` or an Authorization header as a fallback.
- The frontend `getTasks` helper passes `filterData` as axios `params` to construct query strings properly.
- Validation is performed server-side; client should follow the validators in `backend/src/api/tasks/validators/tasks.validator.js` when constructing request payloads.

Testing
- If you add unit tests for these helpers, use `axios-mock-adapter` to assert correct method, URL and Authorization header.
- Because the frontend is ESM (Vite), Jest will require `--experimental-vm-modules` or a transformer (Babel) to import ESM modules in tests.

Next steps
- Add unit tests for critical helpers (getTasks, createTask, getTaskStats, createBulkTasks).
- Add small UI integration tests that mock `taskService` responses.

