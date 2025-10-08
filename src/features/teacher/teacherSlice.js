import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import teacherService from './teacherService.js';

// --- Initial State ---
const initialState = {
    assignments: [],
    activeSession: null, // Will hold the object of the currently live session
    sessionHistory: [],
    feedbackSummary: null, // To hold the fetched summary
    isSummaryLoading: false, // Specific loading state for the summary    
    isError: false,
    isSuccess: false,
    isLoading: false,
    isRosterLoading: false,
    message: '',
};

// --- Async Thunks ---

// Get data for the class creation form (teacher's subjects)
export const getClassCreationData = createAsyncThunk('teacher/getClassCreationData', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await teacherService.getClassCreationData(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create a new class session
export const createClassSession = createAsyncThunk('teacher/createSession', async (sessionData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await teacherService.createClassSession(sessionData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get history of past sessions
export const getTeacherSessionsHistory = createAsyncThunk('teacher/getHistory', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await teacherService.getTeacherSessionsHistory(token);
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


export const createSessionReflection = createAsyncThunk('teacher/createReflection', async (reflectionData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await teacherService.createSessionReflection(reflectionData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const getFeedbackSummaryForSession = createAsyncThunk('teacher/getSummary', async (sessionId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await teacherService.getFeedbackSummaryForSession(sessionId, token);
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
        },

        clearFeedbackSummary: (state) => { // To clear summary when modal closes
            state.feedbackSummary = null;
        },

        updateRosterOnSocketEvent: (state, action) => {
            // action.payload should be the student record updated by the server
            if (state.activeSession) {
                const studentId = action.payload.student;

                const recordIndex = state.activeSession.attendanceRecords.findIndex(
                    (rec) => rec.student._id.toString() === studentId.toString()
                );

                if (recordIndex !== -1) {
                    // Update the specific student's status to 'present'
                    state.activeSession.attendanceRecords[recordIndex].status = true;
                }
            }
        },
        // Reducer for manual toggles
        toggleManualAttendance: (state, action) => {
            const studentIdToToggle = action.payload;
            if (state.activeSession) {
                const recordIndex = state.activeSession.attendanceRecords.findIndex(
                    (rec) => rec.student._id.toString() === studentIdToToggle.toString()
                );

                if (recordIndex !== -1) {
                    // Directly mutate the state thanks to Immer in Redux Toolkit
                    const currentStatus = state.activeSession.attendanceRecords[recordIndex].status;
                    state.activeSession.attendanceRecords[recordIndex].status = !currentStatus;
                }
            }        
        
        },        
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
                state.assignments = action.payload.assignments;
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

            // --- Get Session Roster for initial load ---
            .addCase(getSessionRoster.pending, (state) => {
                state.isRosterLoading = true;
            })
            .addCase(getSessionRoster.fulfilled, (state, action) => {
                state.isRosterLoading = false;
                if (state.activeSession) {
                    state.activeSession.attendanceRecords = action.payload;
                }
            })
            .addCase(getSessionRoster.rejected, (state, action) => {
                state.isRosterLoading = false;
                state.message = `Failed to load roster: ${action.payload}`; 
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
            

            // --- Reducers for createSessionReflection ---
            .addCase(createSessionReflection.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSessionReflection.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Optionally, we could refetch session history here if we want to show a "reflection submitted" status
            })
            .addCase(createSessionReflection.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            // --- Reducers for getFeedbackSummaryForSession ---
            .addCase(getFeedbackSummaryForSession.pending, (state) => {
                state.isSummaryLoading = true;
            })
            .addCase(getFeedbackSummaryForSession.fulfilled, (state, action) => {
                state.isSummaryLoading = false;
                state.feedbackSummary = action.payload;
            })
            .addCase(getFeedbackSummaryForSession.rejected, (state, action) => {
                state.isSummaryLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    ;},
});

export const { reset, 
        clearFeedbackSummary, 
        endActiveSession, 
        updateRosterOnSocketEvent,
        toggleManualAttendance } = teacherSlice.actions;
export default teacherSlice.reducer;