import { configureStore } from '@reduxjs/toolkit';

import authReducer from '../features/auth/authSlice.js'
import taskReducer from '../features/tasks/taskSlice.js'
import profileReducer from '../features/profile/profileSlice.js';
import filesReducer from '../features/files/fileSlice.js';
import aiReducer from '../features/ai/aiTaskSlice.js';
import chatReducer from '../features/chat/chatSlice.js';

import adminReducer from '../features/admin/adminSlice.js';
import teacherReducer from '../features/teacher/teacherSlice.js';
import studentReducer from '../features/student/studentSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    profile: profileReducer,
    files: filesReducer,
    ai: aiReducer,
    chat: chatReducer,
    admin: adminReducer,
    teacher: teacherReducer,
    student: studentReducer,
  },
});

