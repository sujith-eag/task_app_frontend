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
  };
};

export const useMoveItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, newParentId }) => fileService.moveItem(itemId, { newParentId }),
    onSuccess: (data, variables) => {
      const { itemId, newParentId } = variables;
      // NOTE: the oldParentId must be provided by the caller (component) if available.
      // As a fallback we invalidate the root view and the new parent.
      queryClient.invalidateQueries(['files', newParentId || 'root']);
      queryClient.invalidateQueries(['files', 'root']);
      toast.success('Item moved.');
    },
    onError: (err) => toast.error(err.message || 'Failed to move item.'),
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

// Export other lightweight wrappers as needed in future

export default {};
