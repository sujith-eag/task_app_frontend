import TaskForm from '../features/tasks/components/TaskForm.jsx';
import TaskList from '../features/tasks/components/TaskList.jsx';
import SummaryCards from '../features/tasks/components/SummaryCards.jsx';
import AITaskGenerator from '../features/ai/components/AITaskGenerator.jsx';

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
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 'moderate',
            fontSize: {
              xs: '2.2rem',
              md: '2.4rem',
              sm: '3rem'
            }
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
            }
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