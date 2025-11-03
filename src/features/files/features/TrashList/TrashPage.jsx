import React from 'react';
import { Box, Typography, Button, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import TrashTable from './TrashTable.jsx';
import { useListTrash, useGetTrashStats } from '../../useFileQueries.js';
import { FileOperationProvider } from '../../hooks/FileOperationContext.jsx';
import ConfirmationDialog from '../../../../components/ConfirmationDialog.jsx';
import { useFileActions } from '../../hooks/useFileActions.js';
import StorageQuota from '../../components/ui/StorageQuota.jsx';

const TrashPage = () => {
  const { data: trashData, isLoading, isError } = useListTrash();
  const { data: stats } = useGetTrashStats();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <FileOperationProvider>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h4">Trash</Typography>
          </Box>

          {/* Move storage quota up like FilePage for visual consistency */}
          <Box sx={{ mb: 2 }}>
            <StorageQuota />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'flex-end' }
            }}
          >
            <Button variant="outlined" startIcon={<ArrowBackIcon />} sx={{ mr: 2 }} onClick={() => navigate('/files')} size={isSmall ? 'small' : 'medium'}>
              Back to Files
            </Button>
            <EmptyTrashButton openConfirm={() => setConfirmOpen(true)} />
          </Box>

          <Typography variant="body2" sx={{ mb: 2 }}>{`Items in trash: ${((stats?.totalItems ?? (stats?.fileCount + (stats?.folderCount || 0))) || 0)} • Total size: ${stats?.totalSizeMB ? `${stats.totalSizeMB} MB` : '—'}`}</Typography>

          {/* Accept both array responses or { items: [] } envelope from the API */}
          <TrashTable files={Array.isArray(trashData) ? trashData : (trashData?.items || [])} isLoading={isLoading} />

          {/* Keep the confirmation dialog inside the provider so the confirm handler can call provider-backed actions */}
          <TrashEmptyConfirmation open={confirmOpen} onClose={() => setConfirmOpen(false)} />
        </FileOperationProvider>
      </Box>
    </Container>
  );
};

function EmptyTrashButton({ openConfirm }) {
  // This hook uses FileOperationContext internally — safe because this component is rendered inside FileOperationProvider
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { emptyTrash } = useFileActions();

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Button color="error" variant="contained" onClick={openConfirm} size={isSmall ? 'small' : 'medium'}>
      Empty Trash
    </Button>
  );
}

function TrashEmptyConfirmation({ open, onClose }) {
  // Hook must be used inside provider
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { emptyTrash } = useFileActions();

  const handleConfirm = async () => {
    try {
      await emptyTrash();
    } catch (e) {
      // mutation shows toasts
    } finally {
      onClose();
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Confirm Empty Trash"
      message="Are you sure you want to permanently delete all items in the trash? This action cannot be undone."
    />
  );
}

export default TrashPage;
