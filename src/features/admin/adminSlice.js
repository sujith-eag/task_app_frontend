import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from './adminService.js';

// --- Initial State ---
const initialState = {
    // Data for management tabs
    teachers: [],
    pendingApplications: [],
    subjects: [],
    // Data for reporting tabs
    attendanceStats: [],
    feedbackSummary: [],
    // Standard async state flags
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// --- Async Thunks ---

// Get all subjects
export const getSubjects = createAsyncThunk('admin/getSubjects', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getSubjects(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create a new subject
export const createSubject = createAsyncThunk('admin/createSubject', async (subjectData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.createSubject(subjectData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get pending student applications
export const getPendingApplications = createAsyncThunk('admin/getPending', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getPendingApplications(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Review (approve/reject) a student application
export const reviewApplication = createAsyncThunk('admin/reviewApp', async (reviewData, thunkAPI) => {
    try {
        // reviewData = { userId, action: 'approve'/'reject' }
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.reviewApplication(reviewData.userId, reviewData.action, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get attendance statistics report
export const getAttendanceStats = createAsyncThunk('admin/getAttendanceStats', async (filters, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getAttendanceStats(filters, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Get feedback summary report
export const getFeedbackSummary = createAsyncThunk('admin/getFeedbackSummary', async (filters, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getFeedbackSummary(filters, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- Thunk for updating teacher assignments ---
export const updateTeacherAssignments = createAsyncThunk('admin/updateAssignments', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.updateTeacherAssignments(data, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- Thunk for deleting an assignment ---
export const deleteTeacherAssignment = createAsyncThunk('admin/deleteAssignment', async (data, thunkAPI) => {
    // data = { teacherId, assignmentId }
    try {
        const token = thunkAPI.getState().auth.user.token;
        await adminService.deleteTeacherAssignment(data, token);
        // Return the original data on success to use it in the reducer
        return data;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// Update an existing subject
export const updateSubject = createAsyncThunk('admin/updateSubject', async (subjectData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.updateSubject(subjectData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete a subject
export const deleteSubject = createAsyncThunk('admin/deleteSubject', async (subjectId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.deleteSubject(subjectId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// Get all users with the teacher role
export const getAllTeachers = createAsyncThunk('admin/getAllTeachers', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getAllTeachers(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const adminSlice = createSlice({
    name: 'admin',
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
            // Get Subjects
            .addCase(getSubjects.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSubjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects = action.payload;
            })
            .addCase(getSubjects.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Subject
            .addCase(createSubject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects.push(action.payload); // Add new subject to the list
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
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


            // --- cases for updating teacher assignments ---
            .addCase(updateTeacherAssignments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateTeacherAssignments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const { teacherId } = action.meta.arg; // Get teacherId from the original thunk argument
                const updatedDetails = action.payload.teacherDetails;
            
                const teacherIndex = state.teachers.findIndex(t => t._id === teacherId);
                if (teacherIndex !== -1) {
                    // Replace the teacher's details with the updated ones from the server
                    state.teachers[teacherIndex].teacherDetails = updatedDetails;
                }
            })
            .addCase(updateTeacherAssignments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })


            // --- Cases for updating a subject ---
            .addCase(updateSubject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Find the index of the updated subject and replace it in the state
                const index = state.subjects.findIndex(s => s._id === action.payload._id);
                if (index !== -1) {
                    state.subjects[index] = action.payload;
                }
            })
            .addCase(updateSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // --- Add cases for deleting a subject ---
            .addCase(deleteSubject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Remove the deleted subject from the state
                state.subjects = state.subjects.filter(s => s._id !== action.payload.id);
            })
            .addCase(deleteSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // --- Add cases for getting all teachers ---
            .addCase(getAllTeachers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getAllTeachers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.teachers = action.payload; // Populate the teachers array
            })
            .addCase(getAllTeachers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            
            
            // --- Cases for deleting an assignment ---
            .addCase(deleteTeacherAssignment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteTeacherAssignment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const { teacherId, assignmentId } = action.payload; // Data passed from the thunk
                const teacher = state.teachers.find(t => t._id === teacherId);
                if (teacher) {
                    // Filter out the deleted assignment from the specific teacher's assignments array
                    teacher.teacherDetails.assignments = teacher.teacherDetails.assignments.filter(
                        a => a._id !== assignmentId
                    );
                }
            })
            .addCase(deleteTeacherAssignment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })            
            
    ;},
});

export const { reset } = adminSlice.actions;
export default adminSlice.reducer;