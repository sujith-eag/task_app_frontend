# Timetable Feature - Architecture Documentation

**Version:** 2.0 - Stage 1 Complete  
**Last Updated:** October 30, 2025  
**Status:** ✅ Production Ready

---

## 🎉 Stage 1 Completion Summary

Stage 1 of the timetable design is now complete with the following achievements:

### **Core Features Implemented:**
- ✅ View All mode showing multiple semesters simultaneously
- ✅ Progressive semester + section filtering
- ✅ Faculty-based timetable view
- ✅ Intelligent rendering for 2-slot sessions (labs/practicals)
- ✅ Mixed-duration conflict resolution with section-based rows
- ✅ Visual indicators for multi-section (common) sessions
- ✅ 12-hour time format (AM/PM)
- ✅ Professional dark mode support throughout
- ✅ Responsive design for mobile and desktop

### **UI/UX Enhancements:**
- ✅ Gradient title with theme-aware colors
- ✅ Enhanced filter section with proper dark mode contrast
- ✅ Redesigned class type legend with hover effects
- ✅ Improved helper text with background accent
- ✅ Professional empty state messaging
- ✅ Custom scrollbar styling (theme-aware)
- ✅ Thicker colored bars for long sessions
- ✅ Integrated modal header with connected accent bar
- ✅ Better spacing and visual hierarchy
- ✅ Smooth transitions and hover effects

### **Technical Improvements:**
- ✅ Comprehensive documentation (RENDERING_ARCHITECTURE.md, SEMESTER_SECTION_FILTER.md)
- ✅ Intelligent conflict detection algorithm
- ✅ Section-based row grouping when needed
- ✅ Conditional rendering based on data analysis
- ✅ Proper 12-hour to 24-hour time conversion
- ✅ Theme-aware rgba color values

---

## 📁 File Structure

```
timetable/
├── index.js                    # Public API exports
├── Timetable.jsx              # Main container component with filters and legend
├── pages/
│   └── TimetablePage.jsx      # Page wrapper with data loading
├── components/
│   ├── TimetableGrid.jsx      # Grid container with TimetableRow component
│   ├── SessionCard.jsx        # Individual session card component
│   └── SessionModal.jsx       # Session details modal
├── hooks/
│   ├── index.js               # Hook exports
│   ├── useTimetableData.js    # Data filtering and view management
│   └── useSessionGrid.js      # Grid calculation logic with colSpan support
├── utils/
│   ├── index.js               # Utility exports
│   ├── timetableHelpers.js    # General helper functions
│   ├── sessionFilters.js      # Session filtering utilities
│   └── dataValidation.js      # Data validation utilities
├── constants/
│   ├── index.js               # Constants exports
│   ├── timetableConfig.js     # Configuration constants (includes VIEW_TYPES.ALL)
│   └── componentColors.js     # Color theming
└── data/
    ├── sampleTimetable.json   # Old format sample data
    └── currentTimeTable.json  # Current active timetable data
```

---

## 🎯 Component Architecture

### **1. TimetablePage** (Entry Point)
**Purpose:** Page-level component that handles data loading

**Responsibilities:**
- Load timetable data from JSON file
- Pass data to Timetable component
- Simple, streamlined wrapper component

**Key Features:**
- Direct JSON import (currentTimeTable.json)
- No loading states or user context (handled by Timetable)
- Clean, minimal implementation

---

### **2. Timetable** (Controller)
**Purpose:** Main controller component for timetable display and interaction

**Responsibilities:**
- Manage view state (ALL/SEMESTER_SECTION/FACULTY)
- Filter sessions based on selected view
- Display view selection dropdowns
- Show color legend
- Handle modal open/close

**Uses:**
- `useTimetableData` hook for data management
- `TimetableGrid` component for display
- `SessionModal` component for details

**Key Features:**
- Four view modes: View All, Semester (with optional Section filter), Faculty
- Integrated "View All" option in semester dropdown (not separate)
- Progressive disclosure: Section filter only enabled when semester selected
- Responsive filter dropdowns with proper validation
- No empty/placeholder options in dropdowns

