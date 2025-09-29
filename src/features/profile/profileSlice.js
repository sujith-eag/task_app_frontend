import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from './profileService.js';

// --- Async Thunks ---

// Thunk for updating user profile (name, bio, preferences)
export const updateProfile = createAsyncThunk(
    'profile/update',
    async (profileData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await profileService.updateProfile(profileData, token);
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
            const token = thunkAPI.getState().auth.user.token;
            return await profileService.changePassword(passwordData, token);
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
            const token = thunkAPI.getState().auth.user.token;
            return await profileService.updateAvatar(avatarFormData, token);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Apply to become a student
export const applyAsStudent = createAsyncThunk(
  'auth/applyAsStudent',
  async (applicationData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await authService.applyAsStudent(applicationData, token);
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
};

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
                state.isLoading = true;
            })
            .addCase(applyAsStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
                
                // Update the user object in the state with the new pending status
                if (state.user) {
                const updatedUserDetails = {
                    ...state.user.studentDetails,
                    applicationStatus: action.payload.applicationStatus,
                };
                const updatedUser = { ...state.user, studentDetails: updatedUserDetails };
                state.user = updatedUser;
                localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            })
            .addCase(applyAsStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
    ;},
});

export const { resetProfileStatus } = profileSlice.actions;
export default profileSlice.reducer;