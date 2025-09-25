import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import teacherService from './teacherService.js';

// --- Initial State ---
const initialState = {
    assignedSubjects: [],
    activeSession: null, // Will hold the object of the currently live session
    sessionHistory: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// --- Async Thunks ---

// Get data for the class creation form (teacher's subjects)
export const getClassCreationData = createAsyncThunk('teacher/getClassCreationData', async (_, thunkAPI) => {
    try {
        return await teacherService.getClassCreationData();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create a new class session
export const createClassSession = createAsyncThunk('teacher/createSession', async (sessionData, thunkAPI) => {
    try {
        return await teacherService.createClassSession(sessionData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get history of past sessions
export const getTeacherSessionsHistory = createAsyncThunk('teacher/getHistory', async (_, thunkAPI) => {
    try {
        return await teacherService.getTeacherSessionsHistory();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- Get the roster for an active session ---
export const getSessionRoster = createAsyncThunk('teacher/getRoster', async (sessionId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await teacherService.getSessionRoster(sessionId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- Finalize attendance for a session ---
export const finalizeAttendance = createAsyncThunk('teacher/finalize', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await teacherService.finalizeAttendance(data, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- Slice Definition ---
export const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        // Reducer to manually end a session from the frontend (e.g., on finalize or closing the view)
        endActiveSession: (state) => {
            state.activeSession = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get Class Creation Data
            .addCase(getClassCreationData.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getClassCreationData.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.assignedSubjects = action.payload.subjects;
            })
            .addCase(getClassCreationData.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            // Create Class Session
            .addCase(createClassSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createClassSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.activeSession = action.payload; // Set the active session
            })
            .addCase(createClassSession.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            // Get Session History
            .addCase(getTeacherSessionsHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTeacherSessionsHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.sessionHistory = action.payload;
            })
            .addCase(getTeacherSessionsHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // --- Get Session Roster ---
            .addCase(getSessionRoster.fulfilled, (state, action) => {
                if (state.activeSession) {
                    // Update the roster within the active session object
                    state.activeSession.attendanceRecords = action.payload;
                }
            })


            // --- Finalize Attendance ---
            .addCase(finalizeAttendance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(finalizeAttendance.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.activeSession = null; // End the session upon successful finalization
            })
            .addCase(finalizeAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
    ;},
});

export const { reset, endActiveSession } = teacherSlice.actions;
export default teacherSlice.reducer;