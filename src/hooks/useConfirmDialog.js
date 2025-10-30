/**
 * useConfirmDialog Hook
 * 
 * Custom hook for managing ConfirmationDialog state and actions.
 * Works with the existing ConfirmationDialog component at /src/components/ConfirmationDialog.jsx
 * 
 * @returns {Object} Dialog state and control functions
 * 
 * @example
 * ```jsx
 * import useConfirmDialog from '@/hooks/useConfirmDialog';
 * import ConfirmationDialog from '@/components/ConfirmationDialog';
 * 
 * function MyComponent() {
 *   const { dialogState, showDialog, handleConfirm, handleClose } = useConfirmDialog();
 * 
 *   const handleDelete = (item) => {
 *     showDialog({
 *       title: 'Delete Item',
 *       message: `Are you sure you want to delete "${item.name}"?`,
 *       variant: 'delete',
 *       onConfirm: async () => {
 *         await deleteItem(item.id);
 *         toast.success('Deleted successfully');
 *       }
 *     });
 *   };
 * 
 *   return (
 *     <>
 *       <Button onClick={() => handleDelete(item)}>Delete</Button>
 *       <ConfirmationDialog {...dialogState} />
 *     </>
 *   );
 * }
 * ```
 */

import { useState, useCallback } from 'react';

const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    title: '',
    message: '',
    variant: 'warning',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    loading: false,
    requireConfirmation: false,
    confirmationText: 'CONFIRM',
    countdown: 0,
    onConfirm: null,
  });

  /**
   * Show confirmation dialog
   * 
   * @param {Object} config - Dialog configuration
   * @param {string} config.title - Dialog title
   * @param {string} config.message - Confirmation message
   * @param {string} [config.variant='warning'] - Dialog variant: 'success' | 'warning' | 'error' | 'info' | 'delete'
   * @param {string} [config.confirmText='Confirm'] - Confirm button text
   * @param {string} [config.cancelText='Cancel'] - Cancel button text
   * @param {boolean} [config.requireConfirmation=false] - Require text input to confirm
   * @param {string} [config.confirmationText='CONFIRM'] - Text to type for confirmation
   * @param {number} [config.countdown=0] - Countdown before enabling confirm button
   * @param {Function} config.onConfirm - Async function to execute on confirm
   */
  const showDialog = useCallback((config) => {
    setDialogState({
      open: true,
      title: config.title || 'Confirm Action',
      message: config.message || 'Are you sure you want to proceed?',
      variant: config.variant || 'warning',
      confirmText: config.confirmText || 'Confirm',
      cancelText: config.cancelText || 'Cancel',
      loading: false,
      requireConfirmation: config.requireConfirmation || false,
      confirmationText: config.confirmationText || 'CONFIRM',
      countdown: config.countdown || 0,
      onConfirm: config.onConfirm,
    });
  }, []);

  /**
   * Close dialog
   */
  const handleClose = useCallback(() => {
    setDialogState((prev) => ({
      ...prev,
      open: false,
      loading: false,
    }));
  }, []);

  /**
   * Handle confirm action
   * Executes the onConfirm callback with loading state management
   */
  const handleConfirm = useCallback(async () => {
    if (!dialogState.onConfirm) {
      handleClose();
      return;
    }

    setDialogState((prev) => ({ ...prev, loading: true }));

    try {
      await dialogState.onConfirm();
      handleClose();
    } catch (error) {
      // Error handling is done by the caller
      // Dialog stays open on error so user can retry
      console.error('Confirmation action failed:', error);
      setDialogState((prev) => ({ ...prev, loading: false }));
    }
  }, [dialogState.onConfirm, handleClose]);

  return {
    dialogState: {
      ...dialogState,
      onClose: handleClose,
      onConfirm: handleConfirm,
    },
    showDialog,
    handleConfirm,
    handleClose,
  };
};

export default useConfirmDialog;
