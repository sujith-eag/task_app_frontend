import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AUTH_API_URL = `${API_BASE_URL}/auth/`;

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