import axios from 'axios'
import { store } from './store.js';

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
        // Allow callers to opt-out of emitting the global sessionExpired event by
        // setting either `config.skipAuthEvent = true` or header 'x-skip-session-expired-toast'.
        const cfg = error.config || {};
        const skipViaFlag = cfg.skipAuthEvent === true;
        const skipViaHeader = cfg.headers && (cfg.headers['x-skip-session-expired-toast'] || cfg.headers['X-Skip-Session-Expired-Toast']);
        // Only emit a sessionExpired event if the client currently believes it has a user.
        // This prevents toasts for unauthenticated visitors who trigger 401s on public pages.
        const hasClientUser = !!(store && store.getState && store.getState().auth && store.getState().auth.user);
        if (!skipViaFlag && !skipViaHeader && hasClientUser) {
          // Emit an event so higher-level code can handle session expiration.
          // Do NOT perform a hard redirect here — let the app decide.
          const event = new CustomEvent('auth:sessionExpired', { detail: { message: 'Your session has expired. Please log in again.' } });
          window.dispatchEvent(event);
        }
      }
    return Promise.reject(error);
  }
);

export default apiClient;
