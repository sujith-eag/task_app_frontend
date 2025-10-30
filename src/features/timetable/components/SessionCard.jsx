// SessionCard component - Individual session cell

import React from 'react';
import { Box, Typography } from '@mui/material';
import { getComponentColor } from '../constants';
import { formatSections, hasSections } from '../utils';
import { UI_CONFIG } from '../constants';

const SessionCard = ({ session, viewType, onClick }) => {
  const color = getComponentColor(session.componentType);
  const isCommonSession = session.sections && session.sections.length > 1;
  
  // Calculate if this is a long session (>60 minutes)
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);
    return (end - start) / (1000 * 60);
  };
  const duration = calculateDuration(session.startTime, session.endTime);
  const isLongSession = duration > 60;

  return (
    <Box
      onClick={() => onClick(session)}
      sx={{
        mb: 0.5,
        px: { xs: 0.8, md: 1.2 },
        py: { xs: 0.8, md: 1 },
        borderRadius: 1.5,
        boxShadow: 2,
        bgcolor: (theme) => 
          isCommonSession 
            ? (theme.palette.mode === 'dark' 
                ? 'rgba(33, 150, 243, 0.12)' 
                : 'rgba(25, 118, 210, 0.04)')
            : 'background.paper',
        position: 'relative',
        cursor: 'pointer',
        border: '2px solid',
        borderColor: isCommonSession ? 'primary.main' : 'divider',
        minHeight: { xs: 50, md: UI_CONFIG.SESSION_CARD_MIN_HEIGHT },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.2s, background-color 0.2s',
        '&:hover': {
          boxShadow: 6,
          transform: `scale(${UI_CONFIG.HOVER_SCALE})`,
          zIndex: UI_CONFIG.HOVER_Z_INDEX,
          position: 'relative',
          borderColor: isCommonSession ? 'primary.dark' : 'primary.light',
          bgcolor: (theme) => 
            isCommonSession 
              ? (theme.palette.mode === 'dark' 
                  ? 'rgba(33, 150, 243, 0.2)' 
                  : 'rgba(25, 118, 210, 0.08)')
              : (theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'background.paper'),
        },
      }}
    >
      {/* Colored bar for session type - more prominent and wider */}
      <Box sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        height: '100%',
        width: isLongSession ? 10 : 8,
        borderTopLeftRadius: 6,
        borderBottomLeftRadius: 6,
        bgcolor: color.bgcolor,
        boxShadow: `2px 0 8px ${color.bgcolor}80`,
        opacity: 0.95,
      }} />
      
      <Typography variant="subtitle1" sx={{ 
        fontWeight: 700, 
        fontSize: { xs: '0.9em', md: '1.08em' }, 
        ml: 2, 
        color: 'text.primary',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        width: '100%',
      }}>
        {session.shortCode && session.facultyId && session.subjectCode 
          ? `${session.shortCode}(${session.facultyId})-${session.subjectCode}` 
          : session.subjectCode || session.shortCode || 'N/A'}
      </Typography>
      
      <Typography variant="caption" display="block" sx={{ 
        ml: 2, 
        color: 'text.secondary',
        fontSize: { xs: '0.7rem', md: '0.75rem' },
      }}>
        {session.roomId}
      </Typography>
      
      <Typography variant="caption" display="block" sx={{ 
        ml: 2, 
        opacity: 0.9, 
        color: 'text.secondary',
        fontSize: { xs: '0.7rem', md: '0.75rem' },
      }}>
        {viewType === 'section' ? session.facultyName : session.studentGroupId}
      </Typography>
      
      {/* Display sections with visual distinction for multi-section */}
      {hasSections(session.sections) && (
        <Typography 
          variant="caption" 
          display="block"
          sx={{ 
            ml: 2,
            opacity: 0.85, 
            color: isCommonSession ? 'primary.main' : 'text.secondary',
            fontWeight: isCommonSession ? 700 : 600,
            fontSize: { xs: '0.7rem', md: '0.75rem' },
          }}
        >
          Sec: {formatSections(session.sections)}
        </Typography>
      )}
    </Box>
  );
};

export default SessionCard;
