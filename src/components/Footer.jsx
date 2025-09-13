import { Box, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto', // This makes the footer stick to the bottom in a flex container
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: 'lg',
          mx: 'auto'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {'Copyright © '}
          <Link color="inherit" href="https://sujith-eag.in/">
            Sujith Kumar
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
        <Box>
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
    </Box>
  );
};

export default Footer;