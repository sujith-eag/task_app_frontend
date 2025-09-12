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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* --- HEADING SECTION --- */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome {user?.name}
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Your Personal Task Dashboard
        </Typography>
      </Box>

      <TaskForm />
      <TaskList />
    </Box>
  );
};

export default Dashboard;