import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SUBJECTS_API_URL = `${API_BASE_URL}/college/subjects/`;


// --- Subject Management ---

/**
 * Retrieves a list of all academic subjects. with optional semester filter
 * @route GET /api/college/subjects/
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<Array<object>>} An array of subject objects.
 */
const getSubjects = async (token, params={}) => {
    const config = { 
        headers: { Authorization: `Bearer ${token}` }, 
        params // Passing semester as query parameter
    };
    const response = await axios.get(SUBJECTS_API_URL, config);
    return response.data;
};


/**
 * Creates a new subject.
 * @route POST /api/college/subjects/
 * @param {object} subjectData - The data for the new subject { name, code, ... }.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The newly created subject object.
 */
const createSubject = async (subjectData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(SUBJECTS_API_URL, subjectData, config);
    return response.data;
};


/**
 * Updates an existing subject's details.
 * @route PUT /api/college/subjects/:id
 * @param {object} subjectData - The subject data to update, including its 'id'.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated subject object.
 */
const updateSubject = async (subjectData, token) => {
    const { id, ...data } = subjectData;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${SUBJECTS_API_URL}${id}`, data, config);
    return response.data;
};


/**
 * Deletes a subject by its ID.
 * @route DELETE /api/college/subjects/:subjectId
 * @param {string} subjectId - The ID of the subject to delete.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} A success confirmation object.
 */
const deleteSubject = async (subjectId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${SUBJECTS_API_URL}${subjectId}`, config);
    return response.data;
};


export const subjectService = {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
};