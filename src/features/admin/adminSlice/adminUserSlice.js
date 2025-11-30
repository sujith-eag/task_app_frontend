import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../adminService';


// --- Async Thunks ---

/**
 * Get pending student applications with pagination and search
 * @param {Object} params - { page, limit, search }
 */
export const getPendingApplications = createAsyncThunk(
    'adminUsers/getPending', 
    async (params = {}, thunkAPI) => {
        try {
            return await adminService.getPendingApplications(params);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Review (approve/reject) a student application
export const reviewApplication = createAsyncThunk('adminUsers/reviewApp', async (reviewData, thunkAPI) => {
    // reviewData = { userId, action: 'approve'/'reject' }
    try {
        return await adminService.reviewApplication(reviewData.userId, reviewData.action);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

/**
 * Get users by their role with pagination and search
 * @param {Object} params - { role, page, limit, search }
 */
export const getUsersByRole = createAsyncThunk(
    'adminUsers/getByRole', 
    async (params, thunkAPI) => {
        try {
            // Support both old format (just role) and new format (object with params)
            if (typeof params === 'string') {
                return await adminService.getUsersByRole(params);
            }
            return await adminService.getUsersByRole(params.role, {
                page: params.page,
                limit: params.limit,
                search: params.search,
            });
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Promote a user to a faculty role
export const promoteToFaculty = createAsyncThunk('adminUsers/promote', async (data, thunkAPI) => {
    // data = { userId, facultyData }
    try {
        return await adminService.promoteToFaculty(data.userId, data.facultyData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update an existing student's details
export const updateStudentDetails = createAsyncThunk('adminUsers/updateStudent', async (data, thunkAPI) => {
    // data = { studentId, studentData }
    try {
        return await adminService.updateStudentDetails(data.studentId, data.studentData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const updateStudentEnrollment = createAsyncThunk('adminUsers/updateEnrollment', async (data, thunkAPI) => { 
    // data = { studentId, subjectIds }
    try {
        return await adminService.updateStudentEnrollment(data.studentId, data.subjectIds);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- Slice Definition ---
const initialState = {
    pendingApplications: [],
    applicationsPagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
    },
    userList: [],
    usersPagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
    },
    currentRole: null,
    searchTerm: '',
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
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearUsers: (state) => {
            state.userList = [];
            state.usersPagination = initialState.usersPagination;
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
                // Handle new paginated response format
                const payload = action.payload;
                if (payload && payload.data && payload.pagination) {
                    state.pendingApplications = payload.data;
                    state.applicationsPagination = payload.pagination;
                } else {
                    // Fallback for old format
                    state.pendingApplications = Array.isArray(payload)
                        ? payload
                        : payload && Array.isArray(payload.data)
                            ? payload.data
                            : payload && Array.isArray(payload.applications)
                                ? payload.applications
                                : [];
                }
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
                // Normalize payload then remove the reviewed application
                const payload = action.payload;
                const data = payload && payload.data ? payload.data : payload;
                const userId = data?.user?.id || data?.user?._id || data?.userId || null;
                if (userId) {
                    state.pendingApplications = state.pendingApplications.filter(
                        (app) => app._id !== userId
                    );
                }
            })
            .addCase(reviewApplication.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Get Users by Role
            .addCase(getUsersByRole.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsersByRole.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Handle new paginated response format
                const payload = action.payload;
                if (payload && payload.data && payload.pagination) {
                    state.userList = payload.data;
                    state.usersPagination = payload.pagination;
                } else {
                    // Fallback for old format
                    if (Array.isArray(payload)) state.userList = payload;
                    else if (payload && Array.isArray(payload.data)) state.userList = payload.data;
                    else if (payload && Array.isArray(payload.users)) state.userList = payload.users;
                    else if (payload && Array.isArray(payload.docs)) state.userList = payload.docs;
                    else state.userList = [];
                }
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
                // Normalize payload and remove the promoted user from the list
                const payload = action.payload;
                const data = payload && payload.data ? payload.data : payload;
                const userId = data?.user?.id || data?.user?._id || data?.userId || null;
                if (userId) {
                    state.userList = state.userList.filter(
                        (user) => user._id !== userId
                    );
                }
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
                const payload = action.payload;
                const data = payload && payload.data ? payload.data : payload;
                const updatedDetails = data?.studentDetails || data?.updatedStudent || null;

                const index = state.userList.findIndex((user) => user._id === studentId);
                if (index !== -1 && updatedDetails) {
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
                const payload = action.payload;
                const data = payload && payload.data ? payload.data : payload;
                const enrolledSubjects = data?.enrolledSubjects || data?.data?.enrolledSubjects || null;

                const index = state.userList.findIndex((user) => user._id === studentId);
                if (index !== -1 && enrolledSubjects) {
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

export const { reset, setSearchTerm, clearUsers } = adminUserSlice.actions;
export default adminUserSlice.reducer;