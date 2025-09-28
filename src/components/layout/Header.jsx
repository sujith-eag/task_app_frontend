import { logout, reset as resetAuth } from '../../features/auth/authSlice.js';
import { reset as resetTasks } from '../../features/tasks/taskSlice.js';
import { ColorModeContext } from '../../context/ThemeContext.jsx';
import eagleLogo from '../../assets/eagle-logo.png';

import { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    AppBar, Toolbar, Typography, Button, Box, Stack, IconButton,
    Menu, MenuItem, useMediaQuery, Avatar, ListItemIcon
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon Icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import AccountCircle from '@mui/icons-material/AccountCircle'; // Generic user icon
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import { FaSignInAlt, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    
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
            Eagle Campus
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
                {/* --- User menu trigger for both desktop and mobile --- */}
                <IconButton color="inherit" onClick={handleMenuOpen}>
                    {/* Show user's avatar if available, otherwise a generic icon */}
                    {user.avatar ? <Avatar sx={{ width: 32, height: 32 }} src={user.avatar} /> : <AccountCircle />}
                </IconButton>
            </>
        ) : (
            <>
                {/* Desktop Buttons for logged-out */}
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    <Stack direction="row" spacing={0.5}>
                        <Button component={Link} to='/login' 
                            color="inherit" startIcon={<FaSignInAlt />} 
                            size={isDesktop ? 'medium' : 'small'}
                            >Login</Button>
                        <Button component={Link} to='/register' 
                            color="inherit" startIcon={<FaUser />} 
                            size={isDesktop ? 'medium' : 'small'}>
                                Register</Button>
                    </Stack>
                </Box>
                {/* Mobile Menu Icon for logged-out */}
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <MenuIcon />
                    </IconButton>
                </Box>
            </>
        )}
    </Stack>
</Toolbar>

            {/* --- SINGLE, DYNAMIC MENU --- */}
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                {user ? (
                    // Logged-in menu items
                    <div>
                        
                        {/* --- Dashboard Link --- */}
                        {location.pathname !== '/dashboard' && (
                            <MenuItem component={Link} to='/dashboard' onClick={handleMenuClose}>
                                <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                                Task Manager
                            </MenuItem>
                        )}
                        {/* --- My Profile Link --- */}
                        {location.pathname !== '/profile' && (
                        <MenuItem component={Link} to='/profile' onClick={handleMenuClose}>
                            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                            My Profile
                        </MenuItem>)
                        }
                        {/* --- Message Link --- */}
                        {location.pathname !== '/chat' && (
                        <MenuItem component={Link} to='/chat' onClick={handleMenuClose}>
                            <ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon>
                            Messages
                        </MenuItem>
                        )}
                        
                        {/* --- Admin Link --- */}
                        {user?.role === 'admin' && location.pathname !== '/admin/dashboard' && (
                            <MenuItem component={Link} to='/admin/dashboard' onClick={handleMenuClose}>
                                <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                                Admin Dashboard
                            </MenuItem>
                        )}

                        {user.role === 'teacher' && location.pathname !== '/teacher/dashboard' && (
                            <MenuItem component={Link} to='/teacher/dashboard' onClick={handleMenuClose}>
                                <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                                My Dashboard
                            </MenuItem>
                        )}

                        {user.role === 'student' && location.pathname !== '/student/dashboard' && (
                            <MenuItem component={Link} to='/student/dashboard' onClick={handleMenuClose}>
                                <ListItemIcon><DashboardIcon fontSize="small" /></ListItemIcon>
                                My Dashboard
                            </MenuItem>
                        )}
                        
                        <MenuItem onClick={onLogout}>
                            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                            Logout
                        </MenuItem>

                    </div>
                ) : (
                    // Logged-out menu items
                    <div>
                        <MenuItem component={Link} to='/login' 
                            onClick={handleMenuClose}
                            >Login
                        </MenuItem>
                        <MenuItem component={Link} to='/register' 
                            onClick={handleMenuClose}
                            >Register
                        </MenuItem>
                    </div>
                )}
            </Menu>
        </AppBar>
    );
};

export default Header;