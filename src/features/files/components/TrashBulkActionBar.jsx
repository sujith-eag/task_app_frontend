import React from 'react';
import { Paper, Typography, Button, Box, Stack, useTheme } from '@mui/material';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * TrashBulkActionBar
 * Re-styled to match app theme: muted background, tidy spacing,
 * responsive button stacking on small screens, and smaller button sizes.
 */
const TrashBulkActionBar = ({ selectedCount = 0, onRestoreSelected, onPurgeSelected }) => {
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  if (!selectedCount || selectedCount === 0) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1, sm: 2 },
        mb: 2,
        bgcolor: theme.palette.mode === 'light' ? 'grey.50' : 'background.paper',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <Typography variant="body2" color="text.secondary">{selectedCount} selected</Typography>

        <Stack direction={isXs ? 'column' : 'row'} spacing={1} sx={{ ml: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<RestoreFromTrashIcon />}
            onClick={onRestoreSelected}
            size={isXs ? 'small' : 'medium'}
          >
            Restore
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={onPurgeSelected}
            size={isXs ? 'small' : 'medium'}
          >
            Delete Permanently
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TrashBulkActionBar;
