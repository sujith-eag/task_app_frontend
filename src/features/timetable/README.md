# Timetable Feature - Architecture Documentation

## 📁 File Structure

```
timetable/
├── index.js                    # Public API exports
├── Timetable.jsx              # Main container component
├── pages/
│   └── TimetablePage.jsx      # Page wrapper with data loading
├── components/
│   ├── TimetableGrid.jsx      # Grid container component
│   ├── SessionCard.jsx        # Individual session card component
│   └── SessionModal.jsx       # Session details modal
├── hooks/
│   ├── index.js               # Hook exports
│   ├── useTimetableData.js    # Data filtering and view management
│   └── useSessionGrid.js      # Grid calculation logic
├── utils/
│   ├── index.js               # Utility exports
│   ├── timetableHelpers.js    # General helper functions
│   ├── sessionFilters.js      # Session filtering utilities
│   └── dataValidation.js      # Data validation utilities
├── constants/
│   ├── index.js               # Constants exports
│   ├── timetableConfig.js     # Configuration constants
│   └── componentColors.js     # Color theming
└── data/
    ├── sampleTimetable.json   # Old format sample data
    └── newTimeTable.json      # New format data
```

---

## 🎯 Component Architecture

### **1. TimetablePage** (Entry Point)
**Purpose:** Page-level component that handles data loading and user context

**Responsibilities:**
- Load timetable data from JSON/API
- Manage user context (student/staff)
- Provide data to Timetable component
- Handle loading states and errors

**Key Features:**
- Mock data support for development
- API integration structure (TODO comments)
- Timetable selection dropdown

---

### **2. Timetable** (Controller)
**Purpose:** Main controller component for timetable display and interaction

**Responsibilities:**
- Manage view state (semester/section/faculty)
- Filter sessions based on selected view
- Display view selection dropdowns
- Show color legend
- Handle modal open/close

**Uses:**
- `useTimetableData` hook for data management
- `TimetableGrid` component for display
- `SessionModal` component for details

**Key Features:**
- Automatic view selection based on user type
- Three view modes: Semester, Section, Faculty
- Responsive filter dropdowns

---

### **3. TimetableGrid** (Display)
**Purpose:** Renders the timetable grid with sessions

**Responsibilities:**
- Calculate grid layout from sessions
- Render table structure (headers, days, time slots)
- Display session cards in correct cells
- Handle multi-slot sessions (colSpan)

**Uses:**
- `useSessionGrid` hook for grid calculation
- `SessionCard` component for each session
- Constants for DAYS and TIME_SLOTS

**Key Features:**
- Sticky header for better scrolling
- Support for 2-slot sessions
- Empty cell rendering
- Error boundary

---

### **4. SessionCard** (Presentation)
**Purpose:** Individual session card display

**Responsibilities:**
- Display session information (code, room, faculty/group)
- Show section information
- Colored bar for session type
- Hover effects

**Key Features:**
- Component type color coding
- Sections display with formatting
- Smooth hover animation
- Click handler for modal

---

### **5. SessionModal** (Detail View)
**Purpose:** Detailed session information modal

**Responsibilities:**
- Show complete session details
- Display supporting staff if available
- Formatted sections list
- Color-coded header

**Key Features:**
- Full session information
- Icon-based information display
- Sections array support
- Responsive dialog

---

## 🎣 Custom Hooks

### **useTimetableData**
**Purpose:** Manage timetable data filtering and view state

**Inputs:**
- `data`: Array of session objects
- `currentUser`: User object with type and preferences

**Outputs:**
- `view`: Current view state (type, value)
- `handleViewChange`: Function to change view
- `facultyList`: List of unique faculties
- `sectionList`: List of unique sections
- `semesterList`: List of unique semesters
- `filteredSessions`: Filtered sessions based on view

**Features:**
- Automatic default view based on user type
- Memoized list calculations
- Efficient session filtering

---

### **useSessionGrid**
**Purpose:** Calculate grid layout for timetable

**Inputs:**
- `sessions`: Array of session objects

**Outputs:**
- `grid`: Object mapping day → time → sessions
- `occupiedSlots`: Set of slots occupied by multi-slot sessions

