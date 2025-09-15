import { logout, reset as resetAuth } from '../../features/auth/authSlice.js';
import { reset as resetTasks } from '../../features/tasks/taskSlice.js';
import { ColorModeContext } from '../../context/ThemeContext.jsx';
import eagleLogo from '../../assets/eagle-logo.png'

import { useState, useContext } from 'react'; // Import useContext
import { useTheme } from '@mui/material/styles'; // Import useTheme

import { AppBar, Toolbar, Typography, Button, 
    Box, Stack, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { toast } from 'react-toastify';

const Header = () => {
  const theme = useTheme(); // Get current theme
  const colorMode = useContext(ColorModeContext); // Get toggle function
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));  
  
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    const userName = user?.name;
    
    dispatch(logout());
    dispatch(resetAuth());
    dispatch(resetTasks());
    handleMenuClose();
    toast.success(`Goodbye, ${userName || 'User'}!`);
    navigate('/');

  };

  return (
    <AppBar 
      position="sticky" 
      color="default" 
      elevation={1} 
      sx={{ marginBottom: '40px' }}
    >

    <Toolbar 
      sx={{ minHeight: { xs: 56, md: 64 }}}>
      <Link 
        to='/' 
        style={{ 
            textDecoration: 'none', 
            color: 'inherit', 
            display: 'flex', 
            alignItems: 'center' 
            }}>

          <Box
            component="img"
            src={eagleLogo}
            alt="Eagle Tasks Logo"
            // Responsive logo height
            sx={{ 
                height: { xs: 35, md: 45 }, 
                mr: 1.5, 
                transition: 'height 0.3s' 
              }}/>
          <Typography
            variant="h6"
            component="div"
            noWrap
            // Responsive font size for the title
            sx={{ 
                fontSize: { xs: '1.1rem', md: '1.5rem' }, 
                transition: 'font-size 0.3s' 
              }}>
            Eagle Tasks
          </Typography>
        </Link>

        {/* Empty Box as flexible spacer */}
        <Box sx={{ flexGrow: 1 }} />


        {/* Grouping the navigation buttons in a Stack for consistent spacing */}
        <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center">
          <IconButton 
              sx={{ ml: 1 }} 
              onClick={colorMode.toggleColorMode} 
              color="inherit"
              >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>


          {user ? (
            <>
              {/* Desktop Buttons */}
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Stack direction="row" spacing={1}>
                  {location.pathname !== '/dashboard' && (
                    <Button component={Link} to='/dashboard' color="inherit" size={isDesktop ? 'large' : 'small'}>Dashboard</Button>
                  )}
                  {user.role === 'admin' && (
                    <Button component={Link} to='/admin' color="inherit" size={isDesktop ? 'large' : 'small'}>Admin</Button>
                  )}
                  <Button color="inherit" startIcon={<FaSignOutAlt />} onClick={onLogout} size={isDesktop ? 'large' : 'small'}>Logout</Button>
                </Stack>
              </Box>
              {/* Mobile Menu Icon */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton color="inherit" onClick={handleMenuOpen}>
                  <MenuIcon />
                </IconButton>
              </Box>
            </>
            
          ) : (

            <>
              {/* Desktop Buttons for logged-out */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Stack direction="row" spacing={0.5}>
                  <Button component={Link} to='/login' color="inherit" startIcon={<FaSignInAlt />} size={isDesktop ? 'medium' : 'small'}>Login</Button>
                  <Button component={Link} to='/register' color="inherit" startIcon={<FaUser />} size={isDesktop ? 'medium' : 'small'}>Register</Button>
                </Stack>
              </Box>
              {/* Mobile Menu Icon for logged-out */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton color="inherit" onClick={handleMenuOpen}><MenuIcon /></IconButton>
              </Box>
            </>
          )}
        </Stack>
      </Toolbar>

      {/* A SINGLE, DYNAMIC MENU */}
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        {user ? (
          // Logged-in menu items
          <div>
            {location.pathname !== '/dashboard' && (
              <MenuItem component={Link} to='/dashboard' onClick={handleMenuClose}>Dashboard</MenuItem>
            )}
            {user.role === 'admin' && (
              <MenuItem component={Link} to='/admin' onClick={handleMenuClose}>Admin</MenuItem>
            )}
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </div>
        ) : (
          // Logged-out menu items
          <div>
            <MenuItem component={Link} to='/login' onClick={handleMenuClose}>Login</MenuItem>
            <MenuItem component={Link} to='/register' onClick={handleMenuClose}>Register</MenuItem>
          </div>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;
