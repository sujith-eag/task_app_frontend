# Theme System - Quick Reference Card

## 🎨 How to Use the Enhanced Theme System

### Basic Theme Toggle (Already Implemented)
```jsx
// In Header.jsx or any component
import { useContext } from 'react';
import { ColorModeContext } from '../../context/ThemeContext';

function MyComponent() {
  const colorMode = useContext(ColorModeContext);
  
  return (
    <IconButton onClick={colorMode.toggleColorMode}>
      {colorMode.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}
```

---

## 🎯 Key Features Now Available

### 1. Theme Persistence ✅
- **Automatically saves** your preference to localStorage
- **Key:** `'app-theme-mode'`
- **Values:** `'light'` or `'dark'`
- **Survives:** Page refresh, browser restart, window close

### 2. System Preference Detection ✅
- **First Visit:** Auto-detects OS theme preference
- **Subsequent Visits:** Uses saved preference
- **Dynamic Sync:** If no manual preference, follows OS changes

### 3. Mobile Integration ✅
- **Theme Color:** Updates browser chrome color
- **Light Mode:** `#1976d2` (blue)
- **Dark Mode:** `#0a0e27` (deep background)

---

## 🎨 Available Colors

### Light Mode Palette
```javascript
primary.main:      #1976d2  // Vibrant blue
secondary.main:    #dc004e  // Pink/red
success.main:      #2e7d32  // Green
warning.main:      #ed6c02  // Orange
error.main:        #d32f2f  // Red
info.main:         #0288d1  // Light blue

background.default: #f5f7fa // Soft gray
background.paper:   #ffffff // White
background.neutral: #f4f6f8 // Alternative gray

text.primary:       rgba(0,0,0,0.87)
text.secondary:     rgba(0,0,0,0.6)
```

### Dark Mode Palette
```javascript
primary.main:      #90caf9  // Soft blue
secondary.main:    #f48fb1  // Soft pink
success.main:      #66bb6a  // Bright green
warning.main:      #ffa726  // Bright orange
error.main:        #f44336  // Bright red
info.main:         #29b6f6  // Bright cyan

background.default: #0a0e27 // Deep blue-black
background.paper:   #1a1f3a // Elevated surface
background.neutral: #151a30 // Alternative dark

text.primary:       #ffffff
text.secondary:     #b0bec5
```

---

## 📐 Typography Scale

```javascript
h1:      2.5rem  (40px) - font-weight: 600
h2:      2rem    (32px) - font-weight: 600
h3:      1.75rem (28px) - font-weight: 600
h4:      1.5rem  (24px) - font-weight: 600
h5:      1.25rem (20px) - font-weight: 600
h6:      1rem    (16px) - font-weight: 600

subtitle1: 1rem    (16px) - font-weight: 500
subtitle2: 0.875rem (14px) - font-weight: 500

body1:    1rem    (16px) - font-weight: 400
body2:    0.875rem (14px) - font-weight: 400

button:   0.875rem (14px) - font-weight: 500 - no uppercase
caption:  0.75rem (12px) - font-weight: 400
overline: 0.75rem (12px) - font-weight: 500 - uppercase
```

---

## 🎭 Component Styling Examples

### Cards with Hover Effect
```jsx
<Card>
  {/* Automatically has: */}
  {/* - 16px border radius */}
  {/* - Hover lift animation */}
  {/* - Theme-aware shadow */}
</Card>
```

### Buttons
```jsx
<Button variant="contained">
  {/* Automatically has: */}
  {/* - 8px border radius */}
  {/* - Hover lift effect */}
  {/* - Shadow elevation */}
  {/* - No uppercase text */}
</Button>
```

### Text Fields
```jsx
<TextField />
{/* Automatically has: */}
{/* - 8px border radius */}
{/* - Smooth hover transition */}
{/* - Colored focus border */}
```

### Dialogs
```jsx
<Dialog>
  {/* Automatically has: */}
  {/* - 16px border radius */}
  {/* - Backdrop blur effect */}
  {/* - Enhanced shadow */}
</Dialog>
```

### Menus
```jsx
<Menu>
  {/* Automatically has: */}
  {/* - 12px border radius */}
  {/* - Smooth animations */}
  {/* - Hover states */}
</Menu>
```

---

## 🔧 Accessing Theme Values

### Using useTheme Hook
```jsx
import { useTheme } from '@mui/material/styles';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
      padding: theme.spacing(2), // 16px
      borderRadius: theme.shape.borderRadius, // 12px
    }}>
      Content
    </Box>
  );
}
```

### Using sx Prop (Recommended)
```jsx
<Box
  sx={{
    backgroundColor: 'background.paper',
    color: 'text.primary',
    p: 2, // padding: 16px
    borderRadius: 1, // 12px
    boxShadow: 2, // theme-aware shadow
  }}
>
  Content
</Box>
```

---

## 🎨 Custom Styling Patterns

### Glassmorphism Effect
```jsx
<Box
  sx={{
    background: (theme) => 
      theme.palette.mode === 'dark'
        ? 'rgba(26, 31, 58, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    border: (theme) => `1px solid ${theme.palette.divider}`,
  }}
>
  Glass effect content
</Box>
```

### Gradient Background
```jsx
<Box
  sx={{
    background: (theme) => 
      theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }}
>
  Gradient content
</Box>
```

### Hover Animation
```jsx
<Card
  sx={{
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: (theme) => theme.shadows[8],
    },
  }}
>
  Animated card
</Card>
```

