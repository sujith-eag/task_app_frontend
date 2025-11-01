# AI — frontend service reference

This document describes the frontend AI service located at `src/features/ai/aiTaskService.js` and the backend API routes it calls.

Purpose
- Serve as a timeless reference for developers working on the AI frontend services.
- Show each exported function, its inputs, and the corresponding backend route(s).

File
- `aiTaskService.js`
  - Responsibilities: generate AI task previews, generate and persist tasks via AI, retrieve AI usage stats, prompt and session history, and clearing prompt history.
  - Location: `src/features/ai/aiTaskService.js`

Exported functions (summary)

- `fetchAIPlanPreview(requestData, token)`
  - Method: POST
  - Frontend call: `POST ${API_BASE_URL}/ai/tasks/preview` (body: requestData)
  - Backend route: `POST /api/ai/tasks/preview` -> `ai.controller.getAIPlanPreview`

- `generateTasksWithAI(requestData, token)`
  - Method: POST
  - Frontend call: `POST ${API_BASE_URL}/ai/tasks/generate` (body: { prompt, options? })
  - Backend route: `POST /api/ai/tasks/generate` -> `ai.controller.generateTasksWithAI`

- `getAIStats(token)`
  - Method: GET
  - Frontend call: `GET ${API_BASE_URL}/ai/stats`
  - Backend route: `GET /api/ai/stats` -> `ai.controller.getAIStats`

- `getPromptHistory(params, token)`
  - Method: GET
  - Frontend call: `GET ${API_BASE_URL}/ai/prompts/history?sessionId=...&limit=...`
  - Backend route: `GET /api/ai/prompts/history` -> `ai.controller.getPromptHistory`

- `getSessionHistory(token)`
  - Method: GET
  - Frontend call: `GET ${API_BASE_URL}/ai/sessions`
  - Backend route: `GET /api/ai/sessions` -> `ai.controller.getSessionHistory`

- `clearPromptHistory(daysOld, token)`
  - Method: DELETE
  - Frontend call: `DELETE ${API_BASE_URL}/ai/prompts/history?daysOld=...`
  - Backend route: `DELETE /api/ai/prompts/history` -> `ai.controller.clearOldPrompts`

Notes & conventions
- `API_BASE_URL` is supplied via `import.meta.env.VITE_API_BASE_URL` and typically contains the `/api` prefix in development. The service builds endpoints like `${API_BASE_URL}/ai/...`.
- All AI routes are protected and require an Authorization header: `Authorization: Bearer <token>`.
- Task generation endpoints enforce daily usage limits (`checkAIDailyLimit` middleware). Handle possible 429/403 responses accordingly.

Backend routes (reference)
- `POST /api/ai/tasks/preview` — preview/refine AI-generated plan
- `POST /api/ai/tasks/generate` — generate and persist tasks from AI
- `GET  /api/ai/stats` — AI usage stats for user
- `GET  /api/ai/prompts/history` — user's prompt history
- `GET  /api/ai/sessions` — session history grouped by sessionId
- `DELETE /api/ai/prompts/history` — clear old prompt history

Verification
- The frontend `aiTaskService.js` endpoints were mapped to `backend/src/api/ai/routes/ai.routes.js` and controllers under `backend/src/api/ai/controllers/`.

Verification date: 2025-11-01
