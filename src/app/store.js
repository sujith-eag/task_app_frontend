import { configureStore } from '@reduxjs/toolkit';

import adminReducer from '../features/admin/adminSlice.js';
import aiReducer from '../features/ai/aiTaskSlice.js';
import authReducer from '../features/auth/authSlice.js'
import chatReducer from '../features/chat/chatSlice.js';
import filesReducer from '../features/files/fileSlice.js';
import profileReducer from '../features/profile/profileSlice.js';
import studentReducer from '../features/student/studentSlice.js';
import taskReducer from '../features/tasks/taskSlice.js'
import teacherReducer from '../features/teacher/teacherSlice.js';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    ai: aiReducer,
    auth: authReducer,
    chat: chatReducer,
    files: filesReducer,    
    profile: profileReducer,    
    student: studentReducer,    
    tasks: taskReducer,
    teacher: teacherReducer,
  },
});