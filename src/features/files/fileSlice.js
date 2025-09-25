import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from './fileService.js';

// --- Async Thunks ---

export const getFiles = createAsyncThunk('files/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.getFiles(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const uploadFiles = createAsyncThunk('files/upload', async (filesFormData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.uploadFiles(filesFormData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteFile = createAsyncThunk('files/delete', async (fileId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.deleteFile(fileId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const shareFile = createAsyncThunk('files/share', async (shareData, thunkAPI) => {
    try {
        const { fileId, userIdToShareWith } = shareData;
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.shareFile(fileId, userIdToShareWith, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const manageShareAccess = createAsyncThunk('files/manageShare', async (shareData, thunkAPI) => {
    try {
        const { fileId, userIdToRemove } = shareData;
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.manageShareAccess(fileId, userIdToRemove, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const shareWithClass = createAsyncThunk('files/shareClass', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.shareWithClass(data, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


const initialState = {
    files: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    message: '',
};

export const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        resetFileStatus: (state) => {
            state.status = 'idle';
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Files
            .addCase(getFiles.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getFiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.files = Array.isArray(action.payload) ? action.payload : [];
            // If the API returns a falsy value (null, undefined, etc.), default to an empty array.
            })
            .addCase(getFiles.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload;
                state.files = []; 
            })
            // Upload Files
            .addCase(uploadFiles.fulfilled, (state, action) => {
                state.files.unshift(...action.payload); // Add new files to the beginning
            })
            // Delete File
            .addCase(deleteFile.fulfilled, (state, action) => {
                // Remove the deleted file from the state
                state.files = state.files.filter((file) => file._id !== action.payload.fileId);
            })
            // Share File & Manage Share Access (they both return the updated file)
            .addCase(shareFile.fulfilled, (state, action) => {
                // Find and update the specific file in the array
                const index = state.files.findIndex((file) => file._id === action.payload._id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })
            
            .addCase(shareWithClass.fulfilled, (state, action) => {
                // Find and update the specific file in the array
                const index = state.files.findIndex((file) => file._id === action.payload._id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })
            
            .addCase(manageShareAccess.fulfilled, (state, action) => {
                // Same logic as sharing: find and update the file
                const index = state.files.findIndex((file) => file._id === action.payload._id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            });
    },
});

export const { resetFileStatus } = fileSlice.actions;
export default fileSlice.reducer;