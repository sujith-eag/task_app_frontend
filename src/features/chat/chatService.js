import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/conversations/';

const getConversations = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const chatService = { getConversations };
export default chatService;