import apiClient from '../../../app/apiClient.js';

const REPORTS_API_URL = '/admin/reports';


// --- Reporting ---

/**
 * Gets aggregated attendance statistics, with optional filtering.
 * @route GET /api/admin/reports/attendance-stats
 * @param {object} filters - Optional query params (e.g., { teacherId, subjectId }).
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing aggregated attendance data.
 */
const getAttendanceStats = async (filters) => {
    const response = await apiClient.get(`${REPORTS_API_URL}/attendance-stats`, { params: filters });
    return response.data;
};


/**
 * Gets an aggregated summary of feedback, with optional filtering.
 * @route GET /api/admin/reports/feedback-summary
 * @param {object} filters - Optional query params (e.g., { teacherId, subjectId }).
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing the aggregated feedback summary.
 */
const getFeedbackSummary = async (filters) => {
    const response = await apiClient.get(`${REPORTS_API_URL}/feedback-summary`, { params: filters });
    return response.data;
};


/**
 * Retrieves a detailed, 360-degree feedback report for a single class session.
 * This report includes session details, aggregated anonymous student feedback, and the teacher's own reflection.
 * @route   GET /api/admin/reports/feedback-report/:classSessionId
 * @param   {string} classSessionId - The unique ID of the class session to get the report for.
 * @param   {string} token - The admin's or HOD's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a comprehensive report object.
 */
const getFeedbackReport = async (classSessionId) => {
    const response = await apiClient.get(`${REPORTS_API_URL}/feedback-report/${classSessionId}`);
    return response.data;
};


/**
 * Gets a detailed performance report for a single teacher.
 * @route GET /api/admin/reports/teacher/:teacherId
 * @param {string} teacherId - The ID of the teacher.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing the teacher's performance data.
 */
const getTeacherReport = async (teacherId) => {
    const response = await apiClient.get(`${REPORTS_API_URL}/teacher/${teacherId}`);
    return response.data;
};



/**
 * Gets a detailed attendance report for a single student.
 * @route GET /api/admin/reports/student/:studentId
 * @param {string} studentId - The ID of the student.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing the student's attendance data.
 */
const getStudentReport = async (studentId) => {
    const response = await apiClient.get(`${REPORTS_API_URL}/student/${studentId}`);
    return response.data;
};


export const reportingService = {
    getAttendanceStats,
    getFeedbackSummary,
    getFeedbackReport,
    getTeacherReport,
    getStudentReport,
};
