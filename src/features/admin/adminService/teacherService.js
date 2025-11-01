import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/admin/`;
const MANAGEMENT_API_URL = `${API_BASE_URL}/admin/management`;
const TEACHER_ASSIGNMENTS_API_URL = `${API_BASE_URL}/admin/teacher-assignments`;


// --- Teacher & Assignment Management ---

/**
 * Retrieves a list of all users with the 'teacher' role.
 * @route GET /api/admin/management/teachers
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<Array<object>>} An array of teacher user objects.
 */
const getAllTeachers = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${MANAGEMENT_API_URL}/teachers`, config);
    return response.data;
};


/**
 * Adds or updates subject assignments for a teacher.
 * @route POST /api/admin/teacher-assignments/:teacherId
 * @param {object} data - Contains teacherId and assignmentData.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated teacher object.
 */
const updateTeacherAssignments = async (data, token) => {
    const { teacherId, assignmentData } = data;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${TEACHER_ASSIGNMENTS_API_URL}/${teacherId}`, assignmentData, config);
    return response.data;
};


/**
 * Removes a specific subject assignment from a teacher.
 * @route DELETE /api/admin/teacher-assignments/:teacherId/:assignmentId
 * @param {object} data - Contains teacherId and assignmentId.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} A success confirmation message.
 */
const deleteTeacherAssignment = async (data, token) => {
    const { teacherId, assignmentId } = data;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${TEACHER_ASSIGNMENTS_API_URL}/${teacherId}/${assignmentId}`, config);
    return response.data;
};



export const teacherService = {
    getAllTeachers,
    updateTeacherAssignments,
    deleteTeacherAssignment,
};