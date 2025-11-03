import React from 'react';
import { TableRow, TableCell, Checkbox, Box, Typography, Tooltip, Chip, Avatar, Badge } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

import TrashActionMenu from '../../components/TrashActionMenu.jsx';
import { useFileOperations } from '../../hooks/FileOperationContext.jsx';
import { getFileIcon, getFileColor, formatFileType, formatBytes } from '../../components/ui/fileUtils.jsx';

const TrashTableRow = ({ file, isSelected, onSelectFile, onRestore, onPurge }) => {
    const { operationStatus } = useFileOperations();
    const status = operationStatus[file._id];
    const isProcessing = Boolean(status);

    return (
        <TableRow
            role="row"
            aria-selected={isSelected}
            tabIndex={0}
            aria-label={`trash-row-${file._id}`}
            sx={{
                '&:hover': { backgroundColor: 'action.hover' },
                backgroundColor: isSelected ? 'action.selected' : 'transparent',
                opacity: isProcessing ? 0.6 : 1,
            }}
        >
            <TableCell sx={{ width: 72, textAlign: 'center' }}>
                <Box onClick={(e) => e.stopPropagation()} sx={{ display: 'flex', justifyContent: 'center' }}>
                    {status ? (
                        <Chip label={`${status}...`} size="small" />
                    ) : (
                        <TrashActionMenu onRestore={() => onRestore(file._id)} onPurge={() => onPurge(file._id)} />
                    )}
                </Box>
            </TableCell>

            <TableCell component="th" scope="row">
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge
                        overlap="circular"
                        badgeContent={file.isFolder && file.descendantCount ? file.descendantCount : null}
                        color="primary"
                        sx={{ mr: 2 }}
                    >
                        <Avatar
                            variant="rounded"
                            sx={{
                                bgcolor: file.isFolder ? 'warning.main' : getFileColor(file.fileType),
                                width: 44,
                                height: 44,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {file.isFolder ? <FolderOpenIcon sx={{ color: 'common.white' }} /> : getFileIcon(file.fileType) || <InsertDriveFileIcon />}
                        </Avatar>
                    </Badge>

                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Tooltip title={file.fileName} placement="top">
                            <Typography noWrap sx={{ maxWidth: 420 }}>{file.fileName}</Typography>
                        </Tooltip>
                        {/* show file type + size for files */}
                        {!file.isFolder && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                {formatFileType(file.fileType)}{file.size ? ` • ${formatBytes(file.size)}` : ''}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </TableCell>

            <TableCell>
                {file.deletedAt ? new Date(file.deletedAt).toLocaleDateString() : '—'}
            </TableCell>

            <TableCell padding="checkbox">
                <Checkbox
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { e.stopPropagation(); onSelectFile(file._id); }}
                />
            </TableCell>
        </TableRow>
    );
};

export default TrashTableRow;
