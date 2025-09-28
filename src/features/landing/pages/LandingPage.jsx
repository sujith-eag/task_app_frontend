import { Box } from '@mui/material';

import HeroSection from '../components/HeroSection.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import LibrarySection from '../components/LibrarySection.jsx';
import DeveloperSection from '../components/DeveloperSection.jsx';

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
