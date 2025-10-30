# Teacher Feature - Organized Structure

## 📁 Folder Structure

```
teacher/
├── components/
│   ├── attendance/              # Real-time attendance management
│   │   ├── LiveAttendanceRoster.jsx      # Main attendance container with socket integration
│   │   ├── AttendanceStats.jsx           # Visual stats (present/absent/total)
│   │   ├── AttendanceCodeDisplay.jsx     # Code display with copy functionality
│   │   ├── CountdownTimer.jsx            # Countdown with color transitions
│   │   ├── StudentRosterItem.jsx         # Individual student row with toggle
│   │   └── index.js                      # Barrel export
│   │
│   ├── reflection/              # Post-session reflection & feedback
│   │   ├── TeacherReflectionModal.jsx    # Teacher session reflection form
│   │   ├── FeedbackSummaryModal.jsx      # Aggregated student feedback display
│   │   └── index.js                      # Barrel export
│   │
│   ├── history/                 # Class history & past sessions
│   │   ├── ClassHistory.jsx              # Session history with modal triggers
│   │   └── index.js                      # Barrel export
│   │
│   └── shared/                  # Shared/reusable components
│       ├── CreateClassForm.jsx           # New class session form
│       └── index.js                      # Barrel export
│
├── pages/
│   └── TeacherDashboardPage.jsx          # Main teacher dashboard page
│
├── teacherService.js                     # API service layer
├── teacherSlice.js                       # Redux state management
└── README.md                             # This file

```

## 🎯 Component Responsibilities

### **Attendance Module** (`components/attendance/`)
**Purpose:** Real-time attendance tracking during live class sessions

**Components:**
- **LiveAttendanceRoster.jsx** - Main container component
  - Socket.IO integration for real-time updates
  - Roster loading and management
  - Tab filtering (All/Present/Absent)
  - Finalize attendance functionality
  
- **AttendanceStats.jsx** - Visual statistics display
  - Color-coded progress bar (green ≥75%, yellow ≥50%, red <50%)
  - Present/Absent/Total count cards
  - Responsive layout
  
- **AttendanceCodeDisplay.jsx** - Attendance code display
  - Large, readable code with copy functionality
  - Glow effects and visual feedback
  - Monospace font for clarity
  
- **CountdownTimer.jsx** - Session timer
  - Dynamic color transitions (green → yellow → red)
  - Circular progress indicator
  - Time formatting (MM:SS)
  - Closed state when window expires
  
- **StudentRosterItem.jsx** - Individual student row
  - Avatar with color based on name
  - Status indicators (present/absent)
  - Manual toggle switch
  - Pulse animation on check-in

**Socket Events:**
- `join-session-room` - Teacher joins session room
- `student-checked-in` - Real-time attendance updates
- `leave-session-room` - Cleanup on unmount

---

### **Reflection Module** (`components/reflection/`)
**Purpose:** Post-session reflection and feedback analysis

**Components:**
- **TeacherReflectionModal.jsx** - Reflection form
  - Visual star ratings (1-5) for effectiveness and engagement
  - Emoji indicators for pace (🐢 Too Slow, ✓ Just Right, 🚀 Too Fast)
  - Session highlights, challenges, improvements fields
  - Edit existing reflections or create new ones
  
- **FeedbackSummaryModal.jsx** - Feedback aggregation display
  - Student feedback with progress bars
  - Color-coded ratings (green ≥4, yellow ≥3, red <3)
  - Teacher reflection display with themed sections
  - Self-assessment summary box

**Features:**
- Dual useEffect pattern for fetch + populate
- Form state reset on close
- Loading states with spinners
- Empty states for no data scenarios

---

### **History Module** (`components/history/`)
**Purpose:** Display past class sessions

**Components:**
- **ClassHistory.jsx** - Session history list
  - Displays completed sessions with details
  - "Reflected" status chip
  - Two action buttons: Add/Edit Reflection, View Summary
  - Triggers reflection and summary modals
  - Custom scrollbar styling

**Features:**
- Responsive button layout (stacked mobile, row desktop)
- Empty state for no sessions
- Automatic refresh after reflection submission

---

### **Shared Module** (`components/shared/`)
**Purpose:** Reusable components across teacher feature

**Components:**
- **CreateClassForm.jsx** - New session form
  - Cascading dropdowns (Assignment → Section)
  - Class type selection (Theory/Lab)
  - Auto-select first section
  - Loading states and validation
  - Special error handling for "No verified students"

**Features:**
- Form validation before submission
- Disabled states to prevent errors
- Clear error messages
- Responsive inputs with hover effects

---

## 🔗 Import Patterns

### **Using Barrel Exports (Recommended):**
```javascript
// Clean imports from index.js
import { LiveAttendanceRoster } from '../components/attendance';
import { TeacherReflectionModal } from '../components/reflection';
import { ClassHistory } from '../components/history';
import { CreateClassForm } from '../components/shared';
```

### **Direct Imports (When Needed):**
```javascript
// Direct component imports
import LiveAttendanceRoster from '../components/attendance/LiveAttendanceRoster.jsx';
import AttendanceStats from '../components/attendance/AttendanceStats.jsx';
```

---

## 🔄 Redux State Flow

### **State Structure:**
```javascript
teacher: {
  activeSession: null,          // Current live session
  sessionHistory: [],           // Past sessions
  feedbackSummary: null,        // Fetched summary data
  assignments: [],              // Teacher's assignments
  isLoading: false,             // General loading
  isRosterLoading: false,       // Roster-specific loading
  isSummaryLoading: false,      // Summary-specific loading
  isError: false,
  isSuccess: false,
  message: ''
}
```

