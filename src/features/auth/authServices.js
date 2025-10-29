import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_API_URL = `${API_BASE_URL}/auth/`;

// --- Axios Interceptor for Token Expiration Handling ---
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized (Token expired or invalid)
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            // Don't redirect if already on auth pages
            const authPages = ['/login', '/register', '/forgotpassword', '/resetpassword'];
            const isAuthPage = authPages.some(page => currentPath.startsWith(page));
            
            if (!isAuthPage) {
                // Clear user data
                localStorage.removeItem('user');
                // Redirect to login
                window.location.href = '/login';
                // Show error message (will display after redirect)
                setTimeout(() => {
                    // Using setTimeout to ensure it shows after redirect
                    const event = new CustomEvent('auth:sessionExpired', { 
                        detail: { message: 'Your session has expired. Please log in again.' } 
                    });
                    window.dispatchEvent(event);
                }, 100);
            }
        }
        return Promise.reject(error);
    }
);

// --- Authentication & User Management ---

/**
 * Registers a new user. The backend sends a verification email.
 * @route POST /api/auth/register
 * @param {object} userData - { name, email, password, confirmPassword }
 * @returns {object} A success message.
 */
const register = async (userData) => {
    const response = await axios.post(AUTH_API_URL + 'register', userData)
    return response.data
}

/**
 * Logs in an existing user.
 * @route POST /api/auth/login
 * @param {object} userData - { email, password }
 * @returns {object} The user object and JWT token.
 */
const login = async (userData) => {
    const response = await axios.post(AUTH_API_URL + 'login', userData)
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
    }
    return response.data
}

/**
 * Verifies a user's email address using a token from their email.
 * @route GET /api/auth/verifyemail/:token
 * @param {string} token - The verification token from the URL.
 * @returns {object} A success message.
 */
const verifyEmail = async (token) => {
    const response = await axios.get(AUTH_API_URL + 'verifyemail/' + token);
    return response.data;
};

/**
 * Logs the user out by clearing their data from local storage.
 * This is a client-side only function.
 */
const logout = () => {
    localStorage.removeItem('user')
}

// --- Password Management ---

/**
 * Initiates the password reset process by sending a link to the user's email.
 * @route POST /api/auth/forgotpassword
 * @param {object} userData - { email }
 * @returns {object} A success message confirming the email has been sent.
 */
const forgotPassword = async (userData) => {
    const response = await axios.post(AUTH_API_URL + 'forgotpassword', userData)
    return response.data
}

/**
 * Resets the user's password using a valid token.
 * @route PUT /api/auth/resetpassword/:token
 * @param {object} resetData - { token, password, confirmPassword }
 * @returns {object} A success message.
 */
const resetPassword = async (resetData) => {
    const response = await axios.put(
        AUTH_API_URL + 'resetpassword/' + resetData.token,
        {
            password: resetData.password,
            confirmPassword: resetData.confirmPassword,
        }
    );
    return response.data;
};

// --- Service Export ---

const authService = {
    register,
    logout,
    login,
    forgotPassword,
    resetPassword,
    verifyEmail,
}

export default authService