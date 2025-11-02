import apiClient from '../../../app/apiClient.js';

const MANAGEMENT_API_URL = '/admin/management';
const TEACHER_ASSIGNMENTS_API_URL = '/admin/teacher-assignments';


// --- Teacher & Assignment Management ---

/**
 * Retrieves a list of all users with the 'teacher' role.
 * @route GET /api/admin/management/teachers
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<Array<object>>} An array of teacher user objects.
 */
const getAllTeachers = async () => {
    const response = await apiClient.get(`${MANAGEMENT_API_URL}/teachers`);
    return response.data;
};


/**
 * Adds or updates subject assignments for a teacher.
 * @route POST /api/admin/teacher-assignments/:teacherId
 * @param {object} data - Contains teacherId and assignmentData.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated teacher object.
 */
const updateTeacherAssignments = async (data) => {
    const { teacherId, assignmentData } = data;
    const response = await apiClient.post(`${TEACHER_ASSIGNMENTS_API_URL}/${teacherId}`, assignmentData);
    return response.data;
};


/**
 * Removes a specific subject assignment from a teacher.
 * @route DELETE /api/admin/teacher-assignments/:teacherId/:assignmentId
 * @param {object} data - Contains teacherId and assignmentId.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} A success confirmation message.
 */
const deleteTeacherAssignment = async (data) => {
    const { teacherId, assignmentId } = data;
    const response = await apiClient.delete(`${TEACHER_ASSIGNMENTS_API_URL}/${teacherId}/${assignmentId}`);
    return response.data;
};



export const teacherService = {
    getAllTeachers,
    updateTeacherAssignments,
    deleteTeacherAssignment,
};