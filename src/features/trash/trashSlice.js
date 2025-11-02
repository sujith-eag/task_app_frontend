import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from '../files/fileService.js';
import { logout } from '../auth/authSlice.js';

const initialState = {
    items: [],
    stats: {
        fileCount: 0,
        folderCount: 0,
        totalSize: 0,
    },
    status: 'idle',
    message: '',
};

// --- Async Thunks ---
export const listTrash = createAsyncThunk('trash/list', async (_, thunkAPI) => {
    try {
        return await fileService.listTrash();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getTrashStats = createAsyncThunk('trash/stats', async (_, thunkAPI) => {
    try {
        return await fileService.getTrashStats();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const restoreFile = createAsyncThunk('trash/restore', async (fileId, thunkAPI) => {
    try {
        await fileService.restoreFile(fileId);
        return fileId;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const purgeFile = createAsyncThunk('trash/purge', async (fileId, thunkAPI) => {
    try {
        await fileService.purgeFile(fileId);
        return fileId;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const emptyTrash = createAsyncThunk('trash/empty', async (_, thunkAPI) => {
    try {
        return await fileService.emptyTrash();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const bulkRestore = createAsyncThunk('trash/bulkRestore', async (fileIds, thunkAPI) => {
    try {
        await fileService.bulkRestore(fileIds);
        return fileIds;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const bulkPurge = createAsyncThunk('trash/bulkPurge', async (fileIds, thunkAPI) => {
    try {
        await fileService.bulkPurge(fileIds);
        return fileIds;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const trashSlice = createSlice({
    name: 'trash',
    initialState,
    reducers: {
        resetTrashStatus: (state) => {
            state.status = 'idle';
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(listTrash.pending, (state) => { state.status = 'loading'; })
            .addCase(listTrash.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.items || [];
                state.message = '';
            })
            .addCase(listTrash.rejected, (state, action) => { state.status = 'failed'; state.message = action.payload; })
            .addCase(getTrashStats.fulfilled, (state, action) => { state.stats = action.payload || state.stats; })

            .addCase(restoreFile.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            })
            .addCase(purgeFile.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            })
            .addCase(emptyTrash.fulfilled, (state) => {
                state.items = [];
                state.stats = initialState.stats;
            })
            .addCase(bulkRestore.fulfilled, (state, action) => {
                const idsToRestore = action.payload || [];
                state.items = state.items.filter((item) => !idsToRestore.includes(item._id));
            })
            .addCase(bulkPurge.fulfilled, (state, action) => {
                const idsToPurge = action.payload || [];
                state.items = state.items.filter((item) => !idsToPurge.includes(item._id));
            })

            .addCase(logout.fulfilled, () => initialState);
    },
});

export const { resetTrashStatus } = trashSlice.actions;
export default trashSlice.reducer;
