import React, { useState, useEffect } from 'react';
import { Box, TableContainer, Table, TableHead, TableRow, TableCell, Checkbox, TableBody, Paper, Typography } from '@mui/material';
import TrashTableRow from './TrashTableRow.jsx';
import TrashBulkActionBar from '../../components/TrashBulkActionBar.jsx';
import ConfirmationDialog from '../../../../components/ConfirmationDialog.jsx';
import { useFileActions } from '../../hooks/useFileActions.js';

const TrashTable = ({ files = [], isLoading = false }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dialogConfig, setDialogConfig] = useState({ open: false, title: '', message: '', onConfirm: () => {} });

  const { restoreItem, purgeItem, bulkRestoreItems, bulkPurgeItems } = useFileActions();

  useEffect(() => setSelectedFiles([]), [files]);

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedFiles(files.map(f => f._id));
    else setSelectedFiles([]);
  };

  const handleSelectFile = (id) => {
    setSelectedFiles(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const openSinglePurgeDialog = (file) => {
    setDialogConfig({ open: true, title: 'Confirm Deletion', message: `Permanently delete "${file.fileName}"?`, onConfirm: () => { purgeItem(file._id); } });
  };

  const openBulkPurgeDialog = () => {
    setDialogConfig({ open: true, title: 'Confirm Bulk Deletion', message: `Permanently delete ${selectedFiles.length} items?`, onConfirm: () => { bulkPurgeItems(selectedFiles).finally(() => setSelectedFiles([])); } });
  };

  const handleRestore = (fileId) => restoreItem(fileId);
  const handleBulkRestore = () => bulkRestoreItems(selectedFiles).finally(() => setSelectedFiles([]));

  const closeDialog = () => setDialogConfig({ ...dialogConfig, open: false });

  return (
    <Box>
      <TrashBulkActionBar
        selectedCount={selectedFiles.length}
        onRestoreSelected={handleBulkRestore}
        onPurgeSelected={openBulkPurgeDialog}
      />

      <Box sx={{ mt: 2 }}>
        {files.length > 0 ? (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 72, textAlign: 'center' }}>Actions</TableCell>
                  <TableCell sx={{ width: '55%' }}>Name</TableCell>
                  <TableCell sx={{ width: '25%' }}>Date Deleted</TableCell>
                  <TableCell padding="checkbox" sx={{ width: '5%' }}>
                    <Checkbox
                      indeterminate={selectedFiles.length > 0 && selectedFiles.length < files.length}
                      checked={files.length > 0 && selectedFiles.length === files.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files.map((file) => (
                  <TrashTableRow
                    key={file._id}
                    file={file}
                    isSelected={selectedFiles.includes(file._id)}
                    onSelectFile={handleSelectFile}
                    onRestore={(id) => handleRestore(id)}
                    onPurge={(id) => openSinglePurgeDialog(files.find(f => f._id === id))}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography>No items in trash.</Typography>
        )}
      </Box>

      <ConfirmationDialog
        open={dialogConfig.open}
        onClose={closeDialog}
        onConfirm={() => { dialogConfig.onConfirm(); closeDialog(); }}
        title={dialogConfig.title}
        message={dialogConfig.message}
      />
    </Box>
  );
};

export default TrashTable;