### **Key Actions:**
- `createClassSession` - Start new session
- `getSessionRoster` - Fetch attendance roster
- `finalizeAttendance` - Submit final attendance
- `updateRosterOnSocketEvent` - Real-time roster updates
- `toggleManualAttendance` - Manual status toggle
- `upsertSessionReflection` - Create/update reflection
- `getFeedbackSummaryForSession` - Fetch summary
- `getTeacherSessionsHistory` - Fetch past sessions

---

## 🌐 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/college/teachers/class-creation-data` | Get teacher's assignments |
| POST | `/api/college/teachers/class-sessions` | Create new session |
| GET | `/api/college/teachers/class-sessions` | Get session history |
| GET | `/api/college/teachers/class-sessions/:sessionId/roster` | Get session roster |
| PATCH | `/api/college/teachers/class-sessions/:sessionId/roster` | Finalize attendance |
| PUT | `/api/college/teachers/session-reflection` | Create/update reflection |
| GET | `/api/college/teachers/feedback-summary/:sessionId` | Get feedback summary |

---

## 🎨 Design System

### **Colors:**
- **Success (Green):** Present status, effectiveness ≥75%
- **Warning (Yellow/Orange):** Effectiveness 50-74%, time warning
- **Error (Red):** Absent status, effectiveness <50%
- **Primary (Blue):** General actions, attendance code

### **Animations:**
- Pulse-in effect on student check-in
- Color transitions on countdown timer
- Hover effects with transform
- Gradient backgrounds throughout

### **Responsive Breakpoints:**
- `xs`: 0px (mobile)
- `sm`: 600px (tablet)
- `md`: 900px (small desktop)
- `lg`: 1200px (desktop)
- `xl`: 1536px (large desktop)

---

## 🚀 Development Guidelines

### **Adding New Components:**

1. **Determine the module:** attendance, reflection, history, or shared
2. **Create component file** in appropriate folder
3. **Export from index.js** in that folder
4. **Import using barrel exports** in consuming components

### **Example - Adding AttendanceReport.jsx:**
```javascript
// 1. Create file
components/attendance/AttendanceReport.jsx

// 2. Add to index.js
export { default as AttendanceReport } from './AttendanceReport.jsx';

// 3. Import in consuming component
import { AttendanceReport } from '../components/attendance';
```

### **Component Guidelines:**
- Use functional components with hooks
- Implement proper loading states
- Add empty states for no data scenarios
- Include error boundaries
- Follow responsive design patterns
- Use Material-UI `sx` prop (not styled-components)
- Maintain consistent animation patterns

### **Testing Checklist:**
- [ ] Component renders without errors
- [ ] Loading states display correctly
- [ ] Empty states show when no data
- [ ] Error handling works as expected
- [ ] Responsive on mobile, tablet, desktop
- [ ] Dark/light mode both supported
- [ ] Socket integration (if applicable)
- [ ] Redux state updates properly
- [ ] API calls include error handling

---

## 🐛 Debugging

### **Common Issues:**

**Socket Not Connecting:**
```javascript
// Check SocketContext setup
const { socket, isConnected } = useSocket();
console.log('Socket status:', { socket, isConnected });
```

**Roster Not Updating:**
```javascript
// Verify socket listener setup
useEffect(() => {
  if (!socket || !session?._id) return;
  console.log('Setting up listeners for session:', session._id);
  // ... listener setup
}, [socket, session?._id]);
```

**Import Errors:**
```javascript
// Use relative paths correctly based on folder depth
// From attendance/ to teacherSlice.js: ../../teacherSlice.js
// From pages/ to attendance/: ../components/attendance
```

### **Development Console Logs:**
- 🔌 Socket connection/disconnection
- 📋 Roster fetch operations
- 👤 Student check-in events
- 🔄 Redux state updates

**Production Note:** Wrap console logs in DEV checks:
```javascript
if (import.meta.env.DEV) {
  console.log('Debug info');
}
```

---

## 📊 Performance Considerations

- **React.memo** for list items (StudentRosterItem)
- **useMemo** for expensive calculations (filtered lists)
- **useCallback** for event handlers passed to children
- **Lazy loading** for modals (rendered only when open)
- **Socket cleanup** on component unmount
- **Debounced search** if adding search functionality

---

## 🔐 Security

- JWT tokens in all API calls
- Socket authentication on connection
- Role-based access control (teacher role required)
- No sensitive data in console logs (production)
- Sanitized user inputs in forms

---

## 📝 Future Enhancements

**Potential Additions:**
- [ ] CSV export for attendance records
- [ ] Attendance analytics dashboard
- [ ] Multi-session comparison
- [ ] QR code for attendance
- [ ] Offline mode with sync
- [ ] Push notifications for late students
- [ ] Automated reports generation
- [ ] Integration with calendar

---

## 📚 Related Documentation

- [Chat Feature Structure](/src/features/chat/chat.md) - Similar organized structure
- [Timetable Feature](/src/features/timetable/README.md) - Grid calculation patterns
- [Redux Toolkit Docs](https://redux-toolkit.js.org/) - State management
- [Material-UI v7](https://mui.com/) - Component library
- [Socket.IO Client](https://socket.io/docs/v4/client-api/) - Real-time communication

---

**Last Updated:** October 30, 2025  
**Structure Version:** 2.0 (Reorganized)  
**Maintainer:** Development Team
