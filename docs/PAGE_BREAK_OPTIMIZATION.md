# Page Break Optimization

## Issue

The export agent was adding too many page breaks, resulting in:
- Page breaks before every section
- Excessive white space
- Poor document flow
- Unprofessional appearance

## Solution

Updated the export agent instructions to use page breaks **sparingly and strategically**.

## New Page Break Strategy

### ✅ Add Page Breaks ONLY Before:

1. **After Table of Contents** - Separate TOC from main content
2. **Before Introduction** - Only if document is very long (10+ pages)
3. **Before Conclusion** - Separate final thoughts
4. **Before References** - Separate bibliography

### ❌ DO NOT Add Page Breaks:

- Before every h2 heading
- Before subsections (h3, h4)
- In the middle of related content
- Between short sections

## Maximum Page Breaks

**Target**: 3-5 page breaks per document
**Rationale**: Let natural page flow handle most breaks

## Example

### Before (Too Many Breaks)
```markdown
# Title

---PAGE_BREAK---

## Table of Contents
...

---PAGE_BREAK---

## Abstract
...

---PAGE_BREAK---

## Introduction
...

---PAGE_BREAK---

## Section 1
...

---PAGE_BREAK---

## Section 2
...

---PAGE_BREAK---

## Conclusion
...

---PAGE_BREAK---

## References
...
```
**Result**: 8 page breaks = Too many! ❌

### After (Strategic Breaks)
```markdown
# Title

## Table of Contents
...

---PAGE_BREAK---

## Abstract
...

## Introduction
...

## Section 1
...

## Section 2
...

---PAGE_BREAK---

## Conclusion
...

---PAGE_BREAK---

## References
...
```
**Result**: 3 page breaks = Perfect! ✅

## Updated Instructions

### Export Service Prompt
```typescript
// For PDF: Use page breaks SPARINGLY (3-5 maximum). Only before major sections like:
//   * After Table of Contents
//   * Before Introduction
//   * Before Conclusion
//   * Before References
// DO NOT add page breaks before every h2 heading
// Let the PDF generator handle natural page breaks
```

### Export Agent Instructions
```typescript
// **IMPORTANT**: Use page breaks SPARINGLY (3-5 maximum per document)
// ONLY add ---PAGE_BREAK--- markers before MAJOR sections:
//   * After Table of Contents
//   * Before Introduction (if document is long)
//   * Before Conclusion
//   * Before References
// DO NOT add page breaks before every h2 heading
// Let natural page flow handle most breaks
```

## Benefits

1. **Better Flow**: Content flows naturally across pages
2. **Professional**: Looks like a real research paper
3. **Readable**: Related content stays together
4. **Efficient**: Less white space, more content per page
5. **Smart**: Page breaks only where they make sense

## Testing

To verify the optimization:

1. Generate a research report
2. Export as "Enhanced PDF (with TOC)"
3. Open the PDF
4. Check:
   - ✅ 3-5 page breaks maximum
   - ✅ Page breaks only before major sections
   - ✅ Good content flow
   - ✅ No excessive white space
   - ✅ Professional appearance

## Files Modified

- `lib/services/export.service.ts` - Updated prompt
- `lib/mastra/agents/export-agent.ts` - Updated instructions
- `docs/PAGE_BREAK_OPTIMIZATION.md` - This documentation

## Status

✅ **Optimized**
✅ **Build passing**
✅ **Ready for production**

## Visual Comparison

### Before (Excessive Breaks)
```
Page 1: Title + TOC
Page 2: Abstract (half page)
Page 3: Introduction (half page)
Page 4: Section 1 (half page)
Page 5: Section 2 (half page)
Page 6: Conclusion (half page)
Page 7: References
```
**Total**: 7 pages with lots of white space ❌

### After (Strategic Breaks)
```
Page 1: Title + TOC
Page 2-3: Abstract + Introduction + Section 1
Page 4-5: Section 2 + Section 3
Page 6: Conclusion
Page 7: References
```
**Total**: 7 pages with good content density ✅

## Key Takeaway

**Less is more!** Strategic page breaks create better documents than excessive breaks.
