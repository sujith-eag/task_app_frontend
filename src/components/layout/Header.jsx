import { logout, reset as resetAuth } from '../../features/auth/authSlice.js';
import { reset as resetTasks } from '../../features/tasks/taskSlice.js';
import { ColorModeContext } from '../../context/ThemeContext.jsx';
import eagleLogo from '../../assets/eagle-logo.png';
import ConfirmationDialog from '../ConfirmationDialog.jsx';
import ConnectionStatus from '../ConnectionStatus.jsx';

import { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUserRoles } from '../../utils/roles.js';

import {
    AppBar, Toolbar, Typography, Button, Box, Stack, IconButton, Tooltip,
    Menu, MenuItem, useMediaQuery, Avatar, ListItemIcon, Divider
} from '@mui/material';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
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
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const Header = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);
    const userRoles = getUserRoles(user);

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
      elevation={0} // Remove shadow for a cleaner glass effect     
      sx={{ 
        marginBottom: { xs: '24px', sm: '32px', md: '40px' },
        // --- Enhanced glassmorphism styles ---
        background: (theme) => theme.palette.mode === 'dark'
        ? 'linear-gradient(180deg, rgba(26, 31, 58, 0.85) 0%, rgba(18, 18, 18, 0.7) 100%)' // Dark mode gradient
        : 'linear-gradient(180deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.7) 100%)', // Light mode gradient
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)', // Safari support
        borderBottom: (theme) => theme.palette.mode === 'dark'
          ? `2px solid transparent`
          : `2px solid transparent`,
        backgroundImage: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(90deg, rgba(144, 202, 249, 0.3) 0%, rgba(100, 181, 246, 0.3) 50%, rgba(144, 202, 249, 0.3) 100%)'
          : 'linear-gradient(90deg, rgba(25, 118, 210, 0.2) 0%, rgba(21, 101, 192, 0.2) 50%, rgba(25, 118, 210, 0.2) 100%)',
        backgroundPosition: '0 100%',
        backgroundSize: '100% 2px',
        backgroundRepeat: 'no-repeat',
        transition: 'all 0.3s ease',
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
                sx={{
                    ml: 1,
                    transition: 'transform 350ms ease, color 350ms ease',
                    transform: theme.palette.mode === 'dark' ? 'rotate(-8deg) scale(1.02)' : 'rotate(0deg) scale(1)',
                    '&:active': { transform: 'scale(0.95) rotate(0deg)' },
                }}
                onClick={colorMode.toggleColorMode}
                color="inherit"
                aria-label="toggle theme"
                >
            {theme.palette.mode === 'dark' ? (
                <LightModeIcon sx={{ color: theme.palette.warning.main, transition: 'color 350ms ease' }} />
            ) : (
                <DarkModeIcon sx={{ color: theme.palette.primary.main, transition: 'color 350ms ease' }} />
            )}
        </IconButton>
        </Tooltip>

        {/* Socket Connection Status - Only shown when disconnected */}
        {user && <ConnectionStatus />}

        {/* Notifications placeholder (badge will be wired later) */}
        {user && (
            <Tooltip title="Notifications">
                <IconButton color="inherit" size="large" sx={{ ml: 0.5 }}>
                    <Badge color="error" badgeContent={0} invisible={true}>
                        <NotificationsNoneIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
        )}

        {user ? (
            <Tooltip title="Account">
                <IconButton 
                    color="inherit" 
                    onClick={handleMenuOpen}
                    sx={{
                        position: 'relative',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'scale(1.05)',
                        }
                    }}
                >
                    {user.avatar ? (
                        <Box sx={{ position: 'relative' }}>
                            <Avatar 
                                sx={{ 
                                    width: 36, 
                                    height: 36,
                                    border: (theme) => `2px solid ${theme.palette.primary.main}`,
                                    transition: 'all 0.2s ease',
                                }} 
                                src={user.avatar} 
                            />
                            {/* Online status indicator */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: 'success.main',
                                    border: '2px solid',
                                    borderColor: 'background.paper',
                                    boxShadow: (theme) => `0 0 0 2px ${theme.palette.success.main}40`,
                                }}
                            />
                        </Box>
                    ) : (
                        <Box sx={{ position: 'relative' }}>
                            <AccountCircle sx={{ fontSize: 36 }} />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 2,
                                    right: 2,
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    backgroundColor: 'success.main',
                                    border: '2px solid',
                                    borderColor: 'background.paper',
                                }}
                            />
                        </Box>
                    )}
                </IconButton>
            </Tooltip>
        ) : (
            <Tooltip title="Menu">
                <IconButton 
                    color="inherit" 
                    onClick={handleMenuOpen}
                    sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            transform: 'scale(1.05)',
                            bgcolor: 'action.hover',
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Tooltip>
        )}
    </Stack>
</Toolbar>

            {/* --- SINGLE, DYNAMIC MENU --- */}
            <Menu 
                anchorEl={anchorEl} 
                open={isMenuOpen} 
                onClose={handleMenuClose}
                TransitionProps={{
                    timeout: 300,
                }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        minWidth: 240,
                        borderRadius: 2,
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
                            : '0 8px 32px rgba(0, 0, 0, 0.15)',
                        background: (theme) => theme.palette.mode === 'dark'
                            ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(18, 18, 18, 0.95) 100%)'
                            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 250, 0.95) 100%)',
                        backdropFilter: 'blur(10px)',
                        border: 1,
                        borderColor: 'divider',
                    }
                }}
            >
                {user ? (
                    // Logged-in menu items
                    <div>
                        {/* User Info Header */}
                        <MenuItem 
                            disabled 
                            sx={{ 
                                '&.Mui-disabled': { opacity: 1 },
                                py: 1.5,
                                borderBottom: 1,
                                borderColor: 'divider',
                                mb: 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                                {user.avatar ? (
                                    <Avatar 
                                        src={user.avatar} 
                                        sx={{ 
                                            width: 40, 
                                            height: 40,
                                            border: 2,
                                            borderColor: 'primary.main'
                                        }} 
                                    />
                                ) : (
                                    <Avatar 
                                        sx={{ 
                                            width: 40, 
                                            height: 40,
                                            bgcolor: 'primary.main'
                                        }}
                                    >
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </Avatar>
                                )}
                                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            fontWeight: 700,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {user?.name || 'User'}
                                    </Typography>
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary"
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {user?.email}
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>

                        {/* Personal Section */}
                        <Box sx={{ px: 2, py: 0.5 }}>
                            <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                sx={{ 
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}
                            >
                                Personal
                            </Typography>
                        </Box>

                        {/* --- My Profile Link --- */}
                        {location.pathname !== '/profile' && (
                        <MenuItem 
                            component={Link} 
                            to='/profile' 
                            onClick={handleMenuClose}
                            sx={getMenuItemStyles(location.pathname === '/profile')}
                        >
                        <ListItemIcon><AccountBoxIcon fontSize="small" /></ListItemIcon>
                        My Profile
                        </MenuItem>)
                        }

                        {/* --- Task Dashboard Link --- */}
                        {location.pathname !== '/dashboard' && (
                            <MenuItem 
                                component={Link} 
                                to='/dashboard' 
                                onClick={handleMenuClose}
                                sx={getMenuItemStyles(location.pathname === '/dashboard')}                            
                            >
                            <ListItemIcon><AssignmentIcon fontSize="small" /></ListItemIcon>
                                Task Manager
                            </MenuItem>
                        )}

                        {/* Dashboards Section - Role-based */}
                        {(userRoles.includes('admin') || userRoles.includes('teacher') || userRoles.includes('student')) && (
                            <>
                                <Divider sx={{ my: 1 }} />
                                <Box sx={{ px: 2, py: 0.5 }}>
                                    <Typography 
                                        variant="caption" 
                                        color="text.secondary" 
                                        sx={{ 
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: 1,
                                        }}
                                    >
                                        Dashboards
                                    </Typography>
                                </Box>

                                {/* --- Admin Dashboard Link --- */}
                                {userRoles.includes('admin') && location.pathname !== '/admin/dashboard' && (
                                    <MenuItem 
                                        component={Link} 
                                        to='/admin/dashboard' 
                                        onClick={handleMenuClose}
                                        sx={getMenuItemStyles(location.pathname === '/admin/dashboard')}
                                    >
                                        <ListItemIcon><AdminPanelSettingsIcon fontSize="small" /></ListItemIcon>
                                        Admin Dashboard
                                    </MenuItem>
                                )}
                                {/* --- Teacher Dashboard --- */}
                                {userRoles.includes('teacher') && location.pathname !== '/teacher/dashboard' && (
                                    <MenuItem 
                                        component={Link} 
                                        to='/teacher/dashboard' 
                                        onClick={handleMenuClose}
                                        sx={getMenuItemStyles(location.pathname === '/teacher/dashboard')}                            
                                    >
                                    <ListItemIcon><ClassIcon fontSize="small" /></ListItemIcon>
                                        My Dashboard
                                    </MenuItem>
                                )}
                                {/* --- Student Dashboard --- */}
                                {userRoles.includes('student') && location.pathname !== '/student/dashboard' && (
                                    <MenuItem 
                                        component={Link} 
                                        to='/student/dashboard' 
                                        onClick={handleMenuClose}
                                        sx={getMenuItemStyles(location.pathname === '/student/dashboard')}                            
                                    >
                                    <ListItemIcon><SchoolIcon fontSize="small" /></ListItemIcon>
                                        My Dashboard
                                    </MenuItem>
                                )}
                            </>
                        )}

                        {/* Resources Section */}
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ px: 2, py: 0.5 }}>
                            <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                sx={{ 
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}
                            >
                                Resources
                            </Typography>
                        </Box>

                        {/* --- Files Page Link --- */}
                        {location.pathname !== '/files' && (
                            <MenuItem 
                                component={Link} 
                                to='/files' 
                                onClick={handleMenuClose}
                                sx={getMenuItemStyles(location.pathname === '/files')}                        
                            >
                            <ListItemIcon><InsertDriveFileIcon fontSize="small" /></ListItemIcon>
                                Files
                            </MenuItem>
                        )}
                        {/* --- Message Link --- */}
                        {location.pathname !== '/chat' && (
                            <MenuItem 
                                component={Link} 
                                to='/chat' 
                                onClick={handleMenuClose}
                                sx={getMenuItemStyles(location.pathname === '/chat')}                            
                            >
                            <ListItemIcon><ChatIcon fontSize="small" /></ListItemIcon>
                                Messages
                            </MenuItem>
                        )}

                        {/* Public Features Section */}
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ px: 2, py: 0.5 }}>
                            <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                sx={{ 
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}
                            >
                                Public Access
                            </Typography>
                        </Box>

                        <MenuItem 
                            component={Link} 
                            to='/download' 
                            onClick={handleMenuClose} 
                            sx={getMenuItemStyles(location.pathname === '/download')}
                        >
                            <ListItemIcon>
                                <DownloadIcon fontSize="small" />
                            </ListItemIcon>
                            Download File
                        </MenuItem>

                        {/* Account Section */}
                        <Divider sx={{ my: 1 }} />

                        {/* --- Logout Link --- */}
                        <MenuItem 
                            onClick={handleLogoutClick}
                            sx={{
                                ...getMenuItemStyles(false),
                                color: 'error.main',
                                '&:hover': {
                                    bgcolor: 'error.main',
                                    color: 'error.contrastText',
                                    '& .MuiListItemIcon-root': {
                                        color: 'error.contrastText',
                                    }
                                }
                            }}
                        >
                            <ListItemIcon sx={{ color: 'error.main' }}>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>

                    </div>
                ) : (
                    // Logged-out menu items
                <div>
                    <MenuItem 
                        disabled 
                        sx={{ 
                            '&.Mui-disabled': { opacity: 1 },
                            py: 1.5,
                            borderBottom: 1,
                            borderColor: 'divider',
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            Welcome! Please sign in
                        </Typography>
                    </MenuItem>

                    <Box sx={{ px: 2, py: 0.5 }}>
                        <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                            }}
                        >
                            Account
                        </Typography>
                    </Box>

                    <MenuItem 
                        component={Link} 
                        to='/login' 
                        onClick={handleMenuClose} 
                        sx={getMenuItemStyles(location.pathname === '/login')}
                    >
                        <ListItemIcon><LoginIcon fontSize="small" /></ListItemIcon>
                        Login
                    </MenuItem>
                    <MenuItem 
                        component={Link} 
                        to='/register' 
                        onClick={handleMenuClose} 
                        sx={getMenuItemStyles(location.pathname === '/register')}
                    >
                        <ListItemIcon><PersonAddIcon fontSize="small" /></ListItemIcon>
                        Register
                    </MenuItem>
                    
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ px: 2, py: 0.5 }}>
                        <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: 1,
                            }}
                        >
                            Public Access
                        </Typography>
                    </Box>
                    
                    <MenuItem 
                        component={Link} 
                        to='/download' 
                        onClick={handleMenuClose} 
                        sx={getMenuItemStyles(location.pathname === '/download')}
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

// Enhanced menu item styles with active state support
const getMenuItemStyles = (isActive) => ({
    py: 1.25,
    px: 2,
    minHeight: 44, // Better touch target for mobile
    transition: 'all 0.2s ease',
    position: 'relative',
    ...(isActive && {
        bgcolor: 'action.selected',
        borderLeft: 3,
        borderColor: 'primary.main',
        '&:before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 4,
            height: '70%',
            bgcolor: 'primary.main',
            borderRadius: '0 4px 4px 0',
        }
    }),
    '&:hover': {
        bgcolor: isActive ? 'action.selected' : 'action.hover',
        transform: 'translateX(4px)',
        '& .MuiListItemIcon-root': {
            transform: 'scale(1.1)',
        }
    },
    '& .MuiListItemIcon-root': {
        minWidth: 36,
        transition: 'transform 0.2s ease',
    }
});

export default Header;