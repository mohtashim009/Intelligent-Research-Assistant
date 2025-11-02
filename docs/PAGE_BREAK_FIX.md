# Page Break Marker Fix

## Issue

The `---PAGE_BREAK---` markers were showing up as visible text in exported documents instead of being processed as page break instructions.

## Root Cause

The PDF generator (`lib/export-utils.ts`) didn't have code to handle the page break markers, so they were being rendered as regular text.

## Solution

### 1. Added Page Break Handler in PDF Export

```typescript
// In processMarkdownLine function
const processMarkdownLine = (line: string) => {
  // Handle page break markers (don't render them, just add page break)
  if (line.includes('---PAGE_BREAK---') || line.includes('---PAGE-BREAK---')) {
    doc.addPage();
    yPosition = margin + 10;
    return; // Don't render the marker itself
  }
  
  // ... rest of the function
};
```

### 2. Removed Markers from HTML Export

```typescript
// Remove page break markers (they're for PDF only)
enhancedContent = enhancedContent.replace(/---PAGE[-_]BREAK---/g, '');
```

### 3. Removed Markers from Markdown Export

```typescript
// Remove page break markers (they're for PDF only)
enhancedContent = enhancedContent.replace(/---PAGE[-_]BREAK---/g, '');
```

## How It Works Now

### PDF Export
1. Export agent adds `---PAGE_BREAK---` markers before major sections
2. PDF generator detects these markers
3. Adds a new page at each marker location
4. **Does not render the marker text** ✅

### HTML Export
1. Export agent may add `---PAGE_BREAK---` markers
2. HTML export removes all markers (not needed for web)
3. Clean HTML output without markers ✅

### Markdown Export
1. Export agent may add `---PAGE_BREAK---` markers
2. Markdown export removes all markers (not standard markdown)
3. Clean markdown output without markers ✅

## Result

**Before**:
```
# Title

---PAGE_BREAK---  ← Visible in document ❌

## Section 1
Content...
```

**After**:
```
# Title

[New page starts here automatically] ✅

## Section 1
Content...
```

## Testing

To verify the fix:

1. Generate a research report
2. Export as "Enhanced PDF (with TOC)"
3. Open the PDF
4. Verify:
   - ✅ No `---PAGE_BREAK---` text visible
   - ✅ Page breaks occur before major sections
   - ✅ Table of contents is present
   - ✅ Professional formatting

## Files Modified

- `lib/export-utils.ts` - Added page break handling
- `docs/PAGE_BREAK_FIX.md` - This documentation

## Status

✅ **Fixed and tested**
✅ **Build passing**
✅ **Ready for production**
