import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/admin/`;
const SUBJECTS_API_URL = `${API_BASE_URL}/college/subjects/`;
const COLLEGE_API_URL = `${API_BASE_URL}/college/`;


// --- Subject Management ---

/**
 * Retrieves a list of all academic subjects.
 * @route GET /api/college/subjects/
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<Array<object>>} An array of subject objects.
 */
const getSubjects = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
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
 * @route PUT /api/college/students/:studentId
 * @param {string} studentId - The ID of the student to update.
 * @param {object} studentData - The student fields to be updated.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated student user object.
 */
const updateStudentDetails = async (studentId, studentData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${COLLEGE_API_URL}students/${studentId}`, studentData, config);
    return response.data;
};

/**
 * Overwrites the list of subjects a student is enrolled in.
 * @route PUT /api/college/students/:studentId/enrollment
 * @param {string} studentId - The ID of the student.
 * @param {Array<string>} subjectIds - An array of subject IDs for enrollment.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated student object with new enrollments.
 */
const updateStudentEnrollment = async (studentId, subjectIds, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${COLLEGE_API_URL}students/${studentId}/enrollment`, { subjectIds }, config);
    return response.data;
};

// --- Teacher & Assignment Management ---

/**
 * Retrieves a list of all users with the 'teacher' role.
 * @route GET /api/admin/teachers
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<Array<object>>} An array of teacher user objects.
 */
const getAllTeachers = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}teachers`, config);
    return response.data;
};

/**
 * Adds or updates subject assignments for a teacher.
 * @route POST /api/admin/teachers/:teacherId/assignments
 * @param {object} data - Contains teacherId and assignmentData.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} The updated teacher object.
 */
const updateTeacherAssignments = async (data, token) => {
    const { teacherId, assignmentData } = data;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}teachers/${teacherId}/assignments`, assignmentData, config);
    return response.data;
};

/**
 * Removes a specific subject assignment from a teacher.
 * @route DELETE /api/admin/teachers/:teacherId/assignments/:assignmentId
 * @param {object} data - Contains teacherId and assignmentId.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} A success confirmation message.
 */
const deleteTeacherAssignment = async (data, token) => {
    const { teacherId, assignmentId } = data;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${API_URL}teachers/${teacherId}/assignments/${assignmentId}`, config);
    return response.data;
};

// --- Reporting ---

/**
 * Gets aggregated attendance statistics, with optional filtering.
 * @route GET /api/admin/attendance-stats
 * @param {object} filters - Optional query params (e.g., { teacherId, subjectId }).
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing aggregated attendance data.
 */
const getAttendanceStats = async (filters, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
    };
    const response = await axios.get(API_URL + 'attendance-stats', config);
    return response.data;
};

/**
 * Gets an aggregated summary of feedback, with optional filtering.
 * @route GET /api/admin/feedback-summary
 * @param {object} filters - Optional query params (e.g., { teacherId, subjectId }).
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing the aggregated feedback summary.
 */
const getFeedbackSummary = async (filters, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
    };
    const response = await axios.get(API_URL + 'feedback-summary', config);
    return response.data;
};

const adminService = {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    getPendingApplications,
    reviewApplication,
    getUsersByRole,
    promoteToFaculty,
    updateStudentDetails,
    updateStudentEnrollment,
    getAllTeachers,
    updateTeacherAssignments,
    deleteTeacherAssignment,
    getAttendanceStats,
    getFeedbackSummary,
};

export default adminService;