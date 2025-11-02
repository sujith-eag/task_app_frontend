import apiClient from '../../app/apiClient.js';

// Relative endpoints; apiClient.baseURL supplies the API root (e.g. '/api' or full URL)
const API_URL = '/college/students/';


/**
 * Marks attendance for the authenticated student using a class code.
 * @route POST /api/college/students/attendance/mark
 * @param {object} attendanceData - The attendance data containing the code, e.g., { attendanceCode: '12345678' }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation message.
 */
const markAttendance = async (attendanceData) => {
    const response = await apiClient.post(API_URL + 'attendance/mark', attendanceData);
    return response.data;
};


/**
 * Submits anonymous, detailed feedback for a specific class session.
 * @route POST /api/college/students/feedback
 * @param {object} feedbackData - The feedback payload, e.g., { classSessionId, ratings: { clarity, ... }, positiveFeedback, improvementSuggestions }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation message.
 */
const submitFeedback = async (feedbackData) => {
    const response = await apiClient.post(API_URL + 'feedback', feedbackData);
    return response.data;
};


/**
 * Retrieves the personal dashboard statistics for the authenticated student.
 * @route GET /api/college/students/dashboard-stats
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of statistics objects.
 */
const getStudentDashboardStats = async () => {
    const response = await apiClient.get(API_URL + 'dashboard-stats');
    return response.data;
};


/**
 * Retrieves past class sessions for the authenticated student that are awaiting feedback.
 * @route GET /api/college/students/sessions-for-feedback
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of class session objects.
 */
const getSessionsForFeedback = async () => {
    const response = await apiClient.get(API_URL + 'sessions-for-feedback');
    return response.data;
};


/**
 * Get the profile details for the logged-in student.
 * @route GET /api/college/students/me/profile
 * @param {string} token - The user's JWT for authentication.
 * @returns  Subject name, Subject code and omplete studentdetail
 */
const getStudentProfile = async () => {
    const response = await apiClient.get(API_URL + 'me/profile');
    return response.data;
};


const studentService = {
    markAttendance,
    submitFeedback,
    getStudentDashboardStats,
    getSessionsForFeedback,
    getStudentProfile,
};

export default studentService;