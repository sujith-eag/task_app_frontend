// TimetableGrid.jsx
import React from 'react';

// --- Component Constants & Styles ---
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = [
  '09:00-09:55', '09:55-10:50', '11:05-12:00', '12:00-12:55', 
  '13:45-14:40', '14:40-15:35', '15:35-16:30'
];

// A map to quickly find a slot's index
const slotIndexMap = new Map(TIME_SLOTS.map((slot, i) => [slot.split('-')[0], i]));

const styles = {
    gridContainer: { fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif` },
    table: { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' },
    th: { backgroundColor: '#34495e', color: 'white', fontWeight: 'bold', padding: '10px', border: '1px solid #ddd', textAlign: 'center' },
    dayHeader: { fontWeight: 'bold', backgroundColor: '#ecf0f1', padding: '10px', border: '1px solid #ddd', textAlign: 'center', verticalAlign: 'middle' },
    emptyCell: { backgroundColor: '#fdfdfd', border: '1px solid #ddd' },
    sessionCell: {
        color: 'white',
        borderRadius: '4px',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.2)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        padding: '10px',
        border: '1px solid #ddd',
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: '12px'
    },
    // Component type colors
    theory: { backgroundColor: '#2980b9' },
    practical: { backgroundColor: '#c0392b' },
    tutorial: { backgroundColor: '#27ae60' },
};

const TimetableGrid = ({ sessions, viewType, onCellClick }) => {
  // Pre-process sessions to make grid rendering easier
  const gridData = React.useMemo(() => {
    const grid = {};
    const occupiedSlots = new Set(); // To track slots covered by a colSpan

    sessions.forEach(session => {
      const day = session.day;
      if (!grid[day]) grid[day] = {};

      // Calculate duration in minutes to determine column span
      const start = new Date(`1970-01-01T${session.startTime}:00`);
      const end = new Date(`1970-01-01T${session.endTime}:00`);
      const duration = (end - start) / (1000 * 60);

      const colSpan = duration > 60 ? 2 : 1;
	
      // Add the session to the grid with its colSpan
      grid[day][session.startTime] = { ...session, colSpan };
      
      // If it spans 2 columns, mark the next slot as occupied
      if (colSpan === 2) {
        const slotIndex = slotIndexMap.get(session.startTime);
        if (slotIndex !== undefined && slotIndex + 1 < TIME_SLOTS.length) {
          const nextSlotStart = TIME_SLOTS[slotIndex + 1].split('-')[0];
          occupiedSlots.add(`${day}-${nextSlotStart}`);
        }
      }
    });
    return { grid, occupiedSlots };
  }, [sessions]);

  const { grid, occupiedSlots } = gridData;

  return (
    <div style={styles.gridContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Day</th>
            {TIME_SLOTS.map(time => <th key={time} style={styles.th}>{time}</th>)}
          </tr>
        </thead>
        <tbody>
          {DAYS.map(day => (
            <tr key={day}>
              <td style={styles.dayHeader}>{day}</td>
              {TIME_SLOTS.map(slot => {
                const startTime = slot.split('-')[0];
                if (occupiedSlots.has(`${day}-${startTime}`)) return null;
                const session = grid[day]?.[startTime];
                if (session) {
                  return (
                    <td 
                      key={slot} 
                      style={{ ...styles.sessionCell, ...styles[session.componentType] }}
                      colSpan={session.colSpan}
                      onClick={() => onCellClick(session)}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = 'inset 0 0 5px rgba(0,0,0,0.2)'}
                    >
                      <strong style={{fontSize: '14px', display: 'block'}}>{session.subjectCode}</strong> ({session.componentType})
                      <br />
                      <small style={{opacity: 0.9}}>{session.roomId}</small>
                      <br />
                      <small style={{opacity: 0.9}}>{viewType === 'section' ? session.facultyName : session.studentGroupId}</small>
                    </td>
                  );
                }
                return <td key={slot} style={styles.emptyCell}></td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableGrid;