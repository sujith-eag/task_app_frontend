import pkg from '../../../package.json'
import eagleLogo from '../../assets/eagle-logo.png';

import { Box, Typography, Link, IconButton, Container, Stack, Divider } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FavoriteIcon from '@mui/icons-material/Favorite';


const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: { xs: 3, sm: 4 },
        px: 2,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(26, 31, 58, 0.95) 0%, rgba(18, 18, 18, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 247, 250, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderTop: (theme) => `2px solid transparent`,
        backgroundImage: (theme) => theme.palette.mode === 'dark'
          ? 'linear-gradient(90deg, rgba(144, 202, 249, 0.3) 0%, rgba(100, 181, 246, 0.3) 50%, rgba(144, 202, 249, 0.3) 100%)'
          : 'linear-gradient(90deg, rgba(25, 118, 210, 0.2) 0%, rgba(21, 101, 192, 0.2) 50%, rgba(25, 118, 210, 0.2) 100%)',
        backgroundPosition: '0 0',
        backgroundSize: '100% 2px',
        backgroundRepeat: 'no-repeat',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 0%, rgba(144, 202, 249, 0.05) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 0%, rgba(25, 118, 210, 0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Main Content */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 3, sm: 2 },
          mb: { xs: 2, sm: 3 },
        }}>
          
          {/* Left Column: Logo & Brand */}
          <Box sx={{ 
            width: { xs: '100%', sm: 'auto' }, 
            textAlign: { xs: 'center', sm: 'left' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 1,
            }}>
              
            {/* Logo with glow effect */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                mb: 0.5,
              }}
            >
              <Box
                component="img"
                src={eagleLogo}
                alt="Eagle Campus Logo"
                sx={{ 
                  height: { xs: 28, sm: 32 },
                  filter: (theme) => theme.palette.mode === 'dark'
                    ? 'drop-shadow(0 0 8px rgba(144, 202, 249, 0.4))'
                    : 'drop-shadow(0 0 6px rgba(25, 118, 210, 0.3))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    filter: (theme) => theme.palette.mode === 'dark'
                      ? 'drop-shadow(0 0 12px rgba(144, 202, 249, 0.6))'
                      : 'drop-shadow(0 0 10px rgba(25, 118, 210, 0.5))',
                  }
                }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {'© '}
              <Link 
                color="inherit" 
                href="https://sujith-eag.in/"
                sx={{ 
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  }
                }}
                >
                Sujith
              </Link>
              {' '}{new Date().getFullYear()}
              {' • Made with '}
              <FavoriteIcon 
                sx={{ 
                  fontSize: 14, 
                  verticalAlign: 'middle',
                  color: 'error.main',
                  animation: 'heartbeat 1.5s ease-in-out infinite',
                  '@keyframes heartbeat': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' }
                  }
                }} 
              />
            </Typography>
          </Box>

          {/* Center Column: Version & Status */}
          <Box sx={{ 
            width: { xs: '100%', sm: 'auto' }, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                px: 2,
                py: 0.75,
                borderRadius: 2,
                bgcolor: 'action.hover',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                Version
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main',
                  fontSize: '0.8rem',
                }}
              >
                {pkg.version}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              All rights reserved
            </Typography>
          </Box>

          {/* Right Column: Social Icons */}
          <Box sx={{ 
            width: { xs: '100%', sm: 'auto' }, 
            textAlign: { xs: 'center', sm: 'right' } 
          }}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'center', sm: 'flex-end' }}>
              <IconButton
                aria-label="github"
                component="a"
                href="https://github.com/sujith-eag/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  transition: 'all 0.3s ease',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  '&:hover': { 
                    color: 'text.primary',
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: 3,
                    borderColor: 'text.primary',
                    bgcolor: 'action.hover',
                  } 
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="linkedin"
                component="a"
                href="https://www.linkedin.com/in/sujith-eag"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  transition: 'all 0.3s ease',
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  '&:hover': { 
                    color: '#0A66C2',
                    transform: 'translateY(-3px) scale(1.05)',
                    boxShadow: 3,
                    borderColor: '#0A66C2',
                    bgcolor: 'action.hover',
                  } 
                }}
              >
                <LinkedInIcon fontSize="small" />
              </IconButton>
            </Stack>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block', 
                mt: 1,
                fontSize: '0.7rem',
              }}
            >
              Connect with me
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;