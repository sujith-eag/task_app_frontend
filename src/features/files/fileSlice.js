import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fileService from './fileService.js';
import { logout } from '../auth/authSlice.js';

import { createSelector } from '@reduxjs/toolkit';

// --- Async Thunks ---

const initialState = {
    files: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
                    // This ONLY tracks list-level actions like getFiles
    itemStatus: {}, // Tracks status of individual files, 
                    // { 'fileId1': 'deleting', 'fileId2': 'sharing' }    
    // uploadProgress will store per-file progress as an object { '<fileName>': percent }
    // uploadProgressOverall stores a single numeric percent for aggregate UI
    uploadProgress: {},
    uploadProgressOverall: 0,
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


// Input selectors
const selectFiles = (state) => state.files.files;
const selectUserId = (state) => state.auth.user._id;

export const selectMyFiles = createSelector(
  [selectFiles, selectUserId],
  (files, userId) => files.filter(file => file.user && file.user._id === userId)
);

export const selectSharedFiles = createSelector(
  [selectFiles, selectUserId],
  (files, userId) => files.filter(file => file.user && file.user._id !== userId)
);

export const selectMySharedFiles = createSelector(
  [selectFiles, selectUserId],
  (files, userId) => files.filter(f =>
    f.user && f.user._id === userId &&
        ( (Array.isArray(f.sharedWith) && f.sharedWith.length > 0) || 
            (f.publicShare && f.publicShare.isActive && (
                    // if expiresAt exists, only include if it's in the future
                    !f.publicShare.expiresAt || new Date(f.publicShare.expiresAt) > new Date()
            ))
        )
  )
);




export const createPublicShare = createAsyncThunk(
    'files/createPublicShare',
    async (shareData, thunkAPI) => {
        try {
            return await fileService.createPublicShare(shareData);
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
            return await fileService.revokePublicShare(fileId);
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
        return await fileService.getStorageUsage();
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const getFiles = createAsyncThunk('files/getAll', async (parentId, thunkAPI) => {
    try {
        return await fileService.getFiles(parentId);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const uploadFiles = createAsyncThunk('files/upload', async ({ filesFormData, parentId }, thunkAPI) => {
    try {
    // No token needed; apiClient will send cookies
        // Extract files and uploadKeys arrays from the FormData
        const files = filesFormData.getAll('files') || [];
        const keys = filesFormData.getAll('uploadKeys') || [];

        // Build parallel requests, each with its own FormData
        const requests = files.map((file, idx) => {
            const uploadKey = keys[idx] || file.name;
            const fd = new FormData();
            fd.append('files', file);
            fd.append('parentId', parentId || 'null');

            // Each onUploadProgress uses the uploadKey captured in closure
            const onUploadProgress = (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // Dispatch per-file progress keyed by uploadKey
                thunkAPI.dispatch(setUploadProgress({ [uploadKey]: percentCompleted }));

                // Compute overall as average of present per-file progresses
                const currentProgresses = Object.values(thunkAPI.getState().files.uploadProgress || {});
                const sum = currentProgresses.reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
                const overall = currentProgresses.length ? Math.round(sum / currentProgresses.length) : 0;
                thunkAPI.dispatch(setUploadProgress(overall));
            };

            // Use the existing fileService.uploadFiles which accepts an onUploadProgress handler
            return fileService.uploadFiles(fd, undefined, onUploadProgress);
        });

        // Execute all uploads in parallel
        const responses = await Promise.all(requests);

        // Flatten responses
        const uploaded = responses.flat();

        // Reset progress on success
        thunkAPI.dispatch(setUploadProgress(0));
        return uploaded;

    } catch (error) {
        // Reset progress on failure
        thunkAPI.dispatch(setUploadProgress(0));

        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const deleteFile = createAsyncThunk('files/delete', async (fileId, thunkAPI) => {
    try {
        return await fileService.deleteFile(fileId);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const bulkDeleteFiles = createAsyncThunk('files/bulkDelete', async (fileIds, thunkAPI) => {
    try {
        return await fileService.bulkDeleteFiles(fileIds);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const shareFile = createAsyncThunk('files/share', async (shareData, thunkAPI) => {
    try {
        const { fileId, userIdToShareWith } = shareData;
        return await fileService.shareFile(fileId, userIdToShareWith);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const manageShareAccess = createAsyncThunk('files/manageShare', async (shareData, thunkAPI) => {
    try {
        const { fileId, userIdToRemove } = shareData;
        return await fileService.manageShareAccess(fileId, userIdToRemove);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const bulkRemoveAccess = createAsyncThunk('files/bulkRemove', async (fileIds, thunkAPI) => {
    try {
        return await fileService.bulkRemoveAccess(fileIds);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const shareWithClass = createAsyncThunk('files/shareClass', async (data, thunkAPI) => {
    try {
        return await fileService.shareWithClass(data);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


export const createFolder = createAsyncThunk('files/createFolder', async (folderData, thunkAPI) => {
    try {
        return await fileService.createFolder(folderData);
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
        // Accepts either an object like { filename: percent } to merge per-file progress
        // or a number to set the overall percent (or 0 to reset both)
        setUploadProgress: (state, action) => {
            const payload = action.payload;
            if (payload === 0) {
                state.uploadProgress = {};
                state.uploadProgressOverall = 0;
            } else if (typeof payload === 'number') {
                state.uploadProgressOverall = payload;
            } else if (typeof payload === 'object') {
                // Merge per-file progress into state.uploadProgress
                state.uploadProgress = { ...state.uploadProgress, ...payload };
            }
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
                delete state.itemStatus[action.meta.arg]; // clear status on success
                const fileId = action.meta.arg;
                const index = state.files.findIndex(f => f._id === fileId);
                if (index !== -1) {
                    state.files[index].publicShare.isActive = false;
                    // clear the whole object for cleanliness
                    state.files[index].publicShare.code = null;
                    state.files[index].publicShare.expiresAt = null;
                }
            })
            .addCase(revokePublicShare.pending, (state, action) => {
                state.itemStatus[action.meta.arg] = 'revoking';
            })
            .addCase(revokePublicShare.rejected, (state, action) => {
                state.itemStatus[action.meta.arg] = 'error';
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
            .addCase(uploadFiles.pending, (state, action) => {
                state.status = 'loading';
                // reset progress
                state.uploadProgress = {};
                state.uploadProgressOverall = 0;
            })
            .addCase(uploadFiles.rejected, (state, action) => {
                state.status = 'failed';
                state.message = action.payload;
                // reset progress on error
                state.uploadProgress = {};
                state.uploadProgressOverall = 0;
            })
            
            // Delete File
            .addCase(deleteFile.fulfilled, (state, action) => {
                // Remove the status and the file
                delete state.itemStatus[action.payload.fileId];
                state.files = state.files.filter((file) => file._id !== action.payload.fileId);
                // Remove the deleted file from the state
            })
            .addCase(deleteFile.pending, (state, action) => {
                // action.meta.arg is the fileId passed to the thunk
                state.itemStatus[action.meta.arg] = 'deleting'; 

                // state.status = 'loading';
                // state.pendingActionFileIds = [action.meta.arg]; 
            })
            .addCase(deleteFile.rejected, (state, action) => {
                delete state.itemStatus[action.meta.arg];
                // Optionally set a specific error message for this item
                state.itemStatus[action.meta.arg] = 'error'; 
            })
            
            
            // Deleting multiple files
            .addCase(bulkDeleteFiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Filter out all the files whose IDs are in the successfully deleted list
                state.files = state.files.filter(file => !action.payload.ids.includes(file._id));
            })
            .addCase(bulkDeleteFiles.pending, (state, action) => {
                state.status = 'loading';
            })
            
            // Share File & Manage Share Access (they both return the updated file)
            .addCase(shareFile.pending, (state, action) => {
                state.itemStatus[action.meta.arg.fileId] = 'sharing';
            })
            .addCase(shareFile.fulfilled, (state, action) => {
                delete state.itemStatus[action.meta.arg.fileId];
                // Find and update the specific file in the array
                const index = state.files.findIndex((file) => file._id === action.payload._id);
                if (index !== -1) {
                    state.files[index] = action.payload;
                }
            })
            .addCase(shareFile.rejected, (state, action) => {
                delete state.itemStatus[action.meta.arg.fileId];
                state.itemStatus[action.meta.arg.fileId] = 'error';
            })

                        
            // --- Manage Share Access (Remove) ---
            .addCase(manageShareAccess.pending, (state, action) => {
                state.itemStatus[action.meta.arg.fileId] = 'removing';
            })
            .addCase(manageShareAccess.fulfilled, (state, action) => {
                delete state.itemStatus[action.meta.arg.fileId];
                // For a user removing their own access, the file disappears from their list
                if (action.meta.arg.userIdToRemove === null) {
                    state.files = state.files.filter((file) => file._id !== action.payload._id);
                } else {
                    // If an owner is managing access, the file is just updated
                    const index = state.files.findIndex((file) => file._id === action.payload._id);
                    if (index !== -1) {
                        state.files[index] = action.payload;
                    }
                }
            })
            .addCase(manageShareAccess.rejected, (state, action) => {
                delete state.itemStatus[action.meta.arg.fileId];
                state.itemStatus[action.meta.arg.fileId] = 'error';
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

            
            .addCase(bulkRemoveAccess.fulfilled, (state, action) => {
                // Filter out the files that were just removed from the user's view
                state.files = state.files.filter(file => !action.payload.ids.includes(file._id));
            })

            .addMatcher(
                // Match only actions that affect the entire list
                (action) => ['files/getAll/pending', 'files/bulkDelete/pending'].includes(action.type),
                (state) => {
                    state.status = 'loading';
                    state.message = ''; // Clear previous errors
                }
            )
            .addMatcher(
                (action) => ['files/getAll/fulfilled', 'files/getAll/rejected', 'files/bulkDelete/fulfilled', 'files/bulkDelete/rejected'].includes(action.type),
                (state, action) => {
                    if (action.type.endsWith('/fulfilled')) {
                        state.status = 'succeeded';
                        state.message = '';
                    } else { // This handles '/rejected'
                        state.status = 'failed';
                        state.message = action.payload;
                    }
                }
            )
            
    ;},
});

export const { resetFileStatus, 
    setUploadProgress, setCurrentParentId } = fileSlice.actions;
export default fileSlice.reducer;