**Recent Changes:**
- Added "View All" option (Semester 1 & 3) with ViewWeekIcon
- Integrated View All into semester dropdown (removed separate dropdown)
- Removed Student Group dropdown (redundant with Section filter)
- Section filter now properly disabled when View All selected
- Updated display format to show shortCode(facultyId)-subjectCode

---

### **3. TimetableGrid** (Display)
**Purpose:** Renders the timetable grid with sessions using advanced layout logic

**Responsibilities:**
- Calculate grid layout from sessions
- Render table structure (headers, days, time slots)
- Display session cards in correct cells
- Handle multi-slot sessions (colSpan=2 for labs/practicals)
- Support separate rows per semester in View All mode

**Uses:**
- `useSessionGrid` hook for grid calculation
- `TimetableRow` helper component for row rendering
- `SessionCard` component for each session
- Constants for DAYS and TIME_SLOTS

**Architecture:**
```jsx
TimetableGrid
  ├── isViewAll check
  ├── sessionsBySemester (groups by semester in View All mode)
  ├── semesterGrids (pre-computed grids for each semester)
  └── TimetableRow (helper component, renders individual rows)
```

**Key Features:**
- **View All Mode**: Renders separate rows for each semester per day
  - Example: Mon (Sem 1), Mon (Sem 3), Tue (Sem 1), Tue (Sem 3), etc.
  - Avoids complex logic of rendering multiple semesters in one cell
  - Each semester's sessions render independently with proper colSpan
- **Sticky header** for better scrolling experience
- **Fixed table layout** for consistent column widths
- **Smart colSpan logic**: Only spans 2 columns when next slot is empty
- **Occupied slots tracking**: Prevents rendering gaps for 2-slot sessions
- **renderedSlots Set**: Tracks which time slots have been rendered to avoid duplicates
- **Responsive design**: Adjusts widths and padding for mobile/desktop
- Error boundary with fallback UI

**Recent Changes:**
- Implemented separate-row-per-semester approach for View All mode
- Pre-compute all semester grids using useMemo (avoids calling hooks in loops)
- Added TimetableRow helper component to encapsulate row rendering logic
- Fixed React Hooks violation by moving grid calculations to top-level useMemo
- Improved colSpan logic: only span 2 columns if next time slot has no sessions
- Added renderedSlots Set to prevent duplicate cell rendering
- Updated day column width for semester labels (80px mobile, 120px desktop)
- Vertical alignment changed to 'top' for better multi-session cell display
- Cell height set to 'auto' to accommodate variable number of sessions

---

### **4. SessionCard** (Presentation)
**Purpose:** Individual session card display with responsive design

**Responsibilities:**
- Display session information with shortCode(facultyId)-subjectCode format
- Show room number and sections
- Colored bar for session type
- Hover effects and click handling

**Key Features:**
- **Display Format**: `SE(KR)-24MCA31` showing shortCode(facultyId)-subjectCode
- Component type color coding (Theory, Lab, Tutorial, etc.)
- Sections display with comma separation (A, B format)
- Smooth hover animation with scale transform
- Responsive font sizes (xs: 0.7rem, md: 0.85rem)
- Click handler for opening session details modal

**Recent Changes:**
- Updated display format to prominently show shortCode first
- Added facultyId in parentheses after shortCode
- Improved responsive padding and font sizes
- Enhanced hover effects for better UX

---

### **5. SessionModal** (Detail View)
**Purpose:** Detailed session information modal with optimized performance

**Responsibilities:**
- Show complete session details with shortCode in header
- Display supporting staff with correct property names
- Formatted sections list
- Color-coded header by component type

**Key Features:**
- **Performance Optimization**: Dialog stays mounted, visibility controlled by `open` prop
- Faster transition (300ms instead of default)
- Updated to use `slotProps` API (not deprecated TransitionProps/PaperProps)
- Full session information with icon-based display
- **Supporting Staff Display**: Fixed to use `staff.name` property correctly
- Sections array support with proper formatting
- Responsive dialog sizing

