import { useMemo } from 'react';  // To create Stats summary
import { useSelector } from 'react-redux';
import TaskForm from './TaskForm.jsx';
import TaskList from './TaskList.jsx';

// MUI Components & Icons
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import TodayIcon from '@mui/icons-material/Today';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentIcon from '@mui/icons-material/Assignment';


const Dashboard = () => {
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);
  const { tasks } = useSelector((state) => state.tasks);

  
    // Calculate summary stats using useMemo for performance
    const summaryStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of today for accurate comparison
    const activeTasks = tasks.filter(task => task.status !== 'Done');
    return {
      totalActive: activeTasks.length, // NEW
      highPriority: activeTasks.filter(task => task.priority === 'High').length, // NEW
      overdue: activeTasks.filter(task => task.dueDate && new Date(task.dueDate) < today).length,
      dueToday: activeTasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()).length,
      inProgress: tasks.filter(task => task.status === 'In Progress').length,
      completed: tasks.filter(task => task.status === 'Done').length,
    };
  }, [tasks]);

      
      
  // Data for the stat cards, making the JSX cleaner
  const statCards = [
    { title: 'Active Tasks', value: summaryStats.totalActive, icon: <AssignmentIcon color="action" sx={{ fontSize: 40 }} /> },
    { title: 'High Priority', value: summaryStats.highPriority, icon: <NotificationsActiveIcon color="error" sx={{ fontSize: 40 }} /> },
    { title: 'Overdue', value: summaryStats.overdue, icon: <WarningIcon color="error" sx={{ fontSize: 40 }} /> },
    { title: 'Due Today', value: summaryStats.dueToday, icon: <TodayIcon color="primary" sx={{ fontSize: 40 }} /> },
    { title: 'In Progress', value: summaryStats.inProgress, icon: <PlaylistPlayIcon color="warning" sx={{ fontSize: 40 }} /> },
    { title: 'Completed', value: summaryStats.completed, icon: <PlaylistAddCheckIcon color="success" sx={{ fontSize: 40 }} /> },
  ];

  
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
      

      {/* --- SUMMARY CARDS SECTION (USING FLEXBOX) --- */}
      <Box sx={{
        display: 'flex',
        gap: 2,
        mb: 4,
        // On mobile, allow horizontal scrolling
        overflowX: { xs: 'auto', sm: 'visible' },
        // On tablet and up, allow items to wrap to the next line
        flexWrap: { sm: 'wrap' },
        pb: { xs: 2, sm: 0 },
      }}>
        {statCards.map((stat) => (
          <Paper
            key={stat.title}
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              // On mobile, have a fixed width for scrolling
              minWidth: { xs: 170, sm: 'auto' },
              // On tablet and up, use the flex property for a responsive grid-like effect
              flex: { sm: '1 1 180px' },
            }}
          >
            <Box sx={{ mr: 2 }}>{stat.icon}</Box>
            <Box>
              <Typography variant="h4">{stat.value}</Typography>
              <Typography variant="subtitle2" color="text.secondary">{stat.title}</Typography>
            </Box>
          </Paper>
        ))}
      </Box>
      
      
      
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