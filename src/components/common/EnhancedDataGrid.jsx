/**
 * Enhanced DataGrid Component
 * 
 * Wrapper around MUI DataGrid with:
 * - Consistent styling across the app
 * - Automatic skeleton loading states
 * - Empty state handling
 * - Optimized default configurations
 * 
 * This component provides a standardized DataGrid experience throughout
 * the admin panel, reducing code duplication and ensuring consistency.
 */

import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import EmptyState from './EmptyState';
import { DataGridSkeleton } from './SkeletonLoaders';

/**
 * Enhanced DataGrid with consistent UX
 * 
 * @param {Array} rows - Data rows
 * @param {Array} columns - Column definitions
 * @param {boolean} isLoading - Loading state
 * @param {Object} emptyStateProps - Props for EmptyState component
 * @param {boolean} showSkeleton - Show skeleton on initial load
 * @param {Object} sx - Additional MUI sx props
 * @param {Object} dataGridProps - Additional DataGrid props
 * 
 * @example
 * ```jsx
 * <EnhancedDataGrid
 *   rows={users}
 *   columns={columns}
 *   isLoading={isLoading}
 *   emptyStateProps={{
 *     icon: PersonIcon,
 *     title: "No users found",
 *     description: "Get started by adding your first user",
 *     actionLabel: "Add User",
 *     onAction: () => setOpenModal(true)
 *   }}
 * />
 * ```
 */
const EnhancedDataGrid = ({
  rows,
  columns,
  isLoading,
  emptyStateProps = {},
  showSkeleton = true,
  height = 500,
  sx = {},
  ...dataGridProps
}) => {
  // Show skeleton loader on initial load (when rows are empty and loading)
  if (isLoading && rows.length === 0 && showSkeleton) {
    return <DataGridSkeleton />;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: height,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
        ...sx,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        disableRowSelectionOnClick
        
        // Pagination configuration
        pageSizeOptions={[5, 10, 25, 50, 100]}
        initialState={{
          pagination: { 
            paginationModel: { 
              pageSize: 10 
            } 
          },
        }}
        
        // Styling
        sx={{
          border: 'none',
          
          // Remove focus outline (already visible via MUI default styles)
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'none',
          },
          
          // Hover effect on rows
          '& .MuiDataGrid-row:hover': {
            bgcolor: 'action.hover',
            cursor: 'pointer',
          },
          
          // Column header styling
          '& .MuiDataGrid-columnHeader': {
            bgcolor: 'background.default',
            fontWeight: 600,
          },
        }}
        
        // Custom empty state
        slots={{
          noRowsOverlay: () => <EmptyState {...emptyStateProps} />,
        }}
        
        // Spread additional props
        {...dataGridProps}
      />
    </Paper>
  );
};

export default EnhancedDataGrid;
