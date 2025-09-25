import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/files/`;

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


// Share a file with a class
const shareWithClass = async (data, token) => {
    const { fileId, classData } = data;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}${fileId}/share-class`, classData, config);
    return response.data;
};

const fileService = {
    uploadFiles,
    getFiles,
    getDownloadLink,
    deleteFile,
    shareFile,
    manageShareAccess,
    shareWithClass,
};

export default fileService;