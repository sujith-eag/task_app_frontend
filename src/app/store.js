import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice.js'
import taskReducer from '../features/tasks/taskSlice.js'
import profileReducer from '../features/profile/profileSlice.js';
import filesReducer from '../features/files/fileSlice.js';
import aiReducer from '../features/ai/aiTaskSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    profile: profileReducer,
    files: filesReducer,
    ai: aiReducer,
  },
});

