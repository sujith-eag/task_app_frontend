import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/college/students/`;


/**
 * Marks attendance for the authenticated student using a class code.
 * @route POST /api/college/students/attendance/mark
 * @param {object} attendanceData - The attendance data containing the code, e.g., { attendanceCode: '12345678' }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation message.
 */
const markAttendance = async (attendanceData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'attendance/mark', attendanceData, config);
    return response.data;
};


/**
 * Submits anonymous, detailed feedback for a specific class session.
 * @route POST /api/college/students/feedback
 * @param {object} feedbackData - The feedback payload, e.g., { classSessionId, ratings: { clarity, ... }, positiveFeedback, improvementSuggestions }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation message.
 */
const submitFeedback = async (feedbackData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'feedback', feedbackData, config);
    return response.data;
};


/**
 * Retrieves the personal dashboard statistics for the authenticated student.
 * @route GET /api/college/students/dashboard-stats
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of statistics objects.
 */
const getStudentDashboardStats = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'dashboard-stats', config);
    return response.data;
};


/**
 * Retrieves past class sessions for the authenticated student that are awaiting feedback.
 * @route GET /api/college/students/sessions-for-feedback
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of class session objects.
 */
const getSessionsForFeedback = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'sessions-for-feedback', config);
    return response.data;
};


const studentService = {
    markAttendance,
    submitFeedback,
    getStudentDashboardStats,
    getSessionsForFeedback
};

export default studentService;