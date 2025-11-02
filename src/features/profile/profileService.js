import apiClient from '../../app/apiClient.js';

// Keep paths relative to apiClient.baseURL (e.g. '/api')
const API_URL = '/users/';

/**
 * Submits an application for a user to gain student status.
 * @route POST /api/users/apply-student
 * @param {object} applicationData - The student's application details { usn, batch, section }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation object.
 */
const applyAsStudent = async (applicationData) => {
    const response = await apiClient.post(API_URL + 'apply-student', applicationData);
    return response.data;
};

/**
 * Updates the profile information (name, bio, preferences) for the authenticated user.
 * @route PUT /api/users/me
 * @param {object} profileData - The profile fields to be updated.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 */
const updateProfile = async (profileData) => {
    const response = await apiClient.put(API_URL + 'me', profileData);
    return response.data;
};

/**
 * Changes the password for the authenticated user.
 * @route PUT /api/users/password
 * @param {object} passwordData - An object containing { currentPassword, newPassword, confirmPassword }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation message.
 */
const changePassword = async (passwordData) => {
    const response = await apiClient.put(API_URL + 'password', passwordData);
    return response.data;
};

/**
 * Updates the avatar for the authenticated user.
 * @route PUT /api/users/me/avatar
 * @param {FormData} avatarFormData - The FormData object containing the image file.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object with the new avatar URL.
 */
const updateAvatar = async (avatarFormData) => {
    const response = await apiClient.put(API_URL + 'me/avatar', avatarFormData);
    return response.data;
};

/**
 * Retrieves a list of discoverable users for messaging and file sharing.
 * @route GET /api/users/discoverable
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of simplified user objects { name, avatar }.
 */
const getDiscoverableUsers = async () => {
    const response = await apiClient.get(API_URL + 'discoverable');
    return response.data;
};

/**
 * Retrieves the full profile of the authenticated user.
 * @route GET /api/users/me
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} The current user's full profile object.
 */
const getCurrentUser = async () => {
    const response = await apiClient.get(API_URL + 'me');
    return response.data;
};

/**
 * Retrieves the authenticated user's storage usage and quota information.
 * @route GET /api/users/me/storage
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} An object containing used/limit and any per-role quotas.
 */
const getStorageUsage = async () => {
    const response = await apiClient.get(API_URL + 'me/storage');
    return response.data;
};

/**
 * Get active sessions for the authenticated user.
 * @route GET /api/auth/sessions
 */
const getActiveSessions = async () => {
    const response = await apiClient.get('/auth/sessions');
    // backend returns { sessions: [...] } — normalize to return the array
    return response.data && response.data.sessions ? response.data.sessions : [];
};

/**
 * Revoke a session by deviceId.
 * @route DELETE /api/auth/sessions/:deviceId
 */
const revokeSession = async (deviceId) => {
    const response = await apiClient.delete(`/auth/sessions/${deviceId}`);
    return response.data;
};

const profileService = {
    updateProfile,
    changePassword,
    updateAvatar,
    getDiscoverableUsers,
    applyAsStudent,
    getCurrentUser,
    getStorageUsage,
    getActiveSessions,
    revokeSession,
};

export default profileService;