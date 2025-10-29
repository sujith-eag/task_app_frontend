import { register, reset } from '../authSlice.js';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Container, Box, Avatar, Typography, TextField, Button, 
  CircularProgress, Stack, InputAdornment, IconButton, Paper, LinearProgress, 
  List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff  from '@mui/icons-material/VisibilityOff';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


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

  const isNameValid = name.trim().length >= 5;
  const isEmailValid = emailRegex.test(email);
  const isPasswordValid = passwordRegex.test(password);
  const isPasswordsMatch = password === password2;
  const canSubmit = isNameValid && isEmailValid && isPasswordValid && isPasswordsMatch;

  // Password strength calculation
  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (!pwd) return { score: 0, label: '', color: 'inherit' };
    
    // Length
    if (pwd.length >= 8) score += 25;
    if (pwd.length >= 12) score += 10;
    
    // Character variety
    if (/[a-z]/.test(pwd)) score += 15;
    if (/[A-Z]/.test(pwd)) score += 15;
    if (/\d/.test(pwd)) score += 15;
    if (/[@$!%*?&]/.test(pwd)) score += 20;
    
    let label = 'Weak';
    let color = 'error';
    if (score >= 80) {
      label = 'Strong';
      color = 'success';
    } else if (score >= 50) {
      label = 'Medium';
      color = 'warning';
    }
    
    return { score, label, color };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const passwordRequirements = [
    { test: password.length >= 8, label: 'At least 8 characters' },
    { test: /[a-z]/.test(password), label: 'One lowercase letter' },
    { test: /[A-Z]/.test(password), label: 'One uppercase letter' },
    { test: /\d/.test(password), label: 'One number' },
    { test: /[@$!%*?&]/.test(password), label: 'One special character (@$!%*?&)' },
  ];

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
    if (user) {
      navigate('/dashboard');
    }

    if (isError) {
      toast.error(message);
    }
    else if (isSuccess) {
      toast.success(message, {
          autoClose: false, // persistent
          closeOnClick: true,
          draggable: false,
      });
      // Reset the form fields to their initial state on success.
      setFormData({
        name: '',
        email: '',
        password: '',
        password2: '',
      });
    }
    
  return () => {
      dispatch(reset());
  };
  
  }, [isError, isSuccess, message, dispatch]);

  
return (
  <Container component="main" maxWidth="sm">
    <Paper
      elevation={3}
      sx={{
        marginTop: 8,
        marginBottom: 4,
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
              ? 'linear-gradient(45deg, #ce93d8 30%, #ba68c8 90%)'
              : 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
          boxShadow: 3,
        }}
      >
        <PersonAddAltIcon sx={{ fontSize: 28 }} />
      </Avatar>

      <Typography 
        component="h1" 
        variant="h5"
        sx={{
          fontWeight: 600,
          mb: 1,
        }}
      >
        Create Account
      </Typography>

      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: 3, textAlign: 'center' }}
      >
        Join us today! Fill in your details to get started
      </Typography>
      
        <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 1, width: '100%' }}>
          <Stack spacing={2.5}>
            <TextField
              name="name"
              required
              fullWidth
              id="name"
              label="Full Name"
              autoFocus
              value={name}
              onChange={onChange}
              error={name && !isNameValid}
              helperText={name && !isNameValid ? 'Name must be at least 5 characters' : ''}
              slotProps={{
                htmlInput: {
                  maxLength: 50,
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
            <TextField
              required
              fullWidth
              name="email"
              id="email"
              inputMode="email"
              label="Email Address"
              autoComplete="email"
              error={email && !isEmailValid}
              helperText={email && !isEmailValid ? 'Enter a valid email address' : ''}
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
            <Box>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={onChange}
                error={password && !isPasswordValid}
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
              
              {password && (
                <Box sx={{ mt: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Password Strength
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontWeight: 600,
                        color: `${passwordStrength.color}.main`,
                      }}
                    >
                      {passwordStrength.label}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={passwordStrength.score} 
                    color={passwordStrength.color}
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: (theme) => 
                        theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  
                  <Paper 
                    elevation={0}
                    sx={{ 
                      mt: 1.5, 
                      p: 1.5, 
                      backgroundColor: (theme) => 
                        theme.palette.mode === 'dark' 
                          ? 'rgba(255, 255, 255, 0.05)' 
                          : 'rgba(0, 0, 0, 0.02)',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                      Requirements:
                    </Typography>
                    <List dense disablePadding>
                      {passwordRequirements.map((req, index) => (
                        <ListItem key={index} disablePadding sx={{ py: 0.25 }}>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            {req.test ? (
                              <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
                            ) : (
                              <CancelIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                            )}
                          </ListItemIcon>
                          <ListItemText 
                            primary={req.label} 
                            primaryTypographyProps={{ 
                              variant: 'caption',
                              color: req.test ? 'text.primary' : 'text.disabled',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              )}
            </Box>
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
                'Create Account'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
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
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Box>

          </Stack>
        </Box>
    </Paper>
  </Container>
);
};

export default Register;