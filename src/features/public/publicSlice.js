import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import publicService from './publicService';

// --- Async Thunk ---
export const getPublicDownloadLink = createAsyncThunk(
    'public/getDownloadLink',
    async (data, thunkAPI) => {
        try {
            return await publicService.getPublicDownloadLink(data);
        } catch (error) {
            const message =
                (error.response?.data?.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const initialState = {
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    message: '',
    downloadUrl: null,
};

export const publicSlice = createSlice({
    name: 'public',
    initialState,
    reducers: {
        // Resets the state, typically used on component unmount
        resetPublicState: (state) => {
            state.status = 'idle';
            state.message = '';
            state.downloadUrl = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPublicDownloadLink.pending, (state) => {
                state.status = 'loading';
                state.downloadUrl = null; // Clear previous URL
            })
            .addCase(getPublicDownloadLink.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.downloadUrl = action.payload.url;
            })
            .addCase(getPublicDownloadLink.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload;
                state.downloadUrl = null;
            });
    }
});

export const { resetPublicState } = publicSlice.actions;
export default publicSlice.reducer;