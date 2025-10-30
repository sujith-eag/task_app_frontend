import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
// MUI Components & Icons
import { Card, CardContent, Box, Typography, Chip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { updateTask } from '../taskSlice.js';
import EditTaskModal from './EditTaskModal.jsx';
import SubTaskChecklist from './SubTaskChecklist.jsx';
import TaskActions from './TaskActions.jsx';

const TaskItem = ({ taskId }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Only manages its own modal
  const dispatch = useDispatch();

  const task = useSelector((state) => state.tasks.tasks.find((t) => t._id === taskId));

  const handleStatusChange = useCallback((e) => {
    dispatch(updateTask({ taskId, taskData: { status: e.target.value } }));
  }, [dispatch, taskId]);
  
  const priorityColor = { High: 'error', Medium: 'warning', Low: 'info' };

  if (!task) return null;

  return (
    <>
      <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
>
        <Card 
          sx={{ 
            textAlign: 'left', 
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 6,
              transform: 'translateY(-4px)',
            },
            borderLeft: `4px solid`,
            borderLeftColor: 
              task.priority === 'High' ? 'error.main' :
              task.priority === 'Medium' ? 'warning.main' : 'info.main'
          }}
        >
          <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(task.createdAt).toLocaleDateString('en-GB')}
                {task.dueDate && ` | Due: ${new Date(task.dueDate).toLocaleDateString('en-GB')}`}
              </Typography>
              {/* 2. Render the new, self-contained actions component */}
              <TaskActions 
                taskId={task._id}
                taskTitle={task.title}
                onOpenEdit={() => setIsEditModalOpen(true)}
              />
            </Box>

            <Typography variant="h5" sx={{ mt: 1, mb: 1.5, fontWeight: 600 }}>
              {task.title}
            </Typography>
            {task.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mt: 1, 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word'
                }}
              >
                {task.description}
              </Typography>
            )}

<Box display="flex" alignItems="center" gap={2} sx={{ mt: 2 }}>
          <Chip 
            label={task.priority} 
            color={priorityColor[task.priority]} 
            size="small"
            sx={{
              fontWeight: 600,
              boxShadow: 1
            }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id={`status-label-${taskId}`}>Status</InputLabel>
            <Select
              labelId={`status-label-${taskId}`}
              id={`status-select-${taskId}`}
              value={task.status}
              label="Status"
              onChange={handleStatusChange}
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
            >
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
            <SubTaskChecklist taskId={task._id} subTasks={task.subTasks} />
        {task.tags?.length > 0 && (
          <Box sx={{ mt: 2, pt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', borderTop: 1, borderColor: 'divider' }}>
            {task.tags.map((tag) => (
              <Chip 
                key={tag} 
                label={tag} 
                size="small"
                variant="outlined"
                sx={{ 
                  maxWidth: '150px',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
            ))}
          </Box>
        )}
          </CardContent>
        </Card>
      </motion.div>
      
      <EditTaskModal task={task} open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
    </>
  );
};

export default React.memo(TaskItem);