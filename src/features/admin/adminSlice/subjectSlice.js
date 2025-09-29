import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../adminService';


// --- Async Thunks ---
export const getSubjects = createAsyncThunk('adminSubjects/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.getSubjects(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const createSubject = createAsyncThunk('adminSubjects/create', async (subjectData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.createSubject(subjectData, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const updateSubject = createAsyncThunk('adminSubjects/update', async (subjectData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await adminService.updateSubject(subjectData, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteSubject = createAsyncThunk('adminSubjects/delete', async (subjectId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        await adminService.deleteSubject(subjectId, token);
        return subjectId; // Return the ID on success
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
});

// --- Slice Definition ---
const initialState = {
    subjects: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const subjectSlice = createSlice({
    name: 'adminSubjects',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Get Subjects
            .addCase(getSubjects.pending, (state) => { state.isLoading = true; })
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
            .addCase(createSubject.pending, (state) => { state.isLoading = true; })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects.push(action.payload);
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Subject
            .addCase(updateSubject.pending, (state) => { state.isLoading = true; })
            .addCase(updateSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.subjects.findIndex(s => s._id === action.payload._id);
                if (index !== -1) state.subjects[index] = action.payload;
            })
            .addCase(updateSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete Subject
            .addCase(deleteSubject.pending, (state) => { state.isLoading = true; })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects = state.subjects.filter(s => s._id !== action.payload);
            })
            .addCase(deleteSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = subjectSlice.actions;
export default subjectSlice.reducer;