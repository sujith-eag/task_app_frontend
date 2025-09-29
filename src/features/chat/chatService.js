import axios from 'axios';
const API_URL = import.meta.env.VITE_API_BASE_URL + '/chat/';

/**
 * Retrieves all conversations for the authenticated user.
 * @route GET /api/chat/
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of conversation objects.
 */
const getConversations = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
};

/**
 * Creates a new conversation with a recipient or retrieves the existing one.
 * @route POST /api/chat/
 * @param {string} recipientId - The ID of the other user in the conversation.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the conversation object.
 */
const createOrGetConversation = async (recipientId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(API_URL, { recipientId }, config);
    return response.data;
};

/**
 * Retrieves all messages for a specific conversation.
 * @route GET /api/chat/:conversationId/messages
 * @param {string} conversationId - The ID of the conversation.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of message objects.
 */
const getMessagesForConversation = async (conversationId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL + conversationId + '/messages', config);
    return response.data;
};

const chatService = {
    getConversations,
    createOrGetConversation,
    getMessagesForConversation
};

export default chatService;