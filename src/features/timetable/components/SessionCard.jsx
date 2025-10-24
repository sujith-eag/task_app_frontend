// SessionCard component - Individual session cell

import React from 'react';
import { Box, Typography } from '@mui/material';
import { getComponentColor } from '../constants';
import { formatSections, hasSections } from '../utils';
import { UI_CONFIG } from '../constants';

const SessionCard = ({ session, viewType, onClick }) => {
  const color = getComponentColor(session.componentType);

  return (
    <Box
      onClick={() => onClick(session)}
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
        minHeight: UI_CONFIG.SESSION_CARD_MIN_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        transition: 'transform 0.18s, box-shadow 0.18s',
        '&:hover': {
          boxShadow: 6,
          transform: `scale(${UI_CONFIG.HOVER_SCALE})`,
          zIndex: UI_CONFIG.HOVER_Z_INDEX,
          position: 'relative',
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
        bgcolor: color.bgcolor,
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
      
      {/* Display sections if available and array has content */}
      {hasSections(session.sections) && (
        <Typography variant="caption" display="block" sx={{ ml: 1.5, opacity: 0.85, color: 'primary.main', fontWeight: 600 }}>
          Sec: {formatSections(session.sections)}
        </Typography>
      )}
    </Box>
  );
};

export default SessionCard;
