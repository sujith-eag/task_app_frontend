import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../adminService';


// --- Async Thunks ---

// Get pending student applications
export const getPendingApplications = createAsyncThunk('adminUsers/getPending', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getPendingApplications(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Review (approve/reject) a student application
export const reviewApplication = createAsyncThunk('adminUsers/reviewApp', async (reviewData, thunkAPI) => {
    // reviewData = { userId, action: 'approve'/'reject' }
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.reviewApplication(reviewData.userId, reviewData.action, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get users by their role
export const getUsersByRole = createAsyncThunk('adminUsers/getByRole', async (role, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getUsersByRole(role, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Promote a user to a faculty role
export const promoteToFaculty = createAsyncThunk('adminUsers/promote', async (data, thunkAPI) => {
    // data = { userId, facultyData }
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.promoteToFaculty(data.userId, data.facultyData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update an existing student's details
export const updateStudentDetails = createAsyncThunk('adminUsers/updateStudent', async (data, thunkAPI) => {
    // data = { studentId, studentData }
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.updateStudentDetails(data.studentId, data.studentData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const updateStudentEnrollment = createAsyncThunk('adminUsers/updateEnrollment', async (data, thunkAPI) => { 
    // data = { studentId, subjectIds }
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.updateStudentEnrollment(data.studentId, data.subjectIds, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- Slice Definition ---
const initialState = {
    pendingApplications: [],
    userList: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const adminUserSlice = createSlice({
    name: 'adminUsers',
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
            // Get Pending Applications
            .addCase(getPendingApplications.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(getPendingApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.pendingApplications = action.payload;
            })
            .addCase(getPendingApplications.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Review Application
            .addCase(reviewApplication.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(reviewApplication.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Remove the reviewed application from the state
                state.pendingApplications = state.pendingApplications.filter(
                    (app) => app._id !== action.payload.user.id
                );
            })
            .addCase(reviewApplication.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Get Users by Role
            .addCase(getUsersByRole.pending, (state) => {
                state.isLoading = true;
                state.userList = [];  // Clear previous list while loading
            })
            .addCase(getUsersByRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.userList = action.payload;
            })
            .addCase(getUsersByRole.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Promote User to Faculty
            .addCase(promoteToFaculty.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(promoteToFaculty.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Remove the promoted user from the list of general 'users'
                state.userList = state.userList.filter(
                    (user) => user._id !== action.payload.user.id
                );
            })
            .addCase(promoteToFaculty.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Update Student Details
            .addCase(updateStudentDetails.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(updateStudentDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const { studentId } = action.meta.arg;
                const updatedDetails = action.payload.studentDetails;

                const index = state.userList.findIndex((user) => user._id === studentId);
                if (index !== -1) {
                    state.userList[index].studentDetails = updatedDetails;
                }
            })
            .addCase(updateStudentDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Update Student Enrollment
            .addCase(updateStudentEnrollment.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(updateStudentEnrollment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                
                const { studentId } = action.meta.arg;
                const { enrolledSubjects } = action.payload;

                const index = state.userList.findIndex((user) => user._id === studentId);
                if (index !== -1) {
                    state.userList[index].studentDetails.enrolledSubjects = enrolledSubjects;
                }
            })
            .addCase(updateStudentEnrollment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = adminUserSlice.actions;
export default adminUserSlice.reducer;