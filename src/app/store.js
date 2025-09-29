import { configureStore } from '@reduxjs/toolkit';

import adminSubjectReducer from '../features/admin/adminSlice/adminSubjectSlice.js';
import adminUserReducer from '../features/admin/adminSlice/adminUserSlice.js';
import adminTeacherReducer from '../features/admin/adminSlice/adminTeacherSlice.js';
import adminReportingReducer from '../features/admin/adminSlice/adminReportingSlice.js';

import aiReducer from '../features/ai/aiTaskSlice.js';
import authReducer from '../features/auth/authSlice.js';
import chatReducer from '../features/chat/chatSlice.js';
import filesReducer from '../features/files/fileSlice.js';
import profileReducer from '../features/profile/profileSlice.js';
import studentReducer from '../features/student/studentSlice.js';
import taskReducer from '../features/tasks/taskSlice.js';
import teacherReducer from '../features/teacher/teacherSlice.js';


export const store = configureStore({
  reducer: {
    adminSubjects: adminSubjectReducer,
    adminUsers: adminUserReducer,
    adminTeachers: adminTeacherReducer,
    adminReporting: adminReportingReducer,

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