import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/admin/`;


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

export const reportingService = {
    getAttendanceStats,
    getFeedbackSummary,
};