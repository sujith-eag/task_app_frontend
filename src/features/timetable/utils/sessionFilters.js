// Session filtering utilities

/**
 * Filter sessions by faculty name
 * @param {Array} data - Array of session objects
 * @param {string} facultyName - Faculty name to filter by
 * @returns {Array} Filtered sessions
 */
export const filterByFaculty = (data, facultyName) => {
  if (!Array.isArray(data) || !facultyName) return [];
  return data.filter(s => s.facultyName === facultyName);
};

/**
 * Filter sessions by section
 * Supports both new sections array format and old section string format
 * @param {Array} data - Array of session objects
 * @param {string} sectionValue - Section value to filter by
 * @returns {Array} Filtered sessions
 */
export const filterBySection = (data, sectionValue) => {
  if (!Array.isArray(data) || !sectionValue) return [];
  
  return data.filter(s => {
    // Check if sections array includes the value (new format)
    if (Array.isArray(s.sections)) {
      return s.sections.includes(sectionValue) || s.studentGroupId === sectionValue;
    }
    // Fallback for old format (section string)
    return s.section === sectionValue || s.studentGroupId === sectionValue;
  });
};

/**
 * Filter sessions by semester
 * @param {Array} data - Array of session objects
 * @param {string|number} semester - Semester to filter by
 * @returns {Array} Filtered sessions
 */
export const filterBySemester = (data, semester) => {
  if (!Array.isArray(data) || !semester) return [];
  return data.filter(s => String(s.semester) === String(semester));
};

/**
 * Filter sessions by semester AND section letter
 * Shows all classes (core + electives) for a specific section in a semester
 * E.g., "Semester 3, Section A" shows MCA_SEM3_A + ELEC_AD_A1, etc.
 * @param {Array} data - Array of session objects
 * @param {string|number} semester - Semester to filter by
 * @param {string} sectionLetter - Section letter (A, B, etc.)
 * @returns {Array} Filtered sessions
 */
export const filterBySemesterAndSection = (data, semester, sectionLetter) => {
  if (!Array.isArray(data) || !semester || !sectionLetter) return [];
  
  return data.filter(s => {
    // First check if semester matches
    if (String(s.semester) !== String(semester)) return false;
    
    // Then check if section letter is in the sections array
    if (Array.isArray(s.sections)) {
      return s.sections.includes(sectionLetter);
    }
    
    // Fallback for old format
    return s.section === sectionLetter;
  });
};

/**
 * Generic filter function based on view type
 * @param {Array} data - Array of session objects
 * @param {string} viewType - Type of view (faculty, section, semester, semesterSection)
 * @param {string} viewValue - Value to filter by
 * @param {string} sectionLetter - Optional section letter for semesterSection view
 * @returns {Array} Filtered sessions
 */
export const filterSessions = (data, viewType, viewValue, sectionLetter = null) => {
  if (!data || !viewValue) return [];
  
  switch (viewType) {
    case 'faculty':
      return filterByFaculty(data, viewValue);
    case 'section':
      return filterBySection(data, viewValue);
    case 'semester':
      return filterBySemester(data, viewValue);
    case 'semesterSection':
      return filterBySemesterAndSection(data, viewValue, sectionLetter);
    default:
      return data;
  }
};
