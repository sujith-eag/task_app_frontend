import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

import aiTaskService from './aiTaskService.js';
import taskService from '../tasks/taskService.js';

const initialState = {
    sessionId: null,
    previewTasks: [],
    conversationHistory: [],
    refinementCount: 0,
    refinementLimit: 5, // Default, will be updated by backend
    status: 'idle', // 'idle' | 'generating' | 'refining' | 'saving' | 'error'
    error: null,
};


// --- ASYNC THUNKS ---

// Thunk to get or refine a plan preview
export const getAIPlanPreview = createAsyncThunk(
    'ai/getPlanPreview',
    async (promptData, thunkAPI) => {
        try {
            const { prompt } = promptData;
            // Get history and session ID from the current state
            const { conversationHistory, sessionId } = thunkAPI.getState().ai;
            return await aiTaskService.fetchAIPlanPreview({ prompt, history: conversationHistory, sessionId });
        } catch (error) {
            const message = (error.response?.data?.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Thunk to save the final plan (will call the task service)
export const saveAIPlan = createAsyncThunk(
    'ai/savePlan',
    // Accept an optional payload: { tasks: [...] } so the UI can pass edited tasks.
    async (payload, thunkAPI) => {
        try {
            // If the UI provided tasks in the payload, use them; otherwise fall back to state.previewTasks
            const tasksFromPayload = payload && payload.tasks ? payload.tasks : null;
            const { previewTasks } = thunkAPI.getState().ai;
            const tasksToSave = tasksFromPayload || previewTasks;

            // Ensure we send a plain array of tasks to the task service
            return await taskService.createBulkTasks({ tasks: tasksToSave });
        } catch (error) {
            const message = (error.response?.data?.message) || error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);


// This is the thunk that the UI will dispatch
export const generateTasksWithAI = createAsyncThunk(
  'ai/generateTasks',
  async (promptData, thunkAPI) => {
    try {
    return await aiTaskService.generateTasksWithAI(promptData);
    } catch (error) {
      const message = (error.response?.data?.message) || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const aiTaskSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        // This action starts a new session
        startAIPlanSession: (state) => {
            state.sessionId = uuidv4();
            state.previewTasks = [];
            state.conversationHistory = [];
            state.refinementCount = 0;
            state.status = 'idle';
            state.error = null;
        },
        // This action discards the current plan
        discardAIPlan: () => {
            return ({ ...initialState }); // Reset to the initial state
        },
    },
    extraReducers: (builder) => {
        builder
            // Get/Refine Preview
            .addCase(getAIPlanPreview.pending, (state) => {
                state.status = state.refinementCount === 0 ? 'generating' : 'refining';
            })
            .addCase(getAIPlanPreview.fulfilled, (state, action) => {
                state.status = 'previewing';
                state.previewTasks = action.payload?.plan?.tasks || [];
                state.conversationHistory = action.payload.history;
                state.refinementCount = action.payload.refinementCount;
                state.refinementLimit = action.payload.refinementLimit;
            })
            .addCase(getAIPlanPreview.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
                state.previewTasks = [];
                toast.error(action.payload || 'Something went wrong with AI plan generation');
            })

            // Save Plan
            .addCase(saveAIPlan.pending, (state) => {
                state.status = 'saving';
            })
            .addCase(saveAIPlan.rejected, (state, action) => {
                state.status = 'error';
                state.error = action.payload;
                toast.error(action.payload || 'Something went wrong with AI plan generation');
            })
            .addCase(saveAIPlan.fulfilled, (state) => {
                state.status = 'succeeded'; // Just change the status to 'succeeded'
                toast.success('New task plan has been added successfully!');
                // no resettin of state
            });
    },
});

export const { startAIPlanSession, discardAIPlan } = aiTaskSlice.actions;
export default aiTaskSlice.reducer;