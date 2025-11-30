import { forgotPassword, reset } from '../authSlice.js';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Box, Avatar, Typography, TextField, 
  Button, CircularProgress, Alert, Paper, Stack, Divider } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
      if (isError) {
          toast.error(message);
      }
      if (isSuccess ) {
        toast.success(message || 'Password reset link sent to your email!', {
          autoClose: false, // persistent
          closeOnClick: true,
          draggable: false,
        });
        // navigate('/login');
        return () => {
          dispatch(reset());
        };
      }
  }, [isError, isSuccess, message, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!isEmailValid) {
        toast.error('Please enter a valid email address.');
        return;
    }
    dispatch(forgotPassword({ email }));
  };


  // If the request was successful, show a confirmation message instead of the form.
  if (isSuccess) {
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
          }}
        >
          <Avatar 
            sx={{ 
              m: 1, 
              width: 64,
              height: 64,
              background: (theme) => 
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #66bb6a 30%, #4caf50 90%)'
                  : 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
              boxShadow: 3,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%, 100%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.05)' },
              },
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 36 }} />
          </Avatar>

          <Typography 
            component="h1" 
            variant="h5" 
            sx={{ 
              mt: 2, 
              fontWeight: 600,
            }}
          >
            Check Your Email
          </Typography>

          <Alert 
            severity="success" 
            sx={{ 
              mt: 3, 
              mb: 2,
              width: '100%',
              textAlign: 'left',
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            {message}
          </Alert>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            We've sent a password reset link to <strong>{email}</strong>. 
            Please check your inbox and follow the instructions.
          </Typography>

          <Divider sx={{ width: '100%', my: 2 }} />

          <Box sx={{ width: '100%' }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ display: 'block', mb: 2 }}
            >
              Didn't receive the email? Check your spam folder or request a new link.
            </Typography>

            <Stack spacing={1.5}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                startIcon={<ArrowBackIcon />}
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
                Back to Login
              </Button>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  dispatch(reset());
                  setEmail('');
                }}
                sx={{
                  py: 1.2,
                }}
              >
                Send Another Link
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    );
  }
  
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
          transition: 'all 0.3s',
        }}
      >
        <Avatar 
          sx={{ 
            m: 1, 
            width: 56,
            height: 56,
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #81c784 30%, #66bb6a 90%)'
                : 'linear-gradient(45deg, #388e3c 30%, #66bb6a 90%)',
            boxShadow: 3,
          }}
        >
          <MailOutlineIcon sx={{ fontSize: 28 }} />
        </Avatar>

        <Typography 
          component="h1" 
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          Forgot Password?
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 3, textAlign: 'center' }}
        >
          No worries! Enter your email and we'll send you a reset link.
        </Typography>

        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <Stack spacing={2.5}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={email.length > 0 && !isEmailValid}
              helperText={email.length > 0 && !isEmailValid ? "Please enter a valid email" : ""}
              sx={{
                '& .MuiOutlinedInput-root': {
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 1,
                  },
                  '&.Mui-focused': {
                    boxShadow: 2,
                  },
                },
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isEmailValid || isLoading}
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 600,
                transition: 'all 0.3s',
                '&:not(:disabled):hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    transition: 'all 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: 16 }} />
                  Back to Login
                </Typography>
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;