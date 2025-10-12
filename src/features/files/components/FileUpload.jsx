import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, CircularProgress, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { toast } from 'react-toastify';

import { uploadFiles } from '../fileSlice.js';

const FileUpload = () => {
    const dispatch = useDispatch();
    const { status, uploadProgress } = useSelector((state) => state.files);
    const [acceptedFiles, setAcceptedFiles] = useState([]);

    const onDrop = useCallback((newFiles) => {
        // Combine new files with any existing ones, up to the limit of 4
        setAcceptedFiles(prev => [...prev, ...newFiles].slice(0, 4));
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 4,
        maxSize: 10 * 1024 * 1024, // 10MB
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            // Archives
            'application/zip': ['.zip'],
            'application/vnd.rar': ['.rar'],
            // Text & Code
            'text/*': ['.txt', '.csv', '.js', '.css', '.html', '.json'],
        },
    });

    const removeFile = (fileName) => {
        setAcceptedFiles(prev => prev.filter(file => file.name !== fileName));
    };

    const handleUpload = () => {
        if (acceptedFiles.length === 0) {
            toast.error('Please select files to upload.');
            return;
        }

        const formData = new FormData();
        acceptedFiles.forEach(file => {
            formData.append('files', file); // 'files' must match the backend field name
        });

        dispatch(uploadFiles(formData))
            .unwrap()
            .then(() => {
                toast.success(`${acceptedFiles.length} file(s) uploaded successfully!`);
            })
            .catch((error) => {
                // The error payload is the `message` from rejectWithValue
                toast.error(error || 'Upload failed.');
            })
            .finally(() => {
                setAcceptedFiles([]); // Clear the list after dispatching
            });
    };

    const fileList = acceptedFiles.map(file => (
    <ListItem
        key={file.path}
        secondaryAction={
            <IconButton edge="end" aria-label="delete" onClick={() => removeFile(file.name)}>
                <DeleteIcon />
            </IconButton>
        }
    >
        <ListItemIcon><UploadFileIcon /></ListItemIcon>
        <ListItemText 
            primary={file.name} 
            secondary={`${(file.size / 1024).toFixed(2)} KB`} 
        />
        <CheckCircleIcon color="success" sx={{ ml: 2 }} />
    </ListItem>
    ));

    return (
        <Box>
            {/* Dropzone box */}
            <Box
                {...getRootProps()}
                sx={{
                    border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.500'}`,
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                    mb: 2,
                }}
            >
                <input {...getInputProps()} />
                <Typography>Drag 'n' drop some files here, or click to select files</Typography>
                <Typography variant="caption">(Up to 4 files, max 10MB each)</Typography>
            </Box>
            
            {fileList.length > 0 && (
                <>
                    {/* file list */}
                    <Typography variant="h6">Files to Upload:</Typography>
                    <List dense>{fileList}</List>

                    <Button
                        variant="contained"
                        onClick={handleUpload}
                        disabled={status === 'loading'}
                    >
                        {
                            status === 'loading' && uploadProgress < 100 
                            ? `Uploading... ${uploadProgress}%` 
                            : status === 'loading' && uploadProgress === 100 
                                ? 'Processing...' 
                                : `Upload ${fileList.length} File(s)`                            
                        }
                    </Button>
                </>
            )}
        </Box>
    );
};

export default FileUpload;