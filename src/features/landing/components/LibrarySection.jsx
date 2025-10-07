import { itemVariants } from '../../../utils/animations.js';

import { Box, Container, Typography, Button, Paper, Stack, Chip, Grid, Divider } from '@mui/material';
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

// Tech stack for the Sujith's Library project
const libraryStack = [
    { name: 'Vue.js', icon: <LayersIcon fontSize="small" /> },
    { name: 'TypeScript', icon: <CodeIcon fontSize="small" /> },    
    { name: 'VitePress', icon: <CodeIcon fontSize="small" /> },
    { name: 'Vite', icon: <HubIcon fontSize="small" /> },
];

const LibrarySection = () => {
  return (
    <Box sx={{ 
      bgcolor: 'background.default', 
      py: 10 
    }}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={itemVariants}
      >
        <Container maxWidth="lg">
          <Paper
            sx={{
              p: { xs: 4, md: 5 },
              borderRadius: 4,
              background: (theme) => theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
                : 'linear-gradient(135deg, #122a3d 0%, #0d3b66 100%)',
              border: '1px solid',
              borderColor: 'divider',
            }}
            elevation={4}
          >
            <Grid container spacing={{ xs: 4, md: 5 }}>
              
              {/* Column 1: Eagle Campus Tech Stack */}
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                    Powering Eagle Campus
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    This application is a full-stack showcase built with a modern, production-grade MERN stack to deliver a robust and scalable platform.
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1, mb: 3 }}>
                    {eagleCampusStack.map((tech) => (
                      <Chip key={tech.name} icon={tech.icon} label={tech.name} variant="outlined" color="primary" />
                    ))}
                  </Stack>
                </Box>
              </Grid>

              {/* Divider for medium screens and up */}
              <Grid item xs={12} md={6}>
                <Divider sx={{ display: { xs: 'block', md: 'none' }, mb: 4 }} />
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1.5 }}>
                    Explore Sujith's Library
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1, mb: 3 }}>
                    A growing knowledge hub featuring a curated collection of notes and insights, built with a modern frontend stack.
                  </Typography>
                  <Stack 
                    direction="row" 
                    spacing={1} 
                    flexWrap="wrap" 
                    // justifyContent={{ xs: 'center', md: 'flex-start' }}
                    sx={{ gap: 1, mb: 3 }}>
                    {libraryStack.map((tech) => (
                      <Chip key={tech.name} icon={tech.icon} label={tech.name} variant="outlined" color="secondary" />
                    ))}
                  </Stack>
                  
                  <Box sx={{ mt: 'auto', py:2 }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="large"
                      href="https://sujith-eag.in"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Sujith’s Library
                    </Button>
                  </Box>
                </Box>
              </Grid>

            </Grid>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
};

export default LibrarySection;