import React, { useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, reset } from '../features/auth/authSlice.js';
import { Container, Typography, Box, CircularProgress, Alert, Button } from '@mui/material';

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
        <Container component="main" maxWidth="sm">
            <Box sx={{ marginTop: 8, textAlign: 'center' }}>
                <Typography component="h1" variant="h5">Email Verification</Typography>
                <Box sx={{ mt: 3 }}>
                    {isLoading && <CircularProgress />}
                    {isError && <Alert severity="error">{message}</Alert>}
                    {isSuccess && (
                        <Box>
                            <Alert severity="success">{message}</Alert>
                            <Button component={RouterLink} to="/login" variant="contained" sx={{ mt: 2 }}>
                                Proceed to Login
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default VerifyEmailPage;