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
    const [downloadReady, setDownloadReady] = useState(false);

    // Automatically trigger download and show toast on success
    useEffect(() => {
        if (downloadUrl) {
            // Mark ready but do NOT auto-open — present a user-triggered button to avoid popup blocks
            setDownloadReady(true);
            toast.success('Your download is ready. Click the button to start.', {
                icon: <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />
            });
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
        // Handle backspace: if current empty, move focus to previous
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        // Note: paste is handled in onPaste handler for reliability
    };

    const handlePaste = (index, e) => {
        e.preventDefault();
        const pasted = (e.clipboardData && e.clipboardData.getData('text')) || '';
        const sanitized = pasted.replace(/[^a-zA-Z0-9]/g, '');
        if (!sanitized) return;

        const newCode = [...code];
        let writeIdx = index;
        for (let i = 0; i < sanitized.length && writeIdx < 8; i++, writeIdx++) {
            newCode[writeIdx] = sanitized[i];
        }
        setCode(newCode);
        // Focus the next input after the last pasted character (or the last input)
        const focusIdx = Math.min(writeIdx, 7);
        inputRefs.current[focusIdx]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullCode = code.join('');

        if (fullCode.length !== 8) {
            setError('Please enter all 8 characters of the share code.');
            toast.error('Share code must be 8 characters long.');
            return;
        }
        // Open a popup immediately (user-initiated) to avoid popup blockers.
        // We'll navigate it to the returned download URL when available.
        setError('');
        setDownloadReady(false);
        const popup = window.open('', 'public-download');
        try {
            if (popup) {
                popup.document.write('<html><head><title>Preparing download...</title></head><body style="font-family: sans-serif; display:flex;align-items:center;justify-content:center;height:100vh;"><div><h3>Preparing your download...</h3><p>Please keep this window open.</p></div></body></html>');
            }
        } catch (e) {
            // ignore cross-origin write errors
        }

        dispatch(getPublicDownloadLink({ code: fullCode }))
            .unwrap()
            .then((res) => {
                const url = res && res.url;
                if (!url) {
                    const msg = 'Download URL not available.';
                    setError(msg);
                    toast.error(msg);
                    if (popup && !popup.closed) {
                        try { popup.document.body.innerText = msg; } catch (e) {}
                        setTimeout(() => { try { popup.close(); } catch (e) {} }, 2500);
                    }
                    return;
                }

                // Navigate the popup to the download URL (user-initiated window)
                try {
                    if (popup && !popup.closed) {
                        popup.location.href = url;
                    } else {
                        // fallback: open in new tab
                        const w = window.open(url, '_blank', 'noopener');
                        if (!w) {
                            const a = document.createElement('a');
                            a.href = url;
                            a.target = '_blank';
                            a.rel = 'noopener noreferrer';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                        }
                    }
                } catch (e) {
                    // final fallback: anchor click in current window
                    const a = document.createElement('a');
                    a.href = url;
                    a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            })
            .catch((err) => {
                const message = (err && (err.message || err)) || 'Invalid share code. Please try again.';
                setError(message);
                toast.error(message);
                if (popup && !popup.closed) {
                    try { popup.document.body.innerText = message; } catch (e) {}
                    setTimeout(() => { try { popup.close(); } catch (e) {} }, 2500);
                }
            });
    };

    const startDownload = () => {
        if (!downloadUrl) return;
        // User-initiated open — should not be blocked
        try {
            const w = window.open(downloadUrl, '_blank', 'noopener');
            if (!w) {
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
        } catch (e) {
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
        // Keep the page state; allow user to re-download if needed
    };

    const copyDownloadLink = async () => {
        if (!downloadUrl) return;
        try {
            await navigator.clipboard.writeText(downloadUrl);
            toast.success('Download link copied to clipboard.');
        } catch (e) {
            toast.info('Unable to copy link automatically. You can right-click the Download button.');
        }
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
                                        onPaste={(e) => handlePaste(index, e)}
                                        slotProps={{
                                            input: {
                                                maxLength: 1,
                                                autoComplete: 'one-time-code',
                                                'aria-label': `share-code-${index}`,
                                                style: {
                                                    textAlign: 'center',
                                                    fontSize: '1.25rem',
                                                    fontWeight: 600,
                                                    padding: '8px 4px'
                                                }
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
                                                padding: { xs: '12px 2px', sm: '16px 4px' },
                                                textAlign: 'center'
                                            }
                                        }}
                                        error={!!error}
                                    />
                                ))}
                            </Stack>

                            {/* Download-ready banner: user-triggered download avoids popup/navigation issues */}
                            {downloadReady && downloadUrl && (
                                <Paper sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} elevation={3}>
                                    <Typography sx={{ mr: 2 }}>Your download is ready.</Typography>
                                    <Box>
                                        <Button variant="contained" color="primary" onClick={startDownload} sx={{ mr: 1 }} startIcon={<CloudDownloadIcon />}>Start Download</Button>
                                        <Button variant="outlined" onClick={copyDownloadLink}>Copy Link</Button>
                                    </Box>
                                </Paper>
                            )}

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