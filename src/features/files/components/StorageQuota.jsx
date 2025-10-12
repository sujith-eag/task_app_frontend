import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';

const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const StorageQuota = () => {
    const { storageUsage } = useSelector((state) => state.files);
    const { usageBytes, quotaBytes } = storageUsage;

    const percentUsed = quotaBytes > 0 ? (usageBytes / quotaBytes) * 100 : 0;

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Storage</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress variant="determinate" value={percentUsed} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(percentUsed)}%`}</Typography>
                </Box>
            </Box>
            <Typography variant="caption" color="text.secondary">
                {`${formatBytes(usageBytes)} of ${formatBytes(quotaBytes)} used`}
            </Typography>
        </Paper>
    );
};

export default StorageQuota;