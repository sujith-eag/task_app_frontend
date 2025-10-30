# Teacher Feature - Quick Reference

## 📦 Component Inventory

### Total: 9 Components + 4 Barrel Exports

---

## 🎯 Module Breakdown

### **1. Attendance Module** (5 components)
Real-time attendance management during live sessions

```
components/attendance/
├── LiveAttendanceRoster.jsx    [CONTAINER] Main roster with socket integration
├── AttendanceStats.jsx         [DISPLAY]   Color-coded statistics (P/A/Total)
├── AttendanceCodeDisplay.jsx   [DISPLAY]   Large code with copy function
├── CountdownTimer.jsx          [DISPLAY]   Timer with color transitions
├── StudentRosterItem.jsx       [ITEM]      Individual student row
└── index.js                    [EXPORT]    Barrel exports
```

**Usage:**
```javascript
import { LiveAttendanceRoster } from '../components/attendance';
```

---

### **2. Reflection Module** (2 components)
Post-session reflection and feedback analysis

```
components/reflection/
├── TeacherReflectionModal.jsx  [MODAL]     Visual ratings form
├── FeedbackSummaryModal.jsx    [MODAL]     Aggregated feedback display
└── index.js                    [EXPORT]    Barrel exports
```

**Usage:**
```javascript
import { TeacherReflectionModal, FeedbackSummaryModal } from '../components/reflection';
```

---

### **3. History Module** (1 component)
Past session history and management

```
components/history/
├── ClassHistory.jsx            [LIST]      Session list with modals
└── index.js                    [EXPORT]    Barrel exports
```

**Usage:**
```javascript
import { ClassHistory } from '../components/history';
```

---

### **4. Shared Module** (1 component)
Reusable components across feature

```
components/shared/
├── CreateClassForm.jsx         [FORM]      New session form
└── index.js                    [EXPORT]    Barrel exports
```

**Usage:**
```javascript
import { CreateClassForm } from '../components/shared';
```

---

## 🔗 Dependency Graph

```
TeacherDashboardPage
├── CreateClassForm (shared)
├── LiveAttendanceRoster (attendance)
│   ├── AttendanceStats
│   ├── AttendanceCodeDisplay
│   ├── CountdownTimer
│   └── StudentRosterItem
└── ClassHistory (history)
    ├── TeacherReflectionModal (reflection)
    └── FeedbackSummaryModal (reflection)
```

---

## 🎨 Component Types

| Type | Components | Purpose |
|------|-----------|---------|
| **Container** | LiveAttendanceRoster | Manages state and logic |
| **Modal** | TeacherReflectionModal, FeedbackSummaryModal | Overlay dialogs |
| **Form** | CreateClassForm | User input and validation |
| **List** | ClassHistory | Display collections |
| **Display** | AttendanceStats, AttendanceCodeDisplay, CountdownTimer | Show information |
| **Item** | StudentRosterItem | List item component |

---

## 🚀 Quick Import Guide

### **From TeacherDashboardPage:**
```javascript
// pages/TeacherDashboardPage.jsx
import { CreateClassForm } from '../components/shared';
import { LiveAttendanceRoster } from '../components/attendance';
import { ClassHistory } from '../components/history';
```

### **From LiveAttendanceRoster:**
```javascript
// components/attendance/LiveAttendanceRoster.jsx
import AttendanceStats from './AttendanceStats.jsx';
import AttendanceCodeDisplay from './AttendanceCodeDisplay.jsx';
import CountdownTimer from './CountdownTimer.jsx';
import StudentRosterItem from './StudentRosterItem.jsx';
```

### **From ClassHistory:**
```javascript
// components/history/ClassHistory.jsx
import TeacherReflectionModal from '../reflection/TeacherReflectionModal.jsx';
import FeedbackSummaryModal from '../reflection/FeedbackSummaryModal.jsx';
```

### **To teacherSlice from any component:**
```javascript
// From attendance/ or reflection/ or history/ or shared/
import { actionName } from '../../teacherSlice.js';
```

### **To SocketContext from attendance components:**
```javascript
// From components/attendance/
import { useSocket } from '../../../../context/SocketContext.jsx';
```

---

## 📊 Complexity Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Total Components** | 9 | ✅ Manageable |
| **Max Nesting Depth** | 2 levels | ✅ Shallow |
| **Files per Folder** | 1-5 | ✅ Well-distributed |
| **Import Path Depth** | Max 4 `../` | ✅ Reasonable |
| **Barrel Exports** | 4 | ✅ Clean imports |
| **Component Reuse** | High | ✅ Modular |

---

## 🎯 When to Create New Folders

### **Create New Folder When:**
- [ ] Adding 3+ related components
- [ ] Clear functional grouping emerges
- [ ] Need to isolate concerns
- [ ] Planning significant feature expansion

### **Add to Existing Folder When:**
- [ ] Component fits existing grouping
- [ ] Extends current functionality
- [ ] Used by components in that folder
- [ ] Shares similar purpose

---

## 🔍 File Naming Conventions

### **Component Files:**
- PascalCase: `LiveAttendanceRoster.jsx`
- Descriptive names: `AttendanceCodeDisplay.jsx`
- Suffix for variants: `StudentRosterItem.jsx`

### **Barrel Exports:**
- Always: `index.js`
- Export pattern: `export { default as ComponentName } from './ComponentName.jsx';`

### **Documentation:**
- README.md - Main documentation
- MIGRATION.md - Migration guides
- QUICK_REFERENCE.md - This file

---

## 🛠️ Development Workflow

### **1. Find Component Location:**
```bash
# Search by name
find src/features/teacher -name "LiveAttendanceRoster.jsx"

# List all components
find src/features/teacher/components -name "*.jsx" | sort
```

### **2. Check Barrel Exports:**
```bash
# View all exports
cat src/features/teacher/components/*/index.js
```

### **3. Verify Imports:**
```bash
# Check for old import patterns (should be empty)
grep -r "from '\.\./components/[^/]*\.jsx'" src/features/teacher/
```

---

## ✅ Structure Validation

### **Current State:**
- ✅ 4 logical folders created
- ✅ 9 components properly organized
- ✅ 4 barrel export files
- ✅ All imports updated
- ✅ No compilation errors
- ✅ Clean import paths
- ✅ Documentation complete

---

## 📚 Related Documentation

- [README.md](./README.md) - Comprehensive feature documentation
- [MIGRATION.md](./MIGRATION.md) - Restructuring migration guide
- [teacherSlice.js](./teacherSlice.js) - Redux state management
- [teacherService.js](./teacherService.js) - API service layer

---

**Last Updated:** October 30, 2025  
**Structure Version:** 2.0  
**Components:** 9  
**Modules:** 4
