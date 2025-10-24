# Progressive Semester Filtering - Usage Guide

## Problem Solved ✅

**Original Issue:** Students needed a way to view their complete timetable including both core subjects and elective subjects for their specific section.

**Previous Limitations:**
- **All Semester sessions** → Too broad (includes all sections)
- **Specific groups** (e.g., `MCA_SEM3_A` or `ELEC_AD_A1`) → Too narrow (misses electives)
- **Two separate semester filters** → Confusing and cluttered UI

**Current Solution:** 
- ✅ **Progressive filtering** - Start broad, optionally narrow down
- ✅ **Single intuitive filter** - Select semester, then optionally select section
- ✅ **Complete timetable** - Shows core + electives when section is selected
- ✅ **Clean UI** - Consistent labels across all filters

---

## How Progressive Filtering Works

### **Step 1: Select Semester (Required)**
User selects a semester (e.g., Semester 3)

**Result:** Shows ALL sessions for that semester
- All sections (A, B, etc.)
- All student groups (core + electives)
- Complete semester overview

**Use Case:** Administrators, coordinators viewing full semester schedule

---

### **Step 2: Optionally Select Section**
User can optionally select a section letter (A, B, etc.)

**Result:** Shows targeted sessions for that section
- Core subjects for that section
- Elective subjects for that section
- Shared electives (sessions with multiple sections)

**Use Case:** Students viewing their complete personal timetable

---

### **Step 3: Clear Section to Expand**
User can select "-- All Sections --" to go back

**Result:** Returns to full semester view
- Easy toggle between views
- No need to start over

---

## Data Structure

### Example: Semester 3 Sessions
```json
// Core subject for Section B
{
  "studentGroupId": "MCA_SEM3_B",
  "semester": 3,
  "sections": ["B"]
}

// Elective for Section B (AD stream)
{
  "studentGroupId": "ELEC_AD_B1",
  "semester": 3,
  "sections": ["B"]
}

// Elective for both sections
{
  "studentGroupId": "ELEC_SS_G1",
  "semester": 3,
  "sections": ["A", "B"]
}
```

```json
// Core subject for Section B
{
  "studentGroupId": "MCA_SEM3_B",
  "semester": 3,
  "sections": ["B"]
}

// Elective for Section B (AD stream)
{
  "studentGroupId": "ELEC_AD_B1",
  "semester": 3,
  "sections": ["B"]
}

// Elective shared by both sections
{
  "studentGroupId": "ELEC_SS_G1",
  "semester": 3,
  "sections": ["A", "B"]
}
```

---

## User Workflows

### **Workflow 1: View All Semester 3 Sessions**

**Steps:**
1. Select "Semester: 3"
2. Leave "Section: -- All Sections --"

**Result:** Shows ALL Semester 3 sessions
- MCA_SEM3_A sessions
- MCA_SEM3_B sessions  
- ELEC_AD_A1 sessions
- ELEC_AD_B1 sessions
- ELEC_SS_G1 sessions (shared)
- All other Semester 3 groups

**Helper Text:** *"Showing all classes for Semester 3 (all sections)"*

---

### **Workflow 2: View Complete Section B Timetable**

**Steps:**
1. Select "Semester: 3"
2. Select "Section: B"

**Result:** Shows only Section B sessions
- ✅ MCA_SEM3_B sessions (core subjects)
- ✅ ELEC_AD_B1 sessions (AD elective)
- ✅ ELEC_SS_G1 sessions (shared elective)
- ❌ MCA_SEM3_A sessions (filtered out)
- ❌ ELEC_AD_A1 sessions (filtered out)

**Helper Text:** *"Showing all classes (core + electives) for Semester 3, Section B"*

---

### **Workflow 3: Switch Between Views**

**Steps:**
1. Currently viewing "Semester 3, Section B"
2. Select "Section: -- All Sections --"

**Result:** Expands to show all Semester 3 sessions again

**Benefit:** Quick toggle without reselecting semester

---

## UI Layout

### **Current Clean Design:**

```
┌───────────────────────────────────────────────────────────────┐
│  View by Semester [& Section]                                 │
│  ┌──────────────────────┐  ┌──────────────────────────────┐  │
│  │ Semester: [3      ▼] │  │ Section: [-- All --      ▼]  │  │
│  └──────────────────────┘  └──────────────────────────────┘  │
│                              (Optional, disabled until       │
│                               semester is selected)          │
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  View by Student Group                                         │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ MCA_SEM3_A                                            ▼ ││
│  └──────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────┐
│  View by Faculty                                               │
│  ┌──────────────────────────────────────────────────────────┐│
│  │ Ms Geethanjali R                                      ▼ ││
│  └──────────────────────────────────────────────────────────┘│
└───────────────────────────────────────────────────────────────┘

Showing all classes for Semester 3 (all sections)
```

