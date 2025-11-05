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

  // Defensively coerce the tasks value to an array. Some responses may wrap
  // tasks in an object ({ tasks: [...] }) or a bug elsewhere may set this
  // slice to a non-array value. This prevents runtime crashes in the UI.
  // Defensive: tasks slice may be an array or an object { tasks: [...] }
  // We'll normalize inside the memo so dependency tracking stays correct.
  const summaryStats = useMemo(() => {
    const raw = Array.isArray(tasks) ? tasks : (tasks && Array.isArray(tasks.tasks) ? tasks.tasks : []);

    const normalize = (v = '') => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '');

    const startOfDay = (d) => {
      try {
        const dt = new Date(d);
        dt.setHours(0, 0, 0, 0);
        return dt.getTime();
      } catch (e) {
        return null;
      }
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTs = today.getTime();

    // Classify tasks defensively by checking multiple possible shapes.
    const doneTasks = raw.filter((task) => {
      const s = normalize(task.status);
      return s === 'done' || s === 'completed' || task.completed === true || task.isDone === true;
    });

    const inProgressTasks = raw.filter((task) => {
      const s = normalize(task.status);
      return s.includes('progress') || s === 'inprogress' || s === 'ongoing' || task.isInProgress === true;
    });

    const todoTasks = raw.filter((task) => {
      const s = normalize(task.status);
      // Treat anything that's not done or in-progress as todo by default
      return !((s === 'done') || s.includes('progress') || task.completed === true || task.isDone === true || task.isInProgress === true);
    });

    const activeTasks = [...todoTasks, ...inProgressTasks];

    const highPriority = activeTasks.filter((task) => {
      const p = normalize(task.priority);
      return p === 'high' || p === 'h';
    }).length;

    let overdue = 0;
    let dueToday = 0;

    activeTasks.forEach((task) => {
      if (!task || !task.dueDate) return;
      const dTs = startOfDay(task.dueDate);
      if (!dTs) return;
      if (dTs < todayTs) overdue += 1;
      else if (dTs === todayTs) dueToday += 1;
    });

    return {
      totalActive: activeTasks.length,
      highPriority,
      overdue,
      dueToday,
      inProgress: inProgressTasks.length,
      completed: doneTasks.length,
    };
  }, [tasks]);
  
  const statCards = [
    { title: 'Active Tasks', value: summaryStats.totalActive, icon: <AssignmentIcon color="action" sx={{ fontSize: { xs: 32, sm: 40 } }} /> },
    { title: 'High Priority', value: summaryStats.highPriority, icon: <NotificationsActiveIcon color="error" sx={{ fontSize: { xs: 32, sm: 40 } }} /> },
    { title: 'Overdue', value: summaryStats.overdue, icon: <WarningIcon color="error" sx={{ fontSize: { xs: 32, sm: 40 } }} /> },
    { title: 'Due Today', value: summaryStats.dueToday, icon: <TodayIcon color="primary" sx={{ fontSize: { xs: 32, sm: 40 } }} /> },
    { title: 'In Progress', value: summaryStats.inProgress, icon: <PlaylistPlayIcon color="warning" sx={{ fontSize: { xs: 32, sm: 40 } }} /> },
    { title: 'Completed', value: summaryStats.completed, icon: <PlaylistAddCheckIcon color="success" sx={{ fontSize: { xs: 32, sm: 40 } }} /> },
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
      mb: 4,
      // Make sure the flex container for xs doesn't wrap and allows horizontal scroll
      flexWrap: { xs: 'nowrap', sm: 'wrap' },
      alignItems: 'stretch'
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
              p: { xs: 1, sm: 2 },
              display: 'flex',
              alignItems: 'center',
              minWidth: { xs: 120, sm: 'auto' },
              width: { xs: 120, sm: 'auto' },
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
                transform: { xs: 'none', sm: 'rotate(5deg) scale(1.1)' }
              }
            }}>
              {stat.icon}
            </Box>
            <Box>
              {(() => {
                const v = Number.isFinite(stat.value) ? stat.value : 0;
                const useGradient = (stat.title === 'Overdue' || stat.title === 'High Priority') && v > 0;
                const gradientFn = (theme) => {
                  if (stat.title === 'Overdue') return `linear-gradient(45deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`;
                  if (stat.title === 'High Priority') return `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`;
                  return 'inherit';
                };

                return (
                  <Typography
                    variant="h4"
                    sx={(theme) => ({
                      fontWeight: 700,
                      fontSize: { xs: '1rem', sm: theme.typography.h4.fontSize },
                      paddingRight: 0.5,
                      ...(useGradient
                        ? {
                            backgroundImage: gradientFn(theme),
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }
                        : {}),
                    })}
                  >
                    {v}
                  </Typography>
                );
              })()}
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