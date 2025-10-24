// Central export point for the timetable feature

// Main component
export { default as Timetable } from './Timetable';

// Page component
export { default as TimetablePage } from './pages/TimetablePage';

// Sub-components
export { default as TimetableGrid } from './components/TimetableGrid';
export { default as SessionModal } from './components/SessionModal';
export { default as SessionCard } from './components/SessionCard';

// Custom hooks
export { useTimetableData, useSessionGrid } from './hooks';

// Constants
export * from './constants';

// Utilities
export * from './utils';
