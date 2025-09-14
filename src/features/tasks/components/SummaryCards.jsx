import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Box, Typography, Paper } from '@mui/material';
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
    const activeTasks = tasks.filter(task => task.status !== 'Done');
    return {
      totalActive: activeTasks.length,
      highPriority: activeTasks.filter(task => task.priority === 'High').length,
      overdue: activeTasks.filter(task => task.dueDate && new Date(task.dueDate) < today).length,
      dueToday: activeTasks.filter(task => task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()).length,
      inProgress: tasks.filter(task => task.status === 'In Progress').length,
      completed: tasks.filter(task => task.status === 'Done').length,
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
      {statCards.map((stat) => (
        <Paper
          key={stat.title}
          elevation={2}
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            minWidth: { xs: 170, sm: 'auto' },
            flex: { sm: '1 1 170px' },
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
  );
};

export default SummaryCards;