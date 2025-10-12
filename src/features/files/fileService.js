import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/files/`;
const FOLDER_API_URL = `${API_BASE_URL}/folders/`;
const USER_API_URL = `${API_BASE_URL}/users/`;



/**
 * Creates a temporary, code-based public share link for a file.
 * @param {object} shareData - The data required for creating the share.
 * @param {string} shareData.fileId - The ID of the file to share.
 * @param {string} shareData.duration - The duration for which the link will be valid (e.g., '1-hour').
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the public share data (code, expiresAt).
 */
const createPublicShare = async ({ fileId, duration }, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(`${API_URL}${fileId}/public-share`, { duration }, config);
    return response.data;
};


/**
 * Revokes an active public share link for a file.
 * @param {string} fileId - The ID of the file to revoke the share for.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the server's success message.
 */
const revokePublicShare = async (fileId, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(`${API_URL}${fileId}/public-share`, config);
    return response.data;
};


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
 * Retrieves all files and folders for the current user within a specific parent folder (owned and shared).
 * @param {string | null} parentId - The ID of the parent folder, or null for the root directory.
 * @route GET /api/files/
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of file/folder objects.
 */
const getFiles = async (parentId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}?parentId=${parentId || 'null'}`, config);
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


/**
 * Fetches the current user's storage usage statistics from the API.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to an object containing the user's storage data,
 * including usageBytes, quotaBytes, fileCount, and fileLimit.
 */
const getStorageUsage = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${USER_API_URL}me/storage`, config);
    return response.data;
};


/**
 * Creates a new folder.
 * @param {object} folderData - The folder data, including folderName and parentId.
 * @route GET /api/folders/
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the newly created folder object.
 */
const createFolder = async (folderData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(FOLDER_API_URL, folderData, config);
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
    getStorageUsage,
    createFolder,
    createPublicShare,
    revokePublicShare
};

export default fileService;