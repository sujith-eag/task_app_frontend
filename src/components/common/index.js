/**
 * Common Components Barrel Export
 * 
 * Centralizes exports for reusable components used across the admin feature.
 * Import from this file instead of individual component files for cleaner imports.
 * 
 * Note: ConfirmationDialog is located at /src/components/ConfirmationDialog.jsx
 * Import it directly: import ConfirmationDialog from '@/components/ConfirmationDialog';
 * 
 * @example
 * ```js
 * // Common components:
 * import { EmptyState, EnhancedDataGrid, DataGridSkeleton } from '@/components/common';
 * 
 * // Confirmation dialog (separate component):
 * import ConfirmationDialog from '@/components/ConfirmationDialog';
 * ```
 */

// State components
export { default as EmptyState } from './EmptyState';

// Loading components
export {
  DataGridSkeleton,
  StatsCardSkeleton,
  ChartSkeleton,
  ListItemSkeleton,
  FormSkeleton,
} from './SkeletonLoaders';

// Enhanced MUI components
export { default as EnhancedDataGrid } from './EnhancedDataGrid';
