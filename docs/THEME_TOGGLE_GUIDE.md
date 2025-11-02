# Theme Toggle Feature

## Overview
The application now supports both light and dark themes with a toggle button in the header.

## Features
- **Theme Toggle Button**: Sun/Moon icon button in the header
- **Persistent Theme**: Theme preference is saved to localStorage
- **System Preference Detection**: Automatically detects system theme preference on first visit
- **No Flash**: Theme is applied before React hydration to prevent flash of unstyled content
- **Smooth Transitions**: All theme changes are animated smoothly

## Implementation Details

### Components
1. **ThemeContext** (`lib/contexts/ThemeContext.tsx`)
   - Manages theme state
   - Provides `useTheme()` hook
   - Handles localStorage persistence

2. **ThemeToggle** (`components/ui/theme-toggle.tsx`)
   - Toggle button component with animated icons
   - Located in the header next to ExportButton and UserMenu

### Theme Colors
Both light and dark themes use CSS variables defined in `app/globals.css`:

**Light Theme** (default):
- Clean white backgrounds
- Dark text for readability
- Subtle gray accents

**Dark Theme**:
- Deep black backgrounds
- Light text
- Blue/indigo accents

### Usage

#### Using the Theme Toggle
Simply click the sun/moon icon in the header to switch between themes.

#### Accessing Theme in Components
```tsx
import { useTheme } from '@/lib/contexts/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <div>
      Current theme: {theme}
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

## Locations
The theme toggle button appears in:
- Main chat interface header
- Chat interface with persistence header
- Auth page (top-right corner)

## Technical Notes
- Uses Tailwind CSS v4 with CSS variables
- Theme class is applied to `<html>` element
- Supports `prefers-color-scheme` media query
- No external dependencies required
