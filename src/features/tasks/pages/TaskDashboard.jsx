import TaskList from '../components/TaskList.jsx';
import SummaryCards from '../components/SummaryCards.jsx';

import { useSelector } from 'react-redux';

import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';


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

  const navigate = useNavigate();

  return (
  <Box>
      <Box 
        sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 3,
          p: { xs: 1.5, sm: 3 },
          borderRadius: 1,
          background: (theme) => 
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.02)'
              : 'rgba(0,0,0,0.02)'
        }}
      >
        <Box>
          <Typography 
            variant="h5" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
          >
            Welcome {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">Your Personal Task Dashboard</Typography>
        </Box>

        <Button variant="contained" onClick={() => navigate('/tasks/create')}>Create Task</Button>
      </Box>
  
      
      {/* --- MASTER FLEXBOX Two-Column Layout --- */}
      <Box sx={{
        display: 'flex',
        gap: 4,
        flexDirection: { xs: 'column', md: 'row' }
      }}>

        {/* Left Column: compact quick actions + summary on mobile */}
      <Box sx={{
        width: { xs: '100%', md: '35%' },
        flexShrink: 0
      }}>

          <SummaryCards />
        </Box>
        
        {/* Right Column for the Task List */}
        <Box sx={{ flexGrow: 1 }}>
          <TaskList />

        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;