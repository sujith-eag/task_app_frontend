// Data validation utilities

/**
 * Validate if timetable data has the correct structure
 * @param {Array} data - Timetable data to validate
 * @returns {object} Validation result with isValid and errors
 */
export const validateTimetableData = (data) => {
  const errors = [];
  
  if (!Array.isArray(data)) {
    errors.push('Timetable data must be an array');
    return { isValid: false, errors };
  }
  
  if (data.length === 0) {
    errors.push('Timetable data is empty');
    return { isValid: false, errors };
  }
  
  // Check required fields in first few sessions
  const requiredFields = [
    'sessionId', 'day', 'startTime', 'endTime', 
    'subjectCode', 'facultyName', 'semester'
  ];
  
  const sampleSize = Math.min(3, data.length);
  for (let i = 0; i < sampleSize; i++) {
    const session = data[i];
    requiredFields.forEach(field => {
      if (!session[field]) {
        errors.push(`Session ${i} is missing required field: ${field}`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate session object structure
 * @param {object} session - Session object to validate
 * @returns {boolean} True if session is valid
 */
export const isValidSession = (session) => {
  if (!session || typeof session !== 'object') return false;
  
  return Boolean(
    session.sessionId &&
    session.day &&
    session.startTime &&
    session.endTime &&
    session.subjectCode
  );
};

/**
 * Sanitize and normalize timetable data
 * Ensures backward compatibility with old format
 * @param {Array} data - Raw timetable data
 * @returns {Array} Sanitized timetable data
 */
export const sanitizeTimetableData = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(session => ({
    ...session,
    // Ensure sections is always an array
    sections: Array.isArray(session.sections) 
      ? session.sections 
      : session.section 
        ? [session.section] 
        : [],
    // Ensure semester is a number
    semester: Number(session.semester) || 0,
    // Ensure supportingStaff is an array
    supportingStaff: Array.isArray(session.supportingStaff) 
      ? session.supportingStaff 
      : []
  }));
};
