import axios from 'axios'

const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ? import.meta.env.VITE_API_BASE_URL : '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // send cookies
});

// Response interceptor for global 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        // Emit an event so higher-level code can handle session expiration.
        // Do NOT perform a hard redirect here — let the app decide (avoids noisy redirects
        // when probing `/auth/me` on app start while unauthenticated).
        const event = new CustomEvent('auth:sessionExpired', { detail: { message: 'Your session has expired. Please log in again.' } });
        try { window.dispatchEvent(event); } catch (e) { /* ignore */ }
      }
    return Promise.reject(error);
  }
);

export default apiClient;
