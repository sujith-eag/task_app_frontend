import { login, reset } from '../authSlice.js'; 

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Box, Avatar, Typography, TextField, 
  Button, Backdrop, CircularProgress, InputAdornment, IconButton } from '@mui/material';
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
  const [showPassword, setShowPassword] = useState(false);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  const isPasswordEntered = password.trim().length > 5;
  const canSubmit = isEmailValid && isPasswordEntered;
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && user) {
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/profile');
    } else if (user || isSuccess){
      navigate('/profile');
    }
    return () => {
      dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

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
      email: email.trim().toLocaleLowerCase(), 
      password 
    };
    dispatch(login(userData));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
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
            helperText = {email && !isEmailValid ? 'Enter a valid email address' : ''}
            autoFocus
            value={email}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type= {showPassword ? 'text' : 'password'}
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
                  }}
                }/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!canSubmit || isLoading}
          >
            Sign In
          </Button>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            mt: 2 
          }}>
            <Link to="/forgotpassword" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Forgot password?
              </Typography>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                {"Don't have an account? Sign Up"}
              </Typography>
            </Link>
          </Box>          
          
        </Box>
      </Box>
    </Container>
  );
};

export default Login;