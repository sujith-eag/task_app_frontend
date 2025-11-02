import apiClient from '../../app/apiClient.js';

const AI_API_URL = '/ai';

/**
 * Generates a preview of a task plan from a user prompt using the AI service.
 * @route POST /api/ai/tasks/preview
 * @param {object} requestData - The data for the AI request, including the prompt text.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the AI-generated task plan preview.
 * @throws {string} Throws an error message if the API call fails.
 */
const fetchAIPlanPreview = async (requestData) => {
    try {
        // Debug: log the outgoing AI preview request data so it's easier to trace
        // whether the UI is dispatching the call and what payload it sends.
        // This will appear in the browser console when running locally.
        try { console.debug('AI preview request:', requestData); } catch (e) { /* ignore */ }
        const response = await apiClient.post(`${AI_API_URL}/tasks/preview`, requestData);
        return response.data;
    } catch (err) {
        // Normalize to an Error so createAsyncThunk and callers can access .message
        throw new Error(err.response?.data?.message || err.message || 'AI preview failed');
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
const generateTasksWithAI = async (requestData) => {
    try {
        try { console.debug('AI generate request:', requestData); } catch (e) { /* ignore */ }
        const response = await apiClient.post(`${AI_API_URL}/tasks/generate`, requestData);
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.message || err.message || 'AI generation failed');
    }
};

/**
 * Get AI usage statistics for the current user.
 * @route GET /api/ai/stats
 * @access Private
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} Usage statistics object.
 */
const getAIStats = async () => {
    const response = await apiClient.get(`${AI_API_URL}/stats`);
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
const getPromptHistory = async (params = {}) => {
    const response = await apiClient.get(`${AI_API_URL}/prompts/history`, { params });
    return response.data;
};

/**
 * Get session history grouped by sessionId.
 * @route GET /api/ai/sessions
 * @access Private
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} Array of session history objects.
 */
const getSessionHistory = async () => {
    const response = await apiClient.get(`${AI_API_URL}/sessions`);
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
const clearPromptHistory = async (daysOld) => {
    const response = await apiClient.delete(`${AI_API_URL}/prompts/history`, { params: { daysOld } });
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