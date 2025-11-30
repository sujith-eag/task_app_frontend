import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Box,
  Skeleton,
  Divider,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ClassIcon from '@mui/icons-material/Class';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { formatDistanceToNow } from 'date-fns';

// Activity type configurations
const ACTIVITY_CONFIG = {
  application: {
    pending: {
      icon: <HourglassEmptyIcon />,
      color: 'warning',
      bgColor: 'warning.light',
      label: 'Pending',
    },
    approved: {
      icon: <CheckCircleIcon />,
      color: 'success',
      bgColor: 'success.light',
      label: 'Approved',
    },
    rejected: {
      icon: <CancelIcon />,
      color: 'error',
      bgColor: 'error.light',
      label: 'Rejected',
    },
  },
  session: {
    created: {
      icon: <ClassIcon />,
      color: 'info',
      bgColor: 'info.light',
      label: 'Session',
    },
  },
};

/**
 * ActivityFeed - Displays recent activity in the system
 */
const ActivityFeed = ({ activities = [], loading = false }) => {
  if (loading) {
    return (
      <Paper sx={{ p: 2, height: 400 }}>
        <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Paper>
    );
  }

  const getActivityConfig = (activity) => {
    const typeConfig = ACTIVITY_CONFIG[activity.type];
    if (!typeConfig) {
      return {
        icon: <PersonAddIcon />,
        color: 'default',
        bgColor: 'grey.200',
        label: activity.action,
      };
    }
    return typeConfig[activity.action] || {
      icon: <PersonAddIcon />,
      color: 'default',
      bgColor: 'grey.200',
      label: activity.action,
    };
  };

  const formatTimestamp = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  const isEmpty = activities.length === 0;

  return (
    <Paper
      sx={{
        p: 2,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Recent Activity
      </Typography>

      {isEmpty ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography color="text.secondary">
            No recent activity
          </Typography>
        </Box>
      ) : (
        <List
          sx={{
            flex: 1,
            overflow: 'auto',
            '& .MuiListItem-root': {
              px: 0,
            },
          }}
        >
          {activities.map((activity, index) => {
            const config = getActivityConfig(activity);
            const isLast = index === activities.length - 1;

            return (
              <React.Fragment key={activity.id || index}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: config.bgColor,
                        color: `${config.color}.main`,
                        width: 36,
                        height: 36,
                      }}
                    >
                      {config.icon}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {activity.user}
                        </Typography>
                        <Chip
                          label={config.label}
                          size="small"
                          color={config.color}
                          variant="outlined"
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box component="span">
                        {activity.type === 'session' && activity.subject && (
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ display: 'block' }}
                          >
                            Created session for {activity.subject}
                          </Typography>
                        )}
                        {activity.type === 'application' && (
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ display: 'block' }}
                          >
                            Student application {activity.action}
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          component="span"
                        >
                          {formatTimestamp(activity.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {!isLast && <Divider variant="inset" component="li" />}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

ActivityFeed.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.oneOf(['application', 'session']).isRequired,
      action: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      subject: PropTypes.string,
      timestamp: PropTypes.string.isRequired,
    })
  ),
  loading: PropTypes.bool,
};

export default ActivityFeed;
