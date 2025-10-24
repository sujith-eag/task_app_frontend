// src/features/timetable/Timetable.jsx

import React, { useState } from 'react';
import {
    Box, Paper, Typography, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import TimetableGrid from './components/TimetableGrid';
import SessionModal from './components/SessionModal';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { useTimetableData } from './hooks';
import { componentColors } from './constants';

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
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        MCA 2025 Timetable
      </Typography>

      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center', 
          gap: 3, 
          mb: 4, 
          p: 2, 
          backgroundColor: 'action.hover', 
          borderRadius: 1 
        }}
      >
        {/* Combined Semester + Section View (Progressive Filter) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', minHeight: 20 }}>
            View by Semester {view.type === 'semesterSection' && view.sectionLetter && '& Section'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="semester-section-sem-label">Semester</InputLabel>
              <Select
                labelId="semester-section-sem-label"
                label="Semester"
                value={view.type === 'semesterSection' ? view.value : ''}
                onChange={(e) => {
                  // Start with semester only, no section letter yet
                  handleViewChange('semesterSection', e.target.value, '');
                }}
                aria-label="Select semester for view"
              >
                <MenuItem value=""><em>-- Select Semester --</em></MenuItem>
                {semesterList.map(s => <MenuItem key={s} value={s}>Semester {s}</MenuItem>)}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="semester-section-letter-label">Section (Optional)</InputLabel>
              <Select
                labelId="semester-section-letter-label"
                label="Section (Optional)"
                value={view.type === 'semesterSection' ? (view.sectionLetter || '') : ''}
                onChange={(e) => {
                  // Apply section filter on top of semester
                  handleViewChange('semesterSection', view.value, e.target.value);
                }}
                disabled={view.type !== 'semesterSection' || !view.value}
                aria-label="Optionally filter by section letter"
              >
                <MenuItem value=""><em>-- All Sections --</em></MenuItem>
                {sectionLetterList.map(s => <MenuItem key={s} value={s}>Section {s}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* View by Student Group */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', minHeight: 20 }}>
            View by Student Group
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="section-select-label">Student Group</InputLabel>
            <Select
              labelId="section-select-label"
              label="Student Group"
              value={view.type === 'section' ? view.value : ''}
              onChange={(e) => handleViewChange('section', e.target.value)}
              aria-label="Select student group to view timetable"
            >
              <MenuItem value=""><em>-- Select Student Group --</em></MenuItem>
              {sectionList.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>

        {/* View by Faculty */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', minHeight: 20 }}>
            View by Faculty
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="faculty-select-label">Faculty Name</InputLabel>
            <Select
              labelId="faculty-select-label"
              label="Faculty Name"
              value={view.type === 'faculty' ? view.value : ''}
              onChange={(e) => handleViewChange('faculty', e.target.value)}
              aria-label="Select faculty to view timetable"
            >
              <MenuItem value=""><em>-- Select Faculty --</em></MenuItem>
              {facultyList.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Helper text to explain the filters */}
      <Box sx={{ mb: 2, px: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
          {view.type === 'semesterSection' && view.sectionLetter && `Showing all classes (core + electives) for Semester ${view.value}, Section ${view.sectionLetter}`}
          {view.type === 'semesterSection' && !view.sectionLetter && `Showing all classes for Semester ${view.value} (all sections)`}
          {view.type === 'section' && `Showing classes for ${view.value}`}
          {view.type === 'faculty' && `Showing all classes taught by ${view.value}`}
        </Typography>
      </Box>

      {/* Color legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2">Legend:</Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          bgcolor: componentColors.theory.bgcolor, 
          color: componentColors.theory.color, 
          px: 1, 
          borderRadius: 1 
        }}>
          <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} /> Theory
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          bgcolor: componentColors.practical.bgcolor, 
          color: componentColors.practical.color, 
          px: 1, 
          borderRadius: 1 
        }}>
          <MeetingRoomIcon fontSize="small" sx={{ mr: 0.5 }} /> Practical
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 0.5, 
          bgcolor: componentColors.tutorial.bgcolor, 
          color: componentColors.tutorial.color, 
          px: 1, 
          borderRadius: 1 
        }}>
          <SupportAgentIcon fontSize="small" sx={{ mr: 0.5 }} /> Tutorial
        </Box>
      </Box>

      {/* Error handling for empty data */}
      {filteredSessions.length === 0 ? (
        <Typography color="error" align="center" sx={{ my: 4 }}>
          No sessions found for the selected view.
        </Typography>
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