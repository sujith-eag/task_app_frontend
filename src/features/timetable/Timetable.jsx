// src/features/timetable/Timetable.jsx

import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Paper, Typography, FormControl,
    InputLabel, Select, MenuItem
} from '@mui/material';
import TimetableGrid from './components/TimetableGrid';
import SessionModal from './components/SessionModal';

// This utility function is efficient and can remain as is.
const getUniqueValues = (data, key) => [...new Set(data.map(item => item[key]))].sort();

const Timetable = ({ data, currentUser }) => {
  const [view, setView] = useState({ type: '', value: '' });
  const [modalData, setModalData] = useState(null);

  // This logic is perfect and requires no changes.
  const facultyList = useMemo(() => getUniqueValues(data, 'facultyName'), [data]);
  const sectionList = useMemo(() => getUniqueValues(data, 'studentGroupId'), [data]);
  
  // The logic for setting a default view is also excellent and remains.
  useEffect(() => {
    if (currentUser?.type === 'student') {
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
  }, [currentUser, facultyList, sectionList]);

  // The core filtering logic is highly performant and unchanged.
  const filteredSessions = useMemo(() => {
    if (!view.value) return [];
    if (view.type === 'faculty') {
	    return data.filter(s => s.facultyName === view.value)
	};
    if (view.type === 'section') {
	    return data.filter(s => s.studentGroupId.includes(view.value));
	}
    return data;
  }, [data, view]);

  const handleCellClick = (session) => setModalData(session);
  const handleCloseModal = () => setModalData(null);

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
          <InputLabel id="section-select-label">View by Section</InputLabel>
          <Select
            labelId="section-select-label"
            label="View by Section"
            value={view.type === 'section' ? view.value : ''}
            onChange={(e) => setView({ type: 'section', value: e.target.value })}
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
            onChange={(e) => setView({ type: 'faculty', value: e.target.value })}
          >
            <MenuItem value=""><em>-- Select a Faculty --</em></MenuItem>
            {facultyList.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      
      <TimetableGrid 
        sessions={filteredSessions} 
        viewType={view.type} 
        onCellClick={handleCellClick} 
      />
      
      <SessionModal 
        session={modalData} 
        onClose={handleCloseModal} 
      />
    </Paper>
  );
};

export default Timetable;