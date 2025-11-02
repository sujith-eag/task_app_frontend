import apiClient from '../../app/apiClient.js';

const API_URL = '/files';
const FOLDER_API_URL = '/folders';
const USER_API_URL = '/users';
const SHARES_API_URL = '/shares';



/**
 * Creates a temporary, code-based public share link for a file.
 * @route /api/files/shares/:id/public-share
 * @param {object} shareData - The data required for creating the share.
 * @param {string} shareData.fileId - The ID of the file to share.
 * @param {string} shareData.duration - The duration for which the link will be valid (e.g., '1-hour').
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the public share data (code, expiresAt).
 */
/**
 * Creates a temporary, code-based public share link for a file.
 * @route POST /api/shares/:fileId/public
 * @param {object} shareData - The data required for creating the share.
 * @param {string} shareData.fileId - The ID of the file to share.
 * @param {string} shareData.duration - The duration for which the link will be valid (e.g., '1-hour').
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the public share data (code, expiresAt).
 */
const createPublicShare = async ({ fileId, duration }) => {
    const response = await apiClient.post(`${SHARES_API_URL}/${fileId}/public`, { duration });
    return response.data;
};


/**
 * Revokes an active public share link for a file.
 * @route /api/files/shares/:id/public-share
 * @param {string} fileId - The ID of the file to revoke the share for.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the server's success message.
 */
/**
 * Revokes an active public share link for a file.
 * @route DELETE /api/shares/:fileId/public
 * @param {string} fileId - The ID of the file to revoke the share for.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the server's success message.
 */
const revokePublicShare = async (fileId) => {
    const response = await apiClient.delete(`${SHARES_API_URL}/${fileId}/public`);
    return response.data;
};


/**
 * Uploads one or more files to the server.
 * @route POST /api/files/uploads
 * @param {FormData} filesFormData - A FormData object containing the file(s).
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of the newly created file objects.
 */
const uploadFiles = async (filesFormData, onUploadProgress) => {
    const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress,
    };
    const response = await apiClient.post(`${API_URL}/upload`, filesFormData, config);
    return response.data;
};

/**
 * Retrieves all files and folders for the current user within a specific parent folder (owned and shared).
 * @route GET /api/files/items
 * @param {string | null} parentId - The ID of the parent folder, or null for the root directory.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of file/folder objects.
 */
const getFiles = async (parentId) => {
    const response = await apiClient.get(`${API_URL}`, { params: parentId ? { parentId } : {} });
    return response.data;
};


/**
 * Gets a temporary, secure pre-signed URL for downloading a file from S3.
 * @route GET /api/files/downloads/:fileId/download
 * @param {string} fileId - The ID of the file to download.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the download URL.
 */
/**
 * Gets a temporary, secure pre-signed URL for downloading a file from S3.
 * @route GET /api/files/:fileId/download
 * @param {string} fileId - The ID of the file to download.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the download URL.
 */
const getDownloadLink = async (fileId) => {
    const response = await apiClient.get(`${API_URL}/${fileId}/download`);
    return response.data;
};



/**
 * Triggers a bulk download of files as a zip archive by submitting a hidden form.
 * This function does not use axios and is intended to trigger a native browser download.
 * @route POST /api/files/downloads/bulk-download
 * @param {string[]} fileIds - An array of file IDs to download.
 * @param {string} token - The user's JWT for authorization.
 */
