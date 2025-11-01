import React, { useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Box
} from '@mui/material';
import { DAYS, TIME_SLOTS, UI_CONFIG, VIEW_TYPES } from '../constants';
import { useSessionGrid } from '../hooks';
import SessionCard from './SessionCard';

// Helper to convert 12-hour display format to 24-hour data format
const getStartTimeFrom12Hour = (slot) => {
  const displayTo24Hour = {
    '9:00 AM - 9:55 AM': '09:00',
    '9:55 AM - 10:50 AM': '09:55',
    '11:05 AM - 12:00 PM': '11:05',
    '12:00 PM - 12:55 PM': '12:00',
    '1:45 PM - 2:40 PM': '13:45',
    '2:40 PM - 3:35 PM': '14:40',
    '3:35 PM - 4:30 PM': '15:35'
  };
  return displayTo24Hour[slot];
};

// Helper component to render a single timetable row
const TimetableRow = ({ day, semester, grid, occupiedSlots, viewType, onCellClick, rowIdx }) => {
  const cells = [];
  
  for (let i = 0; i < TIME_SLOTS.length; i++) {
    const slot = TIME_SLOTS[i];
    const startTime = getStartTimeFrom12Hour(slot);
    
    // Check if this slot is occupied by a previous spanning session
    if (occupiedSlots.has(`${day}-${startTime}`)) {
      // Skip rendering - this slot is part of a previous 2-slot session
      continue;
    }
    
    const sessionsInCell = grid[day]?.[startTime];
    
    if (sessionsInCell && sessionsInCell.length > 0) {
      // Check if any session spans 2 slots
      const hasSpanningSession = sessionsInCell.some(s => s.colSpan === 2);
      
      cells.push(
                  <TableCell
            key={slot}
            colSpan={hasSpanningSession ? 2 : 1}
            sx={{
              p: { xs: 0.5, md: 1 },
              textAlign: 'left',
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
    } else {
      // Empty cell
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
    }
  }
  
  // Format day label based on whether we have semester/section info
  let dayLabel = day;
  let semesterLabel = null;
  
  if (semester) {
    // Extract semester number and section if present
    // semester could be like "1 (A)" or just "1"
    const match = semester.match(/^(\d+)\s*\(([A-Z])\)$/);
    if (match) {
      // Has section: "1 (A)" -> show "Mon | Sem 1-A" (cleaner format for View All)
      dayLabel = day;
      semesterLabel = `Sem ${match[1]}-${match[2]}`;
    } else {
      // No section: "1" -> show "Mon | Sem 1"
      dayLabel = day;
      semesterLabel = `Sem ${semester}`;
    }
  }
  
  return (
    <TableRow 
      sx={{ 
        backgroundColor: (theme) => 
          rowIdx % 2 === 0 
            ? (theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'grey.50')
            : 'background.paper',
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
          background: (theme) => 
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.3) 0%, rgba(21, 101, 192, 0.25) 100%)'
              : 'linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(13, 71, 161, 0.12) 100%)',
          color: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'primary.light' 
              : 'primary.dark',
          fontSize: { xs: '0.75rem', md: '0.9rem' },
          borderRight: 2,
          borderColor: 'divider',
          p: { xs: 0.5, md: 1 },
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 1px 3px rgba(0, 0, 0, 0.3)'
            : 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 3px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          <Box sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, fontWeight: 700 }}>
            {dayLabel}
          </Box>
          {semesterLabel && (
            <Box sx={{ 
              fontSize: { xs: '0.65rem', md: '0.75rem' }, 
              fontWeight: 600,
              opacity: 0.9,
              mt: -0.25
            }}>
              {semesterLabel}
            </Box>
          )}
        </Box>
      </TableCell>
      {cells}
    </TableRow>
  );
};

const TimetableGrid = ({ sessions, viewType, onCellClick }) => {
  const isViewAll = viewType === VIEW_TYPES.ALL;
  
  // Check if we have mixed-duration conflicts that require section-based grouping
  const hasMixedDurationConflicts = useMemo(() => {
    if (sessions.length === 0) return false;
    
    // Group sessions by day and startTime
    const timeSlotGrid = {};
    sessions.forEach(session => {
      const key = `${session.day}-${session.startTime}`;
      if (!timeSlotGrid[key]) timeSlotGrid[key] = [];
      timeSlotGrid[key].push(session);
    });
    
      // Check if any time slot has sessions with different durations
      for (const sessionsInSlot of Object.values(timeSlotGrid)) {
      if (sessionsInSlot.length > 1) {
        const durations = new Set();
        sessionsInSlot.forEach(s => {
          const duration = (parseInt(s.endTime.split(':')[0]) * 60 + parseInt(s.endTime.split(':')[1])) -
                          (parseInt(s.startTime.split(':')[0]) * 60 + parseInt(s.startTime.split(':')[1]));
          durations.add(duration);
        });
        
        // If we have multiple sessions at same time with different durations, we have a conflict
        if (durations.size > 1) {
          return true;
        }
      }
    }
    
    return false;
  }, [sessions]);
  
  const shouldUseSectionGrouping = isViewAll || hasMixedDurationConflicts;
  
  const sessionsBySemester = useMemo(() => {
    if (!shouldUseSectionGrouping) return null;
    
    const grouped = {};
    sessions.forEach(session => {
      const sem = session.semester;
      if (!grouped[sem]) grouped[sem] = [];
      grouped[sem].push(session);
    });
    
    return grouped;
  }, [sessions, shouldUseSectionGrouping]);
  
  const { grid, occupiedSlots } = useSessionGrid(sessions);

  try {
    return (
      <TableContainer 
        component={Paper} 
        elevation={3}
        sx={{ 
          overflowX: 'auto',
          overflowY: 'auto',
          position: 'relative',
          width: '100%',
          // Set max height to enable vertical scrolling on mobile
          maxHeight: { xs: '70vh', md: '85vh' },
          borderRadius: { xs: 2, sm: 2.5 },
          border: '2px solid',
          borderColor: 'divider',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 8px 32px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
          // Enhanced scrollbar styling
          '&::-webkit-scrollbar': {
            width: '10px',
            height: '10px',
          },
          '&::-webkit-scrollbar-track': {
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.05) 100%)' 
                : 'linear-gradient(90deg, rgba(0, 0, 0, 0.03) 0%, rgba(0, 0, 0, 0.05) 100%)',
            borderRadius: '5px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'linear-gradient(180deg, rgba(33, 150, 243, 0.5) 0%, rgba(21, 101, 192, 0.4) 100%)'
                : 'linear-gradient(180deg, rgba(25, 118, 210, 0.6) 0%, rgba(13, 71, 161, 0.5) 100%)',
            borderRadius: '5px',
            border: '2px solid',
            borderColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)',
            '&:hover': {
              background: (theme) => 
                theme.palette.mode === 'dark' 
                  ? 'linear-gradient(180deg, rgba(33, 150, 243, 0.7) 0%, rgba(21, 101, 192, 0.6) 100%)'
                  : 'linear-gradient(180deg, rgba(25, 118, 210, 0.8) 0%, rgba(13, 71, 161, 0.7) 100%)',
            },
          },
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
                  background: (theme) => 
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(21, 101, 192, 0.2) 100%)'
                      : 'linear-gradient(135deg, rgba(25, 118, 210, 0.12) 0%, rgba(13, 71, 161, 0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: (theme) => 
                    theme.palette.mode === 'dark'
                      ? 'rgba(26, 31, 58, 0.95)'
                      : 'rgba(255, 255, 255, 0.95)',
                  color: (theme) => 
                    theme.palette.mode === 'dark' 
                      ? 'primary.light' 
                      : 'primary.dark',
                  fontSize: { xs: '0.8rem', md: '1rem' },
                  borderRight: 2,
                  borderColor: 'divider',
                  p: { xs: 1, md: 2 },
                  // Critical for mobile sticky behavior
                  position: 'sticky',
                  top: 0,
                  zIndex: 3,
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
                    background: (theme) => 
                      theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.25) 0%, rgba(21, 101, 192, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(25, 118, 210, 0.12) 0%, rgba(13, 71, 161, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    backgroundColor: (theme) => 
                      theme.palette.mode === 'dark'
                        ? 'rgba(26, 31, 58, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)',
                    color: (theme) => 
                      theme.palette.mode === 'dark' 
                        ? 'primary.light' 
                        : 'primary.dark',
                    fontSize: { xs: '0.65rem', md: '0.85rem' },
                    borderRight: 1,
                    borderColor: 'divider',
                    p: { xs: 0.5, md: 2 },
                    width: `${100 / TIME_SLOTS.length}%`,
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap',
                    // Critical for mobile sticky behavior
                    position: 'sticky',
                    top: 0,
                    zIndex: 2,
                  }}
                >
                  {time}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {shouldUseSectionGrouping ? (
              DAYS.flatMap((day, dayIdx) => {
                // Group by semester + section to avoid mixed-duration conflicts
                const semesterSectionGroups = {};
                const commonSessionsPerDay = {}; // Track multi-section sessions to show only once
                
                Object.entries(sessionsBySemester).forEach(([semester, sessions]) => {
                  // Filter sessions for this specific day first
                  const daySessionsForSemester = sessions.filter(s => s.day === day);
                  
                  // Separate single-section and multi-section sessions
                  const singleSectionSessions = daySessionsForSemester.filter(s => s.sections.length === 1);
                  const multiSectionSessions = daySessionsForSemester.filter(s => s.sections.length > 1);
                  
                  // Store multi-section sessions separately (to be shown once)
                  if (multiSectionSessions.length > 0) {
                    const commonKey = `${semester}-COMMON`;
                    commonSessionsPerDay[commonKey] = multiSectionSessions;
                  }
                  
                  // Group single-section sessions by section
                  const sectionGroups = singleSectionSessions.reduce((acc, session) => {
                    session.sections.forEach(section => {
                      const key = `${semester}-${section}`;
                      if (!acc[key]) acc[key] = [];
                      acc[key].push(session);
                    });
                    return acc;
                  }, {});
                  Object.assign(semesterSectionGroups, sectionGroups);
                });
                
                // Add common sessions to each section group
                Object.entries(commonSessionsPerDay).forEach(([commonKey, commonSessions]) => {
                  const semester = commonKey.split('-')[0];
                  // Find all section groups for this semester and add common sessions
                  Object.keys(semesterSectionGroups).forEach(key => {
                    if (key.startsWith(`${semester}-`)) {
                      semesterSectionGroups[key] = [...semesterSectionGroups[key], ...commonSessions];
                    }
                  });
                });
                
                // Filter out empty groups
                const nonEmptyGroups = Object.keys(semesterSectionGroups)
                  .filter(key => semesterSectionGroups[key].length > 0)
                  .sort();
                
                if (nonEmptyGroups.length === 0) {
                  return []; // No sessions for this day
                }
                
                return nonEmptyGroups.map((semesterSection, idx) => {
                  const [semester, section] = semesterSection.split('-');
                  const sessions = semesterSectionGroups[semesterSection];
                  
                  // Calculate grid for this semester-section combination
                  const sectionGrid = sessions.reduce((acc, session) => {
                    const { day: sessionDay, startTime } = session;
                    if (!acc[sessionDay]) acc[sessionDay] = {};
                    if (!acc[sessionDay][startTime]) acc[sessionDay][startTime] = [];
                    
                    const duration = (parseInt(session.endTime.split(':')[0]) * 60 + parseInt(session.endTime.split(':')[1])) -
                                   (parseInt(session.startTime.split(':')[0]) * 60 + parseInt(session.startTime.split(':')[1]));
                    const colSpan = duration > 60 ? 2 : 1;
                    
                    acc[sessionDay][startTime].push({ ...session, colSpan });
                    return acc;
                  }, {});
                  
                  // Calculate occupied slots
                  const sectionOccupiedSlots = new Set();
                  sessions.forEach(session => {
                    const duration = (parseInt(session.endTime.split(':')[0]) * 60 + parseInt(session.endTime.split(':')[1])) -
                                   (parseInt(session.startTime.split(':')[0]) * 60 + parseInt(session.startTime.split(':')[1]));
                    if (duration > 60) {
                      const startIdx = TIME_SLOTS.findIndex(slot => getStartTimeFrom12Hour(slot) === session.startTime);
                      if (startIdx >= 0 && startIdx + 1 < TIME_SLOTS.length) {
                        const nextSlot = getStartTimeFrom12Hour(TIME_SLOTS[startIdx + 1]);
                        sectionOccupiedSlots.add(`${session.day}-${nextSlot}`);
                      }
                    }
                  });
                  
                  const rowIdx = dayIdx * Object.keys(semesterSectionGroups).length + idx;
                  
                  return (
                    <TimetableRow
                      key={`${day}-sem${semester}-sec${section}`}
                      day={day}
                      semester={`${semester} (${section})`}
                      grid={sectionGrid}
                      occupiedSlots={sectionOccupiedSlots}
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
  } catch {
    return (
      <Box sx={{ color: 'error.main', textAlign: 'center', my: 4 }}>
        Error rendering timetable grid. Please check your data or try a different view.
      </Box>
    );
  }
}

export default TimetableGrid;
