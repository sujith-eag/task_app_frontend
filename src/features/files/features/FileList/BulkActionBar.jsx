import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const BulkActionBar = ({ selectedFiles, currentTab, onDownload, onDelete, onRemove }) => {
    const count = selectedFiles.length;
    if (count === 0) return null;

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