import { itemVariants } from '../../../utils/animations.js';

import { Box, Container, Typography, Paper, Stack, Chip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import HubIcon from '@mui/icons-material/Hub';
import LayersIcon from '@mui/icons-material/Layers';
import { motion } from 'framer-motion';

// Tech stack for the Eagle Campus application
const eagleCampusStack = [
  { name: 'React', icon: <LayersIcon fontSize="small" /> },
  { name: 'Node.js', icon: <HubIcon fontSize="small" /> },
  { name: 'Redux', icon: <LayersIcon fontSize="small" /> },
  { name: 'Express.js', icon: <HubIcon fontSize="small" /> },  
  { name: 'MongoDB', icon: <StorageIcon fontSize="small" /> },
  { name: 'AWS', icon: <CodeIcon fontSize="small" /> },
  { name: 'Socket.IO', icon: <CodeIcon fontSize="small" /> },
];

const EagleCampusSection = () => {
  return (
    <Box sx={{ 
      bgcolor: 'background.paper', 
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
          ? 'radial-gradient(circle at 30% 50%, rgba(25, 118, 210, 0.05) 0%, transparent 50%)'
          : 'radial-gradient(circle at 30% 50%, rgba(25, 118, 210, 0.03) 0%, transparent 50%)',
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
                ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
                : 'linear-gradient(135deg, #122a3d 0%, #0d3b66 100%)',
              border: '2px solid',
              borderColor: 'primary.main',
              position: 'relative',
              overflow: 'hidden',
              textAlign: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                right: '-10%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(144, 202, 249, 0.05)'
                  : 'rgba(25, 118, 210, 0.05)',
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
                    ? 'linear-gradient(135deg, #1976d2 0%, #0d47a1 100%)'
                    : 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Powering Eagle Campus
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
                This application is a full-stack showcase built with a modern, production-grade MERN stack to deliver a robust and scalable platform.
              </Typography>
              
              <Stack 
                direction="row" 
                spacing={1} 
                flexWrap="wrap" 
                justifyContent="center"
                sx={{ gap: 1.5 }}
              >
                {eagleCampusStack.map((tech) => (
                  <Chip 
                    key={tech.name} 
                    icon={tech.icon} 
                    label={tech.name} 
                    variant="outlined" 
                    color="primary"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      py: 2.5,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 2,
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '& .MuiChip-icon': {
                          color: 'inherit',
                        }
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
};

export default EagleCampusSection;
