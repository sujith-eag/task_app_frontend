import pkg from '../../../package.json'

import { Box, Typography, Link, IconButton, Container } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        {/* Main Flexbox container */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on desktop
          gap: { xs: 2, sm: 1 }, // Add vertical gap on mobile
        }}>
          
          {/* Left Column: Copyright */}
          <Box sx={{ width: { xs: '100%', sm: '33.33%' }, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="body2" color="text.secondary">
              {'Copyright © '}
              <Link color="inherit" href="https://sujith-eag.in/">
                Sujith Kumar
              </Link>{' '}
              {new Date().getFullYear()}
              {'.'}
            </Typography>
          </Box>

          {/* Center Column: App Version */}
          <Box sx={{ width: { xs: '100%', sm: '33.33%' }, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Version: {pkg.version}
            </Typography>
          </Box>

          {/* Right Column: Social Icons */}
          <Box sx={{ width: { xs: '100%', sm: '33.33%' }, textAlign: { xs: 'center', sm: 'right' } }}>
            <IconButton
              aria-label="github"
              component="a"
              href="https://github.com/sujith-eag/"
              target="_blank"
            >
              <GitHubIcon />
            </IconButton>
            <IconButton
              aria-label="linkedin"
              component="a"
              href="https://www.linkedin.com/in/sujith-eag"
              target="_blank"
            >
              <LinkedInIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;