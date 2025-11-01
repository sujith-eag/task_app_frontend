# adminService — service layer reference

This document describes the frontend service files contained in `src/features/admin/adminService/` and the backend API routes each service function calls.

Purpose
- Serve as a timeless reference for developers working on the Admin frontend services.
- Show each file's responsibility, exported functions, expected inputs, and the corresponding backend route(s).

Files in this directory

- `userService.js`
  - Responsibilities: applications review, user listing and role management, student profile and enrollment updates.
  - Exports: `userService` with functions:
    - `getPendingApplications(token)` — GET `/api/admin/applications`
    - `reviewApplication(userId, action, token)` — PATCH `/api/admin/applications/:userId/review`
    - `getUsersByRole(role, token)` — GET `/api/admin/management/users?role=...`
    - `promoteToFaculty(userId, facultyData, token)` — PATCH `/api/admin/management/users/:userId/promote`
    - `updateStudentDetails(studentId, studentData, token)` — PUT `/api/admin/management/students/:studentId`
    - `updateStudentEnrollment(studentId, subjectIds, token)` — PUT `/api/admin/management/students/:studentId/enrollment`

- `teacherService.js`
  - Responsibilities: teacher listing and assignment management.
  - Exports: `teacherService` with functions:
    - `getAllTeachers(token)` — GET `/api/admin/management/teachers`
    - `updateTeacherAssignments({teacherId, assignmentData}, token)` — POST `/api/admin/teacher-assignments/:teacherId` (body: assignmentData)
    - `deleteTeacherAssignment({teacherId, assignmentId}, token)` — DELETE `/api/admin/teacher-assignments/:teacherId/:assignmentId`

- `subjectService.js`
  - Responsibilities: admin subject CRUD.
  - Exports: `subjectService` with functions:
    - `getSubjects(token, params={})` — GET `/api/admin/subjects` (optional query params e.g. `semester`)
    - `createSubject(subjectData, token)` — POST `/api/admin/subjects` (body: subjectData)
    - `updateSubject(subjectData, token)` — PUT `/api/admin/subjects/:id` (body: subjectData without id)
    - `deleteSubject(subjectId, token)` — DELETE `/api/admin/subjects/:id`

- `reportingService.js`
  - Responsibilities: reporting endpoints consumed by admin UIs.
  - Exports: `reportingService` with functions:
    - `getAttendanceStats(filters, token)` — GET `/api/admin/reports/attendance-stats` (query filters)
    - `getFeedbackSummary(filters, token)` — GET `/api/admin/reports/feedback-summary` (query filters)
    - `getFeedbackReport(classSessionId, token)` — GET `/api/admin/reports/feedback-report/:classSessionId`
    - `getTeacherReport(teacherId, token)` — GET `/api/admin/reports/teacher/:teacherId`
    - `getStudentReport(studentId, token)` — GET `/api/admin/reports/student/:studentId`

Common conventions
- All service functions accept a `token` parameter; they pass it in an `Authorization: Bearer <token>` header in the axios config.
- `API_BASE_URL` is obtained from `import.meta.env.VITE_API_BASE_URL` and includes the `/api` prefix (e.g. `https://api.example.com/api`).
- Service files define section-specific constants to build final endpoint URLs (examples below).

Example constants (in each service file)

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MANAGEMENT_API_URL = `${API_BASE_URL}/admin/management`;
const TEACHER_ASSIGNMENTS_API_URL = `${API_BASE_URL}/admin/teacher-assignments`;
const SUBJECTS_API_URL = `${API_BASE_URL}/admin/subjects`;
const REPORTS_API_URL = `${API_BASE_URL}/admin/reports`;
const APPLICATIONS_API_URL = `${API_BASE_URL}/admin/applications`;
```

Error handling & behavior
- Services return `response.data` from axios calls; callers (UI components or thunks) should handle errors thrown by axios (network errors, non-2xx responses).
- Standard pattern used in these files:
  - Build `config` with `Authorization` header
  - Call axios (GET/POST/PUT/PATCH/DELETE)
  - Return `response.data`

Notes and troubleshooting
- If a service call fails with 401/403, verify the token and the user's roles.
- Confirm the exact request body schema for `assignmentData` before changing shape in the UI.
- Some routes accept query parameters (e.g., `?semester=3` for subjects); pass them via `config.params`.

Where to find backend API specs
- Backend admin module documentation: `backend/src/api/admin/README.md`.
- For per-subdomain details: check subdirectories under `backend/src/api/admin/` (e.g., `applications`, `management`, `teacher-assignments`, `subjects`, `reports`).

Contact / ownership
- Developers maintaining these files: check git history for `src/features/admin/adminService/*.js` to identify recent authors.

This README is a reference document; keep it current when adding new service functions or when the backend routes change.
