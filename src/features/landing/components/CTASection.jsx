import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CTASection = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        py: { xs: 8, sm: 10, md: 12 },
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(25, 118, 210, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center',
              p: { xs: 4, sm: 5, md: 6 },
              borderRadius: 4,
              background: (theme) => theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(21, 101, 192, 0.08) 100%)'
                : 'linear-gradient(135deg, rgba(144, 202, 249, 0.08) 0%, rgba(100, 181, 246, 0.05) 100%)',
              border: '2px solid',
              borderColor: 'primary.main',
              position: 'relative',
              boxShadow: 4,
            }}
          >
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 800,
                mb: 2,
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                background: (theme) => theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)'
                  : 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Ready to Get Started?
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.7,
                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              Empower your academic journey with Eagle Campus—the platform built for students and teachers to collaborate, learn, and succeed together.
            </Typography>

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
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    px: { xs: 3, sm: 4, md: 5 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 700,
                    borderRadius: '50px',
                    textTransform: 'none',
                    boxShadow: 4,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: 8,
                    },
                  }}
                >
                  Sign Up for Free
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/login"
                  sx={{
                    py: { xs: 1.5, sm: 1.75, md: 2 },
                    px: { xs: 3, sm: 4, md: 5 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 600,
                    borderRadius: '50px',
                    borderWidth: 2,
                    textTransform: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderWidth: 2,
                      transform: 'translateY(-3px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/dashboard"
                startIcon={<RocketLaunchIcon />}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: { xs: 1.5, sm: 1.75, md: 2 },
                  px: { xs: 3, sm: 4, md: 5 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 700,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 8,
                  },
                }}
              >
                Go to Dashboard
              </Button>
            )}
          </Box>
        </Container>
      </motion.div>
    </Box>
  );
};

export default CTASection;
