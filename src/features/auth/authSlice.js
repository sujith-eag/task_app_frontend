import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authServices.js'

import { updateProfile, updateAvatar, applyAsStudent } from '../profile/profileSlice.js'; // actions from profileSlice

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// ASYNC THUNKS to Handle Calls to Backend
// Currently having Register, Login, Logout, ForgotPassword and ResetPassword

// Register user
export const register = createAsyncThunk(
  'auth/register',    // On dispatch(register(userData)), Redux Toolkit runs this thunk
  async (user, thunkAPI) => {
    try {
      return await authService.register(user)   // Calls authService.register(userData) (async API call).
    } catch (error) {
      // convert API error into a message string for reducer
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
    // If success, returns the payload which triggers '.fulfilled'.
    // If fail, rejects with a message which triggers '.rejected'.
  }
)

// Login user
export const login = createAsyncThunk(
  'auth/login', 
  async (user, thunkAPI) => {
    try {
      return await authService.login(user)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Logout user
export const logout = createAsyncThunk(
  'auth/logout', 
  async () => {
    await authService.logout()
  }
)

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (userData, thunkAPI) => {
    try {
      return await authService.forgotPassword(userData)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, thunkAPI) => {
    try {
      return await authService.resetPassword(resetData)
    } catch (error) {
      const message =
        (error.response?.data?.message || error.message || error.toString())
      return thunkAPI.rejectWithValue(message)
    }
  }
)
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail', 
  async (token, thunkAPI) => {
	try {
		return await authService.verifyEmail(token);
	} catch (error) {
		const message = (error.response?.data?.message) || error.message || error.toString();
		return thunkAPI.rejectWithValue(message);
	}
});



export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous Reducer (the above are Asyncronous)
    // triggered on calling dispatch(reset())
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  // To handle all the async thunk lifecycle actions: Fulfilled, Rejected, Pending 
  extraReducers: (builder) => {
    builder
      // Registration State Observers
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = null;  // No user created yet
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })

      // Login State Observers 
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      
      // Logout State
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })

      // --- PASSWORD RESET REDUCERS ---
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message // Set success message
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      
      
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.message = action.payload.message // Set success message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      
      // Cases to listen for successful profile updates
      .addCase(updateProfile.fulfilled, (state, action) => {
          // The backend returns the updated user object
          if (state.user) {
              
            const updatedUser = { ...state.user, ...action.payload };
            state.user = updatedUser;
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
          // The backend returns { avatar: 'newUrl' },
            if (state.user) {
              const updatedUser = { ...state.user, avatar: action.payload.avatar };
              state.user = updatedUser;
              localStorage.setItem('user', JSON.stringify(updatedUser));
          }
      })

      .addCase(verifyEmail.pending, (state) => {
          state.isLoading = true;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.message = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
      })

      
      .addCase(applyAsStudent.fulfilled, (state, action) => {
          // The action.payload is the full user object returned by the API
          state.user = action.payload;
          localStorage.setItem('user', JSON.stringify(action.payload));
      })      
      
  ;},
})

export const { reset } = authSlice.actions
export default authSlice.reducer