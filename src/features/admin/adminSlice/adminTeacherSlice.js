import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../adminService';


// --- Async Thunks ---

/**
 * Get all users with the teacher role with pagination and search
 * @param {Object} params - { page, limit, search }
 */
export const getAllTeachers = createAsyncThunk(
    'adminTeachers/getAll', 
    async (params = {}, thunkAPI) => {
        try {
            return await adminService.getAllTeachers(params);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// --- Thunk for updating teacher assignments ---
export const updateTeacherAssignments = createAsyncThunk('adminTeachers/updateAssignments', async (data, thunkAPI) => {
    try {
        return await adminService.updateTeacherAssignments(data);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- Thunk for deleting an assignment ---
export const deleteTeacherAssignment = createAsyncThunk('adminTeachers/deleteAssignment', async (data, thunkAPI) => {
    // data = { teacherId, assignmentId }
    try {
        await adminService.deleteTeacherAssignment(data);
        return data; // Return { teacherId, assignmentId } on success
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- Slice Definition ---
const initialState = {
    teachers: [],
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
    },
    searchTerm: '',
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const adminTeacherSlice = createSlice({
    name: 'adminTeachers',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setTeacherSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        clearTeachers: (state) => {
            state.teachers = [];
            state.pagination = initialState.pagination;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get All Teachers
            .addCase(getAllTeachers.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(getAllTeachers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Handle new paginated response format
                const payload = action.payload;
                if (payload && payload.data && payload.pagination) {
                    state.teachers = payload.data;
                    state.pagination = payload.pagination;
                } else {
                    // Fallback for old format
                    state.teachers = Array.isArray(payload)
                        ? payload
                        : payload && Array.isArray(payload.data)
                            ? payload.data
                            : payload && Array.isArray(payload.teachers)
                                ? payload.teachers
                                : [];
                }
            })
            .addCase(getAllTeachers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Update Teacher Assignments
            .addCase(updateTeacherAssignments.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(updateTeacherAssignments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const { teacherId } = action.meta.arg; // teacherId from the original thunk argument
                const payload = action.payload;
                const data = payload && payload.data ? payload.data : payload;
                const updatedDetails = data?.teacherDetails || data?.updatedTeacher || null;

                state.teachers = state.teachers.map((teacher) => {
                    if(teacher._id === teacherId){
                        return{ ...teacher, teacherDetails: updatedDetails || teacher.teacherDetails};
                    }
                    return teacher;
                });
            })
            .addCase(updateTeacherAssignments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Delete Teacher Assignment
            .addCase(deleteTeacherAssignment.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(deleteTeacherAssignment.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const { teacherId, assignmentId } = action.payload;
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
            });
    },
});

export const { reset, setTeacherSearchTerm, clearTeachers } = adminTeacherSlice.actions;
export default adminTeacherSlice.reducer;