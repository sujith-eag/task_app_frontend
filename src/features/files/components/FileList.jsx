import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, List } from '@mui/material';

// We will create this component in the next step
import FileItem from './FileItem';

const FileList = ({ files }) => {
    const [tabValue, setTabValue] = useState('myFiles');
    
    // Get the current user's ID to filter the files
    const { user } = useSelector((state) => state.auth);
    const userId = user._id;

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Filter files into two separate arrays based on ownership
    const myFiles = files.filter(file => file.user._id === userId);
    const sharedFiles = files.filter(file => file.user._id !== userId);

    return (
        <Box>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="file list tabs">
                <Tab label={`My Files (${myFiles.length})`} value="myFiles" />
                <Tab label={`Shared With Me (${sharedFiles.length})`} value="shared" />
            </Tabs>
            
            <Box sx={{ mt: 2 }}>
                {tabValue === 'myFiles' && (
                    <List>
                        {myFiles.length > 0 ? (
                            myFiles.map(file => <FileItem key={file._id} file={file} />)
                        ) : (
                            <Typography>You haven't uploaded any files yet.</Typography>
                        )}
                    </List>
                )}
                
                {tabValue === 'shared' && (
                    <List>
                        {sharedFiles.length > 0 ? (
                            sharedFiles.map(file => <FileItem key={file._id} file={file} />)
                        ) : (
                            <Typography>No files have been shared with you.</Typography>
                        )}
                    </List>
                )}
            </Box>
        </Box>
    );
};

export default FileList;