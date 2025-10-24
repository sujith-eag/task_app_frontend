import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';
import { DAYS, TIME_SLOTS, UI_CONFIG } from '../constants';
import { useSessionGrid } from '../hooks';
import SessionCard from './SessionCard';

const TimetableGrid = ({ sessions, viewType, onCellClick }) => {
  // Use custom hook for grid calculation
  const { grid, occupiedSlots } = useSessionGrid(sessions);

  try {
    return (
      <TableContainer 
        component={Paper} 
        variant="outlined" 
        sx={{ 
          maxHeight: UI_CONFIG.TABLE_MAX_HEIGHT, 
          overflowX: 'auto',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <Table sx={{ tableLayout: 'fixed', minWidth: UI_CONFIG.TABLE_MIN_WIDTH }} stickyHeader>
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
                            <SessionCard
                              key={session.sessionId || idx}
                              session={session}
                              viewType={viewType}
                              onClick={onCellClick}
                            />
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