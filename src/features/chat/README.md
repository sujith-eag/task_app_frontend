# chat — frontend service reference

This document describes the frontend chat service located at `src/features/chat/chatService.js` and the backend API routes it calls.

Purpose
- Serve as a timeless reference for developers working on the Chat frontend services.
- Show each exported function, its inputs, and the corresponding backend route(s).

File
- `chatService.js`
  - Responsibilities: conversation listing/creation, retrieving messages for a conversation, creating/deleting messages, unread counts, marking messages as read, and message search.
  - Location: `src/features/chat/chatService.js`

Exported functions (summary)

- `getConversations(token)`
  - Method: GET
  - Frontend call: `GET ${API_BASE_URL}/chat/conversations`
  - Backend route: `GET /api/chat/conversations` -> `conversations.controller.getConversations`

- `createOrGetConversation(recipientId, token)`
  - Method: POST
  - Frontend call: `POST ${API_BASE_URL}/chat/conversations` (body: `{ recipientId }`)
  - Backend route: `POST /api/chat/conversations` -> `conversations.controller.createOrGetConversation`

- `getMessagesForConversation(conversationId, token, options)`
  - Method: GET
  - Frontend call: `GET ${API_BASE_URL}/chat/conversations/:conversationId/messages` (supports query `page`, `limit`)
  - Backend route: `GET /api/chat/conversations/:id/messages` -> `messages.controller.getMessages`

- `getTotalUnreadCount(token)`
  - Method: GET
  - Frontend call: `GET ${API_BASE_URL}/chat/messages/unread/total`
  - Backend route: `GET /api/chat/messages/unread/total` -> `messages.controller.getTotalUnreadCount`

- `getUnreadCountForConversation(conversationId, token)`
  - Method: GET
  - Frontend call: `GET ${API_BASE_URL}/chat/conversations/:conversationId/messages/unread`
  - Backend route: `GET /api/chat/conversations/:id/messages/unread` -> `messages.controller.getUnreadCount`

- `markConversationAsRead(conversationId, token)`
  - Method: PUT
  - Frontend call: `PUT ${API_BASE_URL}/chat/conversations/:conversationId/messages/read`
  - Backend route: `PUT /api/chat/conversations/:id/messages/read` -> `messages.controller.markAsRead`

- `createMessage(conversationId, content, token)`
  - Method: POST
  - Frontend call: `POST ${API_BASE_URL}/chat/conversations/:conversationId/messages` (body: `{ content }`)
  - Backend route: `POST /api/chat/conversations/:id/messages` -> `messages.controller.createMessage`

- `deleteMessage(messageId, token)`
  - Method: DELETE
  - Frontend call: `DELETE ${API_BASE_URL}/chat/messages/:messageId`
  - Backend route: `DELETE /api/chat/messages/:id` -> `messages.controller.deleteMessage`

- `searchMessages(conversationId, q, token, options)`
  - Method: GET
  - Frontend call: `GET ${API_BASE_URL}/chat/conversations/:conversationId/messages/search?q=...` (supports pagination params)
  - Backend route: `GET /api/chat/conversations/:id/messages/search` -> `messages.controller.searchMessages`

Notes & conventions
- `API_BASE_URL` is supplied via `import.meta.env.VITE_API_BASE_URL` and typically contains the `/api` prefix in development. The service builds endpoints like `${API_BASE_URL}/chat/...`.
- All routes under `/api/chat` are protected and require an Authorization header: `Authorization: Bearer <token>`.
- Pagination options (`page`, `limit`) may be passed in `options` objects and forwarded as query parameters.

Backend routes available (reference)
- `GET  /api/chat/conversations` — list user conversations
- `POST /api/chat/conversations` — find or create conversation
- `GET  /api/chat/conversations/:id` — get single conversation
- `DELETE /api/chat/conversations/:id` — delete a conversation
- `GET  /api/chat/conversations/:id/messages` — get messages (with pagination)
- `POST /api/chat/conversations/:id/messages` — create message (HTTP endpoint)
- `GET  /api/chat/conversations/:id/messages/search` — search messages
- `GET  /api/chat/conversations/:id/messages/unread` — unread count for a conversation
- `PUT  /api/chat/conversations/:id/messages/read` — mark messages read
- `GET  /api/chat/messages/unread/total` — total unread across conversations
- `DELETE /api/chat/messages/:id` — delete a message

Verification
- The frontend `chatService.js` endpoints were verified against `backend/src/api/chat/routes/chat.routes.js` and the controllers under `backend/src/api/chat/controllers/`.

Verification date: 2025-11-01
