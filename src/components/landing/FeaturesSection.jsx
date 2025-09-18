import { containerVariants, itemVariants } from '../../utils/animations.js';

import { Box, Container, Typography, Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FilterAltIcon from '@mui/icons-material/FilterAlt';


const FeaturesSection = () => {

    const features = [
    {
      title: 'Intuitive Task Management',
      description:
        'Easily create, update, and organize tasks with a clean, user-friendly interface.',
      icon: <CheckCircleOutlineIcon fontSize="large" />,
    },
    {
      title: 'Priority & Due Date Tracking',
      description:
        'Assign priorities and due dates to stay on top of what matters most.',
      icon: <EventNoteIcon fontSize="large" />,
    },
    {
      title: 'Sub-task Checklists',
      description:
        'Break down complex tasks into smaller, manageable steps with an interactive checklist.',
      icon: <PlaylistAddCheckIcon fontSize="large" />,
    },
    {
      title: 'Smart Filtering & Sorting',
      description:
        'Quickly find the tasks you need with powerful filters for status, priority, and due dates.',
      icon: <FilterAltIcon fontSize="large" />,
    },
  ];
  
    
  return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 8 }}
        >
          Features Built for Productivity
        </Typography>

        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{
            mt: 8,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4, // This creates the spacing
            justifyContent: 'center', // Center the cards within the container
          }}
        >

          {features.map((feature) => (
            <Box
              key={feature.title}
              component={motion.div}
              variants={itemVariants}
              sx={{
                // Responsive width for each card. `calc` accounts for the gap.
                width: {
                  xs: '100%',
                  sm: 'calc(50% - 16px)', // 2 columns
                  md: 'calc(25% - 24px)', // 4 columns
                },
              }}
            >
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 3,
                  p: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: 6,
                  },
                }}
                elevation={3}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2,
                    width: 70,
                    height: 70,
                    mx: 'auto',
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    color: 'white',
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
  );
};

export default FeaturesSection;