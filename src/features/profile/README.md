# Profile service — verification & mapping

This README documents the frontend `profileService` functions and the backend routes they call.

Base URL
- Frontend uses `import.meta.env.VITE_API_BASE_URL` as the API base (includes `/api` when running locally).
- Users API root: `${VITE_API_BASE_URL}/users/`

Exported functions and mapped backend endpoints

- getCurrentUser(token)
  - GET /api/users/me
  - Returns the authenticated user's full profile (used on profile page and account settings).

- updateProfile(profileData, token)
  - PUT /api/users/me
  - Body: profile fields to update (name, bio, preferences, etc.)

- changePassword(passwordData, token)
  - PUT /api/users/password
  - Body: { currentPassword, newPassword, confirmPassword }

- updateAvatar(avatarFormData, token)
  - PUT /api/users/me/avatar
  - Multipart FormData with the image file. The backend uses Multer and enforces file size limits.

- getDiscoverableUsers(token)
  - GET /api/users/discoverable
  - Only available to verified users; returns simplified user objects for messaging and sharing.

- applyAsStudent(applicationData, token)
  - POST /api/users/apply-student
  - Body: { usn, batch, section }
  - The backend enforces policies (e.g. only certain roles can apply).

- getStorageUsage(token)
  - GET /api/users/me/storage
  - Returns storage usage and quota details for the authenticated user.

Notes & Implementation details
- All protected endpoints require `Authorization: Bearer <token>` in headers. The service functions set this header.
- Avatar upload route uses Multer on the backend; client should send a FormData object with the file under a standard key (see component code). The avatar upload route has an error handler for large files — keep uploads < 5MB.
- If you add tests for this service, remember the frontend is ESM (Vite). Jest will need either the `--experimental-vm-modules` Node flag or a transform (Babel) to import ESM modules.

Possible next steps
- Add unit tests (axios-mock-adapter) for these helpers to assert correct HTTP method, URL and Authorization header.
- Add a small profile page integration test that mocks `getCurrentUser` and `getStorageUsage` responses to verify UI wiring.

