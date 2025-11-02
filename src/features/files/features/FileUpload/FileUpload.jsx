import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
import {
    Box,
    Typography,
    Button,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Stack,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import fileService from '../../fileService.js';

const MAX_FILES = 8;
const MAX_SIZE = 20 * 1024 * 1024; // 20 MB

const humanFileSize = (size) => {
    if (!size) return '0 B';
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};

// Helper to produce readable rejection messages
const formatRejections = (rejections) => {
    return rejections.map(r => {
        const reasons = r.errors.map(e => e.code === 'file-too-large'
            ? `exceeds ${humanFileSize(MAX_SIZE)}`
            : e.message).join(', ');
        return `${r.file.name}: ${reasons}`;
    });
};

const FileUpload = () => {
    const { currentParentId } = useSelector(state => state.files);

    // Local upload state (per-file progress etc.)
    const [perFileProgress, setPerFileProgress] = useState({});
    const [uploadProgressOverallLocal, setUploadProgressOverallLocal] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const queryClient = useQueryClient();

    // Store items as { id, file, preview }
    const [items, setItems] = useState([]);
    const [rejections, setRejections] = useState([]);

    // Dropzone setup
    const onDrop = useCallback((acceptedFiles, fileRejections) => {
        // Wrap accepted files with unique ids and previews
        const wrapped = acceptedFiles.map(f => ({
            id: `${f.name}-${f.size}-${f.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
            file: f,
            preview: f.type?.startsWith('image/') ? URL.createObjectURL(f) : null,
        }));

        setItems(prev => {
            const combined = [...prev, ...wrapped].slice(0, MAX_FILES);
            return combined;
        });

        if (fileRejections && fileRejections.length > 0) {
            setRejections(formatRejections(fileRejections));
        }
    }, []);

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
        multiple: true,
        maxFiles: MAX_FILES,
        maxSize: MAX_SIZE,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-powerpoint': ['.ppt', '.pptx'],
            'application/vnd.ms-excel': ['.xls', '.xlsx'],
            'application/zip': ['.zip'],
            'application/x-rar-compressed': ['.rar'],
            'application/x-7z-compressed': ['.7z'],
            'image/svg+xml': ['.svg'],
            'application/json': ['.json'],
            'text/*': ['.txt', '.csv'],
            // programming files and notebooks
            'text/x-python': ['.py'],
            'application/x-ipynb+json': ['.ipynb'],
            'application/typescript': ['.ts'],
            'text/x-java-source': ['.java'],
            'text/x-csrc': ['.c'],
            'text/x-c++src': ['.cpp'],
            'text/markdown': ['.md'],
            'application/x-sh': ['.sh'],            
        }
    });

    // Remove single item by id
    const removeItem = (id) => {
        setItems(prev => {
            const found = prev.find(p => p.id === id);
            if (found && found.preview) URL.revokeObjectURL(found.preview);
            return prev.filter(i => i.id !== id);
        });
    };

    // Cancel (clear all)
    const cancelAll = () => {
        items.forEach(i => { if (i.preview) URL.revokeObjectURL(i.preview); });
        setItems([]);
        setRejections([]);
    };

    // Upload handler
    const handleUpload = async () => {
        if (items.length === 0) {
            toast.error('Please select files to upload.');
            return;
        }

        // Upload each file in parallel, keeping per-file progress local to this component.
        setPerFileProgress({});
        setUploadProgressOverallLocal(0);
        setIsUploading(true);

        try {
            const uploadPromises = items.map((item) => {
                const fd = new FormData();
                fd.append('files', item.file);
                // keep the upload key so the backend can associate progress if needed
                fd.append('uploadKeys', item.id);

                const onUploadProgress = (progressEvent) => {
                    try {
                        const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
                        setPerFileProgress(prev => ({ ...prev, [item.id]: percentCompleted }));

                        // compute simple overall average progress
                        setUploadProgressOverallLocal(prev => {
                            const next = { ...perFileProgress, [item.id]: percentCompleted };
                            const values = Object.values(next);
                            if (values.length === 0) return 0;
                            const sum = values.reduce((a, b) => a + (Number(b) || 0), 0);
                            return Math.round(sum / values.length);
                        });
                    } catch (e) {
                        // ignore per-file progress calc errors
                    }
                };

                return fileService.uploadFiles(fd, onUploadProgress);
            });

            await Promise.all(uploadPromises);

            // Invalidate the folder query so the new files appear
            await queryClient.invalidateQueries(['files', currentParentId || 'root']);

            toast.success(`${items.length} file(s) uploaded`);
            cancelAll();
        } catch (err) {
            console.error('Upload error', err);
            toast.error(err?.message || 'Upload failed');
        } finally {
            setUploadProgressOverallLocal(0);
            setPerFileProgress({});
            setIsUploading(false);
        }
    };

    // Map uploadProgress: support both number and object keyed by filename or item id
    const perFileProgressMemo = useMemo(() => perFileProgress, [perFileProgress]);

    // Cleanup previews on unmount
    useEffect(() => {
        return () => {
            items.forEach(i => { if (i.preview) URL.revokeObjectURL(i.preview); });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box>
            <Box
                {...getRootProps()}
                tabIndex={0}
                role="button"
                aria-label="File upload dropzone"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(); }}
                sx={{
                    border: `2px dashed ${isDragActive ? 'primary.main' : 'grey.300'}`,
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'left',
                    cursor: 'pointer',
                    backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                }}
            >
                <input {...getInputProps()} />

                        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                            <UploadFileIcon color={isDragActive ? 'primary' : 'inherit'} sx={{ fontSize: 36 }} />
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="subtitle1">Drag & drop files here</Typography>
                                <Typography variant="body2" color="text.secondary">Click Select to choose files — up to {MAX_FILES} files, max {humanFileSize(MAX_SIZE)} each</Typography>
                            </Box>
                        </Stack>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            {/* Compact upload indicator on the side when uploading */}
                            {isUploading && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 1 }}>
                                    {typeof uploadProgressOverallLocal === 'number' && uploadProgressOverallLocal > 0 ? (
                                        <Typography variant="caption">{uploadProgressOverallLocal}%</Typography>
                                    ) : (
                                        <Typography variant="caption">Uploading</Typography>
                                    )}
                                    <Box sx={{ width: 120, mt: 0.5 }}>
                                        <LinearProgress variant={typeof uploadProgressOverallLocal === 'number' ? 'determinate' : 'indeterminate'} value={typeof uploadProgressOverallLocal === 'number' ? uploadProgressOverallLocal : undefined} sx={{ height: 8, borderRadius: 1 }} />
                                    </Box>
                                </Box>
                            )}

                            <Button variant="outlined" onClick={open} aria-label="Select files">Select</Button>
                        </Box>
            </Box>

            {rejections.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    {rejections.map((r, idx) => (
                        <Typography key={idx} color="error" variant="body2">{r}</Typography>
                    ))}
                </Box>
            )}

                    {/* Global upload indicator moved into the dropzone side area to avoid duplication */}

            {items.length > 0 ? (
                <>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>{items.length} file(s) ready</Typography>
                    <List dense>
                        {items.map(item => {
                            const progress = perFileProgressMemo[item.file.name] ?? perFileProgressMemo[item.id] ?? 0;
                            return (
                                <ListItem key={item.id} secondaryAction={
                                    <IconButton edge="end" aria-label={`remove ${item.file.name}`} onClick={() => removeItem(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }>
                                    <ListItemAvatar>
                                        <Avatar variant="rounded" src={item.preview} alt={item.file.name}>
                                            {!item.preview && <InsertDriveFileIcon />}
                                        </Avatar>
                                    </ListItemAvatar>

                                    <ListItemText primary={item.file.name} secondary={humanFileSize(item.file.size)} sx={{ mr: 2 }} />

                                    <Box sx={{ width: 160, ml: 2 }}>
                                        {isUploading && progress > 0 ? (
                                            <>
                                                <Typography variant="caption">{`${progress}%`}</Typography>
                                                <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 1 }} />
                                            </>
                                        ) : null}
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button variant="contained" onClick={handleUpload} disabled={isUploading} startIcon={<UploadFileIcon />}> {isUploading ? 'Uploading...' : `Upload ${items.length}`}</Button>
                        <Button variant="outlined" onClick={cancelAll}>Cancel</Button>
                    </Box>
                </>
            ) : (
                <Typography variant="body2" color="text.secondary">No files selected.</Typography>
            )}
        </Box>
    );
};

export default FileUpload;