/**
 * Empty State Component
 * 
 * Displays when there's no data to show in lists, tables, or sections.
 * Provides clear messaging and optional call-to-action.
 * 
 * Best practices:
 * - Use descriptive icons that match the context
 * - Provide clear, helpful messaging
 * - Include action button when user can resolve the empty state
 */

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

/**
 * Empty state component for DataGrids, lists, and sections
 * 
 * @param {Component} icon - MUI icon component to display
 * @param {string} title - Main heading text
 * @param {string} description - Supporting description text
 * @param {string} actionLabel - Button text (optional)
 * @param {Function} onAction - Button click handler (optional)
 * 
 * @example
 * ```jsx
 * <EmptyState
 *   icon={PersonAddIcon}
 *   title="No users found"
 *   description="Get started by adding your first user"
 *   actionLabel="Add User"
 *   onAction={() => setOpenModal(true)}
 * />
 * ```
 */
const EmptyState = ({
  // eslint-disable-next-line no-unused-vars
  icon: Icon = InboxIcon,
  title = 'No data found',
  description = 'There are no items to display',
  actionLabel = null,
  onAction = null,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        textAlign: 'center',
        minHeight: 300,
      }}
    >
      {/* Icon */}
      <Icon
        sx={{
          fontSize: 64,
          color: 'text.disabled',
          mb: 2,
        }}
      />
      
      {/* Title */}
      <Typography 
        variant="h6" 
        color="text.secondary" 
        gutterBottom
        sx={{ fontWeight: 500 }}
      >
        {title}
      </Typography>
      
      {/* Description */}
      <Typography 
        variant="body2" 
        color="text.disabled" 
        sx={{ mb: 3, maxWidth: 400 }}
      >
        {description}
      </Typography>
      
      {/* Optional action button */}
      {actionLabel && onAction && (
        <Button 
          variant="contained" 
          onClick={onAction}
          size="large"
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
