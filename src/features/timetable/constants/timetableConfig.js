// Timetable configuration constants

/**
 * Days of the week displayed in the timetable
 */
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Time slots for the timetable
 * Format: 'HH:MM-HH:MM'
 */
export const TIME_SLOTS = [
  '09:00-09:55',
  '09:55-10:50',
  '11:05-12:00',
  '12:00-12:55',
  '13:45-14:40',
  '14:40-15:35',
  '15:35-16:30'
];

/**
 * User types for view configuration
 */
export const USER_TYPES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin'
};

/**
 * View types for timetable filtering
 */
export const VIEW_TYPES = {
  SEMESTER: 'semester',
  SECTION: 'section',
  FACULTY: 'faculty',
  SEMESTER_SECTION: 'semesterSection' // New: Semester + Section letter
};

/**
 * Component types for sessions
 */
export const COMPONENT_TYPES = {
  THEORY: 'theory',
  PRACTICAL: 'practical',
  TUTORIAL: 'tutorial'
};

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  TABLE_MIN_WIDTH: 900,
  TABLE_MAX_HEIGHT: '80vh',
  SESSION_CARD_MIN_HEIGHT: 56,
  HOVER_SCALE: 1.02,
  HOVER_Z_INDEX: 1
};
