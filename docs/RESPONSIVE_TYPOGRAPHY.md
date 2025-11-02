# Responsive Typography Implementation

## Problem
Large heading sizes (like H1 at 1.875rem/30px) don't scale well on mobile devices, causing text to overflow or wrap awkwardly. This is especially problematic in markdown content where headings can be quite long.

## Solution
Implemented responsive typography similar to GitHub's approach, where font sizes scale down on mobile devices and scale up on larger screens.

## Font Size Scaling

### Markdown Headings

| Element | Mobile (< 640px) | Desktop (≥ 640px) | Reduction |
|---------|------------------|-------------------|-----------|
| H1      | 1.5rem (24px)    | 1.875rem (30px)   | 20%       |
| H2      | 1.25rem (20px)   | 1.5rem (24px)     | 17%       |
| H3      | 1.125rem (18px)  | 1.25rem (20px)    | 10%       |
| H4      | 1rem (16px)      | 1.125rem (18px)   | 11%       |

### Body Text

| Element | Mobile (< 640px)  | Desktop (≥ 640px) |
|---------|-------------------|-------------------|
| Paragraph | 0.9375rem (15px) | 1rem (16px)       |
| List items | 0.9375rem (15px) | 1rem (16px)       |
| Inline code | 0.8125rem (13px) | 0.875rem (14px)   |

### Utility Classes

| Class | Mobile (< 640px) | Desktop (≥ 640px) |
|-------|------------------|-------------------|
| .text-heading-xl | 1.75rem (28px) | 2.25rem (36px) |
| .text-heading-lg | 1.5rem (24px) | 1.875rem (30px) |
| .text-heading-md | 1.25rem (20px) | 1.5rem (24px) |

## Implementation Details

### CSS Media Queries
Used `@media (min-width: 640px)` breakpoint (Tailwind's `sm` breakpoint) to apply larger sizes on tablet and desktop devices.

### Mobile-First Approach
- Base styles define mobile sizes (smaller)
- Media queries enhance for larger screens
- Ensures optimal readability on all devices

### Line Height Adjustments
Slightly increased line-height on mobile for better readability with smaller text:
- H1: 1.25 (mobile) → 1.2 (desktop)
- H2: 1.35 (mobile) → 1.3 (desktop)
- H3: 1.45 (mobile) → 1.4 (desktop)

## Benefits

1. **Better Mobile Experience**: Text fits better on small screens without overflow
2. **Improved Readability**: Appropriately sized text for each device
3. **Consistent with Industry Standards**: Similar to GitHub, Medium, and other content platforms
4. **No Breaking Changes**: Desktop experience remains the same
5. **Automatic Scaling**: Works for all markdown content without code changes

## Example

### Before (Fixed Size)
```
Mobile: H1 at 30px - too large, causes wrapping issues
Desktop: H1 at 30px - perfect
```

### After (Responsive)
```
Mobile: H1 at 24px - fits better, easier to read
Desktop: H1 at 30px - same as before
```

## Files Modified
- `app/globals.css`: Added responsive font sizes for all markdown elements and utility classes

## Testing
Test on various screen sizes:
- Mobile (< 640px): Smaller, more compact text
- Tablet (640px - 1024px): Medium-sized text
- Desktop (> 1024px): Full-sized text
