import React, { useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box
} from '@mui/material';
import { DAYS, TIME_SLOTS, UI_CONFIG, VIEW_TYPES } from '../constants';
import { useSessionGrid } from '../hooks';
import SessionCard from './SessionCard';

// Helper component to render a single timetable row
const TimetableRow = ({ day, semester, grid, occupiedSlots, viewType, onCellClick, rowIdx }) => {
  const cells = [];
  const renderedSlots = new Set();
  
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    const slot = TIME_SLOTS[i];
    const startTime = slot.split('-')[0];
    
    if (renderedSlots.has(startTime)) {
      continue;
    }
    
    const sessionsInCell = grid[day]?.[startTime];
    
    if (occupiedSlots.has(`${day}-${startTime}`) && (!sessionsInCell || sessionsInCell.length === 0)) {
      continue;
    }
    
    if (sessionsInCell && sessionsInCell.length > 0) {
      const hasSpanningSession = sessionsInCell.some(s => s.colSpan === 2);
      
      let cellColSpan = 1;
      if (hasSpanningSession && i + 1 < TIME_SLOTS.length) {
        const nextSlotStart = TIME_SLOTS[i + 1].split('-')[0];
        const nextSlotHasSessions = grid[day]?.[nextSlotStart] && grid[day][nextSlotStart].length > 0;
        if (!nextSlotHasSessions) {
          cellColSpan = 2;
        }
      }
      
      cells.push(
        <TableCell
          key={slot}
          colSpan={cellColSpan}
          sx={{
            p: { xs: 0.5, md: 1 },
            textAlign: 'center',
            verticalAlign: 'top',
            border: 1,
            borderColor: 'divider',
            backgroundColor: 'background.default',
            minHeight: { xs: '80px', md: '100px' },
            height: 'auto',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 0.5, md: 1 },
            minHeight: 'fit-content',
          }}>
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
      
      renderedSlots.add(startTime);
      
      if (cellColSpan === 2 && i + 1 < TIME_SLOTS.length) {
        const nextSlotStart = TIME_SLOTS[i + 1].split('-')[0];
        renderedSlots.add(nextSlotStart);
      }
    } else {
      cells.push(
        <TableCell 
          key={slot} 
          sx={{ 
            border: 1, 
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }} 
        />
      );
      renderedSlots.add(startTime);
    }
  }
  
  const dayLabel = semester ? `${day} (Sem ${semester})` : day;
  
  return (
    <TableRow 
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
          width: { xs: '80px', md: '120px' },
          minWidth: { xs: '80px', md: '120px' },
          maxWidth: { xs: '80px', md: '120px' },
          backgroundColor: 'primary.light',
          color: 'primary.contrastText',
          fontSize: { xs: '0.75rem', md: '0.9rem' },
          borderRight: 2,
          borderColor: 'divider',
          p: { xs: 0.5, md: 1 },
        }}
      >
        {dayLabel}
      </TableCell>
      {cells}
    </TableRow>
  );
};

