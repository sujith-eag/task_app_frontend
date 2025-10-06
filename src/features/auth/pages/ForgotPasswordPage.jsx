import { forgotPassword, reset } from '../authSlice.js';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Box, Avatar, Typography, TextField, 
  Button, Backdrop, CircularProgress } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

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
  }, [isError, isSuccess, message, navigate, dispatch]);

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
        <Box sx={{ marginTop: 8, textAlign: 'center' }}>
          <Avatar sx={{ m: 1, bgcolor: 'success.main', margin: 'auto' }}>
            <MailOutlineIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Check Your Email
          </Typography>
          <Alert severity="success" sx={{ mt: 2, textAlign: 'left' }}>
            {message}
          </Alert>
          <Button component={Link} to="/login" variant="contained" sx={{ mt: 3 }}>
            Back to Login
          </Button>
        </Box>
      </Container>
    );
  }
  
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
          <MailOutlineIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Typography component="p" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Enter your email and we'll send you a link to reset your password.
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 3, width: '100%' }}>
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isEmailValid || isLoading}
            >
            Send Reset Link
          </Button>

          {/* <Typography 
              variant="caption" 
              display="block" 
              color="text.secondary" 
              align="center" 
              sx={{ mt: 2 }}
          > Our email bot is on a coffee break ☕️. For you clever hackers 🕵️‍♀️ out there though, you can still find the reset link. Good luck!. 😏👨‍💻
          </Typography> */}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Back to Login
              </Typography>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;