**Recent Changes:**
- Fixed modal opening delay (300-500ms) by keeping Dialog mounted
- Updated from deprecated `TransitionProps`/`PaperProps` to `slotProps` API
- Fixed supporting staff display bug (staff.staffName → staff.name)
- Added shortCode to modal header
- Reduced transition duration for snappier UX

---

## 🎣 Custom Hooks

### **useTimetableData**
**Purpose:** Manage timetable data filtering and view state

**Inputs:**
- `data`: Array of session objects
- `currentUser`: User object with type and preferences (optional)

**Outputs:**
- `view`: Current view state object `{ type, value, sectionLetter }`
- `setView`: Direct state setter
- `handleViewChange`: Function to change view (type, value, sectionLetter)
- `facultyList`: List of unique faculties
- `sectionList`: List of unique student groups
- `semesterList`: List of unique semesters
- `sectionLetterList`: List of unique section letters (A, B, etc.)
- `filteredSessions`: Filtered sessions based on current view

**View Types:**
- `VIEW_TYPES.ALL`: Show all sessions without filtering (default)
- `VIEW_TYPES.SEMESTER_SECTION`: Filter by semester, optionally by section
- `VIEW_TYPES.SEMESTER`: Filter by semester only
- `VIEW_TYPES.FACULTY`: Filter by faculty name

**Features:**
- Automatic default view: VIEW_TYPES.ALL
- Progressive filtering: semester first, then optional section
- Memoized list calculations for performance
- Efficient session filtering with proper section array support

**Recent Changes:**
- Added VIEW_TYPES.ALL support (returns all data without filtering)
- Changed default view from empty state to ALL
- Improved section filtering to handle both section arrays and single section
- Fixed filtering logic to properly handle SEMESTER_SECTION view with optional sectionLetter

---

### **useSessionGrid**
**Purpose:** Calculate grid layout for timetable with colSpan support

**Inputs:**
- `sessions`: Array of session objects

**Outputs:**
- `grid`: Object structure `{ [day]: { [startTime]: [session, session, ...] } }`
- `occupiedSlots`: Set of strings like "Mon-09:55" for slots occupied by 2-slot sessions

**Grid Calculation Logic:**
1. **Build grid**: Group sessions by day and startTime
2. **Calculate colSpan**: Based on session duration (>60 mins = colSpan 2)
3. **Mark occupied slots**: Track which slots are occupied by spanning sessions
4. **Smart occupation logic**: Only mark slot as occupied if no sessions start there

**Features:**
- Automatic colSpan calculation (duration > 60 minutes → colSpan = 2)
- Occupied slots tracking (prevents gaps in rendering)
- Two-pass algorithm:
  - First pass: Build grid and add all sessions
  - Second pass: Mark occupied slots only where no sessions start
- Optimized with useMemo for performance

**Helper Functions:**
- `createSlotIndexMap`: Creates time slot lookup map
- `calculateDuration`: Computes session duration in minutes
- `calculateColSpan`: Determines column span based on duration

**Recent Changes:**
- Split occupied slot marking into separate pass after grid building
- Only mark slots as occupied if no sessions start at that time
- This allows sessions at 09:55 and 12:00 to render even when previous sessions span 2 slots

---

## 🛠️ Utility Functions

### **timetableHelpers.js**
- `getUniqueValues`: Extract unique values from array
- `getSemesterList`: Get all semesters from data
- `getUniqueSections`: Get all individual sections
- `sessionMatchesSection`: Check section match (array/string)
- `formatSections`: Format sections for display
- `hasSections`: Check if sections data exists

### **sessionFilters.js**
- `filterByFaculty`: Filter sessions by faculty
- `filterBySection`: Filter sessions by section (array support)
- `filterBySemester`: Filter sessions by semester
- `filterSessions`: Generic filter function

### **dataValidation.js**
- `validateTimetableData`: Validate data structure
- `isValidSession`: Check session validity
- `sanitizeTimetableData`: Normalize data format

---

## 📦 Constants

