import { Box, Container, Typography, Button, Grid, Paper, Avatar, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import eagleLogo from '../assets/eagle-logo.png';
import developerPhoto from '../assets/sujith.jpg';
import { motion } from 'framer-motion';


// Define animation variants for the features section
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // This makes each child animate in 0.2s after the previous one
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const Landing = () => {

    const features = [
    {
      title: 'Intuitive Task Management',
      description: 'Easily create, update, and organize tasks with a clean, user-friendly interface.',
      icon: <CheckCircleOutlineIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Priority & Due Date Tracking',
      description: 'Never miss a deadline. Assign priorities and due dates to stay on top of what matters most.',
      icon: <EventNoteIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Sub-task Checklists',
      description: 'Break down complex tasks into smaller, manageable steps with an interactive checklist.',
      icon: <PlaylistAddCheckIcon fontSize="large" color="primary" />,
    },
    {
      title: 'Smart Filtering & Sorting',
      description: 'Quickly find the tasks you need with powerful filters for status, priority, and due dates.',
      icon: <FilterAltIcon fontSize="large" color="primary" />,
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

          <img
            src={eagleLogo}
            alt="Eagle Tasks Logo"
            style={{
              height: '80px',
              marginBottom: '1rem',
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))',
            }}
          />

          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Eagle Tasks
          </Typography>
</motion.div>


<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Typography variant="h5" component="p" color="primary.contrastText" sx={{ mb: 4 }}>
            Soar above your workload. Organize, prioritize, and accomplish your goals with effortless clarity.
          </Typography>
          <Button variant="contained" color="secondary" size="large" component={Link} to="/register" sx={{ mr: 2 }}>
            Get Started with Tasks
          </Button>
          <Button variant="outlined" color="inherit" size="large" href="https://sujith-eag.in" target="_blank">
            Visit Sujith’s Library
          </Button>
</motion.div>
        </Container>
      </Box>

      {/* --- REVAMPED FEATURES SECTION --- */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          Features Built for Productivity
        </Typography>


        <Grid
          container
          spacing={4}
          sx={{ mt: 4 }}
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4, staggerChildren: 0.2 }}
        //   whileInView="visible"
        //   viewport={{ once: true, amount: 0.2 }}
        >
        
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={6} 
                key={feature.title} 
                component={motion.div} 
                variants={itemVariants}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: 6 },
                }}
                elevation={2}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {feature.icon}
                    <Typography variant="h6" component="div" sx={{ ml: 2 }}>
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- ENHANCED SUJITH'S LIBRARY SECTION --- */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
        >

        <Container maxWidth="md">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <LibraryBooksIcon sx={{ fontSize: 120, color: 'primary.light' }} />
            </Grid>
            <Grid item xs={12} md={8} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Explore Sujith’s Library
              </Typography>
              <Typography variant="h6" component="p" sx={{ mb: 3, color: 'primary.contrastText' }}>
                A curated collection of tools, insights, and projects I’ve built alongside Eagle Tasks. Sujith’s Library is a growing knowledge hub and project showcase.
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
            </Grid>
          </Grid>
        </Container>
        </motion.div>
      </Box>

{/* --- DEVELOPER SECTION --- */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
        >
        
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            From the Developer
          </Typography>
          <Paper sx={{ p: 4, mt: 4 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 140,
                    height: 140,
                    margin: 'auto',
                    border: '4px solid white',
                    boxShadow: 3,
                  }}
                  alt="Developer Photo"
                  src={developerPhoto}
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <Typography variant="h6" gutterBottom>
                  About Me
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Hi! I’m the developer behind <strong>Eagle Tasks</strong>.
                  This project was built to demonstrate modern web development using the MERN stack and Material-UI.
                  I originally built it for my own productivity needs after struggling to find a tool that fit just right.
                </Typography>

                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Future Plans
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Upcoming updates will introduce user profiles, real-time collaboration,
                  a dedicated mobile app, and advanced analytics — making Eagle Tasks even more powerful.
                  Stay tuned!
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
        </motion.div>
      </Box>

    </Box>
  );
};

export default Landing;

