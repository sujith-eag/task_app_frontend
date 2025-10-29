# Enhanced ConfirmationDialog - Usage Examples

## 🎯 Overview

The enhanced ConfirmationDialog component provides professional confirmation dialogs with multiple variants, loading states, countdown timers, and confirmation inputs.

---

## 📦 Basic Usage (Backward Compatible)

### Simple Confirmation (No Changes Required!)
```jsx
import ConfirmationDialog from './components/ConfirmationDialog';

<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Delete File?"
  message="Are you sure you want to delete this file? This action cannot be undone."
/>
```

**Result:** Works exactly like before! ✅

---

## 🎨 Variant Examples

### 1. Success Variant
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Changes Saved Successfully"
  message="Your profile has been updated. Would you like to view your profile now?"
  variant="success"
  confirmText="View Profile"
  cancelText="Close"
/>
```

### 2. Error Variant
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleRetry}
  title="Upload Failed"
  message="The file could not be uploaded due to a network error. Would you like to retry?"
  variant="error"
  confirmText="Retry Upload"
  cancelText="Cancel"
/>
```

### 3. Warning Variant (Default)
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleProceed}
  title="Unsaved Changes"
  message="You have unsaved changes. Are you sure you want to leave this page?"
  variant="warning"
  confirmText="Leave Page"
  cancelText="Stay"
/>
```

### 4. Info Variant
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleUpdate}
  title="Update Available"
  message="A new version of the app is available. Would you like to update now?"
  variant="info"
  confirmText="Update Now"
  cancelText="Later"
/>
```

### 5. Delete Variant (Destructive)
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleDelete}
  title="Delete Account?"
  message="This will permanently delete your account and all associated data. This action cannot be undone."
  variant="delete"
  confirmText="Delete Account"
  cancelText="Cancel"
/>
```

---

## ⚡ Advanced Features

### 1. Loading State (Async Actions)
```jsx
const handleConfirm = async () => {
  setLoading(true);
  try {
    await deleteFile(fileId);
    toast.success('File deleted successfully');
    handleClose();
  } catch (error) {
    toast.error('Failed to delete file');
  } finally {
    setLoading(false);
  }
};

<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Delete File?"
  message="Are you sure you want to delete this file?"
  variant="delete"
  loading={loading}
  loadingText="Deleting..."
/>
```

**Note:** The component also supports automatic async detection!
```jsx
// This works automatically - component detects Promise
const handleConfirm = async () => {
  await deleteFile(fileId);
  toast.success('File deleted');
};

<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm} // Async function - loading handled automatically!
  title="Delete File?"
  message="Are you sure?"
  variant="delete"
/>
```

---

### 2. Confirmation Input (Type to Confirm)
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleDeleteAccount}
  title="Delete Account Permanently"
  message="This action is irreversible. All your data will be permanently deleted."
  variant="delete"
  requireConfirmation={true}
  confirmationText="DELETE"
  confirmText="Delete Forever"
  disableBackdropClick={true}
/>
```

**Result:** User must type "DELETE" to enable the confirm button.

---

### 3. Countdown Timer
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleDeleteAll}
  title="Delete All Tasks?"
  message="This will delete all 127 tasks. Please take a moment to review this action."
  variant="delete"
  countdown={5}
  confirmText="Delete All"
/>
```

**Result:** Confirm button disabled for 5 seconds with countdown display.

---

### 4. Combined: Countdown + Confirmation Input
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleFactoryReset}
  title="Factory Reset"
  message="This will erase ALL data and reset the app to its initial state. This action cannot be undone."
  variant="error"
  countdown={10}
  requireConfirmation={true}
  confirmationText="RESET"
  confirmText="Reset App"
  disableBackdropClick={true}
/>
```

**Result:** User must wait 10 seconds AND type "RESET" before confirming.

---

### 5. Custom Content (Children)
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleExport}
  title="Export Data"
  variant="info"
  confirmText="Export"
