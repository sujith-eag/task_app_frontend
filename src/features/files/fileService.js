import apiClient from '../../app/apiClient.js';

const API_URL = '/files';
const FOLDER_API_URL = '/folders';
const USER_API_URL = '/users';
const SHARES_API_URL = '/shares';



/**
 * Create a temporary public share for a file.
 * Route: POST /api/shares/:fileId/public
 * Auth: Browser clients use the httpOnly `jwt` cookie (apiClient uses withCredentials).
 * @param {object} shareData - { fileId, duration }
 * @returns {Promise<object>} { code, expiresAt }
 */
const createPublicShare = async ({ fileId, duration }) => {
    const response = await apiClient.post(`${SHARES_API_URL}/${fileId}/public`, { duration });
    return response.data;
};


/**
 * Revoke a public share for a file.
 * Route: DELETE /api/shares/:fileId/public
 * Auth: protected
 * @param {string} fileId
 * @returns {Promise<object>} server response
 */
const revokePublicShare = async (fileId) => {
    const response = await apiClient.delete(`${SHARES_API_URL}/${fileId}/public`);
    return response.data;
};


/**
 * Upload one or more files.
 * Route: POST /api/files/upload
 * Content-Type: multipart/form-data
 * Auth: protected (cookie-based)
 * @param {FormData} filesFormData
 * @returns {Promise<Array<Object>>} created file documents
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
 * List files/folders for the current user in a directory.
 * Route: GET /api/files?parentId={id}
 * Auth: protected
 * @param {string|null} parentId
 * @returns {Promise<Object>} { files, currentFolder, breadcrumbs }
 */
const getFiles = async (parentId) => {
    const response = await apiClient.get(`${API_URL}`, { params: parentId ? { parentId } : {} });
    return response.data;
};


/**
 * Get a pre-signed S3 download URL for a file.
 * Route: GET /api/files/:fileId/download
 * Auth: protected (must have read access)
 * @param {string} fileId
 * @returns {Promise<object>} { url }
 */
const getDownloadLink = async (fileId) => {
    const response = await apiClient.get(`${API_URL}/${fileId}/download`);
    return response.data;
};



/**
 * Trigger a bulk download (ZIP) for multiple files.
 * Preferred: call POST /api/files/bulk-download with JSON { fileIds } and responseType 'blob'.
 * Fallback: submits a hidden form POST to /api/files/bulk-download with a JSON-stringified `fileIds` field so browsers send cookies.
 * Route: POST /api/files/bulk-download
 * Auth: protected
 * @param {string[]} fileIds
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
 * Delete a single file.
 * Route: DELETE /api/files/:id
 * Auth: protected, owner-only
 * @param {string} fileId
 * @returns {Promise<object>} { fileId }
 */
const deleteFile = async (fileId) => {
    await apiClient.delete(`${API_URL}/${fileId}`);
    return { fileId };
};


/**
 * Bulk delete files (owner-only).
 * Route: DELETE /api/files
 * Auth: protected
 * @param {string[]} fileIds
 * @returns {Promise<object>} server response
 */
const bulkDeleteFiles = async (fileIds) => {
    const response = await apiClient.delete(`${API_URL}`, { data: { fileIds } });
    return { ...response.data, ids: fileIds };
};


/**
 * Share a file with a specific user.
 * Route: POST /api/shares/:fileId/user
 * Auth: protected
 * @param {string} fileId
 * @param {string} userIdToShareWith
 * @param {string|null} expiresAt
 * @returns {Promise<object>} updated file/share info
 */
const shareFile = async (fileId, userIdToShareWith, expiresAt = null) => {
    const body = { userIdToShareWith };
    if (expiresAt) body.expiresAt = expiresAt;
    const response = await apiClient.post(`${SHARES_API_URL}/${fileId}/user`, body);
    return response.data;
};


/**
 * Remove a user's access to a file (or remove self).
 * Route: DELETE /api/shares/:fileId/user
 * Auth: protected
 * @param {string} fileId
 * @param {string|null} userIdToRemove
 * @returns {Promise<object>} server response
 */
const manageShareAccess = async (fileId, userIdToRemove) => {
    const response = await apiClient.delete(`${SHARES_API_URL}/${fileId}/user`, { data: userIdToRemove ? { userIdToRemove } : {} });
    return response.data;
};


/**
 * Bulk remove access from multiple shared files.
 * Route: POST /api/shares/bulk-remove
 * Auth: protected
 * @param {string[]} fileIds
 * @returns {Promise<object>} server response
 */
const bulkRemoveAccess = async (fileIds) => {
    const response = await apiClient.post(`${SHARES_API_URL}/bulk-remove`, { fileIds });
    return response.data;
};


/**
 * Share a file with a whole class (batch/section/semester).
 * Route: POST /api/shares/:fileId/class
 * Auth: protected
 * @param {object} data - { fileId, classData }
 * @returns {Promise<object>} server response
 */
const shareWithClass = async (data) => {
    const { fileId, classData } = data;
    const response = await apiClient.post(`${SHARES_API_URL}/${fileId}/class`, classData);
    return response.data;
};

/**
 * Get all shares for a file.
 * Route: GET /api/shares/:fileId
 * Auth: protected
 */
const getFileShares = async (fileId) => {
    const response = await apiClient.get(`${SHARES_API_URL}/${fileId}`);
    return response.data;
};

/**
 * Get files shared with the current user.
 * Route: GET /api/shares/shared-with-me
 * Auth: protected
 * @returns {Promise<Array>} list of file/share objects
 */
const getFilesSharedWithMe = async () => {
    const response = await apiClient.get(`${SHARES_API_URL}/shared-with-me`);
    return response.data;
};


/**
 * Create a new folder.
 * Route: POST /api/folders
 * Auth: protected
 * @param {object} folderData - { folderName, parentId }
 * @returns {Promise<object>} created folder
 */
const createFolder = async (folderData) => {
    const response = await apiClient.post(FOLDER_API_URL, folderData);
    return response.data;
};

/**
 * Get folder details and stats.
 * Route: GET /api/folders/:id
 * Auth: protected
 */
const getFolderDetails = async (folderId) => {
    const response = await apiClient.get(`${FOLDER_API_URL}/${folderId}`);
    return response.data;
};

/**
 * Move an item into another folder.
 * Route: PATCH /api/folders/:id/move
 * Auth: protected, owner-only where applicable
 */
const moveItem = async (folderId, moveData) => {
    const response = await apiClient.patch(`${FOLDER_API_URL}/${folderId}/move`, moveData);
    return response.data;
};

/**
 * Rename a folder.
 * Route: PATCH /api/folders/:id/rename
 * Auth: protected, owner-only
 */
const renameFolder = async (folderId, renameData) => {
    const response = await apiClient.patch(`${FOLDER_API_URL}/${folderId}/rename`, renameData);
    return response.data;
};

/**
 * Delete a folder and its contents.
 * Route: DELETE /api/folders/:id
 * Auth: protected, owner-only
 */
const deleteFolder = async (folderId) => {
    const response = await apiClient.delete(`${FOLDER_API_URL}/${folderId}`);
    return response.data;
};


/**
 * Get current user's storage usage: GET /api/users/me/storage
 * Auth: protected
 * @returns {Promise<object>} { usageBytes, quotaBytes, fileCount, fileLimit }
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