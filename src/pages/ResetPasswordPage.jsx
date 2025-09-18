import { resetPassword, reset } from '../features/auth/authSlice.js';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
    Container, Box, Avatar, Typography, TextField, Button,
    Backdrop, CircularProgress, InputAdornment, IconButton 
} from '@mui/material';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

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
          <VpnKeyIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        <Typography component="p" color="text.secondary" sx={{ mt: 1 }}>
          Enter your new password below.
        </Typography>

        <Box
          component="form"
          onSubmit={onSubmit}
          noValidate
          sx={{ mt: 3, width: '100%' }}
        >
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
              },
            }}
          />
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!canSubmit || isLoading}
          >
            Set New Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;

  