const bulkDownloadFiles = async (fileIds) => {
    // Try to download via XHR (axios) first so we can stream blob and control filename.
    try {
        const response = await apiClient.post(`${API_URL}/bulk-download`, { fileIds }, { responseType: 'blob' });

        // Create a blob and trigger a download
        const blob = new Blob([response.data], { type: 'application/zip' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'EagleCampus-Files.zip');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        return;
    } catch (err) {
        // If XHR download fails (CORS, older browsers, or server returned non-blob), fall back to form POST
        // (Form POST will include httpOnly cookies automatically.)
        console.warn('Bulk download via API failed, falling back to form submit.', err?.message || err);

        const form = document.createElement('form');
        form.method = 'POST';
        // Correct backend endpoint: /files/bulk-download
        form.action = `${API_URL}/bulk-download`;
        form.style.display = 'none'; // Makes it invisible

        // Create a hidden input for the file IDs
        const fileIdsInput = document.createElement('input');
        fileIdsInput.type = 'hidden';
        fileIdsInput.name = 'fileIds';
        fileIdsInput.value = JSON.stringify(fileIds); // IDs as JSON string

        form.appendChild(fileIdsInput);
        document.body.appendChild(form);

        form.submit();
        document.body.removeChild(form);
        return;
    }
};



/**
 * Deletes a file owned by the authenticated user.
 * @route DELETE /api/files/delete/:fileId
 * @param {string} fileId - The ID of the file to delete.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the ID of the deleted file.
 */
/**
 * Deletes a file owned by the authenticated user.
 * @route DELETE /api/files/:id
 * @param {string} fileId - The ID of the file to delete.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the ID of the deleted file.
 */
const deleteFile = async (fileId) => {
    await apiClient.delete(`${API_URL}/${fileId}`);
    return { fileId };
};


/**
 * Deletes multiple files by their IDs.
 * @route DELETE /api/files/delete
 * @param {string[]} fileIds - An array of file IDs to be deleted.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to an object containing the server's success message and the array of deleted file IDs.
 */
const bulkDeleteFiles = async (fileIds) => {
    const response = await apiClient.delete(`${API_URL}`, { data: { fileIds } });
    return { ...response.data, ids: fileIds };
};


/**
 * Shares a file with another registered user.
 * @route POST /api/files/shares/:fileId/share
 * @param {string} fileId - The ID of the file to share.
 * @param {string} userIdToShareWith - The ID of the user to share the file with.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
/**
 * Shares a file with another registered user.
 * @route POST /api/shares/:fileId/user
 * @param {string} fileId - The ID of the file to share.
 * @param {string} userIdToShareWith - The ID of the user to share the file with.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
const shareFile = async (fileId, userIdToShareWith, expiresAt = null) => {
    const body = { userIdToShareWith };
    if (expiresAt) body.expiresAt = expiresAt;
    const response = await apiClient.post(`${SHARES_API_URL}/${fileId}/user`, body);
    return response.data;
};


/**
 * Manages share access to a file (e.g., owner revokes access or a user removes their own access).
 * @route DELETE /api/files/shares/:fileId/share
 * @param {string} fileId - The ID of the file.
 * @param {string | null} userIdToRemove - The ID of the user to remove access for, or null if removing self.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
/**
 * Manages share access to a file (owner revokes access or a user removes their own access).
 * @route DELETE /api/shares/:fileId/user
 * @param {string} fileId - The ID of the file.
 * @param {string | null} userIdToRemove - The ID of the user to remove access for, or null if removing self.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
const manageShareAccess = async (fileId, userIdToRemove) => {
    const response = await apiClient.delete(`${SHARES_API_URL}/${fileId}/user`, { data: userIdToRemove ? { userIdToRemove } : {} });
    return response.data;
};


/**
 * Removes the current user's access from multiple shared files.
 * @route DELETE /api/files/shares/bulk-remove
 * @param {string[]} fileIds - An array of file IDs to remove access from.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the server's success message.
 */
/**
 * Removes the current user's access from multiple shared files.
 * @route POST /api/shares/bulk-remove
 * @param {string[]} fileIds - An array of file IDs to remove access from.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the server's success message.
 */
const bulkRemoveAccess = async (fileIds) => {
    const response = await apiClient.post(`${SHARES_API_URL}/bulk-remove`, { fileIds });
    return response.data;
};


/**
 * Shares a file with an entire class based on subject, batch, and section.
 * @route POST /api/college/files/:fileId/share-class
 * @param {object} data - The data payload, including { fileId, classData }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
/**
 * Shares a file with an entire class based on subject, batch, and section.
 * @route POST /api/shares/:fileId/class
 * @param {object} data - The data payload, including { fileId, classData }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the updated file object.
 */
const shareWithClass = async (data) => {
    const { fileId, classData } = data;
    const response = await apiClient.post(`${SHARES_API_URL}/${fileId}/class`, classData);
    return response.data;
};

/**
 * Get all shares for a specific file.
 * @route GET /api/shares/:fileId
 */
const getFileShares = async (fileId) => {
    const response = await apiClient.get(`${SHARES_API_URL}/${fileId}`);
    return response.data;
};

/**
 * Get files shared with the current user.
 * @route GET /api/shares/shared-with-me
 * @param {string} token
 * @returns {Promise<Array>} list of files
 */
const getFilesSharedWithMe = async () => {
    const response = await apiClient.get(`${SHARES_API_URL}/shared-with-me`);
    return response.data;
};


/**
 * Creates a new folder.
 * @param {object} folderData - The folder data, including folderName and parentId.
 * @route POST /api/folders/
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to the newly created folder object.
 */
const createFolder = async (folderData) => {
    const response = await apiClient.post(FOLDER_API_URL, folderData);
    return response.data;
};

/**
 * Get folder details with statistics.
 * @route GET /api/folders/:id
 */
const getFolderDetails = async (folderId) => {
    const response = await apiClient.get(`${FOLDER_API_URL}/${folderId}`);
    return response.data;
};

/**
 * Move an item (file or folder) into another folder.
 * @route PATCH /api/folders/:id/move
 */
const moveItem = async (folderId, moveData) => {
    const response = await apiClient.patch(`${FOLDER_API_URL}/${folderId}/move`, moveData);
    return response.data;
};

/**
 * Rename a folder.
 * @route PATCH /api/folders/:id/rename
 */
const renameFolder = async (folderId, renameData) => {
    const response = await apiClient.patch(`${FOLDER_API_URL}/${folderId}/rename`, renameData);
    return response.data;
};

/**
 * Delete a folder and its contents.
 * @route DELETE /api/folders/:id
 */
const deleteFolder = async (folderId) => {
    const response = await apiClient.delete(`${FOLDER_API_URL}/${folderId}`);
    return response.data;
};


/**
 * Fetches the current user's storage usage statistics from the API.
 * @param {string} token - The user's JWT for authorization.
 * @returns {Promise<object>} A promise that resolves to an object containing the user's storage data,
 * including usageBytes, quotaBytes, fileCount, and fileLimit.
 */
const getStorageUsage = async () => {
    // Fix: ensure slash between USER_API_URL and "me" so we call /users/me/storage
    const response = await apiClient.get(`${USER_API_URL}/me/storage`);
    return response.data;
};


const fileService = {
    uploadFiles, getFiles,

    deleteFile, bulkDeleteFiles,
    getDownloadLink, bulkDownloadFiles,

    shareFile, manageShareAccess,
    shareWithClass, bulkRemoveAccess,
    getStorageUsage,
    createFolder,
    createPublicShare,
    revokePublicShare,

};

export default fileService;