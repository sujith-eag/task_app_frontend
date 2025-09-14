import { Box } from '@mui/material';
import HeroSection from '../features/landing/HeroSection.jsx';
import FeaturesSection from '../features/landing/FeaturesSection.jsx';
import LibrarySection from '../features/landing/LibrarySection.jsx';
import DeveloperSection from '../features/landing/DeveloperSection.jsx';

const LandingPage = () => {
  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <LibrarySection />
      <DeveloperSection />
    </Box>
  );
};

export default LandingPage;
