import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/admin/`;

// --- Subject Management ---

// Get all subjects
const getSubjects = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'subjects', config);
    return response.data;
};

// Create a new subject
const createSubject = async (subjectData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'subjects', subjectData, config);
    return response.data;
};

// --- Application Management ---

// Get all pending student applications
const getPendingApplications = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'applications', config);
    return response.data;
};

// Review (approve/reject) a student application
const reviewApplication = async (userId, action, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const body = { action }; // e.g., { action: 'approve' }
    const response = await axios.patch(`${API_URL}applications/${userId}/review`, body, config);
    return response.data;
};

// --- Reporting ---

// Get aggregated attendance statistics with optional filters
const getAttendanceStats = async (filters, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filters, // Axios will format this as query string: ?teacherId=...
    };
    const response = await axios.get(API_URL + 'attendance-stats', config);
    return response.data;
};

// Get aggregated feedback summary with optional filters
const getFeedbackSummary = async (filters, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
    };
    const response = await axios.get(API_URL + 'feedback-summary', config);
    return response.data;
};

// --- Add or update a teacher's subject assignments ---
const updateTeacherAssignments = async (data, token) => {
    const { teacherId, assignmentData } = data;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${API_URL}teachers/${teacherId}/assignments`, assignmentData, config);
    return response.data;
};



const adminService = {
    getSubjects,
    createSubject,
    getPendingApplications,
    reviewApplication,
    getAttendanceStats,
    getFeedbackSummary,
    updateTeacherAssignments,
};


export default adminService;