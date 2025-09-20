import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from './chatService.js';


export const getConversations = createAsyncThunk('chat/getConversations', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await chatService.getConversations(token);
    } catch (error) { /* ... error handling ... */ }
});


const initialState = {
    conversations: [],
    messages: {}, // Will store messages keyed by conversation ID
    activeConversationId: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

export const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        // This action is called by the SocketContext when a new message arrives
        addMessage: (state, action) => {
            const message = action.payload;
            const conversationId = message.conversation;

            // Add the message to the correct conversation's message list
            if (state.messages[conversationId]) {
                state.messages[conversationId].push(message);
            } else {
                state.messages[conversationId] = [message];
            }
        },
        // Action to set the currently viewed conversation
        setActiveConversation: (state, action) => {
            state.activeConversationId = action.payload;
        },
        // You can add more reducers here later, e.g., for fetching conversations
    },
        extraReducers: (builder) => {
            builder
                .addCase(getConversations.pending, (state) => {
                    state.status = 'loading';
                })
                .addCase(getConversations.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.conversations = action.payload;
                })
                .addCase(getConversations.rejected, (state, action) => {
                    state.status = 'failed';
                    state.error = action.payload;
                });
        },
});

export const { addMessage, setActiveConversation } = chatSlice.actions;
export default chatSlice.reducer;