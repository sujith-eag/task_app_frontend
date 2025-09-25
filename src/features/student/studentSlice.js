import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import studentService from './studentService.js';

// --- Initial State ---
const initialState = {
    dashboardStats: [],
    // We can add a state for classes awaiting feedback if needed,
    // for now, we'll keep the slice focused on the main dashboard stats.
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// --- Async Thunks ---

// Get the student's personal dashboard stats (attendance per subject)
export const getStudentDashboardStats = createAsyncThunk('student/getDashboardStats', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await studentService.getStudentDashboardStats(token);
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
        const token = thunkAPI.getState().auth.user.token;
        return await studentService.submitFeedback(feedbackData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- Mark attendance ---
export const markAttendance = createAsyncThunk('student/markAttendance', async (attendanceData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await studentService.markAttendance(attendanceData, token);
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
            });
    },
});

export const { reset } = studentSlice.actions;
export default studentSlice.reducer;