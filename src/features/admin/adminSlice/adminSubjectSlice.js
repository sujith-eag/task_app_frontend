import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../adminService';


// --- Async Thunks ---

// Get all subjects
export const getSubjects = createAsyncThunk('adminSubjects/getAll', async (params, thunkAPI) => {
    try {
        return await adminService.getSubjects(params);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create a new subject
export const createSubject = createAsyncThunk('adminSubjects/create', async (subjectData, thunkAPI) => {
    try {
        return await adminService.createSubject(subjectData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update an existing subject
export const updateSubject = createAsyncThunk('adminSubjects/update', async (subjectData, thunkAPI) => {
    try {
        return await adminService.updateSubject(subjectData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete a subject
export const deleteSubject = createAsyncThunk('adminSubjects/delete', async (subjectId, thunkAPI) => {
    try {
        return await adminService.deleteSubject(subjectId);
        // await adminService.deleteSubject(subjectId, token);
        // return subjectId; // Return the ID on success
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// --- Slice Definition ---
const initialState = {
    subjects: [],
    pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false,
    },
    searchTerm: '',
    filterSemester: null,
    filterDepartment: '',
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const adminSubjectSlice = createSlice({
    name: 'adminSubjects',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setSubjectSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setSubjectFilters: (state, action) => {
            const { semester, department } = action.payload;
            if (semester !== undefined) state.filterSemester = semester;
            if (department !== undefined) state.filterDepartment = department;
        },
        clearSubjects: (state) => {
            state.subjects = [];
            state.pagination = initialState.pagination;
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
                // Handle new paginated response format
                const payload = action.payload;
                if (payload && payload.data && payload.pagination) {
                    state.subjects = payload.data;
                    state.pagination = payload.pagination;
                } else {
                    // Fallback for old format { success, count, data }
                    state.subjects = Array.isArray(payload)
                        ? payload
                        : payload && Array.isArray(payload.data)
                            ? payload.data
                            : [];
                }
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
                const payload = action.payload;
                const created = payload && payload.data ? payload.data : payload;
                if (created) state.subjects.push(created);
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Update Subject
            .addCase(updateSubject.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(updateSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const payload = action.payload;
                const updated = payload && payload.data ? payload.data : payload;
                // Find index of updated subject and replace it in the state
                const index = state.subjects.findIndex(s => s._id === updated._id || s._id === updated.id);
                if (index !== -1) {
                    state.subjects[index] = updated;
                }
            })
            .addCase(updateSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            
            // Delete Subject
            .addCase(deleteSubject.pending, (state) => { 
                state.isLoading = true; 
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Normalize payload and remove by id/_id
                const payload = action.payload;
                const result = payload && payload.data ? payload.data : payload;
                const deletedId = result && (result.id || result._id) ? (result.id || result._id) : (typeof payload === 'string' ? payload : null);
                if (deletedId) {
                    state.subjects = state.subjects.filter(s => s._id !== deletedId && s.id !== deletedId);
                }
            })
            .addCase(deleteSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, setSubjectSearchTerm, setSubjectFilters, clearSubjects } = adminSubjectSlice.actions;
export default adminSubjectSlice.reducer;