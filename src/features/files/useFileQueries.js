import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import fileService from './fileService.js';

// --- Query Hooks (Data Fetching) ---

export const useGetFiles = (parentId) => {
  return useQuery({
    queryKey: ['files', parentId || 'root'],
    queryFn: () => fileService.getFiles(parentId),
  });
};

export const useGetStorageUsage = () => {
  return useQuery({
    queryKey: ['storageUsage'],
    queryFn: fileService.getStorageUsage,
  });
};

export const useGetSharedWithMe = () => {
  return useQuery({
    queryKey: ['files', 'sharedWithMe'],
    queryFn: fileService.getFilesSharedWithMe,
  });
};

export const useGetMySharedFiles = () => {
  return useQuery({
    queryKey: ['files', 'mySharedFiles'],
    queryFn: fileService.getFilesIShared,
  });
};

// --- Mutation Helpers ---

const useFileMutation = (mutationFn) => {
  const queryClient = useQueryClient();
  const currentParentId = useSelector((state) => state.files.currentParentId);

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(['files', currentParentId || 'root']);
    },
  });
};

// --- File & Folder Mutations ---

export const useCreateFolder = () => {
  const mutation = useFileMutation(fileService.createFolder);
  return {
    ...mutation,
    mutate: (folderData, options) =>
      mutation.mutate(folderData, {
        ...options,
        onSuccess: () => {
          toast.success(`Folder "${folderData.folderName}" created.`);
          // onSuccess logic above invalidates files query
        },
        onError: (err) => toast.error(err.message || 'Failed to create folder.'),
      }),
    mutateAsync: (folderData, options) =>
      mutation.mutateAsync(folderData, {
        ...options,
        onSuccess: () => {
          toast.success(`Folder "${folderData.folderName}" created.`);
        },
        onError: (err) => toast.error(err.message || 'Failed to create folder.'),
      }),
  };
};

export const useRenameItem = () => {
  const mutation = useFileMutation(({ folderId, renameData }) => fileService.renameFolder(folderId, renameData));
  return {
    ...mutation,
    mutate: ({ folderId, newName }, options) =>
      mutation.mutate({ folderId, renameData: { newName } }, {
        ...options,
        onSuccess: () => {
          toast.success('Item renamed.');
        },
        onError: (err) => toast.error(err.message || 'Failed to rename item.'),
      }),
    mutateAsync: ({ folderId, newName }, options) =>
      mutation.mutateAsync({ folderId, renameData: { newName } }, {
        ...options,
        onSuccess: () => {
          toast.success('Item renamed.');
        },
        onError: (err) => toast.error(err.message || 'Failed to rename item.'),
      }),
  };
};

export const useMoveItem = () => {
  const queryClient = useQueryClient();
  const currentParentId = useSelector((state) => state.files.currentParentId);

  return useMutation({
    mutationFn: ({ itemId, newParentId }) => fileService.moveItem(itemId, { newParentId }),
    onSuccess: (data, variables) => {
      const { newParentId, oldParentId } = variables || {};

      // Invalidate BOTH the old folder (if provided) and the destination folder so both lists refresh
      const oldId = typeof oldParentId !== 'undefined' && oldParentId !== null ? oldParentId : currentParentId;
      queryClient.invalidateQueries(['files', oldId || 'root']);
      queryClient.invalidateQueries(['files', newParentId || 'root']);
      toast.success('Item moved.');
    },
    onError: (err) => toast.error(err.message || 'Failed to move item.'),
  });
};

/**
 * Bulk move multiple items into a destination folder.
 * mutation variables: { itemIds: string[], newParentId: string|null }
 */
export const useBulkMoveItems = () => {
  const queryClient = useQueryClient();
  const currentParentId = useSelector((state) => state.files.currentParentId);

  return useMutation({
    mutationFn: ({ itemIds, newParentId }) => Promise.all(itemIds.map((id) => fileService.moveItem(id, { newParentId }))),
    onSuccess: (data, variables) => {
      const { newParentId, itemIds, oldParentIds } = variables || {};
      // Invalidate lists for current folder and destination so UI refreshes
      queryClient.invalidateQueries(['files', currentParentId || 'root']);
      queryClient.invalidateQueries(['files', newParentId || 'root']);

      // If the caller supplied oldParentIds, invalidate those specific parents too
      if (Array.isArray(oldParentIds) && oldParentIds.length > 0) {
        const unique = Array.from(new Set(oldParentIds.map(x => x === null || typeof x === 'undefined' ? 'root' : String(x))));
        unique.forEach((p) => queryClient.invalidateQueries(['files', p || 'root']));
      }

      toast.success(`${(itemIds && itemIds.length) || (data && data.length) || 'Items'} moved.`);
    },
    onError: (err) => toast.error(err.message || 'Failed to move items.'),
  });
};

