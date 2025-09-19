import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/ai/`;

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
