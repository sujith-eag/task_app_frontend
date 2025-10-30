import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import AITaskGenerator from '../../ai/components/AITaskGenerator.jsx';

import { useSelector } from 'react-redux';

import { Box, Typography, CircularProgress } from '@mui/material';


const Dashboard = () => {
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
        
  if (authLoading) {
    return (
      <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
  <Box> 
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 4, 
          p: 3,
          borderRadius: 2,
          background: (theme) => 
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.1) 0%, rgba(63, 81, 181, 0.1) 100%)'
              : 'linear-gradient(135deg, rgba(103, 58, 183, 0.05) 0%, rgba(63, 81, 181, 0.05) 100%)',
          animation: 'fadeIn 0.6s ease-out',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(-10px)' },
            to: { opacity: 1, transform: 'translateY(0)' }
          }
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: {
              xs: '2.2rem',
              md: '2.4rem',
              sm: '3rem'
            },
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #90caf9 0%, #64b5f6 100%)'
                : 'linear-gradient(135deg, #673ab7 0%, #3f51b5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          >
        Welcome {user?.name}
        </Typography>

        <Typography 
          variant="h5" 
          color="text.secondary"
          sx={{
            fontSize: {
              xs: '1.1rem',
              md: '1.2rem',
              sm: '1.5rem',
            },
            fontWeight: 500
          }}
          >
          Your Personal Task Dashboard
        </Typography>
      </Box>
      

      {/* --- SUMMARY CARDS SECTION --- */}
        <SummaryCards />
      
      
      {/* --- MASTER FLEXBOX Two-Column Layout --- */}
      <Box sx={{
        display: 'flex',
        gap: 4,
        // On extra-small screens, stack them. On medium and up, put them in a row.
        flexDirection: { xs: 'column', md: 'row' }
      }}>

        {/* Left Column for the Form */}
      <Box sx={{
        width: { xs: '100%', md: '35%' }, // Takes full width on mobile, 35% on desktop
        flexShrink: 0 // Prevents this column from shrinking
      }}>

          <AITaskGenerator />

          <TaskForm />
          
        </Box>
        
        {/* Right Column for the Task List */}
        <Box sx={{ flexGrow: 1 }}>      {/* flexGrow allows this column to take all remaining space */}
          
          <TaskList />

        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;