// Custom hook for managing timetable data and filtering

import { useState, useMemo, useEffect } from 'react';
import { 
  getUniqueValues, 
  getSemesterList,
  getUniqueSections,
  filterSessions 
} from '../utils';
import { VIEW_TYPES, USER_TYPES } from '../constants';

/**
 * Custom hook for managing timetable data, views, and filtering
 * @param {Array} data - Raw timetable data
 * @param {object} currentUser - Current user object with type and section/facultyName
 * @returns {object} Timetable data management object
 */
export const useTimetableData = (data, currentUser) => {
  const [view, setView] = useState({ type: '', value: '', sectionLetter: '' });

  // Memoize list values
  const facultyList = useMemo(() => getUniqueValues(data, 'facultyName'), [data]);
  const sectionList = useMemo(() => getUniqueValues(data, 'studentGroupId'), [data]);
  const semesterList = useMemo(() => getSemesterList(data), [data]);
  const sectionLetterList = useMemo(() => getUniqueSections(data), [data]);

  // Set default view based on user type
  useEffect(() => {
    if (!data || data.length === 0) return;

    if (currentUser?.type === USER_TYPES.STUDENT) {
      // Student: Default to semester view
      const userSession = data.find(s => s.studentGroupId === currentUser.section);
      const sem = userSession ? String(userSession.semester) : semesterList[0];
      
      if (sem && semesterList.includes(sem)) {
        setView({ type: VIEW_TYPES.SEMESTER_SECTION, value: sem, sectionLetter: '' });
        return;
      }
      if (currentUser.section && sectionList.includes(currentUser.section)) {
        setView({ type: VIEW_TYPES.SECTION, value: currentUser.section, sectionLetter: '' });
        return;
      }
    } else if (currentUser?.type === USER_TYPES.STAFF) {
      // Staff: Default to faculty view
      if (currentUser.facultyName && facultyList.includes(currentUser.facultyName)) {
        setView({ type: VIEW_TYPES.FACULTY, value: currentUser.facultyName, sectionLetter: '' });
        return;
      }
    }
    
    // Default: View All
    setView({ type: VIEW_TYPES.ALL, value: 'all', sectionLetter: '' });
  }, [currentUser, facultyList, sectionList, semesterList, data]);

  // Filter sessions based on current view
  const filteredSessions = useMemo(() => {
    if (!data) return [];
    
    // If "all" view is selected, return all data
    if (view.type === VIEW_TYPES.ALL) {
      return data;
    }
    
    if (!view.value) return [];
    
    // For semesterSection view with sectionLetter, filter by both
    // If only semester is selected (no sectionLetter), show all semester sessions
    if (view.type === VIEW_TYPES.SEMESTER_SECTION) {
      if (view.sectionLetter) {
        // Both semester and section selected - apply combined filter
        return filterSessions(data, view.type, view.value, view.sectionLetter);
      } else {
        // Only semester selected - show all semester sessions
        return filterSessions(data, VIEW_TYPES.SEMESTER, view.value);
      }
    }
    
    return filterSessions(data, view.type, view.value);
  }, [data, view]);

  // Handle view change
  const handleViewChange = (type, value, sectionLetter = '') => {
    setView({ type, value, sectionLetter });
  };

  return {
    view,
    setView,
    handleViewChange,
    facultyList,
    sectionList,
    semesterList,
    sectionLetterList,
    filteredSessions
  };
};
