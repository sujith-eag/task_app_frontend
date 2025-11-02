import React from 'react';
import { useSelector } from 'react-redux';
import { useGetStorageUsage } from '../../useFileQueries.js';
import { Box, Typography, LinearProgress, Paper, useTheme, Chip } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

const formatBytes = (bytes, decimals = 2) => {
    if (!bytes && bytes !== 0) return '0 Bytes';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const StorageQuota = () => {
    const theme = useTheme();
    const { data: storageUsage, isLoading } = useGetStorageUsage();
    const { usageBytes = 0, quotaBytes = null, fileCount = 0, fileLimit = null } = storageUsage || {};

    const percentUsed = quotaBytes !== null && quotaBytes > 0 ? Math.min(100, (usageBytes / quotaBytes) * 100) : 0;

    // Color thresholds
    const color = percentUsed >= 90 ? theme.palette.error.main : percentUsed >= 70 ? theme.palette.warning.main : theme.palette.primary.main;

    const remainingBytes = quotaBytes === null ? null : Math.max(0, quotaBytes - usageBytes);

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.action.hover}, ${theme.palette.background.paper})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }} aria-hidden>
                <StorageIcon fontSize="large" color="action" />
            </Box>

            <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Storage</Typography>
                        <Typography variant="body2" color="text.secondary">Your account usage</Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ color }}>{Math.round(percentUsed)}%</Typography>
                        <Chip label={quotaBytes === null ? 'Unlimited' : `${formatBytes(remainingBytes)} left`} size="small" sx={{ mt: 0.5 }} />
                    </Box>
                </Box>

                <Box sx={{ mt: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={percentUsed}
                        sx={{
                            height: 10,
                            borderRadius: 2,
                            backgroundColor: theme.palette.grey[200],
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 2,
                                backgroundColor: color,
                            }
                        }}
                        aria-valuenow={Math.round(percentUsed)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center', color: 'text.secondary' }}>
                    <Typography variant="caption">{formatBytes(usageBytes)} used</Typography>
                    <Typography variant="caption">•</Typography>
                    <Typography variant="caption">{quotaBytes === null ? 'Unlimited' : formatBytes(quotaBytes)} quota</Typography>
                    <Typography variant="caption" sx={{ ml: 'auto' }}>{fileCount} files{fileLimit ? ` • limit ${fileLimit}` : ''}</Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default StorageQuota;