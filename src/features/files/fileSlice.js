import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from './fileService.js';
import { logout } from '../auth/authSlice.js';

// --- Async Thunks ---

const initialState = {
    files: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    uploadProgress: 0,
    pendingActionFileIds: [], // To Track the ID of the files being processed    
    message: '',
    currentParentId: null,
    currentFolder: null,
    breadcrumbs: [],
    storageUsage: {
        usageBytes: 0,
        quotaBytes: 0,
        fileCount: 0,
        fileLimit: 0,
    },    
};


export const createPublicShare = createAsyncThunk(
    'files/createPublicShare',
    async (shareData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await fileService.createPublicShare(shareData, token);
        } catch (error) {
            const message = 
                (error.response?.data?.message) || 
                error.message || 
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const revokePublicShare = createAsyncThunk(
    'files/revokePublicShare',
    async (fileId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await fileService.revokePublicShare(fileId, token);
        } catch (error) {
            const message = 
                (error.response?.data?.message) || 
                error.message || 
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const getStorageUsage = createAsyncThunk('files/getUsage', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.getStorageUsage(token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getFiles = createAsyncThunk('files/getAll', async (parentId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.getFiles(parentId, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const uploadFiles = createAsyncThunk('files/upload', async ({ filesFormData, parentId }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;

        // Append parentId to the FormData before sending
        filesFormData.append('parentId', parentId || 'null');

        // Progress handler
        const onUploadProgress = (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // Dispatch the progress update
            thunkAPI.dispatch(setUploadProgress(percentCompleted));
        };

        const response = await fileService.uploadFiles(filesFormData, token, onUploadProgress);

        // Reset progress on success
        thunkAPI.dispatch(setUploadProgress(0)); 
        return response;

    } catch (error) {
        // Reset progress on failure
        thunkAPI.dispatch(setUploadProgress(0)); 
               
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


export const bulkDeleteFiles = createAsyncThunk('files/bulkDelete', async (fileIds, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.bulkDeleteFiles(fileIds, token);
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


export const createFolder = createAsyncThunk('files/createFolder', async (folderData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await fileService.createFolder(folderData, token);
    } catch (error) { 
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
     }
});


export const fileSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        resetFileStatus: (state) => {
            state.status = 'idle';
            state.message = '';
        },
        // Reducer for progress updates
        setUploadProgress: (state, action) => {
            state.uploadProgress = action.payload;
        },
        // Reducer to set the current folder
        setCurrentParentId: (state, action) => {
            state.currentParentId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Getting Storage Quota details
            .addCase(getStorageUsage.fulfilled, (state, action) => {
                state.storageUsage = action.payload;
            })

            
            // public share
            .addCase(createPublicShare.fulfilled, (state, action) => {
                // Find the file and update its publicShare property
                const index = state.files.findIndex(f => f._id === action.meta.arg.fileId);
                if (index !== -1) {
                    state.files[index].publicShare = action.payload;
                }
            })
                
            .addCase(revokePublicShare.fulfilled, (state, action) => {
                // Find the file by the ID passed to the thunk
                const fileId = action.meta.arg;
                const index = state.files.findIndex(f => f._id === fileId);
                
                // Update its publicShare status
                if (index !== -1) {
                    state.files[index].publicShare.isActive = false;
                }
            })                
            // Get Files
            .addCase(getFiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.files = action.payload.files || [];
                state.currentFolder = action.payload.currentFolder || null;
                state.breadcrumbs = action.payload.breadcrumbs || [];

                // Set the parentId from the action metadata for consistency
                state.currentParentId = action.meta.arg || null;
            })
            .addCase(getFiles.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload;
                state.files = []; 
            })

            // Upload Files
            .addCase(uploadFiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.files.unshift(...action.payload); // Add new files to the beginning
            })
            
            // Delete File
            .addCase(deleteFile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Remove the deleted file from the state
                state.files = state.files.filter((file) => file._id !== action.payload.fileId);
            })
            .addCase(deleteFile.pending, (state, action) => {
                state.status = 'loading';
                state.pendingActionFileIds = [action.meta.arg]; 
                // action.meta.arg is the fileId, wrap it in an array
                // The fileId passed to the thunk
            })

            // Deleting multiple files
            .addCase(bulkDeleteFiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Filter out all the files whose IDs are in the successfully deleted list
                state.files = state.files.filter(file => !action.payload.ids.includes(file._id));
            })
            .addCase(bulkDeleteFiles.pending, (state, action) => {
                state.status = 'loading';
                state.pendingActionFileIds = action.meta.arg; 
                // action.meta.arg is already the array of fileIds
            })
            
            // Share File & Manage Share Access (they both return the updated file)
            .addCase(shareFile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Find and update the specific file in the array
                const index = state.files.findIndex((file) => file._id === action.payload._id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })
                        
            .addCase(manageShareAccess.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Same logic as sharing: find and update the file
                const index = state.files.findIndex((file) => file._id === action.payload._id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })
            
            .addCase(shareWithClass.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Find and update the specific file in the array
                const index = state.files.findIndex((file) => file._id === action.payload._id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })

            .addCase(createFolder.fulfilled, (state, action) => {
                // Add the new folder to the top of the file list
                state.files.unshift(action.payload);
            })
            
            .addCase(logout.fulfilled, (state) => {
                // Return the initial state to completely reset the slice
                return initialState;
            })
                        
            // --- Universal Pending & Rejected Handlers ---
            .addMatcher(
                (action) => action.type.endsWith('/pending'),
                // Add the 'action' parameter for correctness, even if unused here
                (state, action) => {
                    state.status = 'loading';
                    state.message = ''; // Clear previous errors
                }
            )
            .addMatcher(
                (action) => action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected'),
                // Add the 'action' parameter to the function signature
                (state, action) => {
                    // Conditionally handle success and failure
                    if (action.type.endsWith('/fulfilled')) {
                        state.status = 'succeeded';
                        // It's good practice to clear any error messages on success
                        state.message = '';
                    } else { // This handles the '/rejected' case
                        state.status = 'failed';
                        // Only set the message from the payload on rejected actions
                        state.message = action.payload;
                    }
                    // Clear the pending IDs on completion for both cases
                    state.pendingActionFileIds = [];
                }
            )
    ;},
});

export const { resetFileStatus, 
    setUploadProgress, setCurrentParentId } = fileSlice.actions;
export default fileSlice.reducer;