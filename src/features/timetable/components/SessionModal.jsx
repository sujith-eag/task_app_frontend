// SessionModal.jsx
import React from 'react';

// --- Integrated Styles ---
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    width: '90%',
    maxWidth: '500px',
    position: 'relative',
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`,
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#555',
  },
  modalHeader: {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  subjectTitle: {
    margin: 0,
    color: '#2c3e50',
  },
  subjectCode: {
    margin: 0,
    fontWeight: 'normal',
    color: '#3498db',
  },
  detailList: {
    listStyle: 'none',
    padding: 0,
  },
  detailItem: {
    marginBottom: '12px',
    fontSize: '1rem',
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#34495e',
    marginRight: '8px',
  }
};

const SessionModal = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>&times;</button>
        <div style={styles.modalHeader}>
          <h2 style={styles.subjectTitle}>{session.subjectTitle}</h2>
          <h4 style={styles.subjectCode}>{session.subjectCode} ({session.componentType})</h4>
        </div>
        <ul style={styles.detailList}>
          <li style={styles.detailItem}><span style={styles.detailLabel}>Faculty:</span> {session.facultyName}</li>
          <li style={styles.detailItem}><span style={styles.detailLabel}>Group:</span> {session.studentGroupId}</li>
          <li style={styles.detailItem}><span style={styles.detailLabel}>Room:</span> {session.roomId}</li>
          <li style={styles.detailItem}><span style={styles.detailLabel}>Time:</span> {session.day}, {session.startTime} - {session.endTime}</li>
          {session.supportingStaff && session.supportingStaff.length > 0 && (
             <li style={styles.detailItem}>
                <span style={styles.detailLabel}>Supporting Staff:</span>
                {session.supportingStaff.map(staff => staff.staffName).join(', ')}
             </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SessionModal;