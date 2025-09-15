import { register, reset } from '../features/auth/authSlice.js';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Box, Avatar, Typography, TextField, 
  Button, Backdrop, CircularProgress, Stack } from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';


const Register = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      password2: '',
    });
    const { name, email, password, password2 } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector(
      (state) => state.auth
    );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess && user) {
      toast.success(`Successfully registered! Welcome ${user.name}!`);
      navigate('/dashboard');
    } else if (user){
      navigate('/dashboard');
    }
    
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
  // Password Regex: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    if (password !== password2) {
      toast.error('Passwords do not match');
    } else if(!passwordRegex.test(password)) {
      toast.error('Password is not strong enough.');
    } else {
      const userData = { 
          name, 
          email: email.trim().toLowerCase(),
          password };
      dispatch(register(userData));
    }
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
        <PersonAddAltIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      
      {/* --- LAYOUT USING STACK --- */}
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
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={onChange}
            />
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={onChange}

              helperText="Must be 8+ characters and include an uppercase letter, a number, and a special character."
            />
            <TextField
              required
              fullWidth
              name="password2"
              label="Confirm Password"
              type="password"
              id="password2"
              value={password2}
              onChange={onChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ pt: 1.5, pb: 1.5 }}
            >
              Sign Up
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