const TimetableGrid = ({ sessions, viewType, onCellClick }) => {
  const isViewAll = viewType === VIEW_TYPES.ALL;
  
  const sessionsBySemester = useMemo(() => {
    if (!isViewAll) return null;
    
    const grouped = {};
    sessions.forEach(session => {
      const sem = session.semester;
      if (!grouped[sem]) grouped[sem] = [];
      grouped[sem].push(session);
    });
    
    return grouped;
  }, [sessions, isViewAll]);
  
  // Pre-compute grids for each semester when in View All mode
  const semesterGrids = useMemo(() => {
    if (!isViewAll || !sessionsBySemester) return null;
    
    const grids = {};
    Object.keys(sessionsBySemester).forEach(semester => {
      const semSessions = sessionsBySemester[semester];
      // Manually compute grid for each semester (can't use hook here)
      const semGrid = {};
      const semOccupiedSlots = new Set();
      
      // Build grid
      semSessions.forEach(session => {
        const day = session.day;
        if (!semGrid[day]) semGrid[day] = {};
        
        const duration = (new Date(`1970-01-01T${session.endTime}:00`) - new Date(`1970-01-01T${session.startTime}:00`)) / (1000 * 60);
        const colSpan = duration > 60 ? 2 : 1;
        
        if (!semGrid[day][session.startTime]) {
          semGrid[day][session.startTime] = [];
        }
        semGrid[day][session.startTime].push({ ...session, colSpan });
      });
      
      // Mark occupied slots
      semSessions.forEach(session => {
        const day = session.day;
        const duration = (new Date(`1970-01-01T${session.endTime}:00`) - new Date(`1970-01-01T${session.startTime}:00`)) / (1000 * 60);
        const colSpan = duration > 60 ? 2 : 1;
        
        if (colSpan === 2) {
          const slotIndex = TIME_SLOTS.findIndex(slot => slot.split('-')[0] === session.startTime);
          if (slotIndex !== -1 && slotIndex + 1 < TIME_SLOTS.length) {
            const nextSlotStart = TIME_SLOTS[slotIndex + 1].split('-')[0];
            if (!semGrid[day]?.[nextSlotStart] || semGrid[day][nextSlotStart].length === 0) {
              semOccupiedSlots.add(`${day}-${nextSlotStart}`);
            }
          }
        }
      });
      
      grids[semester] = { grid: semGrid, occupiedSlots: semOccupiedSlots };
    });
    
    return grids;
  }, [isViewAll, sessionsBySemester]);
  
  const { grid, occupiedSlots } = useSessionGrid(sessions);

  try {
    return (
      <TableContainer 
        component={Paper} 
        variant="outlined" 
        sx={{ 
          overflowX: 'auto',
          position: 'relative',
          width: '100%',
          '@media (min-height: 900px)': {
            maxHeight: '85vh',
            overflowY: 'auto',
          }
        }}
      >
        <Table sx={{ 
          tableLayout: 'fixed', 
          minWidth: { xs: 800, md: UI_CONFIG.TABLE_MIN_WIDTH },
          width: '100%'
        }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell 
                align="center" 
                sx={{ 
                  fontWeight: 700, 
                  width: { xs: '80px', md: '120px' },
                  minWidth: { xs: '80px', md: '120px' },
                  maxWidth: { xs: '80px', md: '120px' },
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  fontSize: { xs: '0.8rem', md: '1rem' },
                  borderRight: 2,
                  borderColor: 'divider',
                  p: { xs: 1, md: 2 },
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
                    fontSize: { xs: '0.7rem', md: '0.9rem' },
                    borderRight: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                    p: { xs: 0.5, md: 2 },
                    width: `${100 / TIME_SLOTS.length}%`,
                  }}
                >
                  {time}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isViewAll ? (
              DAYS.flatMap((day, dayIdx) => {
                return Object.keys(sessionsBySemester).sort().map((semester, semIdx) => {
                  const { grid: semGrid, occupiedSlots: semOccupiedSlots } = semesterGrids[semester];
                  const rowIdx = dayIdx * Object.keys(sessionsBySemester).length + semIdx;
                  
                  return (
                    <TimetableRow
                      key={`${day}-sem${semester}`}
                      day={day}
                      semester={semester}
                      grid={semGrid}
                      occupiedSlots={semOccupiedSlots}
                      viewType={viewType}
                      onCellClick={onCellClick}
                      rowIdx={rowIdx}
                    />
                  );
                });
              })
            ) : (
              DAYS.map((day, rowIdx) => (
                <TimetableRow
                  key={day}
                  day={day}
                  grid={grid}
                  occupiedSlots={occupiedSlots}
                  viewType={viewType}
                  onCellClick={onCellClick}
                  rowIdx={rowIdx}
                />
              ))
            )}
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
