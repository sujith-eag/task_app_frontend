import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentParentId } from '../fileSlice.js';
import fileService from '../fileService.js';
import {
    useDeleteFile,
    useDeleteFolder,
    useBulkDelete,
    useRestoreFile,
    usePurgeFile,
    useEmptyTrash,
    useBulkRestore,
    useBulkPurge,
    useRenameItem,
    useMoveItem,
    useRevokePublicShare,
    useBulkRemoveAccess,
    useShareFile,
    useManageShareAccess,
} from '../useFileQueries.js';
import { useFileOperations } from './FileOperationContext.jsx';

export const useFileActions = () => {
    const dispatch = useDispatch();

    const { startOperation, stopOperation } = useFileOperations();

    const navigateToFolder = (folderId) => {
        // Keep current folder in Redux (client UI state). Server state comes from React Query.
        dispatch(setCurrentParentId(folderId));
    };

    /**
     * Deletes a single item, dispatching the correct thunk
     * based on whether it's a file or a folder.
     */
    // Mutations from React Query (use mutateAsync so callers can await)
    const { mutateAsync: deleteFileMutate } = useDeleteFile();
    const { mutateAsync: deleteFolderMutate } = useDeleteFolder();
    const { mutateAsync: bulkDeleteMutate } = useBulkDelete();
    const { mutateAsync: restoreFileMutate } = useRestoreFile();
    const { mutateAsync: purgeFileMutate } = usePurgeFile();
    const { mutateAsync: emptyTrashMutate } = useEmptyTrash();
    const { mutateAsync: bulkRestoreMutate } = useBulkRestore();
    const { mutateAsync: bulkPurgeMutate } = useBulkPurge();
    const { mutateAsync: renameItemMutate } = useRenameItem();
    const { mutateAsync: moveItemMutate } = useMoveItem();
    const { mutateAsync: revokePublicShareMutate } = useRevokePublicShare();
    const { mutateAsync: bulkRemoveAccessMutate } = useBulkRemoveAccess();
    const { mutateAsync: shareFileMutate } = useShareFile();
    const { mutateAsync: manageShareAccessMutate } = useManageShareAccess();

    const deleteSingleItem = async (item) => {
        startOperation(item._id, 'deleting');
        const id = item._id;
        try {
            if (item.isFolder) {
                return await deleteFolderMutate(id);
            }
            return await deleteFileMutate(id);
        } finally {
            stopOperation(id);
        }
    };

    /**
     * Deletes multiple items (files or folders).
     * The backend soft-delete service handles both.
     */
    const deleteBulkItems = async (fileIds) => {
        // Mark all items as deleting
        fileIds.forEach(id => startOperation(id, 'deleting'));
        try {
            return await bulkDeleteMutate(fileIds);
        } finally {
            fileIds.forEach(id => stopOperation(id));
        }
    };

    /* Trash actions */
    const restoreItem = async (fileId) => {
        startOperation(fileId, 'restoring');
        try {
            return await restoreFileMutate(fileId);
        } finally {
            stopOperation(fileId);
        }
    };

    const purgeItem = async (fileId) => {
        startOperation(fileId, 'purging');
        try {
            return await purgeFileMutate(fileId);
        } finally {
            stopOperation(fileId);
        }
    };

    const emptyTrash = async () => {
        try {
            return await emptyTrashMutate();
        } catch (e) {
            // toast handled by mutation
        }
    };

    const bulkRestoreItems = async (fileIds) => {
        fileIds.forEach(id => startOperation(id, 'restoring'));
        try {
            return await bulkRestoreMutate(fileIds);
        } finally {
            fileIds.forEach(id => stopOperation(id));
        }
    };

    const bulkPurgeItems = async (fileIds) => {
        fileIds.forEach(id => startOperation(id, 'purging'));
        try {
            return await bulkPurgeMutate(fileIds);
        } finally {
            fileIds.forEach(id => stopOperation(id));
        }
    };

	/**
     * Main handler for downloading selected items.
     * Handles single file, single folder, or bulk file downloads.
     */
    const downloadItems = (selectedItems) => {
        if (!selectedItems || selectedItems.length === 0) return;

        if (selectedItems.length === 1) {
            const item = selectedItems[0];
            if (item.isFolder) {
                // Single Folder Download
                toast.info(`Preparing download for "${item.fileName}"...`);
                fileService.downloadFolderAsZip(item._id)
                    .catch(() => toast.error('Folder download failed.'));
            } else {
                // Single File Download
                fileService.getDownloadLink(item._id)
                    .then(({ url }) => window.open(url, '_blank'))
                    .catch(() => toast.error('Could not get download link.'));
            }
        } else {
            // Bulk Download (Files and Folders). Backend will expand folders.
            const ids = selectedItems.map(item => item._id);
            toast.info('Preparing download...');
            fileService.bulkDownloadFiles(ids).catch((err) => {
                const msg = err?.response?.data?.message || err?.message || 'Bulk download failed.';
                toast.error(msg);
            });
        }
    };

    /**
     * Renames a file or folder.
     */
    const renameItem = async (itemId, newName) => {
        startOperation(itemId, 'renaming');
        try {
            // mutateAsync expects the same variable shape as the underlying mutation: { folderId, renameData }
            return await renameItemMutate({ folderId: itemId, renameData: { newName } });
        } finally {
            stopOperation(itemId);
        }
    };

    /**
     * Moves an item to a new parent folder.
     */
    const moveItemToFolder = async (itemId, newParentId, oldParentId = null) => {
        startOperation(itemId, 'moving');
        try {
            return await moveItemMutate({ itemId, newParentId, oldParentId });
        } finally {
            stopOperation(itemId);
        }
    };

    const revokePublicLink = async (fileId) => {
        startOperation(fileId, 'revoking');
        try {
            return await revokePublicShareMutate(fileId);
        } finally {
            stopOperation(fileId);
        }
    };
    

    const removeSharedAccess = async (fileId) => {
        startOperation(fileId, 'removing-access');
        try {
            return await manageShareAccessMutate({ fileId, userIdToRemove: null });
        } finally {
            stopOperation(fileId);
        }
    };
        
    const removeBulkSharedAccess = async (fileIds) => {
        fileIds.forEach(id => startOperation(id, 'removing-access'));
        try {
            return await bulkRemoveAccessMutate(fileIds);
        } finally {
            fileIds.forEach(id => stopOperation(id));
        }
    };
    
        const actions = { 
                navigateToFolder, 
                deleteSingleItem, 
                deleteBulkItems, 
                downloadItems, 
                renameItem,
                moveItemToFolder,
                removeSharedAccess, 
                removeBulkSharedAccess, 
                revokePublicLink,
                // Trash actions
                restoreItem,
                purgeItem,
                emptyTrash,
                bulkRestoreItems,
                bulkPurgeItems
        };

        // Useful for debugging in the browser console when Vite bundles this module
        try {
            // eslint-disable-next-line no-console
            console.debug && console.debug('useFileActions initialized with actions:', Object.keys(actions));
        } catch (e) {
            // ignore
        }

        return actions;
};