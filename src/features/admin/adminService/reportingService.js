import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/admin/`;
const REPORTS_API_URL = `${API_BASE_URL}/admin/reports`;


// --- Reporting ---

/**
 * Gets aggregated attendance statistics, with optional filtering.
 * @route GET /api/admin/reports/attendance-stats
 * @param {object} filters - Optional query params (e.g., { teacherId, subjectId }).
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing aggregated attendance data.
 */
const getAttendanceStats = async (filters, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
    };
    const response = await axios.get(`${REPORTS_API_URL}/attendance-stats`, config);
    return response.data;
};


/**
 * Gets an aggregated summary of feedback, with optional filtering.
 * @route GET /api/admin/reports/feedback-summary
 * @param {object} filters - Optional query params (e.g., { teacherId, subjectId }).
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing the aggregated feedback summary.
 */
const getFeedbackSummary = async (filters, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
    };
    const response = await axios.get(`${REPORTS_API_URL}/feedback-summary`, config);
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
const getFeedbackReport = async (classSessionId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${REPORTS_API_URL}/feedback-report/${classSessionId}`, config);
    return response.data;
};


/**
 * Gets a detailed performance report for a single teacher.
 * @route GET /api/admin/reports/teacher/:teacherId
 * @param {string} teacherId - The ID of the teacher.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing the teacher's performance data.
 */
const getTeacherReport = async (teacherId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${REPORTS_API_URL}/teacher/${teacherId}`, config);
    return response.data;
};



/**
 * Gets a detailed attendance report for a single student.
 * @route GET /api/admin/reports/student/:studentId
 * @param {string} studentId - The ID of the student.
 * @param {string} token - The JWT for authentication.
 * @returns {Promise<object>} An object containing the student's attendance data.
 */
const getStudentReport = async (studentId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${REPORTS_API_URL}/student/${studentId}`, config);
    return response.data;
};


export const reportingService = {
    getAttendanceStats,
    getFeedbackSummary,
    getFeedbackReport,
    getTeacherReport,
    getStudentReport,
};