### **timetableConfig.js**
- `DAYS`: Array of weekdays ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
- `TIME_SLOTS`: Array of time slot strings (7 slots: 09:00-09:55, 09:55-10:50, 11:05-12:00, 12:00-12:55, 13:45-14:40, 14:40-15:35, 15:35-16:30)
- `USER_TYPES`: User type constants (STUDENT, STAFF, ADMIN)
- `VIEW_TYPES`: View type constants
  - `ALL`: Show all sessions without filtering (added in latest update)
  - `SEMESTER_SECTION`: Filter by semester with optional section
  - `SEMESTER`: Filter by semester only
  - `SECTION`: Filter by section
  - `FACULTY`: Filter by faculty name
- `COMPONENT_TYPES`: Session component types (THEORY, LAB, TUTORIAL, SEMINAR, PROJECT)
- `UI_CONFIG`: UI configuration values
  - Table dimensions and padding
  - Transition speeds
  - Breakpoints

### **componentColors.js**
- `componentColors`: Color mapping for session types
  - Theory: Blue shades
  - Lab: Green shades
  - Tutorial: Purple shades
  - Seminar: Orange shades
  - Project: Red shades
- `getComponentColor`: Get color config for component type

---

## 🔄 Data Flow

```
TimetablePage
    ↓ (loads currentTimeTable.json)
Timetable
    ↓ (uses useTimetableData hook)
    ├── View Selection Dropdowns
    │   ├── Semester dropdown (includes "View All" option)
    │   ├── Section filter (progressive, enabled when semester selected)
    │   └── Faculty dropdown (alternative view)
    │
    └── TimetableGrid
            ↓ (checks isViewAll mode)
            │
            ├── View All Mode (isViewAll = true)
            │   ├── sessionsBySemester (groups sessions by semester)
            │   ├── semesterGrids (pre-computed grids via useMemo)
            │   └── Renders separate TimetableRow for each semester per day
            │       └── Mon (Sem 1), Mon (Sem 3), Tue (Sem 1), etc.
            │
            └── Single View Mode (isViewAll = false)
                ├── useSessionGrid (calculates grid from filtered sessions)
                └── Renders one TimetableRow per day
                    └── Mon, Tue, Wed, etc.

TimetableRow (helper component)
    ↓ (for-loop through TIME_SLOTS)
    ├── Checks renderedSlots Set (avoid duplicates)
    ├── Checks occupiedSlots Set (skip gaps from 2-slot sessions)
    ├── Calculates cellColSpan (1 or 2 based on hasSpanningSession)
    └── Renders TableCell with SessionCard(s)
            ↓ (click handler)
        SessionModal (shows detailed information)
```

**Key Flow Details:**
- **View All Mode**: Each semester gets its own grid calculation and row rendering
- **Single View Mode**: One grid for all filtered sessions
- **TimetableRow**: Handles complex colSpan logic and slot tracking
- **renderedSlots Set**: Prevents rendering cells that were already covered by colSpan=2
- **occupiedSlots Set**: Marks slots occupied by 2-slot sessions (but allows sessions starting there)

---

## 📊 Data Format Support

### **Current Format (Primary)**
```json
{
  "sessionId": "SES001",
  "day": "Mon",
  "slotId": "SLOT1",
  "startTime": "09:00",
  "endTime": "10:50",
  "roomId": "LAB101",
  "subjectCode": "24MCA31",
  "subjectTitle": "Database Systems Lab",
  "shortCode": "DSL",
  "facultyId": "KR",
  "facultyName": "Krishna",
  "componentType": "LAB",
  "semester": 3,
  "sections": ["A", "B"],
  "supportingStaff": [
    { "id": "SS01", "name": "Support Staff 1" }
  ]
}
```

### **Key Fields:**
- **sessionId**: Unique session identifier
- **day**: Day of week (Mon-Sat)
- **startTime/endTime**: Time in HH:MM format
- **shortCode**: Subject abbreviation (displayed first in cards)
- **facultyId**: Faculty initials/code
- **sections**: Array of section letters (e.g., ["A", "B"])
- **supportingStaff**: Array of objects with `id` and `name` properties
- **componentType**: LAB, THEORY, TUTORIAL, etc.

