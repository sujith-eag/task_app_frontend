import { useContext } from 'react'; // Import useContext
import { useTheme } from '@mui/material/styles'; // Import useTheme

import { AppBar, Toolbar, Typography, Button, Box, Stack, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import { ColorModeContext } from '../context/ThemeContext'; // Import the context

import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, reset as resetAuth } from '../features/auth/authSlice.js';
import { reset as resetTasks } from '../features/tasks/taskSlice.js';

import eagleLogo from '../assets/eagle-logo.png';

const Header = () => {
  const theme = useTheme(); // Get current theme
  const colorMode = useContext(ColorModeContext); // Get toggle function
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetAuth());
    dispatch(resetTasks());
    navigate('/');
  };

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={1} 
      sx={{ marginBottom: '40px' }}
    >

    <Toolbar>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        flexGrow: 1, 
        textDecoration: 'none',
        color: 'inherit' 
      }}>

      <Link to='/'>
          <img 
            src={eagleLogo} 
            alt="Eagle Tasks Logo" 
            style={{ height: '40px', marginRight: '10px' }} />
        </Link>

          <Typography variant="h6" component="div" noWrap>
            <Link to='/'>
              Eagle Tasks
            </Link>
          </Typography>
        </Box>

        {/* 3. Group the navigation buttons in a Stack for consistent spacing */}
        <Stack 
          direction="row" 
          spacing={1}
          alignItems="center"
          >
            
            
          <IconButton 
            sx={{ ml: 1 }} 
            onClick={colorMode.toggleColorMode} 
            color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>


          {user ? (
            <Stack direction="row" spacing={1}>
              {location.pathname !== '/dashboard' && (
              <Button component={Link} to='/dashboard' color="inherit">
                Dashboard
              </Button>
              )}
              {user.role === 'admin' && (
                <Button component={Link} to='/admin' color="inherit">
                  Admin
                </Button>
              )}

              <Button 
                color="inherit" 
                startIcon={<FaSignOutAlt />} 
                onClick={onLogout}>
              Logout
              </Button>
            </Stack>
          ) : (
            <>
              <Button component={Link} to='/login' color="inherit" startIcon={<FaSignInAlt />}>
                Login
              </Button>
              <Button component={Link} to='/register' color="inherit" startIcon={<FaUser />}>
                Register
              </Button>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}; 

export default Header;