**Key UI Features:**
- ✅ Consistent labels above all filters
- ✅ Proper alignment with `minHeight: 20`
- ✅ Clear visual hierarchy
- ✅ Disabled state for section until semester selected
- ✅ Helper text explains current filter

---

## Filter Comparison

| Filter Type | What It Shows | When to Use |
|------------|---------------|-------------|
| **Semester (no section)** | All classes in a semester | Admin overview, semester planning |
| **Semester + Section** | Complete timetable for specific section (core + electives) | **Students' personal timetable** ✨ |
| **Student Group** | Classes for specific group only | Narrow view, single group |
| **Faculty** | All classes taught by faculty | Faculty schedule |

---

## Code Implementation

### **Progressive Filtering Logic**

```javascript
// In useTimetableData.js hook
if (view.type === 'semesterSection') {
  if (view.sectionLetter) {
    // Both semester AND section selected
    // → Filter by semester AND check sections array
    return filterBySemesterAndSection(data, semester, section);
  } else {
    // Only semester selected, no section
    // → Show all semester sessions
    return filterBySemester(data, semester);
  }
}
```

### **Filter Function**

```javascript
// In sessionFilters.js
export const filterBySemesterAndSection = (data, semester, sectionLetter) => {
  return data.filter(session => {
    // Must match semester
    if (String(session.semester) !== String(semester)) return false;
    
    // Must have section letter in sections array
    if (Array.isArray(session.sections)) {
      return session.sections.includes(sectionLetter);
    }
    
    // Fallback for old format
    return session.section === sectionLetter;
  });
};
```

### **UI State Management**

```javascript
// User selects semester only
handleViewChange('semesterSection', '3', '')
// → view = { type: 'semesterSection', value: '3', sectionLetter: '' }
// → Shows all Semester 3 sessions

// User then selects section
handleViewChange('semesterSection', '3', 'B')  
// → view = { type: 'semesterSection', value: '3', sectionLetter: 'B' }
// → Shows Semester 3, Section B sessions only
```

---

## Benefits

### **For Students**
- 🎓 **Complete view** - See all classes they need (core + electives)
- 🎯 **Focused** - No irrelevant sessions from other sections
- 💡 **Intuitive** - Natural flow from broad to specific
- 📱 **Clean UI** - Less clutter, easier to use

### **For Administrators**
- 📊 **Flexible** - Can view at different levels
- 🔍 **Verification** - Check section completeness
- 📋 **Planning** - See full semester or drill down
- ⚡ **Efficient** - Quick toggling between views

### **For Developers**
- 🧩 **Modular** - Separate concerns, reusable functions
- 🧪 **Testable** - Pure functions, isolated logic
- 📖 **Maintainable** - Clear intent, well-documented
- 🔄 **Extensible** - Easy to add more filters

---

## Testing Scenarios

### **Test 1: Progressive Selection**
- [x] Select Semester 3 → Shows all Semester 3 sessions
- [x] Select Section B → Narrows to Section B only
- [x] Select "All Sections" → Expands back to all

### **Test 2: Edge Cases**
- [x] Section dropdown disabled when no semester selected
- [x] Changing semester clears section selection
- [x] Multi-section sessions (["A","B"]) appear in both
- [x] Helper text updates correctly

### **Test 3: Backward Compatibility**
- [x] Old data format (section string) still works
- [x] New data format (sections array) works
- [x] Mixed data works correctly

### **Test 4: UI Consistency**
- [x] All filter sections have labels
- [x] Labels are properly aligned
- [x] minHeight prevents layout shifts
- [x] Responsive on mobile

---

## Future Enhancements

1. **Auto-selection**: Automatically set semester+section based on user profile
2. **Favorites**: Save preferred filter combinations
3. **Comparison**: View multiple sections side-by-side
4. **Conflicts**: Highlight schedule conflicts
5. **Export**: Download filtered timetable as PDF/iCal
6. **Time filters**: Show only morning/afternoon classes
7. **Day filters**: Show specific days only

---

## Changelog

### **v2.0 - Progressive Filtering (Current)**
- ✅ Combined two semester filters into one
- ✅ Progressive disclosure: semester → optional section
- ✅ Consistent labels across all filters
- ✅ Improved alignment and spacing
- ✅ Cleaner, more intuitive UI

### **v1.0 - Dual Semester Filters (Deprecated)**
- ❌ Separate "Semester Only" and "Semester & Section" filters
- ❌ Confusing for users
- ❌ Cluttered UI
- ❌ Inconsistent alignment

---

**Created:** October 24, 2025  
**Feature:** Progressive Semester Filtering  
**Status:** ✅ Implemented, Tested, and Documented  
**Version:** 2.0
