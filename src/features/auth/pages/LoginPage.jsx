import { login, reset } from '../authSlice.js'; 

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Box, Avatar, Typography, TextField, 
  Button, CircularProgress, InputAdornment, IconButton, Stack, Paper } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff  from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const [formData, setFormData] = useState({ 
      email: '', 
      password: '' 
    });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  
  // Get the return URL from location state (set by PrivateRoute)
  const returnUrl = location.state?.from || '/profile';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordEntered = password.trim().length > 5;
  const canSubmit = isEmailValid && isPasswordEntered;
  
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  // Listen for session expiration event
  useEffect(() => {
    const handleSessionExpired = (event) => {
      toast.error(event.detail.message, {
        autoClose: 5000,
        position: 'top-center',
      });
    };
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, []);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && user) {
      toast.success(`Welcome back, ${user.name}!`);
      // Redirect to the return URL or default to profile
      navigate(returnUrl, { replace: true });
    } else if (user || isSuccess){
      navigate(returnUrl, { replace: true });
    }
    return () => {
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch, returnUrl]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if(!isEmailValid){
      toast.error('Please Enter a valid Email');
      return;
    }
    if(!isPasswordEntered){
      toast.error('Please enter your password');
      return;
    }
    const userData = { 
      email: email.trim().toLowerCase(), 
      password 
    };
    dispatch(login(userData));
  };

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
                ? 'linear-gradient(45deg, #90caf9 30%, #64b5f6 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            boxShadow: 3,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 28 }} />
        </Avatar>

        <Typography 
          component="h1" 
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          Sign in
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Welcome back! Please enter your credentials
        </Typography>

        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <Stack spacing={2.5}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              id="email"
              inputMode="email"
              label="Email Address"
              autoComplete="email"
              error={email && !isEmailValid}
              helperText={email && !isEmailValid ? 'Enter a valid email address' : ''}
              autoFocus
              value={email}
              onChange={onChange}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={onChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
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
              disabled={!canSubmit || isLoading}
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
                'Sign In'
              )}
            </Button>

            <Box sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              mt: 2,
              flexWrap: 'wrap',
              gap: 1,
            }}>
              <Link to="/forgotpassword" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2" 
                  sx={{
                    color: 'primary.main',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot password?
                </Typography>
              </Link>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography 
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'primary.dark',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Link>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;