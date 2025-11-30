import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Box, IconButton, Tooltip, Typography, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FeedbackIcon from '@mui/icons-material/Feedback';

import StatCard from './StatCard.jsx';
import AttendanceChart from './AttendanceChart.jsx';
import FeedbackChart from './FeedbackChart.jsx';
import SemesterDistributionChart from './SemesterDistributionChart.jsx';
import ActivityFeed from './ActivityFeed.jsx';
import QuickActions from './QuickActions.jsx';

import {
  fetchAllDashboardData,
  resetDashboard,
} from '../../adminSlice/adminDashboardSlice.js';

/**
 * DashboardOverview - Main dashboard statistics overview component
 * @param {Function} onTabChange - Callback to change parent tab
 */
const DashboardOverview = ({ onTabChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const {
    stats,
    attendanceTrend,
    feedbackDistribution,
    studentsBySemester,
    recentActivity,
    isStatsLoading,
    isAttendanceLoading,
    isFeedbackLoading,
    isSemesterLoading,
    isActivityLoading,
    isAllLoading,
    isError,
    message,
    lastUpdated,
  } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchAllDashboardData());
    
    return () => {
      dispatch(resetDashboard());
    };
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllDashboardData());
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return null;
    try {
      return new Date(lastUpdated).toLocaleString();
    } catch {
      return null;
    }
  };

  const handleQuickAction = (action) => {
    if (action.type === 'tab' && onTabChange) {
      onTabChange(action.value);
    } else if (action.type === 'path') {
      navigate(action.value);
    }
  };

  return (
    <Box>
      {/* Header with refresh */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Dashboard Overview
          </Typography>
          {lastUpdated && (
            <Typography variant="caption" color="text.secondary">
              Last updated: {formatLastUpdated()}
            </Typography>
          )}
        </Box>
        <Tooltip title="Refresh data">
          <IconButton
            onClick={handleRefresh}
            disabled={isAllLoading}
            color="primary"
          >
            <RefreshIcon
              sx={{
                animation: isAllLoading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Error Alert */}
      {isError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch(resetDashboard())}>
          {message || 'Failed to load dashboard data'}
        </Alert>
      )}

      {/* Stats Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Students"
            value={stats.students?.total || 0}
            trend={stats.students?.trend}
            subtitle="verified"
            icon={PeopleIcon}
            color="primary"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Teachers"
            value={stats.teachers?.total || 0}
            trend={stats.teachers?.trend}
            subtitle="active"
            icon={SchoolIcon}
            color="secondary"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Subjects"
            value={stats.subjects?.total || 0}
            icon={LibraryBooksIcon}
            color="info"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Pending Apps"
            value={stats.pendingApplications?.total || 0}
            icon={AssignmentIcon}
            color="warning"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Sessions"
            value={stats.sessions?.total || 0}
            trend={stats.sessions?.trend}
            subtitle="total"
            icon={EventNoteIcon}
            color="success"
            loading={isStatsLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
          <StatCard
            title="Feedback"
            value={stats.feedback?.total || 0}
            trend={stats.feedback?.trend}
            subtitle="received"
            icon={FeedbackIcon}
            color="error"
            loading={isStatsLoading}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <AttendanceChart
            data={attendanceTrend}
            loading={isAttendanceLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <SemesterDistributionChart
            data={studentsBySemester}
            loading={isSemesterLoading}
          />
        </Grid>
      </Grid>

      {/* Bottom Row - Feedback, Activity, and Quick Actions */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <FeedbackChart
            data={feedbackDistribution}
            loading={isFeedbackLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ActivityFeed
            activities={recentActivity}
            loading={isActivityLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <QuickActions
            onNavigate={handleQuickAction}
            pendingCount={stats.pendingApplications?.total || 0}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

DashboardOverview.propTypes = {
  onTabChange: PropTypes.func,
};

export default DashboardOverview;