### **Display Format:**
- **SessionCard**: `shortCode(facultyId)-subjectCode` → `DSL(KR)-24MCA31`
- **SessionModal**: Full details with shortCode in header
- **Supporting Staff**: Uses `staff.name` property

### **Backward Compatibility:**
- All utilities check for both `sections` array and legacy `section` string
- Graceful handling of missing fields with fallbacks

---

## 🎨 Styling Approach

- **Material-UI (MUI)**: Primary UI library
- **sx prop**: Inline styles with theme support
- **Component-level**: Styles defined in components
- **Constants**: UI values in `UI_CONFIG`
- **Theming**: Colors from `componentColors`

---

## ✅ Benefits of Current Architecture

### **1. Maintainability**
- Clear separation of concerns (components, hooks, utils)
- Easy to locate and modify specific functionality
- Self-documenting structure with helper components
- Well-organized file structure

### **2. Reusability**
- Hooks (useTimetableData, useSessionGrid) can be used in other features
- Utilities are generic and testable
- Constants prevent magic values and enable easy configuration
- Helper components (TimetableRow) encapsulate complex logic

### **3. Scalability**
- Easy to add new view types (just add to VIEW_TYPES constant)
- Simple to extend filtering logic in sessionFilters.js
- Modular components allow independent feature additions
- Separate-row approach for View All scales to any number of semesters

### **4. Testability**
- Utilities are pure functions (easy unit testing)
- Hooks can be tested independently with React Testing Library
- Components are focused with clear responsibilities
- Helper functions isolated for individual testing

### **5. Performance**
- Memoized calculations (useMemo in hooks)
- Optimized re-renders (proper dependency arrays)
- Efficient filtering with early returns
- Pre-computed grids for View All mode (avoids hooks in loops)
- Dialog stays mounted (eliminates re-mount delay)

### **6. User Experience**
- Fast modal opening (300ms, stays mounted)
- Smooth animations and transitions
- Responsive design (mobile and desktop optimized)
- Clear visual hierarchy with color coding
- Intuitive view selection with progressive disclosure

---

## 🚀 Usage Example

```jsx
import { TimetablePage } from '@/features/timetable';

// Basic usage (loads currentTimeTable.json automatically)
<TimetablePage />

// Or use Timetable component directly with custom data
import { Timetable } from '@/features/timetable';

<Timetable 
  data={customTimetableData} 
  currentUser={{ type: 'student', section: 'MCA_SEM3_A' }}
/>

// View All mode is default, users can switch views via dropdowns
```

## 🔍 Technical Deep Dive

### **View All Mode Implementation**

**Problem:** Rendering sessions from multiple semesters in a single cell led to:
- Complex colSpan calculations
- Column misalignment issues
- Sessions appearing in wrong time slots
- Difficulty handling 2-slot sessions (labs) with other sessions at 09:55, 12:00

**Solution:** Separate-row-per-semester approach
```jsx
// In View All mode, render like this:
Mon (Sem 1)  [sessions for Sem 1 only]
Mon (Sem 3)  [sessions for Sem 3 only]
Tue (Sem 1)  [sessions for Sem 1 only]
Tue (Sem 3)  [sessions for Sem 3 only]
```

**Benefits:**
- Each row has simpler rendering logic (single semester)
- colSpan works correctly (no cross-semester conflicts)
- Easy to understand and maintain
- Scales to any number of semesters

### **ColSpan Calculation Logic**

**Rules:**
1. Session duration > 60 minutes → colSpan = 2
2. Check if next time slot has sessions
3. Only apply colSpan=2 if next slot is EMPTY
4. If next slot has sessions → colSpan = 1 (they render in their own column)

**Example:**
```
09:00-10:50 (110 min) DSL Lab
  - colSpan should be 2
  - BUT if there are sessions at 09:55
  - Then colSpan = 1 (so 09:55 sessions can render)
```

### **Occupied Slots Tracking**

