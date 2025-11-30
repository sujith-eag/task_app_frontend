import apiClient from '../../../app/apiClient.js';

const MANAGEMENT_API_URL = '/admin/management';
const APPLICATIONS_API_URL = '/admin/applications';



// --- Application & User Management ---

/**
 * Fetches all pending student applications that require review.
 * Supports pagination and search.
 * @route GET /api/admin/applications
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {string} [params.search=''] - Search term for name, email, or USN
 * @returns {Promise<Object>} Paginated applications with pagination metadata
 */
const getPendingApplications = async (params = {}) => {
    const { page = 1, limit = 20, search = '' } = params;
    const response = await apiClient.get(`${APPLICATIONS_API_URL}`, {
        params: { page, limit, search }
    });
    return response.data;
};


/**
 * Approves or rejects a specific student application.
 * @route PATCH /api/admin/applications/:userId/review
 * @param {string} userId - The ID of the applicant user.
 * @param {string} action - The action to perform ('approve' or 'reject').
 * @returns {Promise<object>} A success confirmation message.
 */
const reviewApplication = async (userId, action) => {
    const body = { action };
    const response = await apiClient.patch(`${APPLICATIONS_API_URL}/${userId}/review`, body);
    return response.data;
};


/**
 * Retrieves a list of users, filtered by their role.
 * Supports pagination and search.
 * @route GET /api/admin/management/users
 * @param {string} role - The role to filter by (e.g., 'student', 'user').
 * @param {Object} params - Query parameters
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.limit=20] - Items per page
 * @param {string} [params.search=''] - Search term for name, email, or USN
 * @returns {Promise<Object>} Paginated users with pagination metadata
 */
const getUsersByRole = async (role, params = {}) => {
    const { page = 1, limit = 20, search = '' } = params;
    const response = await apiClient.get(`${MANAGEMENT_API_URL}/users`, { 
        params: { role, page, limit, search } 
    });
    return response.data;
};


/**
 * Promotes a regular user to a faculty (teacher) role.
 * @route PATCH /api/admin/management/users/:userId/promote
 * @param {string} userId - The ID of the user to be promoted.
 * @param {object} facultyData - The new faculty details for the user.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated user object.
 */
const promoteToFaculty = async (userId, facultyData) => {
    const response = await apiClient.patch(`${MANAGEMENT_API_URL}/users/${userId}/promote`, facultyData);
    return response.data;
};


/**
 * Updates the profile details for a specific student.
 * @route PUT /api/admin/management/students/:studentId
 * @param {string} studentId - The ID of the student to update.
 * @param {object} studentData - The student fields to be updated.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated student user object.
 */
const updateStudentDetails = async (studentId, studentData) => {
    const response = await apiClient.put(`${MANAGEMENT_API_URL}/students/${studentId}`, studentData);
    return response.data;
};


/**
 * Overwrites the list of subjects a student is enrolled in.
 * @route PUT /api/admin/management/students/:studentId/enrollment
 * @param {string} studentId - The ID of the student.
 * @param {Array<string>} subjectIds - An array of subject IDs for enrollment.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated student object with new enrollments.
 */
const updateStudentEnrollment = async (studentId, subjectIds) => {
    const response = await apiClient.put(`${MANAGEMENT_API_URL}/students/${studentId}/enrollment`, { subjectIds });
    return response.data;
};


export const userService = {
    getPendingApplications,
    reviewApplication,
    getUsersByRole,
    promoteToFaculty,
    updateStudentDetails,
    updateStudentEnrollment,
};