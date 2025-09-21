import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/conversations/';

const getConversations = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const createOrGetConversation = async (recipientId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, { recipientId }, config);
    return response.data;
};

const getMessagesForConversation = async (conversationId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // URL includes the conversation ID
    const response = await axios.get(API_URL + conversationId + '/messages', config);
    return response.data;
};

const chatService = { 
    getConversations, 
    createOrGetConversation, 
    getMessagesForConversation
};

export default chatService;