import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';

      
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = [
  '09:00-09:55', '09:55-10:50', '11:05-12:00', '12:00-12:55', 
  '13:45-14:40', '14:40-15:35', '15:35-16:30'
];
const componentColors = {
    theory: { bgcolor: 'primary.main', color: 'primary.contrastText' },
    practical: { bgcolor: 'error.dark', color: 'error.contrastText' },
    tutorial: { bgcolor: 'success.dark', color: 'success.contrastText' },
};
const slotIndexMap = new Map(TIME_SLOTS.map((slot, i) => [slot.split('-')[0], i]));

const TimetableGrid = ({ sessions, viewType, onCellClick }) => {
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
      if (!grid[day][session.startTime]) grid[day][session.startTime] = [];
      grid[day][session.startTime].push({ ...session, colSpan });
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

  try {
    return (
      <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: '80vh', overflowX: 'auto' }}>
        <Table sx={{ tableLayout: 'fixed', minWidth: 900 }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 700, 
                  width: '8%',
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: '1rem',
                  borderRight: 2,
                  borderColor: 'divider',
                }}
              >
                Day
              </TableCell>
              {TIME_SLOTS.map(time => (
                <TableCell 
                  key={time} 
                  align="center" 
                  sx={{ 
                    fontWeight: 700,
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    fontSize: '0.9rem',
                    borderRight: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  {time}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {DAYS.map((day, rowIdx) => (
              <TableRow 
                key={day}
                sx={{ 
                  backgroundColor: rowIdx % 2 === 0 ? 'grey.50' : 'background.paper',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 700, 
                    backgroundColor: 'primary.light',
                    color: 'primary.contrastText',
                    fontSize: '0.95rem',
                    borderRight: 2,
                    borderColor: 'divider',
                  }}
                >
                  {day}
                </TableCell>
                {TIME_SLOTS.map(slot => {
                  const startTime = slot.split('-')[0];
                  if (occupiedSlots.has(`${day}-${startTime}`)) return null;
                  const sessionsInCell = grid[day]?.[startTime];
                  if (sessionsInCell && sessionsInCell.length > 0) {
                    return (
                      <TableCell
                        key={slot}
                        colSpan={sessionsInCell[0].colSpan}
                        sx={{
                          p: 1,
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          border: 1,
                          borderColor: 'divider',
                          backgroundColor: 'background.default',
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {sessionsInCell.map((session, idx) => (
                            <Box
                              key={session.sessionId || idx}
                              onClick={() => onCellClick(session)}
                              sx={{
                                mb: 0.5,
                                px: 1.2,
                                py: 1,
                                borderRadius: 2,
                                boxShadow: 2,
                                bgcolor: 'background.paper',
                                position: 'relative',
                                cursor: 'pointer',
                                border: '1.5px solid',
                                borderColor: 'divider',
                                minHeight: 56,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                transition: 'transform 0.18s, box-shadow 0.18s',
                                '&:hover': {
                                  boxShadow: 6,
                                  transform: 'scale(1.04)',
                                  zIndex: 2,
                                },
                              }}
                            >
                              {/* Colored bar for session type */}
                              <Box sx={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: '100%',
                                width: 6,
                                borderTopLeftRadius: 8,
                                borderBottomLeftRadius: 8,
                                bgcolor: componentColors[session.componentType.toLowerCase()].bgcolor,
                              }} />
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.08em', ml: 1.5, color: 'text.primary' }}>
                                {session.subjectCode}
                              </Typography>
                              <Typography variant="caption" display="block" sx={{ ml: 1.5, color: 'text.secondary' }}>
                                {session.roomId}
                              </Typography>
                              <Typography variant="caption" display="block" sx={{ ml: 1.5, opacity: 0.9, color: 'text.secondary' }}>
                                {viewType === 'section' ? session.facultyName : session.studentGroupId}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    );
                  }
                  return <TableCell 
                    key={slot} 
                    sx={{ 
                      border: 1, 
                      borderColor: 'divider',
                      backgroundColor: 'background.paper',
                    }} 
                  />;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  } catch (err) {
    return (
      <Box sx={{ color: 'error.main', textAlign: 'center', my: 4 }}>
        Error rendering timetable grid. Please check your data or try a different view.
      </Box>
    );
  }
}

export default TimetableGrid;