---

## 🌓 Conditional Styling Based on Theme

### Using sx Prop
```jsx
<Typography
  sx={{
    color: (theme) => 
      theme.palette.mode === 'dark' 
        ? 'primary.light' 
        : 'primary.dark',
  }}
>
  Adapts to theme
</Typography>
```

### Using Theme Hook
```jsx
function MyComponent() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ 
      backgroundColor: isDark ? 'grey.900' : 'grey.100' 
    }}>
      {isDark ? 'Dark Mode!' : 'Light Mode!'}
    </Box>
  );
}
```

---

## 📱 Responsive Design

### Breakpoints
```javascript
xs: 0px      // Extra small (mobile)
sm: 600px    // Small (tablet)
md: 900px    // Medium (small laptop)
lg: 1200px   // Large (desktop)
xl: 1536px   // Extra large (large desktop)
```

### Responsive Styling
```jsx
<Box
  sx={{
    padding: { 
      xs: 1,  // 8px on mobile
      sm: 2,  // 16px on tablet
      md: 3,  // 24px on desktop
    },
    fontSize: {
      xs: '0.875rem',  // 14px
      md: '1rem',      // 16px
    },
  }}
>
  Responsive content
</Box>
```

---

## 🎯 Best Practices

### ✅ DO:
```jsx
// Use theme palette colors
<Box sx={{ color: 'primary.main' }} />

// Use spacing system
<Box sx={{ p: 2, m: 1 }} />

// Use breakpoints for responsiveness
<Box sx={{ display: { xs: 'block', md: 'flex' } }} />

// Access theme in sx prop
<Box sx={{ color: (theme) => theme.palette.text.primary }} />
```

### ❌ DON'T:
```jsx
// Don't hardcode colors
<Box sx={{ color: '#1976d2' }} /> // ❌

// Don't hardcode spacing
<Box sx={{ padding: '16px' }} /> // ❌

// Don't ignore breakpoints
<Box sx={{ width: 1200 }} /> // ❌

// Don't use inline styles
<div style={{ color: 'blue' }} /> // ❌
```

---

## 🔄 Theme Context API

### Available Methods
```jsx
const { 
  toggleColorMode,  // () => void
  mode,            // 'light' | 'dark'
  setMode,         // (mode: 'light' | 'dark') => void
} = useContext(ColorModeContext);
```

### Examples
```jsx
// Toggle theme
toggleColorMode();

// Check current theme
if (mode === 'dark') {
  // Dark mode specific logic
}

// Set theme directly
setMode('light'); // Force light mode
setMode('dark');  // Force dark mode
```

---

## 🎨 Custom Color Variants

### Primary Color Shades
```jsx
primary.light:  #42a5f5 (light mode) | #b3d9ff (dark mode)
primary.main:   #1976d2 (light mode) | #90caf9 (dark mode)
primary.dark:   #1565c0 (light mode) | #5d99c6 (dark mode)
```

### Usage
```jsx
<Button color="primary" variant="contained">
  Primary (main)
</Button>

<Typography color="primary.light">
  Primary Light
</Typography>

<Box sx={{ bgcolor: 'primary.dark' }}>
  Primary Dark
</Box>
```

---

## 🛠️ Debugging Tips

### Check Current Theme
```jsx
// In browser console
localStorage.getItem('app-theme-mode'); // 'light' or 'dark'
```

### Force Theme
```jsx
// In browser console
localStorage.setItem('app-theme-mode', 'dark');
window.location.reload();
```

### Clear Theme Preference
```jsx
// In browser console
localStorage.removeItem('app-theme-mode');
window.location.reload(); // Will use system preference
```

### Inspect Theme Object
```jsx
function DebugTheme() {
  const theme = useTheme();
  console.log('Current theme:', theme);
  return null;
}
```

---

## 📊 Performance Tips

### Memoize Theme-Dependent Values
```jsx
const cardStyles = useMemo(() => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
}), [theme.palette.mode]);
```

### Avoid Inline Functions in sx
```jsx
// ❌ Bad (recreates on every render)
<Box sx={{ color: () => theme.palette.primary.main }} />

// ✅ Good (memoized by MUI)
<Box sx={{ color: 'primary.main' }} />
```

---

## 🎓 Common Patterns

### Loading Skeleton
```jsx
<Skeleton 
  variant="rectangular" 
  width="100%" 
  height={200}
  sx={{ borderRadius: 2 }}
/>
```

### Gradient Text
```jsx
<Typography
  sx={{
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  }}
>
  Gradient Text
</Typography>
```

### Frosted Glass Card
```jsx
<Card
  sx={{
    background: (theme) => 
      theme.palette.mode === 'dark'
        ? 'rgba(26, 31, 58, 0.8)'
        : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    border: (theme) => `1px solid ${theme.palette.divider}`,
  }}
>
  Frosted glass content
</Card>
```

---

## 📚 Resources

### Documentation
- MUI Theme: https://mui.com/material-ui/customization/theming/
- MUI sx prop: https://mui.com/system/getting-started/the-sx-prop/
- MUI palette: https://mui.com/material-ui/customization/palette/

### Tools
- MUI Color Tool: https://m2.material.io/design/color/
- Contrast Checker: https://webaim.org/resources/contrastchecker/

---

**Last Updated:** October 30, 2025  
**Version:** 2.0 (Enhanced Theme System)
