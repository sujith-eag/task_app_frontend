# Common Components Library

**Purpose:** Reusable UI components for the admin feature upgrade  
**Status:** ✅ Phase 1 Complete  
**Last Updated:** October 30, 2025

---

## 📦 Components Overview

This directory contains shared components used across the admin panel. All components follow Material-UI design patterns and are optimized for accessibility and performance.

### Available Components

| Component | Purpose | Documentation |
|-----------|---------|---------------|
| `ConfirmDialog` | Professional confirmation dialogs | [See below](#confirmdialog) |
| `EmptyState` | Empty state messaging | [See below](#emptystate) |
| `EnhancedDataGrid` | Standardized DataGrid wrapper | [See below](#enhanceddatagrid) |
| `SkeletonLoaders` | Loading placeholders | [See below](#skeletonloaders) |

---

## 🎯 Quick Start

### Import Components

```jsx
// Import individual components
import { ConfirmDialog, EmptyState, EnhancedDataGrid } from '@/components/common';
import { DataGridSkeleton, StatsCardSkeleton } from '@/components/common';

// Import hook
import useConfirmDialog from '@/hooks/useConfirmDialog';
```

### Basic Usage

```jsx
import { ConfirmDialog, EnhancedDataGrid, EmptyState } from '@/components/common';
import useConfirmDialog from '@/hooks/useConfirmDialog';

function MyComponent() {
  const { confirmDialog, showConfirm } = useConfirmDialog();

  const handleDelete = (item) => {
    showConfirm({
      title: 'Delete Item',
      message: `Delete "${item.name}"?`,
      severity: 'error',
      onConfirm: async () => {
        await deleteItem(item.id);
      }
    });
  };

  return (
    <>
      <EnhancedDataGrid
        rows={data}
        columns={columns}
        isLoading={isLoading}
      />
      <ConfirmDialog {...confirmDialog} />
    </>
  );
}
```

---

## 📚 Component API Reference

### ConfirmDialog

Professional confirmation dialog replacing `window.confirm()`.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | - | **Required.** Controls dialog visibility |
| `onClose` | function | - | **Required.** Called when dialog closes |
| `onConfirm` | function | - | **Required.** Called when user confirms |
| `title` | string | 'Confirm Action' | Dialog title |
| `message` | string | 'Are you sure?' | Main confirmation message |
| `details` | string | null | Additional warning/info (optional) |
| `severity` | 'error' \| 'warning' \| 'info' | 'warning' | Visual severity level |
| `confirmText` | string | 'Confirm' | Confirm button text |
| `cancelText` | string | 'Cancel' | Cancel button text |
| `isLoading` | boolean | false | Shows loading state |

#### Usage Example

```jsx
<ConfirmDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Delete User"
  message="Are you sure you want to delete this user?"
  details="This action cannot be undone. All user data will be permanently removed."
  severity="error"
  confirmText="Delete User"
  isLoading={isDeleting}
/>
```

---

### EmptyState

Displays when lists or tables have no data.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | Component | InboxIcon | MUI icon component |
| `title` | string | 'No data found' | Main heading |
| `description` | string | 'There are no items...' | Supporting text |
| `actionLabel` | string | null | Button text (optional) |
| `onAction` | function | null | Button click handler (optional) |

#### Usage Example

```jsx
import PersonAddIcon from '@mui/icons-material/PersonAdd';

<EmptyState
  icon={PersonAddIcon}
  title="No users found"
  description="Get started by adding your first user to the system"
  actionLabel="Add User"
  onAction={() => setOpenModal(true)}
/>
```

---

### EnhancedDataGrid

Wrapper around MUI DataGrid with consistent styling and UX enhancements.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | array | - | **Required.** Data rows |
| `columns` | array | - | **Required.** Column definitions |
| `isLoading` | boolean | false | Loading state |
| `emptyStateProps` | object | {} | Props for EmptyState component |
| `showSkeleton` | boolean | true | Show skeleton on initial load |
| `sx` | object | {} | Additional MUI sx props |
| `...dataGridProps` | - | - | Any MUI DataGrid props |

#### Usage Example

```jsx
<EnhancedDataGrid
  rows={users}
  columns={columns}
  isLoading={isLoading}
  emptyStateProps={{
    icon: PersonIcon,
    title: "No users found",
    description: "Add your first user to get started",
    actionLabel: "Add User",
    onAction: handleAdd
  }}
  getRowId={(row) => row._id}
/>
```

---

### SkeletonLoaders

Collection of loading placeholder components.

#### Available Loaders

**DataGridSkeleton**
```jsx
import { DataGridSkeleton } from '@/components/common';

<DataGridSkeleton rows={5} columns={6} />
```

**StatsCardSkeleton**
```jsx
import { StatsCardSkeleton } from '@/components/common';

<StatsCardSkeleton />
```

**ChartSkeleton**
```jsx
import { ChartSkeleton } from '@/components/common';

<ChartSkeleton height={300} />
```

**ListItemSkeleton**
```jsx
import { ListItemSkeleton } from '@/components/common';

<ListItemSkeleton count={5} />
```

**FormSkeleton**
```jsx
import { FormSkeleton } from '@/components/common';

<FormSkeleton fields={4} />
```

---

## 🎣 Custom Hooks

### useConfirmDialog

Manages confirmation dialog state and actions.

#### API

```typescript
const {
  confirmDialog,  // Props to spread to ConfirmDialog
  showConfirm,    // Function to show dialog
  closeConfirm,   // Function to close dialog
  executeConfirm  // Internal - used by ConfirmDialog
} = useConfirmDialog();
```

#### showConfirm Config

```typescript
showConfirm({
  title: string,           // Dialog title
  message: string,         // Confirmation message
  details?: string,        // Additional details
  severity?: 'error' | 'warning' | 'info',
  confirmText?: string,    // Button text
  cancelText?: string,     // Cancel text
  onConfirm: async () => void  // Async action
});
```

#### Full Example

```jsx
import useConfirmDialog from '@/hooks/useConfirmDialog';
import { ConfirmDialog } from '@/components/common';
import { toast } from 'react-toastify';

function MyComponent() {
  const { confirmDialog, showConfirm } = useConfirmDialog();
  
  const handleDelete = (user) => {
    showConfirm({
      title: 'Delete User',
      message: `Delete user "${user.name}"?`,
      details: 'This action cannot be undone.',
      severity: 'error',
      confirmText: 'Delete User',
      onConfirm: async () => {
        try {
          await dispatch(deleteUser(user.id)).unwrap();
          toast.success('User deleted successfully');
        } catch (err) {
          toast.error('Failed to delete user');
          throw err; // Keeps dialog open on error
        }
      }
    });
  };

  return (
    <>
      <Button onClick={() => handleDelete(user)}>Delete</Button>
      <ConfirmDialog {...confirmDialog} />
    </>
  );
}
```

---

## 🎨 Styling Guidelines

### Using MUI sx Prop

All components support MUI's `sx` prop for custom styling:

```jsx
<EnhancedDataGrid
  rows={data}
  columns={columns}
  sx={{
    '& .MuiDataGrid-row': {
      cursor: 'pointer'
    }
  }}
/>
```

### Theme Integration

Components automatically use theme values:

```jsx
// Uses theme.palette.error.main
<ConfirmDialog severity="error" />

// Uses theme.spacing() scale
<EmptyState /> // Has built-in responsive spacing
```

---

## ♿ Accessibility

All components are built with accessibility in mind:

- ✅ Proper ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management in dialogs
- ✅ Screen reader announcements
- ✅ Semantic HTML structure

### Testing Accessibility

```bash
# Test with keyboard
- Tab through focusable elements
- Enter/Space to activate buttons
- Escape to close dialogs

# Test with screen reader
- VoiceOver (Mac): Cmd + F5
- NVDA (Windows): Ctrl + Alt + N
```

---

## 🧪 Testing

### Component Testing Example

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDialog } from '@/components/common';

test('shows confirmation dialog', () => {
  const onConfirm = jest.fn();
  
  render(
    <ConfirmDialog
      open={true}
      onClose={jest.fn()}
      onConfirm={onConfirm}
      title="Delete Item"
      message="Are you sure?"
    />
  );

  expect(screen.getByText('Delete Item')).toBeInTheDocument();
  
  fireEvent.click(screen.getByText('Confirm'));
  expect(onConfirm).toHaveBeenCalled();
});
```

---

## 📝 Best Practices

### 1. Always Show Consequences

```jsx
// ✅ GOOD: Shows what will happen
<ConfirmDialog
  message="Delete this subject?"
  details="This will remove all associated assignments and grades."
/>

// ❌ BAD: Vague message
<ConfirmDialog
  message="Are you sure?"
/>
```

### 2. Use Appropriate Severity

```jsx
// ✅ GOOD: Error for destructive actions
<ConfirmDialog severity="error" title="Delete User" />

// ✅ GOOD: Warning for reversible actions
<ConfirmDialog severity="warning" title="Archive User" />

// ✅ GOOD: Info for non-destructive confirmations
<ConfirmDialog severity="info" title="Send Notification" />
```

### 3. Handle Errors Properly

```jsx
// ✅ GOOD: Re-throw to keep dialog open on error
onConfirm: async () => {
  try {
    await action();
    toast.success('Success!');
  } catch (err) {
    toast.error(err.message);
    throw err; // Keep dialog open
  }
}
```

### 4. Provide Helpful Empty States

```jsx
// ✅ GOOD: Clear messaging and action
<EmptyState
  title="No users found"
  description="Add your first user to get started"
  actionLabel="Add User"
  onAction={handleAdd}
/>

// ❌ BAD: Generic message
<EmptyState title="No data" />
```

---

## 🔧 Troubleshooting

### Dialog Doesn't Close on Success

**Problem:** Dialog stays open after successful action  
**Solution:** Don't throw error on success, only on failure

```jsx
// ✅ CORRECT
onConfirm: async () => {
  try {
    await action();
    // Dialog closes automatically
  } catch (err) {
    toast.error(err.message);
    throw err; // Keep open on error
  }
}
```

### Skeleton Shows After Data Loads

**Problem:** Skeleton loader still visible with data  
**Solution:** Check condition properly

```jsx
// ✅ CORRECT
if (isLoading && data.length === 0) {
  return <DataGridSkeleton />;
}

// ❌ WRONG
if (isLoading) {
  return <DataGridSkeleton />;
}
```

---

## 📖 Related Documentation

- [Phase 1 Implementation Guide](../../../docs/admin-upgrade/PHASE-1-IMPLEMENTATION.md)
- [UI/UX Enhancements Roadmap](../../../docs/admin-upgrade/01-UI-UX-ENHANCEMENTS.md)
- [Example Implementation](../../features/admin/components/_examples/SubjectListRefactored.jsx)

---

**Need Help?**  
Check the example implementation or refer to the roadmap documentation.
