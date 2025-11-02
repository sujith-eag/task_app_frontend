import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import studentService from './studentService.js';

// --- Initial State ---
const initialState = {
    profile: null,
    dashboardStats: [],
    sessionsAwaitingFeedback: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};


// --- Async Thunks ---

// Getting Student details
export const getStudentProfile = createAsyncThunk('student/getProfile', async (_, thunkAPI) => {
    try {
        return await studentService.getStudentProfile();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// Get the student's personal dashboard stats (attendance per subject)
export const getStudentDashboardStats = createAsyncThunk('student/getDashboardStats', async (_, thunkAPI) => {
    try {
        return await studentService.getStudentDashboardStats();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// Submit feedback for a class session
// Note: This thunk primarily triggers an API call. A success doesn't need to alter this slice's
// state directly, but it's useful to have it here to manage loading/error states for the feedback form.
// Submit feedback for a class session
export const submitFeedback = createAsyncThunk('student/submitFeedback', async (feedbackData, thunkAPI) => {
    try {
        return await studentService.submitFeedback(feedbackData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- Mark attendance ---
export const markAttendance = createAsyncThunk('student/markAttendance', async (attendanceData, thunkAPI) => {
    try {
        const response = await studentService.markAttendance(attendanceData);
        // On success, automatically dispatch the action to refetch the dashboard stats.
        thunkAPI.dispatch(getStudentDashboardStats());

        return response;

    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const getSessionsForFeedback = createAsyncThunk('student/getSessionsForFeedback', async (_, thunkAPI) => {
    try {
        // Requires a new backend endpoint.
        return await studentService.getSessionsForFeedback();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});



// --- Slice Definition ---
export const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(getStudentProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStudentProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(getStudentProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            // Get Student Dashboard Stats
            .addCase(getStudentDashboardStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStudentDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.dashboardStats = action.payload;
            })
            .addCase(getStudentDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            // Submit Feedback
            .addCase(submitFeedback.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(submitFeedback.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // We could dispatch another action here to refetch a list of
                // classes awaiting feedback to update the UI.
                state.message = action.payload.message;
            })
            .addCase(submitFeedback.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            

            // --- Mark Attendance ---
            .addCase(markAttendance.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(markAttendance.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(markAttendance.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
    
            .addCase(getSessionsForFeedback.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSessionsForFeedback.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.sessionsAwaitingFeedback = action.payload;
            })
            .addCase(getSessionsForFeedback.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    ;},
});

export const { reset } = studentSlice.actions;
export default studentSlice.reducer;