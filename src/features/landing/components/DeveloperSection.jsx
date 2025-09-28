import developerPhoto from '../../../assets/sujith.jpg'
import { itemVariants } from '../../../utils/animations.js';

import { Box, Container, Typography, Paper, Avatar } from '@mui/material';
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
                    Hi! I’m the developer behind <strong>Eagle Tasks</strong> and <strong>Sujith's Library</strong>. 
                    <br></br>I originally built it for my own productivity needs after struggling to find a tool that fit just
                    right. This project also demonstrates modern web development using the MERN stack and Material-UI.
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}
                  >
                    Future Plans
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Major Feature planned in upcoming updates. Will introduce user profiles, real-time
                    collaboration, a dedicated mobile app, and advanced analytics with each new version —
                    making Eagle Tasks even more powerful. Stay tuned!
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