// --- Delete (Trash) Mutations ---

export const useDeleteFile = () => {
  const mutation = useFileMutation(fileService.deleteFile);
  return {
    ...mutation,
    mutate: (fileId, options) =>
      mutation.mutate(fileId, {
        ...options,
        onSuccess: () => {
          toast.success('File moved to trash.');
        },
        onError: (err) => toast.error(err.message || 'Failed to delete file.'),
      }),
    mutateAsync: (fileId, options) =>
      mutation.mutateAsync(fileId, {
        ...options,
        onSuccess: () => {
          toast.success('File moved to trash.');
        },
        onError: (err) => toast.error(err.message || 'Failed to delete file.'),
      }),
  };
};

export const useDeleteFolder = () => {
  const mutation = useFileMutation(fileService.deleteFolder);
  return {
    ...mutation,
    mutate: (folderId, options) =>
      mutation.mutate(folderId, {
        ...options,
        onSuccess: () => toast.success('Folder moved to trash.'),
        onError: (err) => toast.error(err.message || 'Failed to delete folder.'),
      }),
    mutateAsync: (folderId, options) =>
      mutation.mutateAsync(folderId, {
        ...options,
        onSuccess: () => toast.success('Folder moved to trash.'),
        onError: (err) => toast.error(err.message || 'Failed to delete folder.'),
      }),
  };
};

export const useBulkDelete = () => {
  const mutation = useFileMutation(fileService.bulkDeleteFiles);
  return {
    ...mutation,
    mutate: (fileIds, options) =>
      mutation.mutate(fileIds, {
        ...options,
        onSuccess: (data) => {
          const count = (data && data.ids && data.ids.length) || fileIds.length;
          toast.success(`${count} items moved to trash.`);
        },
        onError: (err) => toast.error(err.message || 'Failed to delete items.'),
      }),
    mutateAsync: (fileIds, options) =>
      mutation.mutateAsync(fileIds, {
        ...options,
        onSuccess: (data) => {
          const count = (data && data.ids && data.ids.length) || fileIds.length;
          toast.success(`${count} items moved to trash.`);
        },
        onError: (err) => toast.error(err.message || 'Failed to delete items.'),
      }),
  };
};

// --- Share Mutations ---

export const useCreatePublicShare = () => {
  const queryClient = useQueryClient();
  const currentParentId = useSelector((state) => state.files.currentParentId);

  return useMutation({
    mutationFn: fileService.createPublicShare,
    onSuccess: () => {
      queryClient.invalidateQueries(['files', currentParentId || 'root']);
      queryClient.invalidateQueries(['files', 'mySharedFiles']);
      toast.success('Public link created!');
    },
    onError: (err) => toast.error(err.message || 'Failed to create link.'),
  });
};

export const useRevokePublicShare = () => {
  const queryClient = useQueryClient();
  const currentParentId = useSelector((state) => state.files.currentParentId);

  return useMutation({
    mutationFn: fileService.revokePublicShare,
    onSuccess: () => {
      queryClient.invalidateQueries(['files', currentParentId || 'root']);
      queryClient.invalidateQueries(['files', 'mySharedFiles']);
      toast.info('Public link revoked.');
    },
    onError: (err) => toast.error(err.message || 'Failed to revoke link.'),
  });
};

export const useShareWithClass = () => {
  const mutation = useFileMutation(fileService.shareWithClass);
  return {
    ...mutation,
    mutate: (data, options) =>
      mutation.mutate(data, {
        ...options,
        onSuccess: (res) => {
          toast.success(res?.message || 'Shared with class successfully.');
        },
        onError: (err) => toast.error(err.message || 'Failed to share with class.'),
      }),
    mutateAsync: (data, options) =>
      mutation.mutateAsync(data, {
        ...options,
        onSuccess: (res) => {
          toast.success(res?.message || 'Shared with class successfully.');
        },
        onError: (err) => toast.error(err.message || 'Failed to share with class.'),
      }),
  };
};

// --- Upload Mutation ---
// Note: upload is handled locally in FileUpload.jsx to provide per-file progress tracking.

// --- Direct share / access mutations ---

