import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { 
    deleteFile, 
    deleteFolder, 
    bulkDeleteFiles, 
    getFiles,
    manageShareAccess, 
    revokePublicShare, 
    bulkRemoveAccess,
    renameFolder,
    moveItem
 } from '../fileSlice.js';
import fileService from '../fileService.js';

export const useFileActions = () => {
    const dispatch = useDispatch();

    const navigateToFolder = (folderId) => {
        dispatch(getFiles(folderId));
    };

    /**
     * Deletes a single item, dispatching the correct thunk
     * based on whether it's a file or a folder.
     */
    const deleteSingleItem = (item) => {
        const thunkToDispatch = item.isFolder 
            ? deleteFolder(item._id) 
            : deleteFile(item._1d || item._id);

        dispatch(thunkToDispatch)
            .unwrap()
            .then(() => toast.success(`"${item.fileName}" moved to trash.`))
            .catch((err) => toast.error(err || 'Failed to delete item.'));
    };

    /**
     * Deletes multiple items (files or folders).
     * The backend soft-delete service handles both.
     */
    const deleteBulkItems = (fileIds) => {
        dispatch(bulkDeleteFiles(fileIds))
            .unwrap()
            .then(() => toast.success(`${fileIds.length} items moved to trash.`))
            .catch((err) => toast.error(err || 'Failed to delete items.'));
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
            // Bulk Download (Files Only)
            const fileIds = selectedItems
                .filter(item => !item.isFolder)
                .map(item => item._id);
            
            if (fileIds.length > 0) {
                fileService.bulkDownloadFiles(fileIds);
            } else {
                toast.info('Bulk download is only available for files.');
            }
        }
    };

    /**
     * Renames a file or folder.
     */
    const renameItem = (itemId, newName) => {
        return dispatch(renameFolder({ folderId: itemId, newName }))
            .unwrap()
            .then(() => toast.success('Item renamed.'))
            .catch((err) => {
                toast.error(err || 'Failed to rename item.');
                throw new Error(err);
            });
    };

    /**
     * Moves an item to a new parent folder.
     */
    const moveItemToFolder = (itemId, newParentId) => {
        return dispatch(moveItem({ itemId, newParentId }))
            .unwrap()
            .then(() => toast.success('Item moved.'))
            .catch((err) => {
                toast.error(err || 'Failed to move item.');
                throw new Error(err);
            });
    };

    const revokePublicLink = (fileId) => {
        dispatch(revokePublicShare(fileId))
            .unwrap()
            .then(() => toast.success('Public link has been revoked!'))
            .catch((err) => toast.error(err || 'Failed to revoke link.'));
    };
    

    const removeSharedAccess = (fileId) => {
        dispatch(manageShareAccess({ fileId, userIdToRemove: null }))
            .unwrap()
            .then(() => toast.success('File removed from your list.'))
            .catch((err) => toast.error(err || 'Failed to remove access.'));
    };
        
    const removeBulkSharedAccess = (fileIds) => {
        return dispatch(bulkRemoveAccess(fileIds))
            .unwrap()
            .then(() => {
                toast.info(`${fileIds.length} file(s) removed from your list.`);
            })
            .catch((err) => {
                toast.error(err || 'Failed to remove files.');
            });
    };
    
    return { 
        navigateToFolder, 
        deleteSingleItem, 
        deleteBulkItems, 
        downloadItems, 
        renameItem,
        moveItemToFolder,
        removeSharedAccess, 
        removeBulkSharedAccess, 
        revokePublicLink
     };
};