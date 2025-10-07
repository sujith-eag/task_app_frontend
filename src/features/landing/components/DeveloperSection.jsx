import developerPhoto from '../../../assets/sujith.jpg'
import { itemVariants } from '../../../utils/animations.js';

import { Box, Container, Typography, Paper, Avatar } from '@mui/material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import  DataExplorationIcon from '@mui/icons-material/DataExploration';
import SecurityIcon from '@mui/icons-material/Security';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';

import { motion } from 'framer-motion';

const DeveloperSection = () => {
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
                  <Box
                    sx={{
                      p: '4px', // The padding creates the border thickness
                      borderRadius: '50%',
                      display: 'inline-block',
                      background: 'linear-gradient(45deg, #3d7dbdff, #bb3fc9ff)', // Example gradient
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 160,
                        height: 160,
                        // margin: 'auto',
                        border: '4px solid', // #eee
                        // boxShadow: 3,
                        borderColor: 'background.paper',
                      }}
                      alt="Developer Photo"
                      src={developerPhoto}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    About Me
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Hi! I’m the developer behind <strong>Eagle Campus</strong>. What started as a personal 
                    productivity tool has evolved into a full-stack showcase of a modern, production-grade 
                    MERN application. This project demonstrates a deep integration of technologies including 
                    AI planning, real-time messaging with Socket.IO, secure file storage on AWS, and a 
                    comprehensive college management system.
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}
                  >
                    What's Next?
                  </Typography>
  <List dense>
    <ListItem>
      <ListItemIcon sx={{ minWidth: 40 }}><DataExplorationIcon color="primary" /></ListItemIcon>
      <ListItemText primary="Rich Data Visualizations" secondary="Expanding analytics dashboards for deeper insights." />
    </ListItem>
    <ListItem>
      <ListItemIcon sx={{ minWidth: 40 }}><SecurityIcon color="primary" /></ListItemIcon>
      <ListItemText primary="Google OAuth 2.0 Integration" secondary="For enhanced security and seamless login." />
    </ListItem>
    <ListItem>
      <ListItemIcon sx={{ minWidth: 40 }}><MobileFriendlyIcon color="primary" /></ListItemIcon>
      <ListItemText primary="Dedicated Mobile Application" secondary="Bringing the full power of Eagle Campus to your phone." />
    </ListItem>
  </List>
  
                    <Typography variant="body1" color="text.secondary">
                    The vision for Eagle Campus continues to grow. 
                    Major Feature planned in upcoming updates. Stay tuned!
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </motion.div>
      </Box>
  );
};

export default DeveloperSection;