import { resetPassword, reset } from '../authSlice.js';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    Container, Box, Avatar, Typography, TextField, Button,
    CircularProgress, InputAdornment, IconButton, Paper, Stack,
    LinearProgress, List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const { password, confirmPassword } = formData;

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const isPasswordValid = passwordRegex.test(password);
  const isPasswordsMatch = password === confirmPassword;
  const canSubmit = isPasswordValid && isPasswordsMatch && password !== '';

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

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    if (isSuccess) {
      toast.success(message || 'Password has been reset successfully!');
      navigate('/login');
    }
    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error('Please fix the errors before submitting.');
      return;
    }
    dispatch(resetPassword({ token, password, confirmPassword }));
  };


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
                ? 'linear-gradient(45deg, #ffa726 30%, #fb8c00 90%)'
                : 'linear-gradient(45deg, #e65100 30%, #ff9800 90%)',
            boxShadow: 3,
          }}
        >
          <VpnKeyIcon sx={{ fontSize: 28 }} />
        </Avatar>

        <Typography 
          component="h1" 
          variant="h5"
          sx={{
            fontWeight: 600,
            mb: 1,
          }}
        >
          Reset Password
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 3, textAlign: 'center' }}
        >
          Create a strong new password for your account
        </Typography>

        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{ mt: 1, width: '100%' }}
        >
          <Stack spacing={2.5}>
            <Box>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoFocus
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
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              error={confirmPassword && !isPasswordsMatch}
              helperText={
                confirmPassword && !isPasswordsMatch
                  ? 'Passwords do not match'
                  : ''
              }
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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
                'Set New Password'
              )}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPasswordPage;

  