// Custom hook for managing session grid calculation and layout

import { useMemo } from 'react';
import { TIME_SLOTS } from '../constants';

/**
 * Create a map of time slots to indices for quick lookup
 * Handles both 24-hour format (from data) and 12-hour format (for display)
 */
const createSlotIndexMap = (timeSlots) => {
  // Extract start time from 12-hour format and map to 24-hour format
  const timeMap = new Map();
  
  // Map 12-hour display format to 24-hour data format
  const displayTo24Hour = {
    '9:00 AM - 9:55 AM': '09:00',
    '9:55 AM - 10:50 AM': '09:55',
    '11:05 AM - 12:00 PM': '11:05',
    '12:00 PM - 12:55 PM': '12:00',
    '1:45 PM - 2:40 PM': '13:45',
    '2:40 PM - 3:35 PM': '14:40',
    '3:35 PM - 4:30 PM': '15:35'
  };
  
  timeSlots.forEach((slot, i) => {
    const time24 = displayTo24Hour[slot];
    if (time24) {
      timeMap.set(time24, i);
    }
  });
  
  return timeMap;
};

/**
 * Helper to get 24-hour time from slot index
 */
const get24HourTime = (slot) => {
  const displayTo24Hour = {
    '9:00 AM - 9:55 AM': '09:00',
    '9:55 AM - 10:50 AM': '09:55',
    '11:05 AM - 12:00 PM': '11:05',
    '12:00 PM - 12:55 PM': '12:00',
    '1:45 PM - 2:40 PM': '13:45',
    '2:40 PM - 3:35 PM': '14:40',
    '3:35 PM - 4:30 PM': '15:35'
  };
  return displayTo24Hour[slot];
};

/**
 * Calculate session duration in minutes
 * @param {string} startTime - Start time (HH:MM)
 * @param {string} endTime - End time (HH:MM)
 * @returns {number} Duration in minutes
 */
const calculateDuration = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  return (end - start) / (1000 * 60);
};

/**
 * Calculate column span based on session duration
 * @param {number} duration - Duration in minutes
 * @returns {number} Number of columns to span
 */
const calculateColSpan = (duration) => {
  return duration > 60 ? 2 : 1;
};

/**
 * Custom hook for managing session grid data structure
 * Optimizes session placement in the timetable grid
 * @param {Array} sessions - Array of session objects
 * @returns {object} Grid data with sessions organized by day and time
 */
export const useSessionGrid = (sessions) => {
  const slotIndexMap = useMemo(() => createSlotIndexMap(TIME_SLOTS), []);

  const gridData = useMemo(() => {
    if (!Array.isArray(sessions)) {
      return { grid: {}, occupiedSlots: new Set() };
    }

    const grid = {};
    const occupiedSlots = new Set();

    // Process all sessions
    sessions.forEach(session => {
      const day = session.day;
      
      // Initialize day if not exists
      if (!grid[day]) {
        grid[day] = {};
      }

      // Calculate session duration and column span
      const duration = calculateDuration(session.startTime, session.endTime);
      const colSpan = calculateColSpan(duration);

      // Initialize time slot if not exists
      if (!grid[day][session.startTime]) {
        grid[day][session.startTime] = [];
      }

      // Add session to grid with calculated colSpan
      grid[day][session.startTime].push({ ...session, colSpan });
    });

    // Now mark occupied slots - but only for slots that DON'T have sessions starting there
    sessions.forEach(session => {
      const day = session.day;
      const duration = calculateDuration(session.startTime, session.endTime);
      const colSpan = calculateColSpan(duration);

      // Mark next slot as occupied if session spans 2 slots
      // BUT only if there are no sessions starting at that next slot
      if (colSpan === 2) {
        const slotIndex = slotIndexMap.get(session.startTime);
        if (slotIndex !== undefined && slotIndex + 1 < TIME_SLOTS.length) {
          const nextSlotStart = get24HourTime(TIME_SLOTS[slotIndex + 1]);
          // Only mark as occupied if no sessions start at this time
          if (!grid[day]?.[nextSlotStart] || grid[day][nextSlotStart].length === 0) {
            occupiedSlots.add(`${day}-${nextSlotStart}`);
          }
        }
      }
    });

    return { grid, occupiedSlots };
  }, [sessions, slotIndexMap]);

  return gridData;
};
