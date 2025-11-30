import apiClient from '../../../app/apiClient.js';

const DASHBOARD_API_URL = '/admin/dashboard';

// ============================================================================
// Dashboard Service
// ============================================================================

/**
 * Gets dashboard overview statistics including counts and trends
 * @route GET /api/admin/dashboard/stats
 * @returns {Promise<object>} Dashboard statistics with students, teachers, subjects, etc.
 */
const getDashboardStats = async () => {
  const response = await apiClient.get(`${DASHBOARD_API_URL}/stats`);
  return response.data;
};

/**
 * Gets 7-day attendance trend data for charts
 * @route GET /api/admin/dashboard/attendance-trend
 * @returns {Promise<Array>} Daily attendance data with date, total, present, percentage
 */
const getAttendanceTrend = async () => {
  const response = await apiClient.get(`${DASHBOARD_API_URL}/attendance-trend`);
  return response.data;
};

/**
 * Gets feedback rating distribution for charts
 * @route GET /api/admin/dashboard/feedback-distribution
 * @returns {Promise<object>} Summary with average ratings and star breakdown
 */
const getFeedbackDistribution = async () => {
  const response = await apiClient.get(`${DASHBOARD_API_URL}/feedback-distribution`);
  return response.data;
};

/**
 * Gets recent activity for the activity feed
 * @route GET /api/admin/dashboard/recent-activity
 * @param {number} limit - Maximum number of activities to return (default: 10)
 * @returns {Promise<Array>} Recent activities with type, action, user, timestamp
 */
const getRecentActivity = async (limit = 10) => {
  const response = await apiClient.get(`${DASHBOARD_API_URL}/recent-activity`, {
    params: { limit },
  });
  return response.data;
};

/**
 * Gets student distribution by semester for charts
 * @route GET /api/admin/dashboard/students-by-semester
 * @returns {Promise<Array>} Student count grouped by semester
 */
const getStudentsBySemester = async () => {
  const response = await apiClient.get(`${DASHBOARD_API_URL}/students-by-semester`);
  return response.data;
};

export const dashboardService = {
  getDashboardStats,
  getAttendanceTrend,
  getFeedbackDistribution,
  getRecentActivity,
  getStudentsBySemester,
};
