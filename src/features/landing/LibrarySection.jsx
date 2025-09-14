import { itemVariants } from '../../utils/animations.js';

import { Box, Container, Typography, Button} from '@mui/material';
import { motion } from 'framer-motion';

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const LibrarySection = () => {
  return (
    <Box sx={{ 
        bgcolor: (theme) => theme.palette.mode === 'light' ? 'primary.main' : 'primary.dark',
        color: 'white',
        py: 8,
    }}
    >

    <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={itemVariants}
    >
        <Container maxWidth="lg">
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            flexDirection: { xs: 'column', md: 'row' },
        }}>
            <Box sx={{ textAlign: 'center' }}>
            <LibraryBooksIcon sx={{ fontSize: { xs: 100, md: 120 }, color: 'white' }} />
            </Box>

            {/* Text Column */}
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
                variant="h4"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 'bold' }}
            >
                Explore Sujith’s Library
            </Typography>
            <Typography
                variant="h6"
                component="p"
                sx={{
                mb: 3,
                color: 'primary.contrastText',
                lineHeight: 1.6,
                }}
            >
                A curated collection of tools, insights, and projects I’ve built alongside Eagle Tasks.
                Sujith’s Library is a growing knowledge hub and project showcase.
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                size="large"
                href="https://sujith-eag.in"
                target="_blank"
            >
                Visit Sujith’s Library
            </Button>
            </Box>
        </Box>
        </Container>
    </motion.div>
    </Box>
  );
};

export default LibrarySection;