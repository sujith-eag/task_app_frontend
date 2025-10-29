# Timetable Rendering Architecture

**Version:** 2.0 - Stage 1 Complete  
**Last Updated:** October 30, 2025  
**Status:** ✅ Production Ready

## Overview

This document describes the rendering architecture for the MCA 2025 Timetable system, including the challenges encountered with HTML table colSpan handling and the intelligent rendering strategy implemented to resolve alignment issues.

**Stage 1 Achievement**: Successfully implemented View All mode with intelligent rendering, proper 2-slot session handling, and complete dark mode support with professional UI/UX.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [The colSpan Challenge](#the-colspan-challenge)
3. [Data Structure Analysis](#data-structure-analysis)
4. [Rendering Strategy](#rendering-strategy)
5. [Implementation Details](#implementation-details)
6. [Trade-offs and Design Decisions](#trade-offs-and-design-decisions)
7. [Future Considerations](#future-considerations)

---

## System Architecture

### Component Hierarchy

```
TimetablePage
└── Timetable (View selection & filtering)
    └── TimetableGrid (Main rendering logic)
        ├── TimetableRow (Helper component)
        │   └── SessionCard (Individual session display)
        └── SessionModal (Session details)
```

### Data Flow

1. **Raw Data**: JSON timetable data from `currentTimeTable.json`
2. **Filtering**: `useTimetableData` hook filters by view type (semester, section, faculty, all)
3. **Grid Building**: `useSessionGrid` hook converts sessions to grid structure
4. **Rendering**: `TimetableGrid` renders based on conflict detection

---

## The colSpan Challenge

### Problem Statement

The timetable must support sessions of varying durations:
- **Single-slot sessions**: 55 minutes (e.g., theory classes) → colSpan=1
- **Double-slot sessions**: 110 minutes (e.g., practicals, labs) → colSpan=2

**Challenge**: When different sections have sessions with different durations at the same time slot, HTML table colSpan causes alignment issues.

### Visual Representation of the Problem

#### Scenario: Semester 1, Friday 09:00

**Data**:
```
Section A: CM Tutorial (09:00-10:50, 110min) → colSpan=2
Section B: DS Theory   (09:00-09:55, 55min)  → colSpan=1
Section B: OS Theory   (09:55-10:50, 55min)  → colSpan=1
```

**Attempted Rendering (BROKEN)**:
```
┌─────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│   Day   │ 09:00-   │ 09:55-   │ 11:05-   │ 12:00-   │ 13:45-   │ 14:40-   │ 15:35-   │
│         │ 09:55    │ 10:50    │ 12:00    │ 12:55    │ 14:40    │ 15:35    │ 16:30    │
├─────────┼──────────┴──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Fri     │    CM Tutorial      │    ?     │    ?     │    ?     │    ?     │    ?     │
│         │  (colSpan=2)        │          │          │          │          │          │
└─────────┴─────────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

When CM Tutorial uses colSpan=2, it physically spans two columns. Adding DS and OS theory to the same row causes:
- OS Theory appears in wrong column (shifts right)
- Table alignment breaks across rows
- Sessions become invisible or misplaced

### Root Cause

**Mixed-Duration Conflicts**: When multiple sessions start at the same time but have different durations, they cannot coexist in the same table row with proper colSpan handling.

---

## Data Structure Analysis

### Investigation Results

#### Semester 1 Analysis
```python
Mixed-duration time slots: 6

Examples:
- Fri 09:00: CM tutorial (110min, Sec A) + DS theory (55min, Sec B)
- Thu 11:05: PwP theory (55min, Sec A) + WPL tutorial (110min, Sec B)
- Tue 11:05: PwP practical (110min, Sec A) + OS theory (55min, Sec B)
```

**Pattern**: All conflicts occur between **different sections** (A vs B)

#### Semester 3 Analysis
```python
Mixed-duration time slots: 0

All time slots have uniform durations when multiple sessions exist.
```

**Pattern**: Sem 3 has no mixed-duration conflicts, rendering is straightforward.

### Multi-Section Sessions

**Semester 1**: 1 multi-section session
- `Mon 15:35: Proctor tutorial (sections=['A', 'B'])`

**Semester 3**: 16 multi-section sessions
- Theory classes: NLP, EH, CC, DevOps
- Practical classes: DevOps, EH, CC, GenAI
- Special: Proctor, Placement

**Implication**: Multi-section sessions appear in all relevant section schedules.

---

## Rendering Strategy

### Intelligent Mode Selection

The system dynamically chooses between two rendering modes based on data characteristics:

#### Mode 1: Regular Rendering (Simple)

**Used when**: No mixed-duration conflicts detected

**Characteristics**:
- One row per day
- All sessions for that day rendered together
- Multi-section sessions appear once
- Clean, compact view

**Example**: Semester 3
```
┌─────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│   Mon   │  NLP     │  NLP     │ DevOps   │    -     │    -     │    -     │    -     │
│         │  (A,B)   │  Lab     │  (A,B)   │          │          │          │          │
└─────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

#### Mode 2: Section-Based Rendering (Complex)

**Used when**: Mixed-duration conflicts detected OR View All mode

**Characteristics**:
- Separate row per section per day
- Each section sees complete schedule
- Multi-section sessions appear in all relevant rows
- Prevents colSpan conflicts

**Example**: Semester 1
```
┌─────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│  Mon    │    -     │    -     │    -     │    -     │    -     │    -     │ Proctor  │
│  Sec A  │          │          │          │          │          │          │  (A,B)   │
├─────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│  Mon    │    -     │    -     │    -     │    -     │    -     │    -     │ Proctor  │
│  Sec B  │          │          │          │          │          │          │  (A,B)   │
└─────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

### Conflict Detection Algorithm

```javascript
hasMixedDurationConflicts() {
  // Group all sessions by day and startTime
  const timeSlotGrid = {};
  sessions.forEach(session => {
    const key = `${session.day}-${session.startTime}`;
    timeSlotGrid[key].push(session);
  });
  
  // Check each time slot for duration mismatches
  for (const sessionsInSlot of Object.values(timeSlotGrid)) {
    if (sessionsInSlot.length > 1) {
      const durations = new Set(
        sessionsInSlot.map(s => calculateDuration(s))
      );
      
      if (durations.size > 1) {
        return true; // Mixed durations found
      }
    }
  }
  
  return false; // No conflicts
}
```

---

## Implementation Details

### Grid Building (`useSessionGrid.js`)

**Purpose**: Convert flat session list to 2D grid structure

```javascript
grid = {
  'Mon': {
    '09:00': [session1, session2, ...],
    '11:05': [session3, ...],
    ...
  },
  'Tue': { ... },
  ...
}
```

**Process**:
1. Group sessions by day
2. Group by startTime within each day
3. Calculate colSpan based on duration
4. Track occupied slots for double-slot sessions

### Section-Based Grouping (`TimetableGrid.jsx`)

**When Active**: Mixed-duration conflicts detected

**Process**:
1. Filter sessions by current day
2. Separate single-section from multi-section sessions
3. Group single-section sessions by section
4. Add multi-section sessions to all relevant groups
5. Render separate row for each section

**Code Structure**:
```javascript
Object.entries(sessionsBySemester).forEach(([semester, sessions]) => {
  const daySessionsForSemester = sessions.filter(s => s.day === day);
  
  const singleSectionSessions = daySessionsForSemester.filter(
    s => s.sections.length === 1
  );
  const multiSectionSessions = daySessionsForSemester.filter(
    s => s.sections.length > 1
  );
  
  // Group single-section sessions
  const sectionGroups = singleSectionSessions.reduce((acc, session) => {
    session.sections.forEach(section => {
      acc[`${semester}-${section}`].push(session);
    });
    return acc;
  }, {});
  
  // Add multi-section sessions to all groups
  Object.keys(sectionGroups).forEach(key => {
    sectionGroups[key].push(...multiSectionSessions);
  });
});
```

### Row Rendering (`TimetableRow` Component)

**Key Features**:
- Iterates through TIME_SLOTS array
- Checks if slot is occupied by previous colSpan=2 session
- Renders sessions with appropriate colSpan
- Skips slots that are occupied

**Algorithm**:
```javascript
for (let i = 0; i < TIME_SLOTS.length; i++) {
  const startTime = TIME_SLOTS[i].split('-')[0];
  
  // Skip if occupied by previous spanning session
  if (occupiedSlots.has(`${day}-${startTime}`)) {
    continue;
  }
  
  const sessionsInCell = grid[day]?.[startTime];
  
  if (sessionsInCell && sessionsInCell.length > 0) {
    const hasSpanningSession = sessionsInCell.some(s => s.colSpan === 2);
    
    // Render with appropriate colSpan
    renderCell(sessionsInCell, hasSpanningSession ? 2 : 1);
  } else {
    renderEmptyCell();
  }
}
```

### Session Card Styling

**Multi-Section Sessions**: Visually distinguished to indicate they're common across sections

```javascript
const isCommonSession = session.sections && session.sections.length > 1;

sx={{
  bgcolor: isCommonSession ? 'action.hover' : 'background.paper',
  borderColor: isCommonSession ? 'primary.main' : 'divider',
}}
```

---

## Trade-offs and Design Decisions

### Trade-off 1: Duplication of Multi-Section Sessions

**Decision**: Show multi-section sessions in all relevant section rows

**Rationale**:
- Each section needs to see their **complete schedule**
- Students shouldn't have to cross-reference multiple views
- Visual distinction (blue border) makes duplication obvious

**Alternative Considered**: Separate "Common Classes" row
- Rejected: Would complicate layout and user mental model

### Trade-off 2: Section-Based Rows Only When Necessary

**Decision**: Use section-based rendering only when conflicts exist

**Rationale**:
- Sem 3 has no conflicts → simple view is cleaner
- Sem 1 has conflicts → section-based view necessary
- Automatic detection eliminates manual configuration

**Alternative Considered**: Always use section-based rendering
- Rejected: Unnecessary duplication in Sem 3, poor UX

### Trade-off 3: Day Label Format

**Decision**: 
- Simple view: `Mon`, `Tue`, etc.
- Section view: Two-line format
  ```
  Mon
  Sec A
  ```

**Rationale**:
- Clear visual hierarchy
- Day is most prominent (primary information)
- Section is secondary context
- Compact, scannable

**Alternative Considered**: `Mon (Sem 1 - Sec A)` or `S1-A Mon`
- Rejected: Too verbose, harder to scan

---

## Future Considerations

### Potential Enhancements

1. **Print View Optimization**
   - Separate print stylesheet for section-based view
   - Page breaks between days
   - Minimize duplication for printing

2. **Section Toggle**
   - In section-based view, allow hiding specific sections
   - Useful for faculty who only teach one section
   - Toggle button: "Show All Sections" / "Show Section A Only"

3. **Conflict Resolution Hints**
   - When conflict detected, show info message
   - "Showing separate rows per section due to scheduling conflicts"
   - Help users understand why layout changed

4. **Performance Optimization**
   - Memoize conflict detection per semester
   - Cache grid calculations
   - Virtual scrolling for very large timetables

5. **Mobile View Enhancement**
   - Horizontal scroll with sticky day column
   - Swipe between days
   - Collapsed view showing only current day

### Known Limitations

1. **Three or More Sections**
   - Current implementation assumes 2 sections (A, B)
   - Would scale automatically but needs testing

2. **Complex Duration Patterns**
   - Algorithm detects mixed durations
   - Doesn't optimize for partially overlapping sessions
   - Edge case: Session A (09:00-10:30), Session B (09:00-09:55)

3. **View All Mode**
   - Always uses section-based rendering
   - Could be optimized to merge sections when no conflicts exist

---

## Testing Checklist

### Functional Tests

- [x] Sem 1 renders with section-based rows
- [x] Sem 3 renders with simple rows
- [x] View All mode shows all semesters
- [x] 2-slot sessions span correctly
- [x] Single-slot sessions align properly
- [x] Multi-section sessions appear in all relevant rows
- [x] Multi-section sessions have visual distinction
- [x] No sessions disappear
- [x] No sessions appear in wrong time slots
- [x] Empty slots render correctly
- [x] Modal opens for all session types

### Edge Cases

- [x] Session spanning last time slot (15:35-16:30)
- [x] Multiple sessions in same cell (stacked vertically)
- [x] All sessions on one day are multi-section
- [x] Day with no sessions
- [x] Switching between view types
- [x] Filtering by section when in section-based view

### Visual Tests

- [x] Table alignment consistent across all rows
- [x] Day labels readable on mobile
- [x] Section labels don't wrap
- [x] Session cards fit in cells
- [x] Hover effects work correctly
- [x] Color coding for session types visible
- [x] Multi-section border visible

---

## Performance Characteristics

### Time Complexity

- **Conflict Detection**: O(n) where n = number of sessions
- **Grid Building**: O(n) per section
- **Rendering**: O(d × t × s) where:
  - d = days (5-6)
  - t = time slots (7)
  - s = sections shown (1-4)

### Space Complexity

- **Grid Storage**: O(n) - each session stored once in grid
- **Section Grouping**: O(n × s) - sessions duplicated per section in worst case

### Optimization Notes

- `useMemo` used for expensive calculations
- Conflict detection runs only on data change
- Grid building happens once per render
- React reconciliation handles row updates efficiently

---

## Conclusion

The intelligent rendering strategy successfully handles the complex requirements of the timetable system:

1. **Automatic conflict detection** ensures optimal rendering mode
2. **Section-based separation** resolves colSpan alignment issues
3. **Visual distinction** for multi-section sessions maintains clarity
4. **Performance** remains optimal even with complex data

This architecture provides a robust foundation for future enhancements while maintaining excellent user experience across different semester configurations.

---

## Stage 1 Completion Summary

### Achievements

**✅ Core Functionality:**
- View All mode with intelligent semester-based rendering
- Progressive semester + section filtering
- Faculty-based timetable view
- 2-slot session handling with proper colSpan logic
- Mixed-duration conflict detection and resolution
- Multi-section visual indicators (blue border, bold text, subtle background)

**✅ UI/UX Excellence:**
- Professional dark mode support throughout
- 12-hour time format (AM/PM)
- Gradient title with theme-aware colors
- Enhanced filter section with proper contrast
- Redesigned class type legend with hover effects
- Improved helper text with background accent
- Custom scrollbar styling
- Better spacing and visual hierarchy

**✅ Technical Quality:**
- Comprehensive documentation
- Intelligent rendering algorithm
- Section-based row grouping when needed
- Theme-aware rgba color values
- Proper time conversion (12h display, 24h data)
- Responsive design for all screen sizes

### Next Phase: Stage 2

Future enhancements to consider:
1. Export functionality (PDF, iCal)
2. Print optimization
3. Conflict detection and highlighting
4. Comparison mode (multiple sections)
5. Auto-selection based on user profile
6. Calendar integration
7. Search and filter enhancements

---

## References

- **Component Files**: `src/features/timetable/components/TimetableGrid.jsx`
- **Hook Files**: `src/features/timetable/hooks/useSessionGrid.js`, `useTimetableData.js`
- **Data File**: `src/features/timetable/data/currentTimeTable.json`
- **Constants**: `src/features/timetable/constants/timetableConfig.js`
- **Documentation**: `README.md`, `SEMESTER_SECTION_FILTER.md`

---

**Document Version**: 2.0 - Stage 1 Complete  
**Last Updated**: October 30, 2025  
**Status**: ✅ Production Ready  
**Next Review**: Stage 2 Planning

