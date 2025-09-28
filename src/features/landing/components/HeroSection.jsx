import eagleLogo from '../../../assets/eagle-logo.png';

import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const HeroSection = () => {
  
  const { user } = useSelector((state) => state.auth);

  return (
      <Box
        sx={{
          background: (theme) => theme.palette.mode === 'light'
            ? 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)' // Light mode gradient
            : 'linear-gradient(135deg, #0d47a1 0%, #002171 100%)', // Dark mode gradient
          color: 'white',
          py: { xs: 10, md: 14 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={eagleLogo}
              alt="Eagle Campus Logo"
              style={{
                height: '90px',
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '3rem' } }}
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
                color: 'primary.contrastText',
                maxWidth: '700px',
                mx: 'auto',
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