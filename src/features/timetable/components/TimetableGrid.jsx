// src/features/timetable/components/TimetableGrid.jsx

import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';

// --- Component Constants ---
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = [
  '09:00-09:55', '09:55-10:50', '11:05-12:00', '12:00-12:55', 
  '13:45-14:40', '14:40-15:35', '15:35-16:30'
];

// Map component types to MUI theme colors for dynamic styling
const componentColors = {
    theory: { bgcolor: 'primary.main', color: 'primary.contrastText' },
    practical: { bgcolor: 'error.dark', color: 'error.contrastText' },
    tutorial: { bgcolor: 'success.dark', color: 'success.contrastText' },
};

// A map to quickly find a slot's index for colSpan calculation
const slotIndexMap = new Map(TIME_SLOTS.map((slot, i) => [slot.split('-')[0], i]));

const TimetableGrid = ({ sessions, viewType, onCellClick }) => {
  
  // This core logic is excellent and remains unchanged.
  // It efficiently processes session data into a grid structure.
  const gridData = React.useMemo(() => {
    const grid = {};
    const occupiedSlots = new Set();

    sessions.forEach(session => {
      const day = session.day;
      if (!grid[day]) grid[day] = {};

      const start = new Date(`1970-01-01T${session.startTime}:00`);
      const end = new Date(`1970-01-01T${session.endTime}:00`);
      const duration = (end - start) / (1000 * 60);
      const colSpan = duration > 60 ? 2 : 1;
	
      grid[day][session.startTime] = { ...session, colSpan };
      
      if (colSpan === 2) {
        const slotIndex = slotIndexMap.get(session.startTime);
        if (slotIndex !== undefined && slotIndex + 1 < TIME_SLOTS.length) {
          const nextSlotStart = TIME_SLOTS[slotIndex + 1].split('-')[0];
          occupiedSlots.add(`${day}-${nextSlotStart}`);
        }
      }
    });
    return { grid, occupiedSlots };
  }, [sessions]);

  const { grid, occupiedSlots } = gridData;

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ fontWeight: 'bold', width: '8%' }}>Day</TableCell>
            {TIME_SLOTS.map(time => (
              <TableCell key={time} align="center" sx={{ fontWeight: 'bold' }}>
                {time}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {DAYS.map(day => (
            <TableRow key={day}>
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'action.hover' }}>
                {day}
              </TableCell>
              {TIME_SLOTS.map(slot => {
                const startTime = slot.split('-')[0];
                if (occupiedSlots.has(`${day}-${startTime}`)) return null;
                const session = grid[day]?.[startTime];
                
                if (session) {
                  return (
                    <TableCell 
                      key={slot} 
                      colSpan={session.colSpan}
                      onClick={() => onCellClick(session)}
                      sx={{
                        p: 1,
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: 1,
                        borderColor: 'divider',
                        ...componentColors[session.componentType.toLowerCase()],
                        '&:hover': {
                            boxShadow: 3,
                            transform: 'scale(1.03)',
                            zIndex: 1
                        },
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {session.subjectCode}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {session.roomId}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ opacity: 0.9 }}>
                          {viewType === 'section' ? session.facultyName : session.studentGroupId}
                        </Typography>
                      </Box>
                    </TableCell>
                  );
                }
                return <TableCell key={slot} sx={{ border: 1, borderColor: 'divider' }} />;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TimetableGrid;