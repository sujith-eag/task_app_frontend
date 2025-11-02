import apiClient from '../../../app/apiClient.js';

// Keep endpoints relative to apiClient.baseURL
const SUBJECTS_API_URL = '/admin/subjects/';


// --- Subject Management ---

/**
 * Retrieves a list of all academic subjects. with optional semester filter
 * @route GET /api/admin/subjects/
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<Array<object>>} An array of subject objects.
 */
const getSubjects = async (params={}) => {
    const response = await apiClient.get(SUBJECTS_API_URL, { params });
    return response.data;
};


/**
 * Creates a new subject.
 * @route POST /api/admin/subjects/
 * @param {object} subjectData - The data for the new subject { name, code, ... }.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The newly created subject object.
 */
const createSubject = async (subjectData) => {
    const response = await apiClient.post(SUBJECTS_API_URL, subjectData);
    return response.data;
};


/**
 * Updates an existing subject's details.
 * @route PUT /api/admin/subjects/:id
 * @param {object} subjectData - The subject data to update, including its 'id'.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated subject object.
 */
const updateSubject = async (subjectData) => {
    const { id, ...data } = subjectData;
    const response = await apiClient.put(`${SUBJECTS_API_URL}${id}`, data);
    return response.data;
};


/**
 * Deletes a subject by its ID.
 * @route DELETE /api/admin/subjects/:subjectId
 * @param {string} subjectId - The ID of the subject to delete.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} A success confirmation object.
 */
const deleteSubject = async (subjectId) => {
    const response = await apiClient.delete(`${SUBJECTS_API_URL}${subjectId}`);
    return response.data;
};


export const subjectService = {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
};