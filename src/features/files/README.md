# Files service — verification & mapping

This README documents the frontend `fileService` functions and the backend routes they call. It also highlights important mismatches that were fixed during Phase 0 (refactor).

Base URL
- Frontend uses `import.meta.env.VITE_API_BASE_URL` as the API base (includes `/api` when running locally).

Key API roots
- Files API: `${VITE_API_BASE_URL}/files`
- Folders API: `${VITE_API_BASE_URL}/folders`
- Shares API: `${VITE_API_BASE_URL}/shares`

Exported functions (frontend) and their mapped backend endpoints

- uploadFiles(filesFormData, token)
  - POST /api/files/upload
  - multipart/form-data with files and optional parentId

- getFiles(parentId, token)
  - GET /api/files?parentId=<id> (parentId optional)
  - returns list of files/folders under parent

- getDownloadLink(fileId, token)
  - GET /api/files/:fileId/download
  - returns a temporary pre-signed URL or download metadata

- bulkDownloadFiles(fileIds, token, fileName?)
  - POST /api/files/bulk-download
  - responseType: blob — triggers browser download of the returned zip

- deleteFile(fileId, token)
  - DELETE /api/files/:id

- bulkDeleteFiles(fileIds, token)
  - DELETE /api/files  (with body { fileIds })

Folders
- createFolder(folderData, token)
  - POST /api/folders
- getFolderDetails(folderId, token)
  - GET /api/folders/:id
- moveItem(folderId, moveData, token)
  - PATCH /api/folders/:id/move
- renameFolder(folderId, renameData, token)
  - PATCH /api/folders/:id/rename
- deleteFolder(folderId, token)
  - DELETE /api/folders/:id

Shares (important refactor notes)
- Shares are handled under `/api/shares` (migrated from older `/college/files/...` and in-file endpoints).

- shareFile(fileId, userIdToShareWith, token, expiresAt?)
  - POST /api/shares/:fileId/user
  - body: { userIdToShareWith, expiresAt? }

- createPublicShare({ fileId, duration }, token)
  - POST /api/shares/:fileId/public
  - creates a public code-based share

- revokePublicShare(fileId, token)
  - DELETE /api/shares/:fileId/public

- manageShareAccess(fileId, userIdToRemove, token)
  - DELETE /api/shares/:fileId/user
  - body: { userIdToRemove } or empty to remove own access

- bulkRemoveAccess(fileIds, token)
  - POST /api/shares/bulk-remove
  - body: { fileIds }

- shareWithClass({ fileId, classData }, token)
  - POST /api/shares/:fileId/class

- getFileShares(fileId, token)
  - GET /api/shares/:fileId

- getFilesSharedWithMe(token)
  - GET /api/shares/shared-with-me

Notes and migration guidance
- The backend refactor consolidated sharing under `/api/shares`. Frontend calls that used older endpoints were updated to use `/shares/*` paths.
- Bulk download previously used a hidden form POST to an old `/downloads/bulk-download`; backend now exposes `/api/files/bulk-download` which streams a zip — the frontend now calls this via axios with `responseType: 'blob'` and triggers an in-browser download.
- All requests must include `Authorization: Bearer <token>` in headers for protected endpoints.
- When calling DELETE endpoints that accept a request body (bulk delete, manage share access), axios requires the body to be sent via the `data` option.

Testing notes
- Unit tests that import ESM frontend modules may require running Jest with Node's `--experimental-vm-modules` flag or using a transform (Babel) because the frontend is ESM (Vite). See repository testing notes for the project's preferred approach.

If you'd like, I can:
- Add unit tests that assert the updated URLs and headers for these functions (using axios-mock-adapter).
- Add small integration mock examples showing how to call bulkDownloadFiles from the UI.

