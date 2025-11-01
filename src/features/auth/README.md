````markdown
# auth — frontend service reference

This document describes the frontend authentication service located at `src/features/auth/authServices.js` and the backend API routes it calls.

Purpose
- Serve as a timeless reference for developers working on the Auth frontend services.
- Show each exported function, its inputs, and the corresponding backend route(s).
# Authentication (Auth) — Feature Guide

This consolidated document captures the essential documentation for the Authentication feature: purpose, architecture, endpoints, UX decisions, security notes, known issues, suggested fixes and next steps. It gathers the important sections from the existing auth docs and formats them into a single authoritative README — the other auth markdown files can be archived or removed once you've confirmed this file.

Last updated: 2025-10-30

## 1. Executive Summary

The Auth feature implements user sign-in, sign-up, password reset, email verification and session management. Recent refactors and improvements updated UI patterns to MUI v7, added password strength validation, implemented JWT expiration handling, and improved accessibility and UX across auth pages.

Goals:
- Robust, secure authentication flows
- Clear, accessible UI (dark/light themes)
- Minimal breaking changes to backend and Redux
- Good developer documentation and testing guidance

## 2. Quick Facts / API Surface

Base URL: `${VITE_API_BASE_URL}/auth` and related user endpoints at `${VITE_API_BASE_URL}/users`

Common endpoints used by frontend:
- POST /api/auth/register (register)
- POST /api/auth/login (login)
- POST /api/auth/forgotpassword (forgot password)
- PUT /api/auth/resetpassword/:token (reset password)
- GET /api/auth/verifyemail/:token (verify email)
- Other user-related endpoints: see `src/features/profile/profileService.js` (e.g., GET /api/users/me, PUT /api/users/me/avatar)

Client-side service: `src/features/auth/authServices.js` — central place for auth HTTP calls and axios interceptors.

## 3. Key Improvements (high level)

- JWT expiration handling: global axios interceptor logs out the user on 401, clears localStorage and redirects to `/login` with a friendly event-based toast notification.
- Password strength meter: real-time scoring and visual feedback used on Register and Reset Password pages.
- MUI v7 slotProps: updated components to remove deprecated patterns and ensure theme-aware behavior.
- Inline loading states: replaced full-page backdrops with button-level loading indicators.
- Accessibility: ARIA attributes, keyboard navigation improvements, focus management.

## 4. UX & Component Notes

Pages and notable behavior:
- LoginPage: session expiration listener (dispatches `auth:sessionExpired` custom event), email validation, inline loading.
- RegisterPage: password strength meter + requirements checklist, confirm password validation.
- ForgotPasswordPage: enhanced success screen with actions (send another link, back to login).
- ResetPasswordPage: token from URL, password strength, confirm password; redirects to login on success.
- VerifyEmailPage: three-state UI (loading / success / error) and helpful CTA buttons.

Design system patterns:
- Gradient avatars per page for consistent branding.
- Button hover lift and subtle focus/hover shadows for TextFields.
- Theme-aware colors (use theme functions rather than hardcoded values).

## 5. Security & Validation

- Password requirements enforced client-side (and validated server-side): min 8 chars, uppercase, lowercase, number, special char.
- Email validation: simple regex, trim and lowercase before submit.
- JWT handling (critical): response interceptor handles 401 status to avoid silent failures.
- Suggested security additions (Phase 2): 2FA (TOTP), rate-limit UI messages, password breach check (HaveIBeenPwned integration).

## 6. Testing & Validation Checklist

Manual checks to run before releases:
- Login success/failure flows, 401 handling
- Register: strength meter, validation, verification email behavior
- Forgot/reset: token handling, success UI, errors
- Verify email: all three states
- Dark & light themes
- Mobile responsiveness

Unit test guidance:
- Use axios-mock-adapter to assert correct HTTP methods, URLs, and Authorization header from `authServices.js`.
- Note: frontend is ESM (Vite). Jest must be run with `--experimental-vm-modules` or via a Babel transform.

## 7. Suggestions & Improvements

Priority suggestions:
- Implement rate-limit UI handling for 429 responses (show retry-after countdown).
- Add optional "Remember me" email persistence.
- Integrate password breach checking (k-anonymity via HaveIBeenPwned).
- Plan 2FA rollout (TOTP) as a high-priority security upgrade.

Developer ergonomics:
- Lazy-load auth pages to reduce initial bundle size.
- Centralize password strength logic into a small util to reuse between Register/Reset.
- Standardize event names for cross-component notifications (e.g., `auth:sessionExpired`).


Owner: frontend team (auth module maintainers)

---
