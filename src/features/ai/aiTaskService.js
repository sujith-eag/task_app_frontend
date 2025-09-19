import axios from 'axios';

const API_URL = 'https://task-app-backend-8j57.onrender.com/api/ai/'
// const API_URL = '/api/ai/'; // Base URL for AI routes

// Generate tasks from a prompt using the AI service
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
