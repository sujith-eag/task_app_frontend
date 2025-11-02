import apiClient from '../../app/apiClient.js';

// Use relative endpoints; apiClient.baseURL supplies the API root
const API_URL = '/college/teachers/';


/**
 * Creates or updates a teacher's personal reflection for a completed class session.
 * @route   PUT /api/college/teachers/session-reflection
 * @param   {object} reflectionData - The reflection payload, including the `classSessionId` and self-assessment data.
 * @param   {string} token - The teacher's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the created/updated reflection object.
 */
const upsertSessionReflection = async (reflectionData) => {
    const response = await apiClient.put(API_URL + 'session-reflection', reflectionData);
    return response.data;
};


/**
 * Retrieves an anonymized, aggregated summary of student feedback for a teacher's own class session.
 * @route   GET /api/college/teachers/feedback-summary/:sessionId
 * @param   {string} sessionId - The unique ID of the class session to get the summary for.
 * @param   {string} token - The teacher's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing the student feedback summary and the teacher's own reflection.
 */
const getFeedbackSummaryForSession = async (sessionId) => {
    const response = await apiClient.get(`${API_URL}feedback-summary/${sessionId}`);
    return response.data;
};


/**
 * Retrieves the necessary data for a teacher to create a class (e.g., their assigned subjects).
 * @route GET /api/college/teachers/class-creation-data
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to an object containing class creation data.
 */
const getClassCreationData = async () => {
    const response = await apiClient.get(API_URL + 'class-creation-data');
    return response.data;
};


/**
 * Creates a new class session for attendance.
 * @route POST /api/college/teachers/class-sessions
 * @param {object} sessionData - The data for the new session { subject, section, etc. }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the newly created class session object.
 */
const createClassSession = async (sessionData) => {
    const response = await apiClient.post(API_URL + 'class-sessions', sessionData);
    return response.data;
};


/**
 * Retrieves a history of the authenticated teacher's past class sessions.
 * @route GET /api/college/teachers/class-sessions
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of past session objects.
 */
const getTeacherSessionsHistory = async () => {
    const response = await apiClient.get(API_URL + 'class-sessions');
    return response.data;
};


/**
 * Retrieves the current attendance roster for a specific, active class session.
 * @route GET /api/college/teachers/class-sessions/:sessionId/roster
 * @param {string} sessionId - The ID of the active class session.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to the session's attendance roster.
 */
const getSessionRoster = async (sessionId) => {
    const response = await apiClient.get(`${API_URL}class-sessions/${sessionId}/roster`);
    return response.data;
};


/**
 * Finalizes the attendance for a session, including any manual overrides by the teacher.
 * @route PATCH /api/college/teachers/class-sessions/:sessionId/roster
 * @param {object} data - The data payload, including { sessionId, updatedRoster }.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to a success confirmation message.
 */
const finalizeAttendance = async (data) => {
    const { sessionId, updatedRoster } = data;
    const response = await apiClient.patch(`${API_URL}class-sessions/${sessionId}/roster`, { updatedRoster });
    return response.data;
};


const teacherService = {
    upsertSessionReflection,
    getFeedbackSummaryForSession,
    getClassCreationData,
    createClassSession,
    getTeacherSessionsHistory,
    getSessionRoster,
    finalizeAttendance,
};

export default teacherService;