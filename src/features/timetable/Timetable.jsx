// src/features/timetable/Timetable.jsx

import React, { useState } from 'react';
import {
    Box, Paper, Typography, FormControl,
    InputLabel, Select, MenuItem, Button
} from '@mui/material';
import TimetableGrid from './components/TimetableGrid';
import SessionModal from './components/SessionModal';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import { useTimetableData } from './hooks';
import { componentColors, VIEW_TYPES } from './constants';

const Timetable = ({ data, currentUser }) => {
  const [modalData, setModalData] = useState(null);

  // Use custom hook for data management
  const {
    view,
    handleViewChange,
    facultyList,
    sectionList,
    semesterList,
    sectionLetterList,
    filteredSessions
  } = useTimetableData(data, currentUser);

  const handleCellClick = (session) => setModalData(session);
  const handleCloseModal = () => setModalData(null);

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: { xs: 2, md: 3 }, 
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            textAlign: 'center',
            fontWeight: 700,
            background: (theme) => 
              theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          MCA 2025 Timetable
        </Typography>
      </Box>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center', 
          gap: { xs: 2, md: 3 }, 
          mb: 4, 
          p: { xs: 2, md: 3 }, 
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)' 
              : 'grey.50',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Combined Semester + Section View (Progressive Filter) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon fontSize="small" />
            View by Semester
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' } }}>
            <FormControl fullWidth size="small">
              <InputLabel id="semester-section-sem-label">Semester</InputLabel>
              <Select
                labelId="semester-section-sem-label"
                label="Semester"
                value={view.type === 'semesterSection' ? view.value : (view.type === VIEW_TYPES.ALL ? 'all' : '')}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  if (selectedValue === 'all') {
                    // Switch to "View All" mode
                    handleViewChange(VIEW_TYPES.ALL, 'all', '');
                  } else if (selectedValue) {
                    // Start with semester only, no section letter yet
                    handleViewChange('semesterSection', selectedValue, '');
                  }
                }}
                aria-label="Select semester for view"
              >
                <MenuItem value="all">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ViewWeekIcon fontSize="small" />
                    <span>All Semesters</span>
                  </Box>
                </MenuItem>
                {semesterList.map(s => <MenuItem key={s} value={s}>Semester {s}</MenuItem>)}
              </Select>
            </FormControl>
            
            <FormControl fullWidth size="small">
              <InputLabel id="semester-section-letter-label">Section (Optional)</InputLabel>
              <Select
                labelId="semester-section-letter-label"
                label="Section (Optional)"
                value={view.type === 'semesterSection' && view.value !== 'all' ? (view.sectionLetter || '') : ''}
                onChange={(e) => {
                  // Apply section filter on top of semester
                  handleViewChange('semesterSection', view.value, e.target.value);
                }}
                disabled={view.type !== 'semesterSection' || !view.value || view.value === 'all'}
                aria-label="Optionally filter by section letter"
              >
                <MenuItem value=""><em>All Sections</em></MenuItem>
                {sectionLetterList.map(s => <MenuItem key={s} value={s}>Section {s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* View by Faculty */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupportAgentIcon fontSize="small" />
            View by Faculty
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel id="faculty-select-label">Faculty Name</InputLabel>
            <Select
              labelId="faculty-select-label"
              label="Faculty Name"
              value={view.type === 'faculty' ? view.value : ''}
              onChange={(e) => {
                if (e.target.value) {
                  handleViewChange('faculty', e.target.value);
                }
              }}
              aria-label="Select faculty to view timetable"
            >
              <MenuItem value=""><em>Select Faculty</em></MenuItem>
              {facultyList.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Helper text to explain the filters */}
      <Box 
        sx={{ 
          mb: 3, 
          px: 2, 
          py: 1.5,
          backgroundColor: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'rgba(33, 150, 243, 0.08)' 
              : 'rgba(33, 150, 243, 0.05)',
          borderRadius: 2,
          borderLeft: '4px solid',
          borderColor: 'primary.main',
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500,
          }}
        >
          {view.type === VIEW_TYPES.ALL && 'Showing all classes across all semesters and sections'}
          {view.type === 'semesterSection' && view.value && view.sectionLetter && `Showing all classes (core + electives) for Sem ${view.value}-${view.sectionLetter}`}
          {view.type === 'semesterSection' && view.value && !view.sectionLetter && `Showing all classes for Semester ${view.value} (all sections)`}
          {view.type === 'section' && view.value && `Showing classes for ${view.value}`}
          {view.type === 'faculty' && view.value && `Showing all classes taught by ${view.value}`}
          {!view.value && view.type !== VIEW_TYPES.ALL && 'Please select a filter option above to view the timetable'}
        </Typography>
      </Box>

      {/* Color legend */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: { xs: 1.5, md: 2 }, 
        mb: 3, 
        alignItems: 'center',
        justifyContent: { xs: 'center', md: 'flex-start' },
        p: 2,
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontSize: { xs: '0.85rem', md: '0.9rem' },
            fontWeight: 600,
            color: 'text.primary',
          }}
        >
          Class Types:
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          bgcolor: componentColors.theory.bgcolor, 
          color: componentColors.theory.color, 
          px: { xs: 1, md: 1.5 }, 
          py: { xs: 0.5, md: 0.75 },
          borderRadius: 1.5,
          fontSize: { xs: '0.75rem', md: '0.875rem' },
          fontWeight: 600,
          boxShadow: 1,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
          }
        }}>
          <SchoolIcon fontSize="small" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} /> Theory
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          bgcolor: componentColors.practical.bgcolor, 
          color: componentColors.practical.color, 
          px: { xs: 1, md: 1.5 }, 
          py: { xs: 0.5, md: 0.75 },
          borderRadius: 1.5,
          fontSize: { xs: '0.75rem', md: '0.875rem' },
          fontWeight: 600,
          boxShadow: 1,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
          }
        }}>
          <MeetingRoomIcon fontSize="small" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} /> Practical
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          bgcolor: componentColors.tutorial.bgcolor, 
          color: componentColors.tutorial.color, 
          px: { xs: 1, md: 1.5 }, 
          py: { xs: 0.5, md: 0.75 },
          borderRadius: 1.5,
          fontSize: { xs: '0.75rem', md: '0.875rem' },
          fontWeight: 600,
          boxShadow: 1,
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
          }
        }}>
          <SupportAgentIcon fontSize="small" sx={{ fontSize: { xs: '1rem', md: '1.1rem' } }} /> Tutorial
        </Box>
      </Box>

      {/* Error handling for empty data */}
      {filteredSessions.length === 0 ? (
        <Box 
          sx={{ 
            my: 6, 
            textAlign: 'center',
            p: 4,
            borderRadius: 2,
            backgroundColor: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'rgba(211, 47, 47, 0.08)' 
                : 'rgba(211, 47, 47, 0.05)',
            border: '1px solid',
            borderColor: 'error.main',
          }}
        >
          <Typography 
            variant="h6" 
            color="error" 
            sx={{ mb: 1, fontWeight: 600 }}
          >
            No sessions found
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
          >
            Try selecting a different filter option above
          </Typography>
        </Box>
      ) : (
        <TimetableGrid 
          sessions={filteredSessions} 
          viewType={view.type} 
          onCellClick={handleCellClick} 
        />
      )}

      <SessionModal 
        session={modalData} 
        onClose={handleCloseModal} 
      />
    </Paper>
  );
};

export default Timetable;