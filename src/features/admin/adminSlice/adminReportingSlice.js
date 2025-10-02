import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../adminService';


// --- Async Thunks ---

// Get attendance statistics report
export const getAttendanceStats = createAsyncThunk('adminReporting/getAttendance', async (filters, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getAttendanceStats(filters, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get feedback summary report
export const getFeedbackSummary = createAsyncThunk('adminReporting/getFeedback', async (filters, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getFeedbackSummary(filters, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const getFeedbackReport = createAsyncThunk('adminReporting/getDetailedReport', async (classSessionId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getFeedbackReport(classSessionId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- Slice Definition ---
const initialState = {
    attendanceStats: [],
    feedbackSummary: [],
    detailedReport: null,
    isDetailLoading: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const adminReportingSlice = createSlice({
    name: 'adminReporting',
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
            // Get Attendance Stats
            .addCase(getAttendanceStats.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(getAttendanceStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.attendanceStats = action.payload;
            })
            .addCase(getAttendanceStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Get Feedback Summary
            .addCase(getFeedbackSummary.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(getFeedbackSummary.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.feedbackSummary = action.payload;
            })
            .addCase(getFeedbackSummary.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            
            // --- Reducers for the detailed feedback report ---
            .addCase(getFeedbackReport.pending, (state) => {
                state.isDetailLoading = true;
            })
            .addCase(getFeedbackReport.fulfilled, (state, action) => {
                state.isDetailLoading = false;
                state.detailedReport = action.payload;
            })
            .addCase(getFeedbackReport.rejected, (state, action) => {
                state.isDetailLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    ;},
});

export const { reset } = adminReportingSlice.actions;
export default adminReportingSlice.reducer;