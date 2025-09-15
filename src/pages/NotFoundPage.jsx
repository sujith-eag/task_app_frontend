import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

// import { ReactComponent as NotFoundIllustration } from '../assets/404-illustration.svg';
import notFoundUrl from '../assets/404-illustration.svg';

const NotFoundPage = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: { xs: 'center', md: 'left' },
          gap: 4,
          py: 8,
        }}
      >
        <Box sx={{ maxWidth: 400 }}>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold' }}>
            404
          </Typography>
          <Typography variant="h4" component="h2" sx={{ mt: 1, mb: 2 }}>
            Hi there!, you seem lost.
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            I see that "Get completely lost in a site" wasn't on your to-do list for today.</Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            size="large"
          >
          Get back on Track
          </Button>
        </Box>

        <Box sx={{ maxWidth: 400, width: '100%' }}>
          {/* <NotFoundIllustration style={{ width: '100%', height: 'auto' }} /> */}
        <img src={notFoundUrl} alt="Not Found" style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
