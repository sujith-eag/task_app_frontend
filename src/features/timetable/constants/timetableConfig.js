// Timetable configuration constants

/**
 * Days of the week displayed in the timetable
 */
export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Time slots for the timetable
 * Format: '12-hour format AM/PM'
 */
export const TIME_SLOTS = [
  '9:00 AM - 9:55 AM',
  '9:55 AM - 10:50 AM',
  '11:05 AM - 12:00 PM',
  '12:00 PM - 12:55 PM',
  '1:45 PM - 2:40 PM',
  '2:40 PM - 3:35 PM',
  '3:35 PM - 4:30 PM'
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
  SEMESTER_SECTION: 'semesterSection', // New: Semester + Section letter
  ALL: 'all' // View all sessions without filtering
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
