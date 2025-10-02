import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/college/teachers/`;



// --- Submit a teacher's reflection for a class session ---
const createSessionReflection = async (reflectionData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'session-reflection', reflectionData, config);
    return response.data;
};

// --- Get the feedback summary for a specific session ---
const getFeedbackSummaryForSession = async (sessionId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}feedback-summary/${sessionId}`, config);
    return response.data;
};



/**
 * Retrieves the necessary data for a teacher to create a class (e.g., their assigned subjects).
 * @route GET /api/college/teachers/class-creation-data
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing class creation data.
 */
const getClassCreationData = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'class-creation-data', config);
    return response.data;
};

/**
 * Creates a new class session for attendance.
 * @route POST /api/college/teachers/class-sessions
 * @param {object} sessionData - The data for the new session { subject, section, etc. }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the newly created class session object.
 */
const createClassSession = async (sessionData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL + 'class-sessions', sessionData, config);
    return response.data;
};

/**
 * Retrieves a history of the authenticated teacher's past class sessions.
 * @route GET /api/college/teachers/class-sessions
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of past session objects.
 */
const getTeacherSessionsHistory = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + 'class-sessions', config);
    return response.data;
};

/**
 * Retrieves the current attendance roster for a specific, active class session.
 * @route GET /api/college/teachers/class-sessions/:sessionId/roster
 * @param {string} sessionId - The ID of the active class session.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to the session's attendance roster.
 */
const getSessionRoster = async (sessionId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${API_URL}class-sessions/${sessionId}/roster`, config);
    return response.data;
};

/**
 * Finalizes the attendance for a session, including any manual overrides by the teacher.
 * @route PATCH /api/college/teachers/class-sessions/:sessionId/roster
 * @param {object} data - The data payload, including { sessionId, updatedRoster }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation message.
 */
const finalizeAttendance = async (data, token) => {
    const { sessionId, updatedRoster } = data;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.patch(`${API_URL}class-sessions/${sessionId}/roster`, { updatedRoster }, config);
    return response.data;
};

const teacherService = {
    createSessionReflection,
    getFeedbackSummaryForSession,
    getClassCreationData,
    createClassSession,
    getTeacherSessionsHistory,
    getSessionRoster,
    finalizeAttendance,
};

export default teacherService;