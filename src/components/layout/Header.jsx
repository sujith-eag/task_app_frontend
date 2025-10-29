import { logout, reset as resetAuth } from '../../features/auth/authSlice.js';
import { reset as resetTasks } from '../../features/tasks/taskSlice.js';
import { ColorModeContext } from '../../context/ThemeContext.jsx';
import eagleLogo from '../../assets/eagle-logo.png';
import ConfirmationDialog from '../ConfirmationDialog.jsx';

import { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
    AppBar, Toolbar, Typography, Button, Box, Stack, IconButton, Tooltip,
    Menu, MenuItem, useMediaQuery, Avatar, ListItemIcon, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon Icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun icon
import AccountCircle from '@mui/icons-material/AccountCircle'; // Generic user icon
import AccountBoxIcon from '@mui/icons-material/AccountBox'; // Profile
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'; // Admin
import AssignmentIcon from '@mui/icons-material/Assignment'; // for task
import SchoolIcon from '@mui/icons-material/School';  // for student
import ClassIcon from '@mui/icons-material/Class'; // for teacher
import ChatIcon from '@mui/icons-material/Chat'; // message
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile' // file
import LoginIcon from '@mui/icons-material/Login'; // login
import LogoutIcon from '@mui/icons-material/Logout'; // logout
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // register
import DownloadIcon from '@mui/icons-material/Download';

const Header = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const [anchorEl, setAnchorEl] = useState(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
    
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));  
    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
        handleMenuClose(); // Close menu when opening dialog
    };
    
    const handleLogoutConfirm = async () => {
        const userName = user?.name;
        await dispatch(logout());
        await dispatch(resetAuth());
        await dispatch(resetTasks());
        setLogoutDialogOpen(false);
        toast.success(`Goodbye, ${userName || 'User'}!`);
        navigate('/');
    };
    
  return (
    <AppBar 
      position="sticky" 
      color="default" 
    //   elevation={1}
      elevation={0} // Remove shadow for a cleaner glass effect     
      sx={{ 
        marginBottom: '40px',
        // --- glassmorphism styles ---
        background: (theme) => theme.palette.mode === 'dark'
        ? 'rgba(18, 18, 18, 0.7)' // Dark mode semi-transparent
        : 'rgba(255, 255, 255, 0.7)', // Light mode semi-transparent
        backdropFilter: 'blur(10px)',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
    }}

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
            alt="Eagle Campus Logo"
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

        <Tooltip title={theme.palette.mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          <IconButton 
              sx={{ ml: 1 }} 
              onClick={colorMode.toggleColorMode} 
              color="inherit"
              >
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        {user ? (
            <Tooltip title="Account">
                <IconButton color="inherit" onClick={handleMenuOpen}>
                    {user.avatar ? <Avatar sx={{ width: 32, height: 32 }} src={user.avatar} /> : <AccountCircle />}
                </IconButton>
            </Tooltip>
        ) : (
            <Tooltip title="Menu">
                <IconButton color="inherit" onClick={handleMenuOpen}>
                    <MenuIcon />
                </IconButton>
            </Tooltip>
        )}
    </Stack>
</Toolbar>

            {/* --- SINGLE, DYNAMIC MENU --- */}
            <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                {user ? (
                    // Logged-in menu items
                    <div>
                        <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1 } }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Hi, {user?.name || 'User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                            </Box>
                        </MenuItem>

                        {/* --- My Profile Link --- */}
                        {location.pathname !== '/profile' && (
                        <MenuItem component={Link} to='/profile' onClick={handleMenuClose}
                            sx={menuItemStyles}
                        >
                        <ListItemIcon><AccountBoxIcon fontSize="small" /></ListItemIcon>
                        My Profile
                        </MenuItem>)
                        }                        

                        {/* --- Admin Dashboard Link --- */}
                        {user?.role === 'admin' && location.pathname !== '/admin/dashboard' && (
                            <MenuItem component={Link} to='/admin/dashboard' onClick={handleMenuClose}
                                sx={menuItemStyles}
                            >
                                <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                                Admin Dashboard
                            </MenuItem>
                        )}
                        {/* --- Teacher Dashboard --- */}
                        {user.role === 'teacher' && location.pathname !== '/teacher/dashboard' && (
                            <MenuItem component={Link} to='/teacher/dashboard' onClick={handleMenuClose}
                                sx={menuItemStyles}                            
                            >
                            <ListItemIcon><ClassIcon fontSize="small" /></ListItemIcon>
                                My Dashboard
                            </MenuItem>
                        )}
                        {/* --- Student Dashboard --- */}
                        {user.role === 'student' && location.pathname !== '/student/dashboard' && (
                            <MenuItem component={Link} to='/student/dashboard' onClick={handleMenuClose}
                                sx={menuItemStyles}                            
                            >
                            <ListItemIcon><SchoolIcon fontSize="small" /></ListItemIcon>
                                My Dashboard
                            </MenuItem>
                        )}
                        {/* --- Task Dashboard Link --- */}
                        {location.pathname !== '/dashboard' && (
                            <MenuItem component={Link} to='/dashboard' onClick={handleMenuClose}
                                sx={menuItemStyles}                            
                            >
                            <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
                                Task Manager
                            </MenuItem>
                        )}



            {/* FOR LOGGED-IN USERS */}
            <Divider sx={{ my: 1 }} />

            <MenuItem 
                component={Link} 
                to='/download' 
                onClick={handleMenuClose} 
                sx={menuItemStyles}>
                <ListItemIcon>
                    <DownloadIcon fontSize="small" />
                </ListItemIcon>
                Download File
            </MenuItem>

            <Divider sx={{ my: 1 }} />



                        {/* --- Files Page Link --- */}
                        {location.pathname !== '/files' && (
                            <MenuItem component={Link} to='/files' onClick={handleMenuClose}
                                sx={menuItemStyles}                        
                            >
                            <ListItemIcon><InsertDriveFileIcon fontSize="small" /></ListItemIcon>
                                Files
                            </MenuItem>
                        )}
                        {/* --- Message Link --- */}
                        {location.pathname !== '/chat' && (
                            <MenuItem component={Link} to='/chat' onClick={handleMenuClose}
                                sx={menuItemStyles}                            
                            >
                            <ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon>
                                Messages
                            </MenuItem>
                        )}

                        {/* --- Logout Link --- */}
                        <MenuItem 
                            onClick={handleLogoutClick}
                            sx={menuItemStyles}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>

                    </div>
                ) : (
                    // Logged-out menu items
                <div>
                    <MenuItem disabled sx={{ '&.Mui-disabled': { opacity: 1 } }}>
                        <Typography variant="body2" color="text.secondary">
                            You are not logged in.
                        </Typography>
                    </MenuItem>

                    <MenuItem 
                        component={Link} 
                        to='/login' 
                        onClick={handleMenuClose} 
                        sx={menuItemStyles}
                    >
                        <ListItemIcon><LoginIcon fontSize="small" /></ListItemIcon>
                        Login
                    </MenuItem>
                    <MenuItem 
                        component={Link} 
                        to='/register' 
                        onClick={handleMenuClose} 
                        sx={menuItemStyles}
                    >
                        <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
                        Register
                    </MenuItem>
                    
                    <MenuItem 
                        component={Link} 
                        to='/download' 
                        onClick={handleMenuClose} 
                        sx={menuItemStyles}
                        >
                            <ListItemIcon>
                                <DownloadIcon fontSize="small" />
                            </ListItemIcon>
                        Download File
                    </MenuItem>
                </div>
                )}
            </Menu>
            
            {/* Logout Confirmation Dialog */}
            <ConfirmationDialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                onConfirm={handleLogoutConfirm}
                title="Logout"
                message={`Are you sure you want to logout${user?.name ? `, ${user.name}` : ''}?`}
                variant="warning"
                confirmText="Logout"
                cancelText="Stay Logged In"
            />
        </AppBar>
    );
};

// Reusable styles for menu items
const menuItemStyles = {
    transition: 'background-color 0.2s ease, transform 0.15s ease',
    '&:hover': {
        bgcolor: 'action.hover',
        transform: 'translateX(4px)',
    },
};

export default Header;