**Features:**
- Automatic colSpan calculation
- Multi-slot session handling
- Optimized with useMemo

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
- `DAYS`: Array of weekdays
- `TIME_SLOTS`: Array of time slot strings
- `USER_TYPES`: User type constants
- `VIEW_TYPES`: View type constants
- `COMPONENT_TYPES`: Session component types
- `UI_CONFIG`: UI configuration values

### **componentColors.js**
- `componentColors`: Color mapping for session types
- `getComponentColor`: Get color config for type

---

## 🔄 Data Flow

```
TimetablePage
    ↓ (loads data)
Timetable
    ↓ (uses useTimetableData hook)
    ├── Filter dropdowns (change view)
    └── TimetableGrid
            ↓ (uses useSessionGrid hook)
            └── SessionCard (click to open modal)
                    ↓
                SessionModal (shows details)
```

---

## 📊 Data Format Support

### **New Format (Primary)**
```json
{
  "sessionId": "...",
  "sections": ["A", "B"],
  "studentGroupId": "...",
  ...
}
```

### **Old Format (Backward Compatible)**
```json
{
  "sessionId": "...",
  "section": "A",
  "studentGroupId": "...",
  ...
}
```

**Compatibility:** All utilities check for both `sections` array and `section` string.

---

## 🎨 Styling Approach

- **Material-UI (MUI)**: Primary UI library
- **sx prop**: Inline styles with theme support
- **Component-level**: Styles defined in components
- **Constants**: UI values in `UI_CONFIG`
- **Theming**: Colors from `componentColors`

---

## ✅ Benefits of Refactoring

### **1. Maintainability**
- Clear separation of concerns
- Easy to locate and modify code
- Self-documenting structure

### **2. Reusability**
- Hooks can be used in other features
- Utilities are generic and testable
- Constants prevent magic values

### **3. Scalability**
- Easy to add new view types
- Simple to extend filtering logic
- Modular components

### **4. Testability**
- Utilities are pure functions
- Hooks can be tested independently
- Components are focused

### **5. Performance**
- Memoized calculations
- Optimized re-renders
- Efficient filtering

---

## 🚀 Usage Example

```jsx
import { TimetablePage } from '@/features/timetable';

// In your app
<TimetablePage />

// Or use Timetable directly
import { Timetable } from '@/features/timetable';

<Timetable 
  data={timetableData} 
  currentUser={{ type: 'student', section: 'MCA_SEM3_A' }}
/>
```

---

## 🔧 Future Enhancements

### **Potential Improvements:**
1. Add TypeScript for type safety
2. Implement virtual scrolling for large datasets
3. Add print functionality
4. Export to PDF/iCal
5. Mobile-optimized card view
6. Dark mode support
7. Filter by multiple criteria
8. Search functionality
9. Conflict detection
10. Real-time updates via WebSocket

---

## 📝 Development Guidelines

### **When adding features:**
1. Add constants to `constants/`
2. Add utilities to `utils/`
3. Create hooks in `hooks/` if reusable logic
4. Keep components focused and small
5. Export from index.js files
6. Maintain backward compatibility

### **When modifying:**
1. Check impact on all view types
2. Test with both data formats
3. Verify filtering still works
4. Check mobile responsiveness
5. Update documentation

---

## 🐛 Common Issues & Solutions

### **Issue: Sessions not showing**
- Check data format (sections array vs section string)
- Verify view filtering logic
- Check console for errors

### **Issue: Hover effect broken**
- Verify UI_CONFIG values
- Check TableContainer overflow settings
- Ensure proper z-index stacking

### **Issue: Wrong sessions in view**
- Check filter logic in sessionFilters.js
- Verify view.value matches data
- Check studentGroupId vs sections matching

---

## 📚 Related Documentation

- [MUI Table Documentation](https://mui.com/material-ui/react-table/)
- [React Hooks Guide](https://react.dev/reference/react)
- [JavaScript Array Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

---

**Last Updated:** October 24, 2025
**Version:** 2.0.0 (Phase 2 Refactoring Complete)
