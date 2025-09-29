import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/users/`;

/**
 * Submits an application for a user to gain student status.
 * @route POST /api/users/apply-student
 * @param {object} applicationData - The student's application details { usn, batch, section }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation object.
 */
const applyAsStudent = async (applicationData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + 'apply-student', applicationData, config);
    return response.data;
};

/**
 * Updates the profile information (name, bio, preferences) for the authenticated user.
 * @route PUT /api/users/me
 * @param {object} profileData - The profile fields to be updated.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 */
const updateProfile = async (profileData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + 'me', profileData, config);
    return response.data;
};

/**
 * Changes the password for the authenticated user.
 * @route PUT /api/users/password
 * @param {object} passwordData - An object containing { currentPassword, newPassword, confirmPassword }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation message.
 */
const changePassword = async (passwordData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + 'password', passwordData, config);
    return response.data;
};

/**
 * Updates the avatar for the authenticated user.
 * @route PUT /api/users/me/avatar
 * @param {FormData} avatarFormData - The FormData object containing the image file.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object with the new avatar URL.
 */
const updateAvatar = async (avatarFormData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
            // When sending FormData, Axios automatically sets the
            // 'Content-Type': 'multipart/form-data' header.
        },
    };
    const response = await axios.put(API_URL + 'me/avatar', avatarFormData, config);
    return response.data;
};

/**
 * Retrieves a list of discoverable users for messaging and file sharing.
 * @route GET /api/users/discoverable
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of simplified user objects { name, avatar }.
 */
const getDiscoverableUsers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + 'discoverable', config);
    return response.data;
};

const profileService = {
    updateProfile,
    changePassword,
    updateAvatar,
    getDiscoverableUsers,
    applyAsStudent,
};

export default profileService;