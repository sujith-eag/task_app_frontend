import { useSelector } from 'react-redux';
import TaskForm from './TaskForm.jsx';
import TaskList from './TaskList.jsx';

// MUI Components
import { Box, Typography, CircularProgress } from '@mui/material';

const Dashboard = () => {
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);

  // Handle the initial authentication loading state with MUI's spinner
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
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome {user?.name}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Your Personal Task Dashboard
        </Typography>
      </Box>
      
      {/* --- MASTER FLEXBOX LAYOUT --- */}
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
          <TaskForm />
        </Box>
        
        {/* Right Column for the Task List */}
        <Box sx={{ flexGrow: 1 }}> {/* flexGrow allows this column to take all remaining space */}
          <TaskList />
        </Box>

      </Box>
    </Box>
  );
};

export default Dashboard;