export const useShareFile = () => {
  const queryClient = useQueryClient();
  const currentParentId = useSelector((state) => state.files.currentParentId);

  return useMutation({
    mutationFn: ({ fileId, userIdToShareWith }) => fileService.shareFile(fileId, userIdToShareWith),
    onSuccess: () => {
      queryClient.invalidateQueries(['files', currentParentId || 'root']);
      queryClient.invalidateQueries(['files', 'mySharedFiles']);
      toast.success('File shared successfully.');
    },
    onError: (err) => toast.error(err.message || 'Failed to share file.'),
  });
};

export const useManageShareAccess = () => {
  const queryClient = useQueryClient();
  const currentParentId = useSelector((state) => state.files.currentParentId);

  return useMutation({
    mutationFn: ({ fileId, userIdToRemove }) => fileService.manageShareAccess(fileId, userIdToRemove),
    onSuccess: () => {
      // Invalidate both recipient and owner lists to refresh UI
      queryClient.invalidateQueries(['files', currentParentId || 'root']);
      queryClient.invalidateQueries(['files', 'sharedWithMe']);
      queryClient.invalidateQueries(['files', 'mySharedFiles']);
      toast.success('Share access updated.');
    },
    onError: (err) => toast.error(err.message || 'Failed to update share access.'),
  });
};

export const useBulkRemoveAccess = () => {
  const mutation = useFileMutation(fileService.bulkRemoveAccess);
  return {
    ...mutation,
    mutate: (fileIds, options) =>
      mutation.mutate(fileIds, {
        ...options,
        onSuccess: (data) => {
          toast.info(`${(data && data.ids && data.ids.length) || fileIds.length} file(s) removed from your list.`);
        },
        onError: (err) => toast.error(err.message || 'Failed to remove files.'),
      }),
    mutateAsync: (fileIds, options) =>
      mutation.mutateAsync(fileIds, {
        ...options,
        onSuccess: (data) => {
          toast.info(`${(data && data.ids && data.ids.length) || fileIds.length} file(s) removed from your list.`);
        },
        onError: (err) => toast.error(err.message || 'Failed to remove files.'),
      }),
  };
};

// --- Trash Queries & Mutations ---

export const useListTrash = () => {
  return useQuery({ queryKey: ['trash'], queryFn: fileService.listTrash });
};

export const useGetTrashStats = () => {
  return useQuery({ queryKey: ['trashStats'], queryFn: fileService.getTrashStats });
};

export const useRestoreFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId) => fileService.restoreFile(fileId),
    onSuccess: () => {
      toast.success('Item restored.');
      queryClient.invalidateQueries(['trash']);
      queryClient.invalidateQueries(['trashStats']);
      queryClient.invalidateQueries(['files']);
    },
    onError: (err) => toast.error(err.message || 'Failed to restore.'),
  });
};

export const usePurgeFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileId) => fileService.purgeFile(fileId),
    onSuccess: () => {
      toast.success('Item permanently deleted.');
      queryClient.invalidateQueries(['trash']);
      queryClient.invalidateQueries(['trashStats']);
      queryClient.invalidateQueries(['storageUsage']);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete.'),
  });
};

export const useEmptyTrash = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => fileService.emptyTrash(),
    onSuccess: () => {
      toast.info('Trash emptied.');
      queryClient.invalidateQueries(['trash']);
      queryClient.invalidateQueries(['trashStats']);
      queryClient.invalidateQueries(['storageUsage']);
    },
    onError: (err) => toast.error(err.message || 'Failed to empty trash.'),
  });
};

export const useBulkRestore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileIds) => fileService.bulkRestore(fileIds),
    onSuccess: (data) => {
      const count = (data && data.ids && data.ids.length) || 0;
      toast.success(`${count || 'Items'} restored.`);
      queryClient.invalidateQueries(['trash']);
      queryClient.invalidateQueries(['trashStats']);
      queryClient.invalidateQueries(['files']);
    },
    onError: (err) => toast.error(err.message || 'Failed to restore items.'),
  });
};

export const useBulkPurge = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fileIds) => fileService.bulkPurge(fileIds),
    onSuccess: (data) => {
      const count = (data && data.ids && data.ids.length) || 0;
      toast.success(`${count || 'Items'} permanently deleted.`);
      queryClient.invalidateQueries(['trash']);
      queryClient.invalidateQueries(['trashStats']);
      queryClient.invalidateQueries(['storageUsage']);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete items.'),
  });
};

// Export other lightweight wrappers as needed in future

export default {};
