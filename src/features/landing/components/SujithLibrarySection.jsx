import { itemVariants } from '../../../utils/animations.js';

import { Box, Container, Typography, Button, Paper, Stack, Chip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import HubIcon from '@mui/icons-material/Hub';
import LayersIcon from '@mui/icons-material/Layers';
import { motion } from 'framer-motion';

// Tech stack for the Sujith's Library project
const libraryStack = [
  { name: 'Vue.js', icon: <LayersIcon fontSize="small" /> },
  { name: 'TypeScript', icon: <CodeIcon fontSize="small" /> },    
  { name: 'VitePress', icon: <CodeIcon fontSize="small" /> },
  { name: 'Vite', icon: <HubIcon fontSize="small" /> },
];

const SujithLibrarySection = () => {
  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      py: { xs: 6, sm: 8, md: 10 },
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
          ? 'radial-gradient(circle at 70% 50%, rgba(233, 30, 99, 0.05) 0%, transparent 50%)'
          : 'radial-gradient(circle at 70% 50%, rgba(233, 30, 99, 0.03) 0%, transparent 50%)',
        pointerEvents: 'none',
      }
    }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={itemVariants}
      >
        <Container maxWidth="md">
          <Paper
            sx={{
              p: { xs: 4, sm: 5, md: 6 },
              borderRadius: 4,
              background: (theme) => theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)'
                : 'linear-gradient(135deg, #2d1b2e 0%, #4a1942 100%)',
              border: '2px solid',
              borderColor: 'secondary.main',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(240, 98, 146, 0.05)'
                  : 'rgba(233, 30, 99, 0.05)',
                filter: 'blur(60px)',
              }
            }}
            elevation={6}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="h3" 
                component="h2" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  background: (theme) => theme.palette.mode === 'light'
                    ? 'linear-gradient(135deg, #d81b60 0%, #c2185b 100%)'
                    : 'linear-gradient(135deg, #f48fb1 0%, #f06292 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Explore Sujith's Library
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary" 
                sx={{ 
                  mb: 4, 
                  lineHeight: 1.7,
                  fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                  maxWidth: '650px',
                  mx: 'auto',
                }}
              >
                A growing knowledge hub featuring a curated collection of notes and insights, built with a modern frontend stack.
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                flexWrap="wrap" 
                justifyContent="center"
                sx={{ gap: 1.5, mb: 4 }}
              >
                {libraryStack.map((tech) => (
                  <Chip 
                    key={tech.name} 
                    icon={tech.icon} 
                    label={tech.name} 
                    variant="outlined" 
                    color="secondary"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      py: 2.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 2,
                        bgcolor: 'secondary.main',
                        color: 'secondary.contrastText',
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        }
                      }
                    }}
                  />
                ))}
              </Stack>
              
              <Button
                variant="contained"
                color="secondary"
                size="large"
                href="https://sujith-eag.in"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  py: { xs: 1.5, sm: 1.75 },
                  px: { xs: 4, sm: 5 },
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                  fontWeight: 700,
                  borderRadius: '50px',
                  textTransform: 'none',
                  boxShadow: 4,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: 8,
                  }
                }}
              >
                Visit Sujith's Library →
              </Button>
            </Box>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
};

export default SujithLibrarySection;
