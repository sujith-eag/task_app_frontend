// Timetable helper utility functions

/**
 * Get unique values from an array of objects for a specific key
 * @param {Array} data - Array of objects
 * @param {string} key - Key to extract unique values from
 * @returns {Array} Sorted array of unique values
 */
export const getUniqueValues = (data, key) => {
  if (!Array.isArray(data)) return [];
  return [...new Set(data.map(item => item[key]))].filter(Boolean).sort();
};

/**
 * Get all available semesters from timetable data
 * @param {Array} data - Array of session objects
 * @returns {Array} Sorted array of semester strings
 */
export const getSemesterList = (data) => {
  if (!Array.isArray(data)) return [];
  const semesters = new Set();
  data.forEach(item => {
    if (item.semester) semesters.add(item.semester);
  });
  return Array.from(semesters).map(String).sort();
};

/**
 * Get all unique sections from sessions
 * Extracts individual sections from the sections array
 * @param {Array} data - Array of session objects
 * @returns {Array} Sorted array of unique section values
 */
export const getUniqueSections = (data) => {
  if (!Array.isArray(data)) return [];
  const sections = new Set();
  data.forEach(item => {
    if (Array.isArray(item.sections)) {
      item.sections.forEach(sec => sections.add(sec));
    } else if (item.section) {
      sections.add(item.section);
    }
  });
  return Array.from(sections).sort();
};

/**
 * Check if a session matches a specific section
 * Supports both array and string format for backward compatibility
 * @param {object} session - Session object
 * @param {string} sectionValue - Section value to match
 * @returns {boolean} True if session matches the section
 */
export const sessionMatchesSection = (session, sectionValue) => {
  if (!session || !sectionValue) return false;
  
  // Check sections array (new format)
  if (Array.isArray(session.sections)) {
    return session.sections.includes(sectionValue) || session.studentGroupId === sectionValue;
  }
  
  // Fallback to old format (section string)
  return session.section === sectionValue || session.studentGroupId === sectionValue;
};

/**
 * Format sections array for display
 * @param {Array|string} sections - Sections array or string
 * @returns {string} Formatted sections string (e.g., "A, B")
 */
export const formatSections = (sections) => {
  if (Array.isArray(sections) && sections.length > 0) {
    return sections.join(', ');
  }
  if (typeof sections === 'string') {
    return sections;
  }
  return 'N/A';
};

/**
 * Check if sections data exists and has content
 * @param {Array|string} sections - Sections array or string
 * @returns {boolean} True if sections data is available
 */
export const hasSections = (sections) => {
  return (Array.isArray(sections) && sections.length > 0) || typeof sections === 'string';
};
