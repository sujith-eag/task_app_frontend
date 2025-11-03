import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const BulkActionBar = ({ selectedItems = [], currentTab, onDownload, onDelete, onRemove }) => {
    const count = selectedItems.length;
    if (count === 0) return null;

    // If any selected folder is empty, disable bulk download
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
                const checks = await Promise.all(folderItems.map(f => import('../../fileService.js').then(m => m.default.getFolderDetails(f._id)).catch(() => null)));
                const empty = checks.some(c => !c || (c.stats && c.stats.fileCount === 0));
                if (mounted) setHasEmptyFolder(empty);
            } catch (e) {
                if (mounted) setHasEmptyFolder(false);
            }
        };
        check();
        return () => { mounted = false; };
    }, [selectedItems]);

    return (
        <Paper sx={{ p: 2, mb: 2, 
		        display: 'flex', alignItems: 'center', 
		        justifyContent: 'space-between' }}>
            <Typography>{count} selected</Typography>
            <Box>
				{/* --- Dynamic Download Button --- */}
				{/* This button is NOT shown on the 'My Shares' tab */}
                {currentTab !== 'myShares' && (
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={onDownload}
                        disabled={hasEmptyFolder}
                        title={hasEmptyFolder ? 'One or more selected folders are empty — cannot download.' : undefined}
                        sx={{ mr: 2 }}
                    >
                        {count > 1 ? 'Download as Zip' : 'Download'}
                    </Button>
                )}

				{/* Context-aware buttons for Delete/Remove */}
                {currentTab === 'myFiles' && (
                    <Button 
	                    variant="contained" 
	                    color="error" 
	                    startIcon={<DeleteIcon />} 
	                    onClick={onDelete}>
                        Delete Selected
                    </Button>
                )}
                {currentTab === 'sharedWithMe' && (
                    <Button 
	                    variant="contained" 
	                    color="warning" 
	                    startIcon={<ExitToAppIcon />} 
	                    onClick={onRemove}>
                        Remove From My List
                    </Button>
                )}
            </Box>
        </Paper>
    );
};

export default BulkActionBar;