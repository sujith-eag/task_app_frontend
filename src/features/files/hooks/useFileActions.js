import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteFile, bulkDeleteFiles, getFiles,
    manageShareAccess, revokePublicShare, bulkRemoveAccess
 } from '../fileSlice.js';
import fileService from '../fileService.js';

export const useFileActions = () => {
    const dispatch = useDispatch();

    const user = useSelector(state => state.auth.user); // user for token

    const navigateToFolder = (folderId) => {
        dispatch(getFiles(folderId));
    };

    const deleteSingleFile = (file) => {
        dispatch(deleteFile(file._id))
            .unwrap()
            .then(() => toast.success(`"${file.fileName}" deleted.`))
            .catch((err) => toast.error(err || 'Failed to delete file.'));
    };

    const deleteBulkFiles = (fileIds) => {
        dispatch(bulkDeleteFiles(fileIds))
            .unwrap()
            .then(() => toast.success(`${fileIds.length} files deleted.`))
            .catch((err) => toast.error(err || 'Failed to delete files.'));
    };

	// --- Main Handler for Download to dispatch different calls ---
    const downloadFiles = (selectedIds, userToken) => {
        if (selectedIds.length === 1) {
            fileService.getDownloadLink(selectedIds[0], userToken)
                .then(({ url }) => window.open(url, '_blank')) // Trigger download in a new tab
                .catch(() => toast.error('Could not get download link.'));
        } else if (selectedIds.length > 1) {
            fileService.bulkDownloadFiles(selectedIds, userToken);
        }
    };

    const downloadSingleFile = (fileId) => {
        fileService.getDownloadLink(fileId, user.token)
            .then(({ url }) => window.open(url, '_blank'))
            .catch(() => toast.error('Could not get download link.'));
    };

    const revokePublicLink = (fileId) => {
        dispatch(revokePublicShare(fileId))
            .unwrap()
            .then(() => toast.success('Public link has been revoked!'))
            .catch((err) => toast.error(err || 'Failed to revoke link.'));
    };
    

    const removeSharedAccess = (fileId) => {
        // Assuming removing self, so userIdToRemove is null
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
    
    return { navigateToFolder, deleteSingleFile, deleteBulkFiles, 
        downloadFiles, downloadSingleFile, 
        removeSharedAccess, removeBulkSharedAccess, 
        revokePublicLink
     };
};