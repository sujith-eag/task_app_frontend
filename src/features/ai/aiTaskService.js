import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/ai/`;

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
        const response = await axios.post(API_URL + 'tasks/preview', requestData, config);
        return response.data;
    } catch (err) {
        throw err.response?.data?.message || err.message;
    }
};

const aiTaskService = { fetchAIPlanPreview };
export default aiTaskService;