**Two-pass algorithm in useSessionGrid:**

Pass 1: Build grid
```javascript
sessions.forEach(session => {
  grid[day][startTime].push({ ...session, colSpan });
});
```

Pass 2: Mark occupied slots (only where NO sessions start)
```javascript
sessions.forEach(session => {
  if (colSpan === 2) {
    const nextSlot = TIME_SLOTS[index + 1];
    // Only mark if nextSlot has NO sessions starting there
    if (!grid[day][nextSlot] || grid[day][nextSlot].length === 0) {
      occupiedSlots.add(`${day}-${nextSlot}`);
    }
  }
});
```

**Why two passes?**
- Allows sessions at 09:55 to render even when 09:00 session spans 2 slots
- Prevents gaps in the grid
- Maintains visual continuity for truly spanning sessions

### **React Hooks Rules Compliance**

**Problem:** Initially called `useSessionGrid` inside map loop (Hooks violation)

**Solution:** Pre-compute all grids in top-level useMemo
```javascript
const semesterGrids = useMemo(() => {
  const grids = {};
  Object.keys(sessionsBySemester).forEach(key => {
    // Manually calculate grid (not using hook)
    grids[key] = { grid: semGrid, occupiedSlots };
  });
  return grids;
}, [sessionsBySemester]);
```

Then access in render:
```javascript
const { grid, occupiedSlots } = semesterGrids[semester];
```

---

## 🔧 Future Enhancements

### **High Priority:**
1. **Section Ordering Standardization**: Ensure consistent A-before-B ordering in View All mode
2. **TypeScript Migration**: Add type safety for better development experience
3. **API Integration**: Replace JSON import with real-time API calls
4. **Loading States**: Add skeleton loaders and error boundaries
5. **Conflict Detection**: Highlight scheduling conflicts across sessions

### **Medium Priority:**
6. **Print Functionality**: Generate printable timetable views
7. **Export Options**: PDF, iCal, or CSV export
8. **Dark Mode Support**: Theme-aware color schemes
9. **Filter Combinations**: Allow multiple filter criteria simultaneously
10. **Search Functionality**: Quick search by faculty, room, or subject

### **Low Priority:**
11. **Virtual Scrolling**: For large datasets (100+ sessions)
12. **Mobile Card View**: Alternative view optimized for mobile devices
13. **Drag-and-Drop**: Admin feature for timetable editing
14. **Real-time Updates**: WebSocket integration for live changes
15. **Accessibility Improvements**: ARIA labels, keyboard navigation
16. **Analytics Dashboard**: Usage statistics and popular time slots
17. **Notifications**: Alerts for upcoming classes or changes
18. **Favorites**: Save frequently viewed timetables

### **Technical Debt:**
19. Add comprehensive unit tests for all utilities
20. Add integration tests for component interactions
21. Performance profiling and optimization
22. Code splitting for faster initial load

---

## 📝 Development Guidelines

### **When adding features:**
1. Add new constants to `constants/timetableConfig.js`
2. Add utility functions to appropriate file in `utils/`
3. Create reusable hooks in `hooks/` for shared logic
4. Keep components focused and single-purpose
5. Export all public APIs from index.js files
6. Maintain backward compatibility with data formats
7. Add proper PropTypes or TypeScript definitions
8. Document complex logic with inline comments

### **When modifying existing code:**
1. Test impact on all view types (ALL, SEMESTER_SECTION, FACULTY)
2. Verify both data formats still work (sections array and legacy section string)
3. Check filtering logic across all VIEW_TYPES
4. Test mobile responsiveness (xs, md breakpoints)
5. Verify modal performance (should open within 300ms)
6. Update README.md with significant changes
7. Run linter and fix warnings
8. Test with real data (currentTimeTable.json)

### **Code Style:**
- Use functional components with hooks
- Prefer `useMemo` and `useCallback` for performance
- Use MUI's `sx` prop for styling (not styled-components)
- Keep component files under 300 lines (extract helpers if larger)
- Use descriptive variable names (e.g., `hasSpanningSession` not `flag`)
- Add comments for complex algorithms (e.g., colSpan calculation)

