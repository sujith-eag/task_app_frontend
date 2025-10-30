import React, { useState } from 'react';
import { Box, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import QrCode2Icon from '@mui/icons-material/QrCode2';

const AttendanceCodeDisplay = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Paper
            elevation={4}
            sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: 3,
                background: (theme) => 
                    theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(25, 118, 210, 0.35) 100%)'
                        : 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(33, 150, 243, 0.2) 100%)',
                boxShadow: (theme) => theme.palette.mode === 'dark'
                    ? `0 12px 40px rgba(33, 150, 243, 0.4), 0 4px 12px rgba(33, 150, 243, 0.3), 0 0 40px ${theme.palette.primary.main}30`
                    : `0 12px 40px rgba(25, 118, 210, 0.2), 0 4px 12px rgba(25, 118, 210, 0.15), 0 0 40px ${theme.palette.primary.main}20`,
                border: '2px solid',
                borderColor: 'primary.main',
                mb: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: (theme) => 
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(90deg, transparent, #90caf9, transparent)'
                            : 'linear-gradient(90deg, transparent, #1976d2, transparent)',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <QrCode2Icon sx={{ color: 'primary.main', fontSize: { xs: '1.5rem', sm: '2rem' } }} />
                    <Typography 
                        variant="subtitle1" 
                        fontWeight={600}
                        fontSize={{ xs: '0.875rem', sm: '1rem' }}
                        color="primary.main"
                    >
                        Attendance Code
                    </Typography>
                </Box>
                
                <Tooltip title={copied ? "Copied!" : "Copy code"}>
                    <IconButton 
                        onClick={handleCopy}
                        size="small"
                        sx={{
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: (theme) => theme.palette.mode === 'dark'
                                    ? 'rgba(33, 150, 243, 0.2)'
                                    : 'rgba(25, 118, 210, 0.1)',
                            },
                        }}
                    >
                        {copied ? <CheckIcon /> : <ContentCopyIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Code Display */}
            <Box
                sx={{
                    textAlign: 'center',
                    py: { xs: 2, sm: 3 },
                    px: 2,
                    borderRadius: 2,
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(0, 0, 0, 0.3)'
                        : 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(25, 118, 210, 0.2)',
                }}
            >
                <Typography
                    sx={{
                        fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                        fontWeight: 700,
                        letterSpacing: { xs: '0.3rem', sm: '0.5rem' },
                        fontFamily: 'monospace',
                        color: 'primary.main',
                        textShadow: (theme) => theme.palette.mode === 'dark'
                            ? '0 0 20px rgba(144, 202, 249, 0.5)'
                            : '0 0 20px rgba(25, 118, 210, 0.3)',
                        userSelect: 'all',
                    }}
                >
                    {code}
                </Typography>
            </Box>

            <Typography 
                variant="caption" 
                display="block" 
                textAlign="center" 
                sx={{ 
                    mt: 1.5,
                    color: 'text.secondary',
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                }}
            >
                Share this code with students to mark attendance
            </Typography>
        </Paper>
    );
};

export default AttendanceCodeDisplay;
