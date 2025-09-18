import { Box } from '@mui/material';

import HeroSection from '../components/landing/HeroSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import LibrarySection from '../components/landing/LibrarySection.jsx';
import DeveloperSection from '../components/landing/DeveloperSection.jsx';

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
