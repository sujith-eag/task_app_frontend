import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/files/`;


/**
 * Uploads one or more files to the server.
 * @route POST /api/files/
 * @param {FormData} filesFormData - A FormData object containing the file(s).
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of the newly created file objects.
 */
const uploadFiles = async (filesFormData, token, onUploadProgress) => {
    const config = { 
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
        },
        // Passing progress handler to the Axios config        
        onUploadProgress,
    };
    const response = await axios.post(API_URL, filesFormData, config);
    return response.data;
};


/**
 * Retrieves all files for the user, including owned files and files shared with them.
 * @route GET /api/files/
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of file objects.
 */
const getFiles = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
};


/**
 * Gets a temporary, secure pre-signed URL for downloading a file from S3.
 * @route GET /api/files/:fileId/download
 * @param {string} fileId - The ID of the file to download.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the download URL.
 */
const getDownloadLink = async (fileId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + fileId + '/download', config);
    return response.data;
};


/**
 * Deletes a file owned by the authenticated user.
 * @route DELETE /api/files/:fileId
 * @param {string} fileId - The ID of the file to delete.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the ID of the deleted file.
 */
const deleteFile = async (fileId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(API_URL + fileId, config);
    return { fileId }; // Return the ID for easy state updates
};


/**
 * Deletes multiple files by their IDs.
 * @route DELETE /api/files/
 * @param {string[]} fileIds - An array of file IDs to be deleted.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to an object containing the server's success message and the array of deleted file IDs.
 */
const bulkDeleteFiles = async (fileIds, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: { fileIds } // Pass IDs in the request body for a DELETE request
    };
    const response = await axios.delete( API_URL, config);
    // Pass the original IDs back to the reducer for efficient state updates
    return { ...response.data, ids: fileIds };
};


/**
 * Shares a file with another registered user.
 * @route POST /api/files/:fileId/share
 * @param {string} fileId - The ID of the file to share.
 * @param {string} userIdToShareWith - The ID of the user to share the file with.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
const shareFile = async (fileId, userIdToShareWith, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + fileId + '/share', { userIdToShareWith }, config);
    return response.data;
};


/**
 * Manages share access to a file (e.g., owner revokes access or a user removes their own access).
 * @route DELETE /api/files/:fileId/share
 * @param {string} fileId - The ID of the file.
 * @param {string | null} userIdToRemove - The ID of the user to remove access for, or null if removing self.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
const manageShareAccess = async (fileId, userIdToRemove, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: userIdToRemove ? { userIdToRemove } : {},
    };
    const response = await axios.delete(API_URL + fileId + '/share', config);
    return response.data;
};


/**
 * Shares a file with an entire class based on subject, batch, and section.
 * @route POST /api/files/:fileId/share-class
 * @param {object} data - The data payload, including { fileId, classData }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
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
    bulkDeleteFiles,
    shareFile,
    manageShareAccess,
    shareWithClass,
};

export default fileService;