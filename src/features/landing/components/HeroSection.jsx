import eagleLogo from '../../../assets/eagle-logo.png';

import { Box, Container, Typography, Button, keyframes } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

// Keyframes for the animated gradient background
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const HeroSection = () => {
  
  const { user } = useSelector((state) => state.auth);

  return (
      <Box
        sx={{
        background: `linear-gradient(-45deg, #0d47a1, #1A237E, #c5640aff, #4088bfff)`,
        backgroundSize: '400% 400%',
        animation: `${gradientAnimation} 10s ease infinite`,
          // background: (theme) => theme.palette.mode === 'light'
          // ? 'radial-gradient(circle, #1976d2 0%, #0d47a1 100%)'
          // : 'radial-gradient(circle, #0d47a1 0%, #002171 100%)',
          
          // ? 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)' // Light mode gradient
            // : 'linear-gradient(135deg, #0d47a1 0%, #002171 100%)', // Dark mode gradient
          color: 'white',
          py: { xs: 12, md: 16 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          
        // --- Subtle "glow" effect for depth ---
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '250px', md: '500px' },
          height: { xs: '250px', md: '500px' },
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 60%)',
          filter: 'blur(20px)',
        },          
        
        // --- A curved bottom edge for a smooth transition ---
        clipPath: 'ellipse(140% 100% at 50% 100%)',        
      }}
      >
        <Container 
          maxWidth="md"
          sx={{ position: 'relative', zIndex: 1 }} >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1 , y: 0}}
            transition={{ duration: 0.7 }}
          >
            <img
              src={eagleLogo}
              alt="Eagle Campus Logo"
              style={{
                height: '80px',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ 
                fontWeight: 700, 
                fontSize: { xs: '2.25rem', md: '3.5rem' },
                background: 'linear-gradient(45deg, #64ffda 30%, #ffffff 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',              
              }}
            >
              Eagle Campus
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Typography
              variant="h5"
              component="p"
              sx={{
                mb: 5,
                color: 'rgba(255, 255, 255, 0.85)', // Softer than pure white                
              // color: 'primary.contrastText',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
            The Smart unified Campus platform where educational management meets student productivity and empowerment.
            </Typography>
            
          {!user && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={Link}
                to="/register"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: 'bold',
                  borderRadius: '25px', // Pill shape
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
          </motion.div>
        </Container>
      </Box>
  );
};

export default HeroSection;