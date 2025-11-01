import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AI_API_URL = `${API_BASE_URL}/ai`;

/**
 * Generates a preview of a task plan from a user prompt using the AI service.
 * @route POST /api/ai/tasks/preview
 * @param {object} requestData - The data for the AI request, including the prompt text.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the AI-generated task plan preview.
 * @throws {string} Throws an error message if the API call fails.
 */
const fetchAIPlanPreview = async (requestData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
        const response = await axios.post(`${AI_API_URL}/tasks/preview`, requestData, config);
        return response.data;
    } catch (err) {
        throw err.response?.data?.message || err.message;
    }
};

/**
 * Generate tasks from an AI prompt and persist them to the user's tasks.
 * @route POST /api/ai/tasks/generate
 * @access Private (daily limit checked)
 * @param {object} requestData - { prompt: string, options?: object }
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object[]>} Array of created tasks.
 */
const generateTasksWithAI = async (requestData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    try {
        const response = await axios.post(`${AI_API_URL}/tasks/generate`, requestData, config);
        return response.data;
    } catch (err) {
        throw err.response?.data?.message || err.message;
    }
};

/**
 * Get AI usage statistics for the current user.
 * @route GET /api/ai/stats
 * @access Private
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} Usage statistics object.
 */
const getAIStats = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${AI_API_URL}/stats`, config);
    return response.data;
};

/**
 * Get prompt history for the user (supports optional sessionId and limit query params).
 * @route GET /api/ai/prompts/history
 * @access Private
 * @param {object} params - Optional query params { sessionId, limit }
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} Array of prompt history entries.
 */
const getPromptHistory = async (params = {}, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }, params };
    const response = await axios.get(`${AI_API_URL}/prompts/history`, config);
    return response.data;
};

/**
 * Get session history grouped by sessionId.
 * @route GET /api/ai/sessions
 * @access Private
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} Array of session history objects.
 */
const getSessionHistory = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${AI_API_URL}/sessions`, config);
    return response.data;
};

/**
 * Clear old prompt history (server accepts `daysOld` as query param).
 * @route DELETE /api/ai/prompts/history
 * @access Private
 * @param {number} daysOld - Number of days; prompts older than this will be cleared (optional, defaults handled by backend).
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} Result object from backend.
 */
const clearPromptHistory = async (daysOld, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` }, params: { daysOld } };
    const response = await axios.delete(`${AI_API_URL}/prompts/history`, config);
    return response.data;
};

const aiTaskService = {
    fetchAIPlanPreview,
    generateTasksWithAI,
    getAIStats,
    getPromptHistory,
    getSessionHistory,
    clearPromptHistory,
};
export default aiTaskService;