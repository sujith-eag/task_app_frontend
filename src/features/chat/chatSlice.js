import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import chatService from './chatService.js';

// --- ASYNC THUNKS ---
export const getConversations = createAsyncThunk('chat/getConversations', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await chatService.getConversations(token);
    } catch (error) { /* ... error handling ... */ }
});

export const startConversation = createAsyncThunk('chat/startConversation', async (recipientId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await chatService.createOrGetConversation(recipientId, token);
    } catch (error) { /* ... */ }
});


export const getMessages = createAsyncThunk('chat/getMessages', async (conversationId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await chatService.getMessagesForConversation(conversationId, token);
    } catch (error) { /* ... */ }
});


// --- INITIAL STATE ---
const initialState = {
    conversations: {
        ids: [],      // Array of conversation IDs to maintain order
        entities: {}, // Object mapping conversation IDs to conversation data
    },
    messages: {},     // Messages keyed by conversation ID
    onlineUsers: [],  // Array of online user IDs
    activeConversationId: null, // Store only the ID to prevent stale data
    // Granular status and error tracking for each async operation
    status: {
        getConversations: 'idle', // 'loading' | 'succeeded' | 'failed'
        getMessages: 'idle',
        startConversation: 'idle'
    },
    error: {
        getConversations: null,
        getMessages: null,
        startConversation: null
    }
};


// --- CHAT SLICE ---
export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // --- Reducers for Real-Time Socket Events ---
        // Called by the SocketContext when a new message arrives
        addMessage: (state, action) => {
            const message = action.payload;
            const conversationId = message.conversation;

            // Ensure the message array for the conversation exists.
            if (!state.messages[conversationId]) {
                state.messages[conversationId] = [];
            }

            // Check if the message (by its final _id) already exists.
            const messageExists = state.messages[conversationId].some(
                (m) => m._id === message._id
            );

            // Only add the message if it's not already in the state.
            if (!messageExists) {
                state.messages[conversationId].push(message);
            }

            // Update and re-sort the conversation list. This part of your logic is correct.
            if (state.conversations.entities[conversationId]) {
                state.conversations.entities[conversationId].lastMessage = message;
                
                const index = state.conversations.ids.indexOf(conversationId);
                if (index > -1) {
                    state.conversations.ids.splice(index, 1);
                }
                state.conversations.ids.unshift(conversationId);
            }
        },
        
        updateMessagesToRead: (state, action) => {
            const { conversationId, readerId } = action.payload;
            if (state.messages[conversationId]) {
                state.messages[conversationId].forEach(msg => {
                    // Mark messages as 'read' if they were not sent by the user who just read them
                    if (msg.sender !== readerId && msg.status !== 'read') {
                        msg.status = 'read';
                    }
                });
            }
        },
        // --- UI Interaction Reducers ---
        setActiveConversationId: (state, action) => {
            state.activeConversationId = action.payload;
        },

        clearChatState: (state) => {
            // Utility to reset state on logout
            Object.assign(state, initialState);
        },

        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },

        clearActiveConversation: (state) => {
            state.activeConversationId = null;
        },

        // --- OPTIMISTIC UI REDUCERS ---
        // --- Reconcile the optimistic message with the server response ---
        reconcileMessage: (state, action) => {
            const finalMessage = action.payload; // This is the final message from the server
            const conversationId = finalMessage.conversation;

            // Find the temporary message by its tempId and replace it
            const messageIndex = state.messages[conversationId]?.findIndex(
                msg => msg.tempId === finalMessage.tempId
            );

            if (messageIndex !== -1) {
                state.messages[conversationId][messageIndex] = {
                    ...finalMessage,
                    status: 'sent', // Mark as sent
                };
            }
        },

        // --- Add an optimistic message to the state ---
        addOptimisticMessage: (state, action) => {
            const message = action.payload;
            const conversationId = message.conversation;
            if (state.messages[conversationId]) {
                state.messages[conversationId].push(message);
            } else {
                state.messages[conversationId] = [message];
            }
        },
    },
        extraReducers: (builder) => {
            builder
            // --- Get Conversations ---
            .addCase(getConversations.pending, (state) => {
                state.status.getConversations = 'loading';
            })
            .addCase(getConversations.fulfilled, (state, action) => {
                state.status.getConversations = 'succeeded';
                // Normalize the conversations data
                state.conversations.ids = action.payload.map(c => c._id);
                state.conversations.entities = action.payload.reduce((acc, c) => {
                    acc[c._id] = c;
                    return acc;
                }, {});
            })
            .addCase(getConversations.rejected, (state, action) => {
                state.status.getConversations = 'failed';
                state.error.getConversations = action.error.message;
            })

            // --- Get Messages ---
            .addCase(getMessages.pending, (state) => {
                state.status.getMessages = 'loading';
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                const messages = action.payload;
                if (messages && messages.length > 0) {
                    const conversationId = messages[0].conversation;
                    state.messages[conversationId] = messages;
                }
                state.status.getMessages = 'succeeded';
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.status.getMessages = 'failed';
                state.error.getMessages = action.error.message;
            })

            // --- Start Conversation ---
            .addCase(startConversation.fulfilled, (state, action) => {
                const newConvo = action.payload;
                if (!state.conversations.entities[newConvo._id]) {
                    state.conversations.ids.unshift(newConvo._id);
                    state.conversations.entities[newConvo._id] = newConvo;
                }
                state.activeConversationId = newConvo._id;
            });
        }
    }
);

export const { 
        addMessage, 
        setOnlineUsers,
        updateMessagesToRead,
        setActiveConversationId,
        clearChatState,
        addOptimisticMessage, 
        reconcileMessage, 
        clearActiveConversation,
     } = chatSlice.actions;
     
     
// --- SELECTORS ---
// Memoized selectors for performance. They prevent re-renders if the state they select hasn't changed.
const selectConversationsEntities = (state) => state.chat.conversations.entities;
const selectConversationsIds = (state) => state.chat.conversations.ids;
const selectActiveConversationId = (state) => state.chat.activeConversationId;

export const selectAllConversations = createSelector(
    [selectConversationsEntities, selectConversationsIds],
    (entities, ids) => ids.map(id => entities[id])
);

export const selectActiveConversation = createSelector(
    [selectConversationsEntities, selectActiveConversationId],
    (entities, activeId) => activeId ? entities[activeId] : null
);     
     
export default chatSlice.reducer;