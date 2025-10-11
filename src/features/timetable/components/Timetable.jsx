// Timetable.jsx
import React, { useState, useMemo, useEffect } from 'react';
import TimetableGrid from './TimetableGrid.jsx';
import SessionModal from './SessionModal.jsx';

const styles = {
    container: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
    },
    header: { textAlign: 'center', color: '#2c3e50' },
    controls: { display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '25px', padding: '15px', backgroundColor: '#ecf0f1', borderRadius: '6px' },
    controlGroup: { display: 'flex', flexDirection: 'column' },
    label: { fontWeight: 500, marginBottom: '5px', color: '#34495e' },
    select: { padding: '8px 12px', border: '1px solid #bdc3c7', borderRadius: '4px', minWidth: '250px', fontSize: '16px' },
};

// Extracts unique values for dropdowns from the timetable data
const getUniqueValues = (data, key) => [...new Set(data.map(item => item[key]))].sort();

const Timetable = ({ data, currentUser }) => {
  // State to manage the current view (e.g., by faculty or by section)
  const [view, setView] = useState({ type: '', value: '' });
  const [modalData, setModalData] = useState(null);

  // Get unique faculty and sections for the dropdowns
  const facultyList = useMemo(() => getUniqueValues(data, 'facultyId'), [data]);
  const sectionList = useMemo(() => getUniqueValues(data, 'studentGroupId'), [data]);
  
  // Set default view on initial render based on currentUser prop
  useEffect(() => {
    if (currentUser?.type === 'student') {
        setView({ type: 'section', value: currentUser.section });
    } else if (currentUser?.type === 'staff') {
        // Default to staff's own schedule if facultyId is provided
        if (currentUser.facultyId && facultyList.includes(currentUser.facultyId)) {
            setView({ type: 'faculty', value: currentUser.facultyId });
        } else { // Or show the first section as a generic default for other staff
            setView({ type: 'section', value: sectionList[0] || '' });
        }
    } else { // Generic default for guests
        setView({ type: 'section', value: sectionList[0] || '' });
    }
  }, [currentUser, facultyList, sectionList]);

  // Memoized filtering logic to prevent re-calculation on every render
  const filteredSessions = useMemo(() => {
    if (!view.value) return [];
    if (view.type === 'faculty') {
	    return data.filter(s => s.facultyId === view.value)
	};
    if (view.type === 'section') {
	    return data.filter(s => s.studentGroupId.includes(view.value));
	}
      // For sections, we need to find all sessions where this group participates
      // This includes compulsory subjects and electives
      // The current data structure handles this directly via studentGroupId	
    return data;
  }, [data, view]);

  const handleCellClick = (session) => setModalData(session);
  const handleCloseModal = () => setModalData(null);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>University Timetable</h1>
      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <label htmlFor="section-select" style={styles.label}>View by Section:</label>
          <select id="section-select" style={styles.select} value={view.type === 'section' ? view.value : ''} onChange={(e) => setView({ type: 'section', value: e.target.value })}>
            <option value="">--Select a Section--</option>
            {sectionList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={styles.controlGroup}>
          <label htmlFor="faculty-select" style={styles.label}>View by Faculty:</label>
          <select id="faculty-select" style={styles.select} value={view.type === 'faculty' ? view.value : ''} onChange={(e) => setView({ type: 'faculty', value: e.target.value })}>
            <option value="">--Select a Faculty--</option>
            {facultyList.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>
      
      <TimetableGrid sessions={filteredSessions} viewType={view.type} onCellClick={handleCellClick} />
      
      <SessionModal session={modalData} onClose={handleCloseModal} />
    </div>
  );
};

export default Timetable;