import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { Box, Typography, Paper, Fade } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import TodayIcon from '@mui/icons-material/Today';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AssignmentIcon from '@mui/icons-material/Assignment';

const SummaryCards = () => {
  const { tasks } = useSelector((state) => state.tasks);

  const summaryStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Count tasks by status
    const doneTasks = tasks.filter(task => task.status === 'Done' || task.status === 'done');
    const inProgressTasks = tasks.filter(task => task.status === 'In Progress' || task.status === 'in-progress');
    const todoTasks = tasks.filter(task => task.status === 'To Do' || task.status === 'todo' || task.status === 'ToDo');
    
    // Active tasks = To Do + In Progress (everything except Done)
    const activeTasks = [...todoTasks, ...inProgressTasks];
    
    return {
      totalActive: activeTasks.length,
      highPriority: activeTasks.filter(task => task.priority === 'High').length,
      overdue: activeTasks.filter(task => task.dueDate && new Date(task.dueDate) < today).length,
      dueToday: activeTasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()).length,
      inProgress: inProgressTasks.length,
      completed: doneTasks.length,
    };
  }, [tasks]);
  
  const statCards = [
    { title: 'Active Tasks', value: summaryStats.totalActive, icon: <AssignmentIcon color="action" sx={{ fontSize: 40 }} /> },
    { title: 'High Priority', value: summaryStats.highPriority, icon: <NotificationsActiveIcon color="error" sx={{ fontSize: 40 }} /> },
    { title: 'Overdue', value: summaryStats.overdue, icon: <WarningIcon color="error" sx={{ fontSize: 40 }} /> },
    { title: 'Due Today', value: summaryStats.dueToday, icon: <TodayIcon color="primary" sx={{ fontSize: 40 }} /> },
    { title: 'In Progress', value: summaryStats.inProgress, icon: <PlaylistPlayIcon color="warning" sx={{ fontSize: 40 }} /> },
    { title: 'Completed', value: summaryStats.completed, icon: <PlaylistAddCheckIcon color="success" sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box sx={{
      display: { xs: 'flex', sm: 'grid' },
      overflowX: { xs: 'auto', sm: 'visible' },
      pb: { xs: 2, sm: 0 },
      gap: 2,
      gridTemplateColumns: {
        sm: 'repeat(auto-fit, minmax(170px, 1fr))',
      },
      mb: 4
    }}>
      {statCards.map((stat, index) => (
        <Fade in timeout={300 + (index * 100)} key={stat.title}>
          <Paper
            component={motion.div}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)' 
            }}
            transition={{ duration: 0.2 }}
            elevation={2}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              minWidth: { xs: 170, sm: 'auto' },
              flex: { sm: '1 1 170px' },
              cursor: 'default',
              transition: 'all 0.3s ease',
              background: (theme) => 
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)',
            }}
          >
            <Box sx={{ 
              mr: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'rotate(5deg) scale(1.1)'
              }
            }}>
              {stat.icon}
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: (theme) => 
                    stat.title === 'Overdue' && stat.value > 0
                      ? `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`
                      : stat.title === 'High Priority' && stat.value > 0
                      ? `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
                      : 'inherit',
                  WebkitBackgroundClip: stat.value > 0 ? 'text' : 'inherit',
                  WebkitTextFillColor: stat.value > 0 ? 'transparent' : 'inherit',
                }}
              >
                {stat.value}
              </Typography>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {stat.title}
              </Typography>
            </Box>
          </Paper>
        </Fade>
      ))}
    </Box>
  );
};

export default SummaryCards;