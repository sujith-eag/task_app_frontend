import eagleLogo from '../../../assets/eagle-logo.png';

import { Box, Container, Typography, Button, Stack, Chip } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import SpeedIcon from '@mui/icons-material/Speed';

const HeroSection = () => {
  
  const { user } = useSelector((state) => state.auth);

  return (
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #0d47a1 0%, #1A237E 50%, #000051 100%)'
            : 'linear-gradient(135deg, #1565c0 0%, #0d47a1 50%, #01579b 100%)',
          color: 'white',
          py: { xs: 8, sm: 12, md: 16 },
          px: { xs: 2, sm: 3 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: '85vh', sm: '80vh', md: '85vh' },
          display: 'flex',
          alignItems: 'center',
          
        // --- Enhanced glow effect with particles ---
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '300px', sm: '400px', md: '600px' },
          height: { xs: '300px', sm: '400px', md: '600px' },
          background: 'radial-gradient(circle, rgba(100, 181, 246, 0.15) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(40px)',
          animation: 'pulse 4s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.3, transform: 'translate(-50%, -50%) scale(1)' },
            '50%': { opacity: 0.5, transform: 'translate(-50%, -50%) scale(1.1)' }
          }
        },
        
        // --- Geometric shapes background ---
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: (theme) => theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.05) 100%)'
            : 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.2) 100%)',
        }
      }}
      >
        <Container 
          maxWidth="lg"
          sx={{ position: 'relative', zIndex: 1 }} >
          
          {/* Logo and Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1 , y: 0}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Box
              component="img"
              src={eagleLogo}
              alt="Eagle Campus Logo"
              sx={{
                height: { xs: '70px', sm: '80px', md: '90px' },
                mb: { xs: 2, sm: 2.5, md: 3 },
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' }
                }
              }}
            />
            
            {/* Trust Badges */}
            <Stack 
              direction="row" 
              spacing={{ xs: 1, sm: 1.5 }} 
              justifyContent="center" 
              sx={{ mb: { xs: 2, sm: 3 } }}
              flexWrap="wrap"
            >
              <Chip
                icon={<VerifiedUserIcon />}
                label="Secure"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
              <Chip
                icon={<SpeedIcon />}
                label="Fast & Reliable"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  fontWeight: 600,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              />
            </Stack>

            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{ 
                fontWeight: 800, 
                fontSize: { xs: '2rem', sm: '2.75rem', md: '3.75rem', lg: '4rem' },
                background: (theme) => theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #ffffff 0%, #e1f5fe 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #90caf9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: { xs: 2, sm: 2.5, md: 3 },
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
              }}
            >
              Eagle Campus
            </Typography>
          </motion.div>

          {/* Subtitle and Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <Typography
              variant="h5"
              component="h2"
              sx={{
                mb: { xs: 2, sm: 2.5, md: 3 },
                color: 'rgba(255, 255, 255, 0.95)',
                maxWidth: { xs: '100%', sm: '650px', md: '750px' },
                mx: 'auto',
                lineHeight: { xs: 1.5, sm: 1.6, md: 1.7 },
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.35rem' },
                fontWeight: 400,
                px: { xs: 1, sm: 2 }
              }}
            >
              The Smart Unified Campus Platform Where Educational Management Meets Student Productivity and Empowerment
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                mb: { xs: 4, sm: 5, md: 6 },
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: { xs: '100%', sm: '600px' },
                mx: 'auto',
                fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                px: { xs: 2, sm: 3 }
              }}
            >
              Transform your campus experience with AI-powered planning, real-time collaboration, and comprehensive management tools—all in one place.
            </Typography>
            
            {/* CTA Buttons */}
            {!user ? (
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={{ xs: 2, sm: 3 }} 
                justifyContent="center"
                sx={{ px: { xs: 2, sm: 0 } }}
              >
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/register"
                  startIcon={<RocketLaunchIcon />}
                  sx={{
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    px: { xs: 3, sm: 4, md: 5 },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 700,
                    borderRadius: '50px',
                    bgcolor: 'white',
                    color: 'primary.main',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.95)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
                    },
                  }}
                >
                  Get Started Free
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
                  startIcon={<InfoOutlinedIcon />}
                  sx={{
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    px: { xs: 3, sm: 4, md: 5 },
                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                    fontWeight: 600,
                    borderRadius: '50px',
                    borderColor: 'white',
                    borderWidth: 2,
                    color: 'white',
                    textTransform: 'none',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  Learn More
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/dashboard"
                startIcon={<RocketLaunchIcon />}
                sx={{
                  py: { xs: 1.5, sm: 1.75, md: 2 },
                  px: { xs: 3, sm: 4, md: 5 },
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: '50px',
                  bgcolor: 'white',
                  color: 'primary.main',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.95)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </motion.div>
        </Container>
      </Box>
  );
};

export default HeroSection;