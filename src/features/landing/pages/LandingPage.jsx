import { Box } from '@mui/material';

import HeroSection from '../components/HeroSection.jsx';
import FeaturesSection from '../components/FeaturesSection.jsx';
import EagleCampusSection from '../components/EagleCampusSection.jsx';
import SujithLibrarySection from '../components/SujithLibrarySection.jsx';
import DeveloperSection from '../components/DeveloperSection.jsx';
import CTASection from '../components/CTASection.jsx';

const LandingPage = () => {
  return (
    <Box>
      <HeroSection />
      <FeaturesSection />
      <EagleCampusSection />
      <SujithLibrarySection />
      <DeveloperSection />
      <CTASection />
    </Box>
  );
};

export default LandingPage;
