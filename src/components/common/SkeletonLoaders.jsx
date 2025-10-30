/**
 * Skeleton Loaders for Admin Components
 * 
 * Provides loading placeholders for different UI elements to improve
 * perceived performance and prevent layout shifts.
 * 
 * Usage:
 * - Show skeleton while data is being fetched
 * - Replace with actual content once data arrives
 * - Maintains layout structure during loading
 */

import React from 'react';
import { Box, Paper, Skeleton, Stack } from '@mui/material';

/**
 * DataGrid skeleton loader
 * 
 * Mimics the structure of a MUI DataGrid with header and rows
 * 
 * @param {number} rows - Number of skeleton rows to display
 * @param {number} columns - Number of columns in the grid
 */
export const DataGridSkeleton = ({ rows = 5, columns = 6 }) => {
  return (
    <Paper sx={{ p: 2, minHeight: 400 }}>
      <Stack spacing={2}>
        {/* Header row */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton 
              key={`header-${i}`} 
              variant="rectangular" 
              height={40} 
              sx={{ flex: 1, borderRadius: 1 }} 
            />
          ))}
        </Box>

        {/* Data rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <Box key={`row-${rowIndex}`} sx={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={`cell-${rowIndex}-${colIndex}`} 
                variant="text" 
                sx={{ flex: 1, fontSize: '1rem' }} 
              />
            ))}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

/**
 * Stats card skeleton
 * 
 * Used for dashboard statistics cards during initial load
 */
export const StatsCardSkeleton = () => {
  return (
    <Paper sx={{ p: 3, height: 140 }}>
      <Stack spacing={1}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="rectangular" width="40%" height={32} sx={{ borderRadius: 1 }} />
        <Skeleton variant="text" width="50%" height={20} />
      </Stack>
    </Paper>
  );
};

/**
 * Chart skeleton
 * 
 * Placeholder for chart components (Recharts, etc.)
 * 
 * @param {number} height - Height of the chart container
 */
export const ChartSkeleton = ({ height = 300 }) => {
  return (
    <Paper sx={{ p: 2, height }}>
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height="100%" 
        sx={{ borderRadius: 1 }}
      />
    </Paper>
  );
};

/**
 * List item skeleton
 * 
 * For lists, activity feeds, etc.
 */
export const ListItemSkeleton = ({ count = 5 }) => {
  return (
    <Stack spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="60%" />
          </Box>
        </Box>
      ))}
    </Stack>
  );
};

/**
 * Form skeleton
 * 
 * For modal forms and edit dialogs
 */
export const FormSkeleton = ({ fields = 4 }) => {
  return (
    <Stack spacing={3}>
      {Array.from({ length: fields }).map((_, i) => (
        <Box key={i}>
          <Skeleton variant="text" width="30%" height={20} sx={{ mb: 1 }} />
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ borderRadius: 1 }} />
        </Box>
      ))}
    </Stack>
  );
};
