import axios from 'axios';

const API_URL = '/api/files/'
// const API_URL = 'https://task-app-backend-8j57.onrender.com/api/files/';

// Upload one or more files
const uploadFiles = async (filesFormData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, filesFormData, config);
    return response.data;
};

// Get all files for the user (owned and shared)
const getFiles = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

// Get a temporary download link for a file
const getDownloadLink = async (fileId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL + fileId + '/download', config);
    return response.data;
};

// Delete a file owned by the user
const deleteFile = async (fileId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + fileId, config);
    // Return the ID of the deleted file for easy state updates
    return { fileId };
};

// Share a file with another user
const shareFile = async (fileId, userIdToShareWith, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + fileId + '/share', { userIdToShareWith }, config);
    return response.data;
};

// Manage share access (owner revokes or user removes self)
const manageShareAccess = async (fileId, userIdToRemove, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        // If the owner is revoking access, the userIdToRemove will be in the body.
        // If a user is removing themselves, the body will be empty.
        data: userIdToRemove ? { userIdToRemove } : {},
    };
    const response = await axios.delete(API_URL + fileId + '/share', config);
    return response.data;
};


const fileService = {
    uploadFiles,
    getFiles,
    getDownloadLink,
    deleteFile,
    shareFile,
    manageShareAccess,
};

export default fileService;