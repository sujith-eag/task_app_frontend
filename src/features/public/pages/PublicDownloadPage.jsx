import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, TextField, Button, Box, CircularProgress, Typography, Paper, Stack, Fade } from '@mui/material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { getPublicDownloadLink, resetPublicState } from '../publicSlice.js';

const PublicDownloadPage = () => {
    const dispatch = useDispatch();
    const [code, setCode] = useState(['', '', '', '', '', '', '', '']);
    const [error, setError] = useState('');
    const inputRefs = useRef([]);
    const { status, downloadUrl } = useSelector((state) => state.public);

    // Automatically trigger download and show toast on success
    useEffect(() => {
        if (downloadUrl) {
            toast.success('Your download is starting...', {
                icon: <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />
            });
            window.open(downloadUrl, '_blank');
        }
    }, [downloadUrl]);

    // Cleanup effect to reset the slice's state when the component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetPublicState());
        };
    }, [dispatch]);

    // Focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleCodeChange = (index, value) => {
        // Only allow alphanumeric characters
        const sanitized = value.replace(/[^a-zA-Z0-9]/g, '');
        
        if (sanitized.length <= 1) {
            const newCode = [...code];
            newCode[index] = sanitized;
            setCode(newCode);
            setError('');

            // Auto-focus next input
            if (sanitized && index < 7) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then((text) => {
                const sanitized = text.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);
                const newCode = [...sanitized.split(''), ...Array(8).fill('')].slice(0, 8);
                setCode(newCode);
                // Focus last filled input
                const lastIndex = Math.min(sanitized.length, 7);
                inputRefs.current[lastIndex]?.focus();
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullCode = code.join('');
        
        if (fullCode.length !== 8) {
            setError('Please enter all 8 characters of the share code.');
            toast.error('Share code must be 8 characters long.');
            return;
        }

        setError('');
        dispatch(getPublicDownloadLink({ code: fullCode }))
            .unwrap()
            .catch((err) => {
                setError(err || 'Invalid share code. Please try again.');
                toast.error(err || 'An unknown error occurred.');
            });
    };

    const isButtonDisabled = status === 'loading' || code.join('').length !== 8;

    return (
        <Container maxWidth="sm">
            <Fade in timeout={600}>
                <Box sx={{ 
                    mt: { xs: 4, sm: 8 }, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center' 
                }}>
                    <Paper
                        component={motion.div}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        elevation={6}
                        sx={{
                            p: { xs: 3, sm: 5 },
                            width: '100%',
                            borderRadius: 3,
                            background: (theme) =>
                                theme.palette.mode === 'dark'
                                    ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(3, 169, 244, 0.05) 100%)'
                                    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(255, 255, 255, 1) 100%)',
                            border: 1,
                            borderColor: 'primary.main',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                boxShadow: 10,
                                borderColor: 'primary.dark'
                            }
                        }}
                    >
                        {/* Header Icon and Title */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    p: 2,
                                    borderRadius: '50%',
                                    background: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'rgba(33, 150, 243, 0.2)'
                                            : 'rgba(33, 150, 243, 0.1)',
                                    mb: 2,
                                    animation: 'pulse 2s ease-in-out infinite',
                                    '@keyframes pulse': {
                                        '0%, 100%': { transform: 'scale(1)' },
                                        '50%': { transform: 'scale(1.05)' }
                                    }
                                }}
                            >
                                <CloudDownloadIcon 
                                    sx={{ 
                                        fontSize: 48, 
                                        color: 'primary.main'
                                    }} 
                                />
                            </Box>
                            <Typography 
                                variant="h4" 
                                gutterBottom
                                sx={{ 
                                    fontWeight: 700,
                                    background: (theme) =>
                                        theme.palette.mode === 'dark'
                                            ? 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)'
                                            : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}
                            >
                                Download Shared File
                            </Typography>
                            <Typography 
                                variant="body1" 
                                color="text.secondary" 
                                sx={{ 
                                    mb: 1,
                                    fontWeight: 500 
                                }}
                            >
                                Enter your 8-character share code
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                            >
                                Paste or type the code you received to access the file
                            </Typography>
                        </Box>

                        {/* Code Input Form */}
                        <Box component="form" onSubmit={handleSubmit}>
                            {/* OTP-style Code Inputs */}
                            <Stack 
                                direction="row" 
                                spacing={{ xs: 0.75, sm: 1.5 }} 
                                justifyContent="center"
                                sx={{ mb: 3 }}
                            >
                                {code.map((digit, index) => (
                                    <TextField
                                        key={index}
                                        inputRef={(el) => (inputRefs.current[index] = el)}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        inputProps={{
                                            maxLength: 1,
                                            style: { 
                                                textAlign: 'center',
                                                fontSize: '1.25rem',
                                                fontWeight: 600,
                                                padding: '8px 4px'
                                            }
                                        }}
                                        sx={{
                                            width: { xs: 36, sm: 56 },
                                            '& .MuiOutlinedInput-root': {
                                                height: { xs: 48, sm: 64 },
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    boxShadow: 2
                                                },
                                                '&.Mui-focused': {
                                                    boxShadow: 3,
                                                    transform: 'scale(1.05)'
                                                }
                                            },
                                            '& input': {
                                                color: digit ? 'primary.main' : 'text.primary',
                                                padding: { xs: '12px 2px', sm: '16px 4px' }
                                            }
                                        }}
                                        error={!!error}
                                    />
                                ))}
                            </Stack>

                            {/* Error Message */}
                            {error && (
                                <Fade in>
                                    <Typography 
                                        variant="body2" 
                                        color="error" 
                                        sx={{ 
                                            textAlign: 'center', 
                                            mb: 2,
                                            fontWeight: 500 
                                        }}
                                    >
                                        {error}
                                    </Typography>
                                </Fade>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={isButtonDisabled}
                                startIcon={status === 'loading' ? null : <CloudDownloadIcon />}
                                sx={{
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 6
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)'
                                    },
                                    '&.Mui-disabled': {
                                        background: 'action.disabledBackground'
                                    }
                                }}
                            >
                                {status === 'loading' ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Download File'
                                )}
                            </Button>
                        </Box>

                        {/* Helper Text */}
                        <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                                display: 'block', 
                                textAlign: 'center', 
                                mt: 3 
                            }}
                        >
                            💡 Tip: You can paste the entire code by pressing Ctrl+V
                        </Typography>
                    </Paper>
                </Box>
            </Fade>
        </Container>
    );
};

export default PublicDownloadPage;