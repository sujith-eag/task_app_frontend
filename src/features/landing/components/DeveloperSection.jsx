import developerPhoto from '../../../assets/sujith.jpg'
import { itemVariants } from '../../../utils/animations.js';

import { Box, Container, Typography, Paper, Avatar, IconButton } from '@mui/material';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import  DataExplorationIcon from '@mui/icons-material/DataExploration';
import SecurityIcon from '@mui/icons-material/Security';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { motion } from 'framer-motion';

const DeveloperSection = () => {
  return (
      <Box sx={{ 
        bgcolor: 'background.default', 
        py: { xs: 8, sm: 10, md: 12 }
        }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={itemVariants}
        >
          <Container maxWidth="md">
            <Typography
              variant="h3"
              align="center"
              gutterBottom
              sx={{ 
                fontWeight: 800, 
                mb: { xs: 5, sm: 6, md: 7 },
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                background: (theme) => `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              From the Developer
            </Typography>
            <Paper
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 4,
                boxShadow: 6,
                border: '2px solid',
                borderColor: 'divider',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: 10,
                }
              }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: { xs: 'center', md: 'flex-start' },
                gap: { xs: 3, sm: 4, md: 5 },
                flexDirection: { xs: 'column', md: 'row' },
              }}>

                {/* Avatar with Social Links */}
                <Box sx={{ textAlign: 'center', flexShrink: 0 }}>
                  <Box
                    sx={{
                      p: '4px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      background: 'linear-gradient(135deg, #3d7dbdff, #bb3fc9ff)',
                      animation: 'float 3s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-8px)' }
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 140, sm: 160 },
                        height: { xs: 140, sm: 160 },
                        border: '4px solid',
                        borderColor: 'background.paper',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        }
                      }}
                      alt="Developer Photo"
                      src={developerPhoto}
                    />
                  </Box>
                  
                  {/* Social Links */}
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                      component="a"
                      href="https://github.com/sujith-eag/"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: 'text.primary',
                          transform: 'translateY(-2px)',
                          bgcolor: 'action.hover',
                        }
                      }}
                    >
                      <GitHubIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      component="a"
                      href="https://www.linkedin.com/in/sujith-eag"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#0A66C2',
                          color: '#0A66C2',
                          transform: 'translateY(-2px)',
                          bgcolor: 'action.hover',
                        }
                      }}
                    >
                      <LinkedInIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Box>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      fontSize: { xs: '1.25rem', sm: '1.4rem' },
                      mb: 2
                    }}
                  >
                    About Me
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3, 
                      lineHeight: 1.7,
                      fontSize: { xs: '0.95rem', sm: '1rem' }
                    }}
                  >
                    Hi! I'm the developer behind <strong>Eagle Campus</strong>. What started as a personal 
                    productivity tool has evolved into a full-stack showcase of a modern, production-grade 
                    MERN application. This project demonstrates a deep integration of technologies including 
                    AI planning, real-time messaging with Socket.IO, secure file storage on AWS, and a 
                    comprehensive college management system.
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ mt: 4, mb: 2.5, fontWeight: 700, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
                  >
                    What's Next?
                  </Typography>
  <List dense sx={{ mb: 3 }}>
    <ListItem sx={{ py: 1 }}>
      <ListItemIcon sx={{ minWidth: 40 }}>
        <DataExplorationIcon color="primary" />
      </ListItemIcon>
      <ListItemText 
        primary="Rich Data Visualizations" 
        secondary="Expanding analytics dashboards for deeper insights."
        primaryTypographyProps={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
        secondaryTypographyProps={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
      />
    </ListItem>
    <ListItem sx={{ py: 1 }}>
      <ListItemIcon sx={{ minWidth: 40 }}>
        <SecurityIcon color="primary" />
      </ListItemIcon>
      <ListItemText 
        primary="Google OAuth 2.0 Integration" 
        secondary="For enhanced security and seamless login."
        primaryTypographyProps={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
        secondaryTypographyProps={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
      />
    </ListItem>
    <ListItem sx={{ py: 1 }}>
      <ListItemIcon sx={{ minWidth: 40 }}>
        <MobileFriendlyIcon color="primary" />
      </ListItemIcon>
      <ListItemText 
        primary="Dedicated Mobile Application" 
        secondary="Bringing the full power of Eagle Campus to your phone."
        primaryTypographyProps={{ fontWeight: 600, fontSize: { xs: '0.9rem', sm: '0.95rem' } }}
        secondaryTypographyProps={{ fontSize: { xs: '0.85rem', sm: '0.9rem' } }}
      />
    </ListItem>
  </List>
  
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ 
                        lineHeight: 1.7,
                        fontSize: { xs: '0.95rem', sm: '1rem' }
                      }}
                    >
                    The vision for Eagle Campus continues to grow. 
                    Major features are planned for upcoming updates. Stay tuned!
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Container>
        </motion.div>
      </Box>
  );
};export default DeveloperSection;