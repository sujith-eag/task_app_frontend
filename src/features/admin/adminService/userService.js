import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/admin/`;



// --- Application & User Management ---

/**
 * Fetches all pending student applications that require review.
 * @route GET /api/admin/applications
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<Array<object>>} An array of user objects with application data.
 */
const getPendingApplications = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'applications', config);
    return response.data;
};


/**
 * Approves or rejects a specific student application.
 * @route PATCH /api/admin/applications/:userId/review
 * @param {string} userId - The ID of the applicant user.
 * @param {string} action - The action to perform ('approve' or 'reject').
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} A success confirmation message.
 */
const reviewApplication = async (userId, action, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const body = { action };
    const response = await axios.patch(`${API_URL}applications/${userId}/review`, body, config);
    return response.data;
};


/**
 * Retrieves a list of users, filtered by their role.
 * @route GET /api/admin/users
 * @param {string} role - The role to filter by (e.g., 'student', 'user').
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<Array<object>>} An array of user objects matching the role.
 */
const getUsersByRole = async (role, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { role }
    };
    const response = await axios.get(API_URL + 'users', config);
    return response.data;
};


/**
 * Promotes a regular user to a faculty (teacher) role.
 * @route PATCH /api/admin/users/:userId/promote
 * @param {string} userId - The ID of the user to be promoted.
 * @param {object} facultyData - The new faculty details for the user.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated user object.
 */
const promoteToFaculty = async (userId, facultyData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.patch(`${API_URL}users/${userId}/promote`, facultyData, config);
    return response.data;
};


/**
 * Updates the profile details for a specific student.
 * @route PUT /api/admin/students/:studentId
 * @param {string} studentId - The ID of the student to update.
 * @param {object} studentData - The student fields to be updated.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated student user object.
 */
const updateStudentDetails = async (studentId, studentData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}students/${studentId}`, studentData, config);
    return response.data;
};


/**
 * Overwrites the list of subjects a student is enrolled in.
 * @route PUT /api/admin/students/:studentId/enrollment
 * @param {string} studentId - The ID of the student.
 * @param {Array<string>} subjectIds - An array of subject IDs for enrollment.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated student object with new enrollments.
 */
const updateStudentEnrollment = async (studentId, subjectIds, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${API_URL}students/${studentId}/enrollment`, { subjectIds }, config);
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