### **Performance Considerations:**
- Always use `useMemo` for expensive calculations
- Avoid calling hooks inside loops (pre-compute instead)
- Use `React.memo` for components that render frequently
- Keep dependency arrays minimal and correct
- Avoid inline object/array creation in render

### **Testing Strategy:**
- Unit test all utility functions in `utils/`
- Test hooks with `@testing-library/react-hooks`
- Integration test user flows (select view → see filtered data)
- Visual regression testing for responsive layouts
- Test edge cases (empty data, single session, 100+ sessions)

---

## 🐛 Common Issues & Solutions

### **Issue: Sessions not showing**
**Symptoms:** Empty grid or missing sessions
**Solutions:**
- Check data format (sections array vs section string)
- Verify view filtering logic in useTimetableData
- Check console for errors or validation warnings
- Ensure VIEW_TYPES.ALL is properly handling all sessions

### **Issue: Modal opening is slow**
**Solution:** Modal now stays mounted with `keepMounted`, visibility controlled by `open` prop (300ms transition)

### **Issue: Supporting staff not displaying**
**Solution:** Fixed to use `staff.name` instead of `staff.staffName`

### **Issue: Lab sessions not spanning 2 columns**
**Symptoms:** 2-hour sessions appear in single column
**Solutions:**
- Check session duration calculation in useSessionGrid
- Verify endTime - startTime > 60 minutes
- Check if next slot has sessions (colSpan only applied if next slot empty)

### **Issue: Sessions appearing in wrong columns**
**Symptoms:** Sessions visually offset by 1-2 columns
**Solution:** Fixed by using renderedSlots Set to skip iterations when colSpan=2

### **Issue: Duplicate sessions in View All mode**
**Symptoms:** Same session appears multiple times
**Solution:** Each semester now gets separate grid calculation in View All mode

### **Issue: Section order inconsistent (A/B switching)**
**Status:** Known issue - sections may appear in different order depending on data
**Workaround:** Currently accepted behavior, can be standardized if needed

### **Issue: Hover effect broken**
**Solutions:**
- Verify UI_CONFIG values in constants
- Check TableContainer overflow settings
- Ensure proper z-index stacking context

### **Issue: Wrong sessions in view**
**Solutions:**
- Check filter logic in sessionFilters.js
- Verify view.value matches data structure
- Check studentGroupId vs sections matching in filters

---

## 📋 Recent Updates & Bug Fixes

### **Version 2.0 - Stage 1 Complete (October 30, 2025)**

**🎨 UI/UX Overhaul:**
- ✅ Professional dark mode support across all components
- ✅ Gradient title with theme-aware colors (light/dark variants)
- ✅ Enhanced filter section with proper dark mode contrast
- ✅ Redesigned class type legend with hover effects and container
- ✅ Improved helper text with background accent and border
- ✅ Professional empty state with styled container
- ✅ Custom scrollbar styling (theme-aware rgba values)
- ✅ Better spacing, borders, and visual hierarchy
- ✅ Smooth transitions and hover effects throughout

**⏰ Time Format Enhancement:**
- ✅ Changed from 24-hour to 12-hour format (AM/PM)
- ✅ Helper functions for time conversion (display vs data format)
- ✅ Updated TIME_SLOTS constant to user-friendly format
- ✅ Maintained backward compatibility with 24-hour data

**📊 Grid & Layout Improvements:**
- ✅ Fixed time slot wrapping on all screen sizes (nowrap)
- ✅ Better responsive font sizes for mobile
- ✅ Alternating row colors work properly in dark mode
- ✅ Improved table container with rounded corners and shadows

**🎴 SessionCard Enhancements:**
- ✅ Theme-aware background colors for common sessions
- ✅ Thicker colored bar for long sessions (8px vs 6px)
- ✅ Better hover states for both light/dark modes
- ✅ Removed duration badge (to prevent overlap)

**🔲 SessionModal Improvements:**
- ✅ Integrated accent bar into header (connected, not detached)
- ✅ Proper dark mode background inheritance
- ✅ Cleaner, more cohesive design

