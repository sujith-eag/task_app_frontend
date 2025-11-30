import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, Box, Button, Stack, Divider, Chip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import GroupIcon from '@mui/icons-material/Group';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * QuickActions - Quick access buttons for common admin tasks
 */
const QuickActions = ({ onNavigate, pendingCount = 0 }) => {
  const actions = [
    {
      id: 'applications',
      label: 'Review Applications',
      description: 'Review pending student applications',
      icon: <PersonAddIcon />,
      color: 'warning',
      badge: pendingCount > 0 ? pendingCount : null,
      tab: 1, // Student Applications tab
    },
    {
      id: 'subjects',
      label: 'Manage Subjects',
      description: 'Add or edit subjects',
      icon: <LibraryAddIcon />,
      color: 'primary',
      tab: 2, // Subject Management tab
    },
    {
      id: 'faculty',
      label: 'Faculty Management',
      description: 'Manage faculty and assignments',
      icon: <GroupIcon />,
      color: 'secondary',
      tab: 3, // Faculty Management tab
    },
    {
      id: 'reports',
      label: 'View Reports',
      description: 'Access attendance and feedback reports',
      icon: <AssessmentIcon />,
      color: 'success',
      path: '/admin/reporting',
    },
    {
      id: 'users',
      label: 'User Management',
      description: 'Manage all users',
      icon: <SettingsIcon />,
      color: 'info',
      tab: 4, // User Management tab
    },
  ];

  const handleActionClick = (action) => {
    if (action.tab !== undefined) {
      onNavigate?.({ type: 'tab', value: action.tab });
    } else if (action.path) {
      onNavigate?.({ type: 'path', value: action.path });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Quick Actions
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Common admin tasks
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1.5}>
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outlined"
            color={action.color}
            onClick={() => handleActionClick(action)}
            startIcon={action.icon}
            endIcon={<ArrowForwardIcon fontSize="small" />}
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              px: 2,
              borderRadius: 2,
              textAlign: 'left',
              '& .MuiButton-startIcon': {
                mr: 1.5,
              },
              '& .MuiButton-endIcon': {
                ml: 'auto',
                opacity: 0,
                transition: 'opacity 0.2s, transform 0.2s',
              },
              '&:hover .MuiButton-endIcon': {
                opacity: 1,
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box>
                <Typography
                  variant="body2"
                  component="span"
                  sx={{ fontWeight: 500, display: 'block' }}
                >
                  {action.label}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  component="span"
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                >
                  {action.description}
                </Typography>
              </Box>
              {action.badge && (
                <Chip
                  label={action.badge}
                  size="small"
                  color={action.color}
                  sx={{
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
          </Button>
        ))}
      </Stack>
    </Paper>
  );
};

QuickActions.propTypes = {
  onNavigate: PropTypes.func,
  pendingCount: PropTypes.number,
};

export default QuickActions;