>
  <Box sx={{ py: 2 }}>
    <Typography variant="body2" gutterBottom>
      Select the data you want to export:
    </Typography>
    <FormGroup>
      <FormControlLabel control={<Checkbox />} label="Tasks" />
      <FormControlLabel control={<Checkbox />} label="Files" />
      <FormControlLabel control={<Checkbox />} label="Messages" />
      <FormControlLabel control={<Checkbox />} label="Profile" />
    </FormGroup>
    <Alert severity="info" sx={{ mt: 2 }}>
      Export may take several minutes for large datasets.
    </Alert>
  </Box>
</ConfirmationDialog>
```

---

## 🎛️ All Available Props

### Basic Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | required | Controls dialog visibility |
| `onClose` | function | required | Callback when dialog is closed |
| `onConfirm` | function | required | Callback when confirmed (supports async) |
| `title` | string | required | Dialog title |
| `message` | string | required* | Dialog message (*not required if using children) |

### Variant & Styling
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | string | 'warning' | 'success' \| 'warning' \| 'error' \| 'info' \| 'delete' |
| `showIcon` | boolean | true | Show variant icon in title |
| `maxWidth` | string | 'sm' | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' |

### Button Customization
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `confirmText` | string | 'Confirm' | Confirm button text |
| `cancelText` | string | 'Cancel' | Cancel button text |

### Advanced Features
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `loading` | boolean | false | Show loading state |
| `loadingText` | string | 'Processing...' | Text during loading |
| `countdown` | number | 0 | Countdown timer in seconds |
| `requireConfirmation` | boolean | false | Require text input to confirm |
| `confirmationText` | string | 'CONFIRM' | Text that must be typed |
| `disableBackdropClick` | boolean | false | Prevent closing on backdrop click |
| `children` | node | null | Custom content (replaces message) |

---

## 🎨 Variant Color Reference

| Variant | Icon | Color | Use Case |
|---------|------|-------|----------|
| `success` | ✓ CheckCircle | Green | Success confirmations, completions |
| `warning` | ⚠ Warning | Orange | Caution, unsaved changes |
| `error` | ⊗ Error | Red | Failures, critical actions |
| `info` | ⓘ Info | Blue | Information, updates |
| `delete` | 🗑 Delete | Red | Destructive delete actions |

---

## 💡 Common Use Cases

### File Delete
```jsx
<ConfirmationDialog
  open={deleteDialogOpen}
  onClose={() => setDeleteDialogOpen(false)}
  onConfirm={async () => {
    await deleteFile(fileId);
    toast.success('File deleted');
    setDeleteDialogOpen(false);
  }}
  title="Delete File?"
  message={`Are you sure you want to delete "${fileName}"? This action cannot be undone.`}
  variant="delete"
  confirmText="Delete"
/>
```

---

### Logout Confirmation
```jsx
<ConfirmationDialog
  open={logoutDialogOpen}
  onClose={() => setLogoutDialogOpen(false)}
  onConfirm={async () => {
    await dispatch(logout());
    navigate('/');
    toast.success('Logged out successfully');
  }}
  title="Logout"
  message="Are you sure you want to logout?"
  variant="warning"
  confirmText="Logout"
  cancelText="Stay Logged In"
/>
```

---

### Submit Form
```jsx
<ConfirmationDialog
  open={submitDialogOpen}
  onClose={() => setSubmitDialogOpen(false)}
  onConfirm={async () => {
    await submitForm(formData);
    toast.success('Form submitted');
    setSubmitDialogOpen(false);
  }}
  title="Submit Form?"
  message="Please review your information before submitting. You won't be able to edit this later."
  variant="info"
  confirmText="Submit"
  cancelText="Review Again"
/>
```

---

### Account Deletion (Secure)
```jsx
<ConfirmationDialog
  open={deleteAccountOpen}
  onClose={() => setDeleteAccountOpen(false)}
  onConfirm={async () => {
    await deleteAccount();
    navigate('/');
  }}
  title="Delete Account Permanently"
  message="This will permanently delete your account and all associated data. This action cannot be undone."
  variant="delete"
  countdown={10}
  requireConfirmation={true}
  confirmationText="DELETE MY ACCOUNT"
  confirmText="Delete Forever"
  disableBackdropClick={true}