**📝 Label Format:**
- ✅ Changed from "S1 Sec A" to "Sem 1-A" for clarity
- ✅ Consistent format across grid and helper text
- ✅ Professional appearance without emojis in helper text

### **Version 2.1.0 (October 29, 2025)**

**Major Features:**
- ✅ Added View All mode (displays all semesters together)
- ✅ Separate-row-per-semester rendering approach
- ✅ Improved colSpan logic for 2-slot sessions
- ✅ Pre-computed semester grids (React Hooks compliance)
- ✅ Intelligent rendering with mixed-duration conflict detection
- ✅ Section-based row grouping when conflicts exist
- ✅ Visual indicators for multi-section sessions (blue border, bold text)

**UI/UX Improvements:**
- ✅ Modal opening performance (300ms, stays mounted)
- ✅ Updated display format: shortCode(facultyId)-subjectCode
- ✅ Removed redundant dropdowns (Student Group, Select Timetable)
- ✅ Progressive section filter (enabled only when semester selected)
- ✅ Integrated View All into semester dropdown
- ✅ Added icons to filter section headers (SchoolIcon, SupportAgentIcon)

**Bug Fixes:**
- ✅ Fixed modal delay (300-500ms → 300ms)
- ✅ Fixed supporting staff display (staff.staffName → staff.name)
- ✅ Fixed column width mismatches (tableLayout: 'fixed')
- ✅ Fixed sessions appearing in wrong columns (renderedSlots Set)
- ✅ Fixed React Hooks violation (pre-compute grids with useMemo)
- ✅ Fixed occupied slots logic (two-pass algorithm)
- ✅ Fixed dropdown validation (removed empty options)
- ✅ Updated deprecated MUI props (TransitionProps → slotProps)
- ✅ Fixed Sem 1 rendering issues (mixed-duration conflicts resolved)

**Technical Improvements:**
- ✅ Extracted TimetableRow helper component
- ✅ Smart colSpan calculation (checks if next slot has sessions)
- ✅ renderedSlots Set for duplicate prevention
- ✅ occupiedSlots Set for gap prevention
- ✅ Responsive design enhancements (xs/md breakpoints)
- ✅ Comprehensive documentation (RENDERING_ARCHITECTURE.md, SEMESTER_SECTION_FILTER.md)

**Known Behavior:**
- ℹ️ Section ordering may vary (A/B position not standardized) - Accepted behavior
- ℹ️ Sem 1 uses section-based rows (due to mixed-duration conflicts)
- ℹ️ Sem 3 uses regular rows (no conflicts, cleaner view)

---

## 🚀 Next Steps (Stage 2)

Potential future enhancements for Stage 2:
1. **Export functionality** - Download timetable as PDF or iCal
2. **Print optimization** - Printer-friendly layout
3. **Conflict detection** - Highlight scheduling conflicts
4. **Comparison mode** - View multiple sections side-by-side
5. **Auto-selection** - Set semester+section based on user profile
6. **Favorites** - Save preferred filter combinations
7. **Time filters** - Show only morning/afternoon classes
8. **Day filters** - Show specific days only
9. **Search functionality** - Find sessions by subject, faculty, or room
10. **Calendar integration** - Export to Google Calendar, Outlook, etc.
- ⚠️ Section ordering may vary (A/B position not standardized) - Accepted behavior

---

## �📚 Related Documentation

- [MUI Table Documentation](https://mui.com/material-ui/react-table/)
- [MUI Dialog API](https://mui.com/material-ui/api/dialog/)
- [React Hooks Guide](https://react.dev/reference/react)
- [React Rules of Hooks](https://react.dev/link/rules-of-hooks)
- [JavaScript Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [useMemo Hook](https://react.dev/reference/react/useMemo)

---

**Last Updated:** October 30, 2025  
**Version:** 2.0 - Stage 1 Complete  
**Status:** ✅ Production Ready  
**Next Phase:** Stage 2 - Advanced Features (Export, Print, Calendar Integration)

