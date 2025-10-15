// src/features/timetable/Timetable.jsx

import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Paper, Typography, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import TimetableGrid from './components/TimetableGrid';
import SessionModal from './components/SessionModal';
import SchoolIcon from '@mui/icons-material/School';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// This utility function is efficient and can remain as is.

// Utility to get unique values for a key
const getUniqueValues = (data, key) => [...new Set(data.map(item => item[key]))].sort();

// Get all available semesters from data (using the 'semester' field)
const getSemesterList = (data) => {
  const semesters = new Set();
  data.forEach(item => {
    if (item.semester) semesters.add(item.semester);
  });
  // Return as ['3', '4', ...] for dropdown compatibility
  return Array.from(semesters).map(String).sort();
};

const Timetable = ({ data, currentUser }) => {
  const [view, setView] = useState({ type: '', value: '' });
  const [modalData, setModalData] = useState(null);

  const facultyList = useMemo(() => getUniqueValues(data, 'facultyName'), [data]);
  const sectionList = useMemo(() => getUniqueValues(data, 'studentGroupId'), [data]);
  const semesterList = useMemo(() => getSemesterList(data), [data]);

  // Set default view: student -> semester, staff -> faculty, else section
  useEffect(() => {
    if (currentUser?.type === 'student') {
      // Use the semester from the user's section if possible
      const userSession = data.find(s => s.studentGroupId === currentUser.section);
      const sem = userSession ? String(userSession.semester) : semesterList[0];
      if (sem && semesterList.includes(sem)) {
        setView({ type: 'semester', value: sem });
        return;
      }
      setView({ type: 'section', value: currentUser.section });
    } else if (currentUser?.type === 'staff') {
      if (currentUser.facultyName && facultyList.includes(currentUser.facultyName)) {
        setView({ type: 'faculty', value: currentUser.facultyName });
      } else {
        setView({ type: 'section', value: sectionList[0] || '' });
      }
    } else {
      setView({ type: 'section', value: sectionList[0] || '' });
    }
  }, [currentUser, facultyList, sectionList, semesterList, data]);

  // Aggregate all sessions for a semester (core + electives) using 'semester' field
  const filteredSessions = useMemo(() => {
    if (!view.value) return [];
    if (view.type === 'faculty') {
      return data.filter(s => s.facultyName === view.value);
    }
    if (view.type === 'section') {
      return data.filter(s => s.studentGroupId === view.value);
    }
    if (view.type === 'semester') {
      // All sessions where semester matches
      return data.filter(s => String(s.semester) === String(view.value));
    }
    return data;
  }, [data, view]);

  const handleCellClick = (session) => setModalData(session);
  const handleCloseModal = () => setModalData(null);

  // Helper to handle view change and reset others
  const handleViewChange = (type, value) => {
    setView({ type, value });
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        University Timetable
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
        <FormControl fullWidth>
          <InputLabel id="semester-select-label">View by Semester</InputLabel>
          <Select
            labelId="semester-select-label"
            label="View by Semester"
            value={view.type === 'semester' ? view.value : ''}
            onChange={(e) => handleViewChange('semester', e.target.value)}
            aria-label="Select semester to view timetable"
          >
            <MenuItem value=""><em>-- Select a Semester --</em></MenuItem>
            {semesterList.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="section-select-label">View by Section</InputLabel>
          <Select
            labelId="section-select-label"
            label="View by Section"
            value={view.type === 'section' ? view.value : ''}
            onChange={(e) => handleViewChange('section', e.target.value)}
            aria-label="Select section to view timetable"
          >
            <MenuItem value=""><em>-- Select a Section --</em></MenuItem>
            {sectionList.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="faculty-select-label">View by Faculty</InputLabel>
          <Select
            labelId="faculty-select-label"
            label="View by Faculty"
            value={view.type === 'faculty' ? view.value : ''}
            onChange={(e) => handleViewChange('faculty', e.target.value)}
            aria-label="Select faculty to view timetable"
          >
            <MenuItem value=""><em>-- Select a Faculty --</em></MenuItem>
            {facultyList.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* Color legend */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        <Typography variant="subtitle2">Legend:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'primary.main', color: 'primary.contrastText', px: 1, borderRadius: 1 }}>
          <SchoolIcon fontSize="small" sx={{ mr: 0.5 }} /> Theory
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'error.dark', color: 'error.contrastText', px: 1, borderRadius: 1 }}>
          <MeetingRoomIcon fontSize="small" sx={{ mr: 0.5 }} /> Practical
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: 'success.dark', color: 'success.contrastText', px: 1, borderRadius: 1 }}>
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