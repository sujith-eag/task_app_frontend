import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CHAT_API_URL = `${API_BASE_URL}/chat`;

/**
 * Retrieves all conversations for the authenticated user.
 * @route GET /api/chat/conversations
 * @access Private (requires Authorization header)
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of conversation objects.
 */
const getConversations = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${CHAT_API_URL}/conversations`, config);
    return response.data;
};

/**
 * Creates a new conversation with a recipient or retrieves the existing one.
 * @route POST /api/chat/conversations
 * @access Private (requires Authorization header)
 * @param {string} recipientId - The ID of the other user in the conversation.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise that resolves to the conversation object.
 */
const createOrGetConversation = async (recipientId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${CHAT_API_URL}/conversations`, { recipientId }, config);
    return response.data;
};

/**
 * Retrieves all messages for a specific conversation (supports pagination via `page` and `limit` query params).
 * @route GET /api/chat/conversations/:conversationId/messages
 * @access Private (requires Authorization header)
 * @param {string} conversationId - The ID of the conversation.
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of message objects.
 */
const getMessagesForConversation = async (conversationId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${CHAT_API_URL}/conversations/${conversationId}/messages`, config);
    return response.data;
};

/**
 * Get total unread messages across all conversations.
 * @route GET /api/chat/messages/unread/total
 * @access Private (requires Authorization header)
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise resolving to an object like `{ count: number }`.
 */
const getTotalUnreadCount = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${CHAT_API_URL}/messages/unread/total`, config);
    return response.data;
};

/**
 * Get unread message count for a single conversation.
 * @route GET /api/chat/conversations/:conversationId/messages/unread
 * @access Private (requires Authorization header)
 * @param {string} conversationId - Conversation ID
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise resolving to an object like `{ count: number }`.
 */
const getUnreadCountForConversation = async (conversationId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${CHAT_API_URL}/conversations/${conversationId}/messages/unread`, config);
    return response.data;
};

/**
 * Mark all messages in a conversation as read.
 * @route PUT /api/chat/conversations/:conversationId/messages/read
 * @access Private (requires Authorization header)
 * @param {string} conversationId - Conversation ID
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise resolving to the result object.
 */
const markConversationAsRead = async (conversationId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.put(`${CHAT_API_URL}/conversations/${conversationId}/messages/read`, {}, config);
    return response.data;
};

/**
 * Send (create) a new message in a conversation.
 * @route POST /api/chat/conversations/:conversationId/messages
 * @access Private (requires Authorization header)
 * @param {string} conversationId - Conversation ID
 * @param {string} content - Message content
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise resolving to the created message object.
 */
const createMessage = async (conversationId, content, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(`${CHAT_API_URL}/conversations/${conversationId}/messages`, { content }, config);
    return response.data;
};

/**
 * Delete a specific message.
 * @route DELETE /api/chat/messages/:messageId
 * @access Private (requires Authorization header)
 * @param {string} messageId - Message ID
 * @param {string} token - The user's JWT for authentication.
 * @returns {Promise<object>} A promise resolving to the deletion result.
 */
const deleteMessage = async (messageId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.delete(`${CHAT_API_URL}/messages/${messageId}`, config);
    return response.data;
};

/**
 * Search messages inside a conversation.
 * @route GET /api/chat/conversations/:conversationId/messages/search?q=...
 * @access Private (requires Authorization header)
 * @param {string} conversationId - Conversation ID
 * @param {string} q - Search query
 * @param {string} token - The user's JWT for authentication.
 * @param {object} [options] - Optional pagination: { page, limit }
 * @returns {Promise<Array<object>>} A promise resolving to an array of matching messages.
 */
const searchMessages = async (conversationId, q, token, options = {}) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { q, ...options },
    };
    const response = await axios.get(`${CHAT_API_URL}/conversations/${conversationId}/messages/search`, config);
    return response.data;
};

const chatService = {
    getConversations,
    createOrGetConversation,
    getMessagesForConversation,
    getTotalUnreadCount,
    getUnreadCountForConversation,
    markConversationAsRead,
    createMessage,
    deleteMessage,
    searchMessages,
};

export default chatService;