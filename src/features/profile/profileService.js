import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/users/`;

// Update user profile (name, bio, preferences)
const updateProfile = async (profileData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + 'me', profileData, config);
    return response.data;
};

// Change user password
const changePassword = async (passwordData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + 'password', passwordData, config);
    return response.data;
};

// Update user avatar
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


// Get list of users available for sharing
const getDiscoverableUsers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    // Note the different endpoint
    const response = await axios.get(API_URL + 'discoverable', config);
    return response.data;
};

const profileService = {
    updateProfile,
    changePassword,
    updateAvatar,
    getDiscoverableUsers,
};

export default profileService;



