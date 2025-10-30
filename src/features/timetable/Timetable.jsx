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
      elevation={4} 
      sx={{ 
        p: { xs: 2, md: 3 }, 
        borderRadius: { xs: 2, sm: 3 },
        backgroundColor: 'background.paper',
        boxShadow: (theme) => theme.palette.mode === 'dark'
          ? '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 10px 40px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08)',
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
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(33, 150, 243, 0.08) 0%, rgba(21, 101, 192, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(25, 118, 210, 0.05) 0%, rgba(13, 71, 161, 0.03) 100%)',
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 4px 20px rgba(33, 150, 243, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 4px 20px rgba(25, 118, 210, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
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

      {/* Color legend - Mobile-friendly horizontal layout */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: { xs: 1.5, md: 2 }, 
        mb: 3, 
        alignItems: 'center',
        p: { xs: 2, md: 2.5 },
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.03)',
        borderRadius: 2,
        border: '2px solid',
        borderColor: 'divider',
        boxShadow: 1,
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontSize: { xs: '0.9rem', md: '0.95rem' },
            fontWeight: 700,
            color: 'text.primary',
            mr: { xs: 0, sm: 1 },
          }}
        >
          Class Types:
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: { xs: 'flex-start', sm: 'center' },
          gap: 0.75, 
          bgcolor: componentColors.theory.bgcolor, 
          color: componentColors.theory.color, 
          px: { xs: 1.5, md: 2 }, 
          py: { xs: 0.75, md: 1 },
          borderRadius: 2,
          fontSize: { xs: '0.8rem', md: '0.875rem' },
          fontWeight: 600,
          boxShadow: 2,
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
            borderColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.2)',
          }
        }}>
          <SchoolIcon fontSize="small" sx={{ fontSize: { xs: '1.1rem', md: '1.2rem' } }} /> 
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>Theory</Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: { xs: 'flex-start', sm: 'center' },
          gap: 0.75, 
          bgcolor: componentColors.practical.bgcolor, 
          color: componentColors.practical.color, 
          px: { xs: 1.5, md: 2 }, 
          py: { xs: 0.75, md: 1 },
          borderRadius: 2,
          fontSize: { xs: '0.8rem', md: '0.875rem' },
          fontWeight: 600,
          boxShadow: 2,
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
            borderColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.2)',
          }
        }}>
          <MeetingRoomIcon fontSize="small" sx={{ fontSize: { xs: '1.1rem', md: '1.2rem' } }} /> 
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>Practical</Typography>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: { xs: 'flex-start', sm: 'center' },
          gap: 0.75, 
          bgcolor: componentColors.tutorial.bgcolor, 
          color: componentColors.tutorial.color, 
          px: { xs: 1.5, md: 2 }, 
          py: { xs: 0.75, md: 1 },
          borderRadius: 2,
          fontSize: { xs: '0.8rem', md: '0.875rem' },
          fontWeight: 600,
          boxShadow: 2,
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 4,
            borderColor: (theme) => theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.2)',
          }
        }}>
          <SupportAgentIcon fontSize="small" sx={{ fontSize: { xs: '1.1rem', md: '1.2rem' } }} /> 
          <Typography component="span" sx={{ fontSize: 'inherit', fontWeight: 'inherit' }}>Tutorial</Typography>
        </Box>
      </Box>

      {/* Helper text to explain the filters - moved above grid */}
      <Box 
        sx={{ 
          mb: 3, 
          px: { xs: 2, md: 2.5 }, 
          py: { xs: 1.5, md: 2 },
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'linear-gradient(90deg, rgba(33, 150, 243, 0.12) 0%, rgba(33, 150, 243, 0.06) 100%)' 
              : 'linear-gradient(90deg, rgba(33, 150, 243, 0.08) 0%, rgba(33, 150, 243, 0.04) 100%)',
          borderRadius: 2,
          border: '2px solid',
          borderColor: 'primary.main',
          boxShadow: (theme) => theme.palette.mode === 'dark'
            ? '0 2px 12px rgba(33, 150, 243, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : '0 2px 12px rgba(33, 150, 243, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 500,
            fontSize: { xs: '0.85rem', sm: '0.875rem' },
          }}
        >
          {view.type === VIEW_TYPES.ALL && 'All semesters & sections'}
          {view.type === 'semesterSection' && view.value && view.sectionLetter && `Sem ${view.value}-${view.sectionLetter} (Core + Electives)`}
          {view.type === 'semesterSection' && view.value && !view.sectionLetter && `Sem ${view.value} - All sections`}
          {view.type === 'section' && view.value && `${view.value}`}
          {view.type === 'faculty' && view.value && `Faculty: ${view.value}`}
          {!view.value && view.type !== VIEW_TYPES.ALL && 'Select a filter to view timetable'}
        </Typography>
      </Box>

      {/* Error handling for empty data */}
      {filteredSessions.length === 0 ? (
        <Box 
          sx={{ 
            my: 6, 
            textAlign: 'center',
            p: 4,
            borderRadius: 2,
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? 'linear-gradient(135deg, rgba(211, 47, 47, 0.12) 0%, rgba(198, 40, 40, 0.08) 100%)' 
                : 'linear-gradient(135deg, rgba(211, 47, 47, 0.08) 0%, rgba(198, 40, 40, 0.05) 100%)',
            border: '2px solid',
            borderColor: 'error.main',
            boxShadow: (theme) => theme.palette.mode === 'dark'
              ? '0 4px 20px rgba(211, 47, 47, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
              : '0 4px 20px rgba(211, 47, 47, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
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