/>
```

---

## 🔄 Migration Guide

### Existing Code (Still Works!)
```jsx
// OLD CODE - No changes needed!
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Delete?"
  message="Are you sure?"
/>
```

### Enhanced Version
```jsx
// NEW CODE - With enhancements
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Delete?"
  message="Are you sure?"
  variant="delete"        // ← Add variant
  requireConfirmation     // ← Add safety
  confirmationText="DELETE"
/>
```

---

## 🎨 Styling Examples

### Custom Max Width
```jsx
<ConfirmationDialog
  maxWidth="md"  // Larger dialog
  // ... other props
/>
```

### With Alert Inside
```jsx
<ConfirmationDialog
  open={open}
  onClose={handleClose}
  onConfirm={handleConfirm}
  title="Important Notice"
  variant="warning"
>
  <Alert severity="warning" sx={{ mb: 2 }}>
    <strong>Warning:</strong> This action cannot be undone!
  </Alert>
  <Typography>
    Are you sure you want to proceed with this operation?
  </Typography>
</ConfirmationDialog>
```

---

## 🧪 Testing Examples

### Test Basic Dialog
```jsx
function TestBasicDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Open Basic Dialog
      </Button>
      
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          console.log('Confirmed!');
          setOpen(false);
        }}
        title="Basic Dialog"
        message="This is a basic confirmation dialog."
      />
    </>
  );
}
```

### Test All Variants
```jsx
function TestVariants() {
  const [variant, setVariant] = useState('success');
  const [open, setOpen] = useState(false);

  const variants = ['success', 'warning', 'error', 'info', 'delete'];

  return (
    <>
      {variants.map((v) => (
        <Button
          key={v}
          onClick={() => {
            setVariant(v);
            setOpen(true);
          }}
        >
          {v}
        </Button>
      ))}
      
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        title={`${variant} Dialog`}
        message={`This is a ${variant} confirmation dialog.`}
        variant={variant}
      />
    </>
  );
}
```

### Test Async Confirmation
```jsx
function TestAsync() {
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success('Action completed!');
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Test Async
      </Button>
      
      <ConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        title="Async Action"
        message="This will take 2 seconds to complete."
        variant="info"
        loadingText="Processing..."
      />
    </>
  );
}
```

---

## ✅ Best Practices

### 1. ✅ DO: Use appropriate variant
```jsx
// Destructive action
<ConfirmationDialog variant="delete" />

// Warning/caution
<ConfirmationDialog variant="warning" />

// Success confirmation
<ConfirmationDialog variant="success" />
```

### 2. ✅ DO: Add confirmation for critical actions
```jsx
<ConfirmationDialog
  variant="delete"
  requireConfirmation={true}
  confirmationText="DELETE"
/>
```

### 3. ✅ DO: Use countdown for irreversible actions
```jsx
<ConfirmationDialog
  variant="delete"
  countdown={5}
/>
```

### 4. ✅ DO: Support async actions
```jsx
const handleConfirm = async () => {
  await performAction();
};
```

### 5. ❌ DON'T: Autofocu confirm button for destructive actions
```jsx
// The enhanced dialog doesn't autofocus confirm by default ✅
// This prevents accidental confirmations
```

---

## 🎯 Summary

**Features Added:**
- ✅ 5 variants (success, warning, error, info, delete)
- ✅ Icons for each variant
- ✅ Loading states (automatic async detection)
- ✅ Countdown timers
- ✅ Confirmation input requirement
- ✅ Custom button text
- ✅ Custom max width
- ✅ Disable backdrop click
- ✅ Custom content support
- ✅ Close button in title
- ✅ 100% backward compatible

**Line Count:**
- Before: 20 lines
- After: 330 lines
- Professional features: 10+

**Ready to use!** 🚀
