import apiClient from '../../app/apiClient.js';
import { getDeviceId } from '../../utils/deviceId.js';

// apiClient.baseURL is expected to point to the API root (for example '/api' or 'http://localhost:5000')
// Keep this path relative so baseURL + AUTH_API_URL => '/api/auth' when baseURL='/api'
const AUTH_API_URL = '/auth/';

// --- Authentication & User Management ---

/**
 * Registers a new user. The backend sends a verification email.
 * @route POST /api/auth/register
 * @param {object} userData - { name, email, password, confirmPassword }
 * @returns {object} A success message.
 */
const register = async (userData) => {
    const response = await apiClient.post(AUTH_API_URL + 'register', userData)
    return response.data
}

/**
 * Logs in an existing user.
 * @route POST /api/auth/login
 * @param {object} userData - { email, password }
 * @returns {object} The user object and JWT token.
 */
const login = async (userData) => {
    const deviceId = getDeviceId();
    const response = await apiClient.post(AUTH_API_URL + 'login', userData, { headers: { 'x-device-id': deviceId } });
    // Backend sets an httpOnly cookie and returns an envelope { message, user }
    // Return only the user object so reducers receive a consistent payload (same shape as /auth/me)
    return response.data?.user || response.data;
}

/**
 * Verifies a user's email address using a token from their email.
 * @route GET /api/auth/verifyemail/:token
 * @param {string} token - The verification token from the URL.
 * @returns {object} A success message.
 */
const verifyEmail = async (token) => {
    const response = await apiClient.get(AUTH_API_URL + 'verifyemail/' + token);
    return response.data;
};

/**
 * Logs the user out by clearing their data from local storage.
 * This is a client-side only function.
 */
const logout = async () => {
        try {
            await apiClient.post(AUTH_API_URL + 'logout');
        } catch (e) {
            // ignore network errors on logout
        }
}

// --- Password Management ---

/**
 * Initiates the password reset process by sending a link to the user's email.
 * @route POST /api/auth/forgotpassword
 * @param {object} userData - { email }
 * @returns {object} A success message confirming the email has been sent.
 */
const forgotPassword = async (userData) => {
    const response = await apiClient.post(AUTH_API_URL + 'forgotpassword', userData)
    return response.data
}

/**
 * Resets the user's password using a valid token.
 * @route PUT /api/auth/resetpassword/:token
 * @param {object} resetData - { token, password, confirmPassword }
 * @returns {object} A success message.
 */
const resetPassword = async (resetData) => {
    const response = await apiClient.put(
        AUTH_API_URL + 'resetpassword/' + resetData.token,
        {
            password: resetData.password,
            confirmPassword: resetData.confirmPassword,
        }
    );
    return response.data;
};

// Get currently authenticated user (reads server cookie)
const getMe = async () => {
    // Skip emitting the global sessionExpired event for the regular app startup probe.
    const response = await apiClient.get(AUTH_API_URL + 'me', { headers: { 'x-skip-session-expired-toast': '1' }, skipAuthEvent: true });
    return response.data;
}

// --- Service Export ---

const authService = {
    register,
    logout,
    login,
    forgotPassword,
    resetPassword,
    verifyEmail,
    getMe,
}

export default authService