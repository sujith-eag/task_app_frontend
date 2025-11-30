import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../adminService';

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch dashboard overview statistics
 */
export const fetchDashboardStats = createAsyncThunk(
  'adminDashboard/fetchStats',
  async (_, thunkAPI) => {
    try {
      return await adminService.getDashboardStats();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Fetch 7-day attendance trend for charts
 */
export const fetchAttendanceTrend = createAsyncThunk(
  'adminDashboard/fetchAttendanceTrend',
  async (_, thunkAPI) => {
    try {
      return await adminService.getAttendanceTrend();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Fetch feedback distribution for charts
 */
export const fetchFeedbackDistribution = createAsyncThunk(
  'adminDashboard/fetchFeedbackDistribution',
  async (_, thunkAPI) => {
    try {
      return await adminService.getFeedbackDistribution();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Fetch recent activity for activity feed
 */
export const fetchRecentActivity = createAsyncThunk(
  'adminDashboard/fetchRecentActivity',
  async (limit = 10, thunkAPI) => {
    try {
      return await adminService.getRecentActivity(limit);
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Fetch student distribution by semester
 */
export const fetchStudentsBySemester = createAsyncThunk(
  'adminDashboard/fetchStudentsBySemester',
  async (_, thunkAPI) => {
    try {
      return await adminService.getStudentsBySemester();
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

/**
 * Fetch all dashboard data at once
 */
export const fetchAllDashboardData = createAsyncThunk(
  'adminDashboard/fetchAll',
  async (_, thunkAPI) => {
    try {
      // Dispatch all individual thunks in parallel
      await Promise.all([
        thunkAPI.dispatch(fetchDashboardStats()),
        thunkAPI.dispatch(fetchAttendanceTrend()),
        thunkAPI.dispatch(fetchFeedbackDistribution()),
        thunkAPI.dispatch(fetchRecentActivity()),
        thunkAPI.dispatch(fetchStudentsBySemester()),
      ]);
      return true;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ============================================================================
// Initial State
// ============================================================================

const initialState = {
  // Stats overview
  stats: {
    students: { total: 0, trend: 0, last30Days: 0 },
    teachers: { total: 0, trend: 0, last30Days: 0 },
    subjects: { total: 0 },
    pendingApplications: { total: 0 },
    sessions: { total: 0, trend: 0, last30Days: 0 },
    feedback: { total: 0, trend: 0, last30Days: 0 },
  },
  
  // Chart data
  attendanceTrend: [],
  feedbackDistribution: {
    summary: { totalFeedback: 0, averageRatings: {} },
    breakdown: [],
  },
  studentsBySemester: [],
  
  // Activity feed
  recentActivity: [],
  
  // Loading states
  isStatsLoading: false,
  isAttendanceLoading: false,
  isFeedbackLoading: false,
  isActivityLoading: false,
  isSemesterLoading: false,
  isAllLoading: false,
  
  // Error states
  isError: false,
  message: '',
  
  // Last updated timestamp
  lastUpdated: null,
};

// ============================================================================
// Slice Definition
// ============================================================================

export const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState,
  reducers: {
    resetDashboard: (state) => {
      state.isError = false;
      state.message = '';
    },
    clearDashboard: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ---- Dashboard Stats ----
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isStatsLoading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isStatsLoading = false;
        const payload = action.payload;
        if (payload?.data?.stats) {
          state.stats = payload.data.stats;
        } else if (payload?.stats) {
          state.stats = payload.stats;
        }
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isStatsLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // ---- Attendance Trend ----
      .addCase(fetchAttendanceTrend.pending, (state) => {
        state.isAttendanceLoading = true;
      })
      .addCase(fetchAttendanceTrend.fulfilled, (state, action) => {
        state.isAttendanceLoading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.attendanceTrend = payload;
        } else if (Array.isArray(payload?.data)) {
          state.attendanceTrend = payload.data;
        }
      })
      .addCase(fetchAttendanceTrend.rejected, (state, action) => {
        state.isAttendanceLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // ---- Feedback Distribution ----
      .addCase(fetchFeedbackDistribution.pending, (state) => {
        state.isFeedbackLoading = true;
      })
      .addCase(fetchFeedbackDistribution.fulfilled, (state, action) => {
        state.isFeedbackLoading = false;
        const payload = action.payload;
        if (payload?.data) {
          state.feedbackDistribution = payload.data;
        } else if (payload?.summary) {
          state.feedbackDistribution = payload;
        }
      })
      .addCase(fetchFeedbackDistribution.rejected, (state, action) => {
        state.isFeedbackLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // ---- Recent Activity ----
      .addCase(fetchRecentActivity.pending, (state) => {
        state.isActivityLoading = true;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.isActivityLoading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.recentActivity = payload;
        } else if (Array.isArray(payload?.data)) {
          state.recentActivity = payload.data;
        }
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.isActivityLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // ---- Students By Semester ----
      .addCase(fetchStudentsBySemester.pending, (state) => {
        state.isSemesterLoading = true;
      })
      .addCase(fetchStudentsBySemester.fulfilled, (state, action) => {
        state.isSemesterLoading = false;
        const payload = action.payload;
        if (Array.isArray(payload)) {
          state.studentsBySemester = payload;
        } else if (Array.isArray(payload?.data)) {
          state.studentsBySemester = payload.data;
        }
      })
      .addCase(fetchStudentsBySemester.rejected, (state, action) => {
        state.isSemesterLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      
      // ---- Fetch All Dashboard Data ----
      .addCase(fetchAllDashboardData.pending, (state) => {
        state.isAllLoading = true;
      })
      .addCase(fetchAllDashboardData.fulfilled, (state) => {
        state.isAllLoading = false;
      })
      .addCase(fetchAllDashboardData.rejected, (state, action) => {
        state.isAllLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetDashboard, clearDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
