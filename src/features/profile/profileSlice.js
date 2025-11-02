import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from './profileService.js';
import { getDeviceId } from '../../utils/deviceId.js';
import { logout } from '../auth/authSlice.js';

// --- Async Thunks ---

// Thunk for updating user profile (name, bio, preferences)
export const updateProfile = createAsyncThunk(
    'profile/update',
    async (profileData, thunkAPI) => {
        try {
            return await profileService.updateProfile(profileData);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Thunk for changing password
export const changePassword = createAsyncThunk(
    'profile/changePassword',
    async (passwordData, thunkAPI) => {
        try {
            return await profileService.changePassword(passwordData);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Thunk for updating avatar
export const updateAvatar = createAsyncThunk(
    'profile/updateAvatar',
    async (avatarFormData, thunkAPI) => {
        try {
            return await profileService.updateAvatar(avatarFormData);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Apply to become a student
export const applyAsStudent = createAsyncThunk(
  'profile/applyAsStudent',
  async (applicationData, thunkAPI) => {
    try {
            return await profileService.applyAsStudent(applicationData);
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
);


const initialState = {
    profileStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    passwordStatus: 'idle',
    avatarStatus: 'idle',
    message: '',
        sessions: [],
        sessionStatus: 'idle',
};

// Thunk to fetch active sessions
export const fetchSessions = createAsyncThunk(
    'profile/fetchSessions',
    async (_, thunkAPI) => {
        try {
            const sessions = await profileService.getActiveSessions();
            return sessions;
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Thunk to revoke a session by deviceId
export const revokeSession = createAsyncThunk(
    'profile/revokeSession',
    async (deviceId, thunkAPI) => {
        try {
            await profileService.revokeSession(deviceId);
            // If user revoked current device, log them out
            if (deviceId === getDeviceId()) {
                // dispatch logout so UI clears immediately
                thunkAPI.dispatch(logout());
                return [];
            }
            // Return refreshed sessions list
            const sessions = await profileService.getActiveSessions();
            return sessions;
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // A reducer to reset the status, e.g., after showing a success/error message
        resetProfileStatus: (state) => {
            state.profileStatus = 'idle';
            state.passwordStatus = 'idle';
            state.avatarStatus = 'idle';
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            // Update Profile cases
            .addCase(updateProfile.pending, (state) => {
                state.profileStatus = 'loading';
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.profileStatus = 'succeeded';
                state.message = 'Profile updated successfully!';
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.profileStatus = 'failed';
                state.message = action.payload;
            })
            // Change Password cases
            .addCase(changePassword.pending, (state) => {
                state.passwordStatus = 'loading';
            })
            .addCase(changePassword.fulfilled, (state, action) => {
                state.passwordStatus = 'succeeded';
                state.message = action.payload.message;
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.passwordStatus = 'failed';
                state.message = action.payload;
            })
            // Update Avatar cases
            .addCase(updateAvatar.pending, (state) => {
                state.avatarStatus = 'loading';
            })
            .addCase(updateAvatar.fulfilled, (state, action) => {
                state.avatarStatus = 'succeeded';
                state.message = 'Avatar updated successfully!';
            })
            .addCase(updateAvatar.rejected, (state, action) => {
                state.avatarStatus = 'failed';
                state.message = action.payload;
            })

            // --- Apply as Student State Observers ---
            .addCase(applyAsStudent.pending, (state) => {
                state.profileStatus = 'loading';
            })
            .addCase(applyAsStudent.fulfilled, (state, action) => {
                state.profileStatus = 'succeeded';
                // No longer need to update the user here because the authSlice
                // is already listening for this action and will update its own user object.
                state.message = "Application submitted successfully."; 
            })
            .addCase(applyAsStudent.rejected, (state, action) => {
                state.profileStatus = 'failed';
                state.message = action.payload;
            })
            // Sessions
            .addCase(fetchSessions.pending, (state) => {
                state.sessionStatus = 'loading';
            })
            .addCase(fetchSessions.fulfilled, (state, action) => {
                state.sessionStatus = 'succeeded';
                state.sessions = action.payload;
            })
            .addCase(fetchSessions.rejected, (state, action) => {
                state.sessionStatus = 'failed';
                state.message = action.payload;
            })
            .addCase(revokeSession.pending, (state) => {
                state.sessionStatus = 'loading';
            })
            .addCase(revokeSession.fulfilled, (state, action) => {
                state.sessionStatus = 'succeeded';
                state.sessions = action.payload;
            })
            .addCase(revokeSession.rejected, (state, action) => {
                state.sessionStatus = 'failed';
                state.message = action.payload;
            })
            
    ;},
});

export const { resetProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;