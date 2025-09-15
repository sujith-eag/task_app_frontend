import { register, reset } from '../features/auth/authSlice.js';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Box, Avatar, Typography, TextField, Button, 
  Backdrop, CircularProgress, Stack, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff  from '@mui/icons-material/VisibilityOff';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';


const Register = () => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      password2: '',
    });
  const { name, email, password, password2 } = formData;

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const isNameValid = name.trim().length > 5;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);
  const isPasswordsMatch = password === password2;
  const canSubmit = isNameValid && isEmailValid && isPasswordValid && isPasswordsMatch;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
      (state) => state.auth
    );
  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if(!canSubmit){
        toast.error('Please fix form errors before submitting');
        return;
    }
    const userData = { 
        name, 
        email: email.trim().toLowerCase(),
        password 
    };
    dispatch(register(userData));
}; 

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && user) {
      toast.success(`Successfully registered! Welcome ${user.name}!`);
      navigate('/dashboard');
    } else if (user || isSuccess){
      navigate('/dashboard');
    }
    
  return () => {
      dispatch(reset());
  };
  
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  
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
        <PersonAddAltIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3, width: '100%' }}>
          <Stack spacing={2}>
            <TextField
              name="name"
              required
              fullWidth
              id="name"
              label="Name"
              autoFocus
              value={name}
              onChange={onChange}
            />
            <TextField
              required
              fullWidth
              name="email"
              id="email"
              inputMode="email"
              label="Email Address"
              autoComplete="email"
              error={email && !isEmailValid}
              helperText = {email && !isEmailValid ? 'Enter a valid email address' : ''}
              value={email}
              onChange={onChange}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type= {showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={onChange}
              error={password && !isPasswordValid}
              helperText={
                  password && !isPasswordValid 
                  ? 'At least 8 chars, uppercase, number, special char' 
                  : ''
                }
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
            <TextField
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type={showPassword2 ? 'text' : 'password'}
              id="password2"
              value={password2}
              onChange={onChange}
              error={password2 && !isPasswordsMatch}
              helperText={
                password2 && !isPasswordsMatch 
                ? 'Passwords do not match' 
                : ''
              }
              slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword2(!showPassword2)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                        {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                }/>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ pt: 1.5, pb: 1.5 }}
              disabled={!canSubmit || isLoading}
              >Sign Up
            </Button>

            <Box sx={{ textAlign: 'right' }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Box>

          </Stack>
        </Box>
    </Box>
  </Container>
);
};

export default Register;