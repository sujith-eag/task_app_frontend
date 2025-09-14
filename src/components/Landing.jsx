import {
  Box, Container, Typography, Button,
  Paper, Avatar, Card, CardContent,} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import eagleLogo from '../assets/eagle-logo.png';
import developerPhoto from '../assets/sujith.jpg';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

const Landing = () => {
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
    <Box>
      {/* HERO SECTION */}
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
              alt="Eagle Tasks Logo"
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
              Eagle Tasks
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
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Soar above your workload. Organize, prioritize, and accomplish your
              goals with effortless clarity.
            </Typography>
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
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                href="https://sujith-eag.in"
                target="_blank"
              >
                Visit Sujith’s Library
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* FEATURES SECTION */}
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


{/* --- SUJITH'S LIBRARY SECTION --- */}
<Box sx={{ 
  bgcolor: (theme) => theme.palette.mode === 'light' ? 'primary.main' : 'primary.dark',
  color: 'white',
  py: 8,
  }}
  >

  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={itemVariants}
  >
    <Container maxWidth="lg">
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        flexDirection: { xs: 'column', md: 'row' },
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <LibraryBooksIcon sx={{ fontSize: { xs: 100, md: 120 }, color: 'white' }} />
        </Box>

        {/* Text Column */}
      <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Explore Sujith’s Library
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{
              mb: 3,
              color: 'primary.contrastText',
              lineHeight: 1.6,
            }}
          >
            A curated collection of tools, insights, and projects I’ve built alongside Eagle Tasks.
            Sujith’s Library is a growing knowledge hub and project showcase.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            href="https://sujith-eag.in"
            target="_blank"
          >
            Visit Sujith’s Library
          </Button>
        </Box>
      </Box>
    </Container>
  </motion.div>
</Box>

      {/* DEVELOPER SECTION */}
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
          <Container maxWidth="md">
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 6 }}
            >
              From the Developer
            </Typography>
            <Paper
              sx={{
                p: 5,
                borderRadius: 3,
                boxShadow: 3,
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                flexDirection: { xs: 'column', md: 'row' },
              }}>
                <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                  <Avatar
                    sx={{
                      width: 160,
                      height: 160,
                      margin: 'auto',
                      border: '4px solid #eee',
                      boxShadow: 3,
                    }}
                    alt="Developer Photo"
                    src={developerPhoto}
                  />
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    About Me
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Hi! I’m the developer behind <strong>Eagle Tasks</strong>. This
                    project was built to demonstrate modern web development using the
                    MERN stack and Material-UI. I originally built it for my own
                    productivity needs after struggling to find a tool that fit just
                    right.
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}
                  >
                    Future Plans
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Upcoming updates will introduce user profiles, real-time
                    collaboration, a dedicated mobile app, and advanced analytics —
                    making Eagle Tasks even more powerful. Stay tuned!
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Landing;
