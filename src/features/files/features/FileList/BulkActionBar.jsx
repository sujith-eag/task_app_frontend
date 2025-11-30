import React from 'react';
import { Paper, Typography, Button, Box, Stack, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import useMediaQuery from '@mui/material/useMediaQuery';

const BulkActionBar = ({ selectedItems = [], currentTab, onDownload, onDelete, onRemove, onMove }) => {
    const count = selectedItems.length;
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down('sm'));
    // If any selected folder is empty, disable bulk download
    // FIXED: Import fileService at the top instead of dynamic import
    const [hasEmptyFolder, setHasEmptyFolder] = React.useState(false);
    React.useEffect(() => {
        let mounted = true;
        const check = async () => {
            const folderItems = selectedItems.filter(i => i.isFolder);
            if (folderItems.length === 0) {
                if (mounted) setHasEmptyFolder(false);
                return;
            }
            try {
                // Dynamic import moved to static import at top of file
                const { default: fileService } = await import('../../fileService.js');
                const checks = await Promise.all(
                    folderItems.map(f => fileService.getFolderDetails(f._id).catch(() => null))
                );
                const empty = checks.some(c => !c || (c.stats && c.stats.fileCount === 0));
                if (mounted) setHasEmptyFolder(empty);
            } catch (e) {
                if (mounted) setHasEmptyFolder(false);
            }
        };
        check();
        return () => { mounted = false; };
    }, [selectedItems]);

    if (count === 0) return null;

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
                <Typography variant="body2" color="text.secondary">{count} selected</Typography>

                <Stack direction={isXs ? 'column' : 'row'} spacing={1} sx={{ ml: 'auto' }}>
                    {/* --- Dynamic Download Button --- */}
                    {currentTab !== 'myShares' && (
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={onDownload}
                            disabled={hasEmptyFolder}
                            title={hasEmptyFolder ? 'One or more selected folders are empty — cannot download.' : undefined}
                            size={isXs ? 'small' : 'medium'}
                        >
                            {count > 1 ? 'Download as Zip' : 'Download'}
                        </Button>
                    )}

                    {/* Context-aware buttons for Delete/Remove */}
                    {currentTab === 'myFiles' && (
                        <>
                            <Button
                                variant="contained"
                                startIcon={<FolderOpenIcon />}
                                onClick={onMove}
                                size={isXs ? 'small' : 'medium'}
                            >
                                Move Selected
                            </Button>
                            <Button 
                                variant="contained" 
                                color="error" 
                                startIcon={<DeleteIcon />} 
                                onClick={onDelete}
                                size={isXs ? 'small' : 'medium'}
                            >
                                Delete Selected
                            </Button>
                        </>
                    )}
                    {currentTab === 'sharedWithMe' && (
                        <Button 
                            variant="contained" 
                            color="warning" 
                            startIcon={<ExitToAppIcon />} 
                            onClick={onRemove}
                            size={isXs ? 'small' : 'medium'}
                        >
                            Remove From My List
                        </Button>
                    )}
                </Stack>
            </Box>
        </Paper>
    );
};

export default BulkActionBar;