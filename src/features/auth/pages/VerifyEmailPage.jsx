import { verifyEmail, reset } from '../authSlice.js';

import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, CircularProgress, Alert, Button, 
  Paper, Avatar, Stack, Divider } from '@mui/material';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EmailIcon from '@mui/icons-material/Email';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(verifyEmail(token));
        }
        return () => {
            dispatch(reset());
        };
    }, [dispatch, token]);

    return (
        <Container component="main" maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    marginTop: 8,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    textAlign: 'center',
                    minHeight: 300,
                    justifyContent: 'center',
                }}
            >
                {isLoading && (
                    <Box>
                        <Avatar 
                            sx={{ 
                                m: 'auto', 
                                mb: 2,
                                width: 64,
                                height: 64,
                                background: (theme) => 
                                    theme.palette.mode === 'dark'
                                        ? 'linear-gradient(45deg, #64b5f6 30%, #42a5f5 90%)'
                                        : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                boxShadow: 3,
                                animation: 'rotate 2s linear infinite',
                                '@keyframes rotate': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' },
                                },
                            }}
                        >
                            <EmailIcon sx={{ fontSize: 32 }} />
                        </Avatar>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                            Verifying Your Email
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Please wait while we verify your email address...
                        </Typography>
                        <CircularProgress size={40} />
                    </Box>
                )}

                {isError && (
                    <Box sx={{ width: '100%' }}>
                        <Avatar 
                            sx={{ 
                                m: 'auto', 
                                mb: 2,
                                width: 64,
                                height: 64,
                                bgcolor: 'error.main',
                                boxShadow: 3,
                            }}
                        >
                            <ErrorOutlineIcon sx={{ fontSize: 36 }} />
                        </Avatar>
                        
                        <Typography 
                            variant="h5" 
                            sx={{ fontWeight: 600, mb: 2 }}
                        >
                            Verification Failed
                        </Typography>

                        <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                            {message}
                        </Alert>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            The verification link may have expired or is invalid. 
                            Please request a new verification email.
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Stack spacing={1.5}>
                            <Button 
                                component={RouterLink} 
                                to="/register" 
                                variant="contained"
                                fullWidth
                                sx={{
                                    py: 1.2,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 4,
                                    },
                                }}
                            >
                                Register Again
                            </Button>
                            <Button 
                                component={RouterLink} 
                                to="/login" 
                                variant="outlined"
                                fullWidth
                                sx={{ py: 1.2 }}
                            >
                                Go to Login
                            </Button>
                        </Stack>
                    </Box>
                )}

                {isSuccess && (
                    <Box sx={{ width: '100%' }}>
                        <Avatar 
                            sx={{ 
                                m: 'auto', 
                                mb: 2,
                                width: 64,
                                height: 64,
                                background: (theme) => 
                                    theme.palette.mode === 'dark'
                                        ? 'linear-gradient(45deg, #66bb6a 30%, #4caf50 90%)'
                                        : 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                                boxShadow: 3,
                                animation: 'scaleUp 0.5s ease-out',
                                '@keyframes scaleUp': {
                                    '0%': { transform: 'scale(0)' },
                                    '50%': { transform: 'scale(1.1)' },
                                    '100%': { transform: 'scale(1)' },
                                },
                            }}
                        >
                            <CheckCircleOutlineIcon sx={{ fontSize: 36 }} />
                        </Avatar>

                        <Typography 
                            variant="h5" 
                            sx={{ fontWeight: 600, mb: 2 }}
                        >
                            Email Verified!
                        </Typography>

                        <Alert 
                            severity="success" 
                            icon={<MarkEmailReadIcon />}
                            sx={{ mb: 2, textAlign: 'left' }}
                        >
                            {message}
                        </Alert>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Your email has been successfully verified. You can now sign in to your account.
                        </Typography>

                        <Button 
                            component={RouterLink} 
                            to="/login" 
                            variant="contained"
                            fullWidth
                            size="large"
                            sx={{
                                py: 1.5,
                                fontWeight: 600,
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 4,
                                },
                            }}
                        >
                            Proceed to Login
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default VerifyEmailPage;