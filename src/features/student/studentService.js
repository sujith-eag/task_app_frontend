import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/student/`;

// Mark attendance using a class code
const markAttendance = async (attendanceData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // attendanceData = { attendanceCode: '12345678' }
    const response = await axios.post(API_URL + 'attendance/mark', attendanceData, config);
    return response.data;
};

// Submit anonymous feedback for a class
const submitFeedback = async (feedbackData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // feedbackData = { classSessionId, rating, comment }
    const response = await axios.post(API_URL + 'feedback', feedbackData, config);
    return response.data;
};

// Get the student's personal dashboard statistics
const getStudentDashboardStats = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'dashboard-stats', config);
    return response.data;
};

const studentService = {
    markAttendance,
    submitFeedback,
    getStudentDashboardStats,
};

export default studentService;