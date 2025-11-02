# Export Agent Flow Diagram

## Complete Export Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ User clicks "Export to PDF"
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    components/ui/export-button.tsx               │
│                                                                  │
│  handleExport(format: 'pdf' | 'html' | 'markdown')             │
│      ↓                                                           │
│  exportToPDF(messages, title)                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    lib/export-utils.ts                           │
│                                                                  │
│  Step 1: Combine Messages                                       │
│  ┌────────────────────────────────────────────────────┐        │
│  │ const rawContent = messages                         │        │
│  │   .map(msg => msg.content)                         │        │
│  │   .join('\n\n---\n\n');                            │        │
│  └────────────────────────────────────────────────────┘        │
│                              │                                   │
│                              ↓                                   │
│  Step 2: Enhance with Export Agent                              │
│  ┌────────────────────────────────────────────────────┐        │
│  │ const enhanced = await enhanceContentForExport(    │        │
│  │   rawContent,                                      │        │
│  │   'pdf',                                           │        │
│  │   conversationTitle                                │        │
│  │ );                                                 │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              enhanceContentForExport() Function                  │
│                                                                  │
│  const exportAgent = mastra.getAgent('exportAgent');           │
│                                                                  │
│  const prompt = `                                               │
│    Enhance this content for PDF export:                         │
│    1. Add table of contents                                     │
│    2. Insert page breaks (---PAGE_BREAK---)                    │
│    3. Optimize heading hierarchy                                │
│    4. Improve structure                                         │
│    5. Preserve citations                                        │
│                                                                  │
│    Content: ${rawContent}                                       │
│  `;                                                             │
│                                                                  │
│  const result = await exportAgent.generate(prompt);            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXPORT AGENT (Gemini 2.5 Flash Lite)         │
│                                                                  │
│  AI Processing:                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │ 1. Analyze document structure                      │        │
│  │ 2. Generate table of contents                      │        │
│  │ 3. Insert page break markers                       │        │
│  │ 4. Validate heading hierarchy                      │        │
│  │ 5. Optimize for PDF format                         │        │
│  │ 6. Preserve all citations                          │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                  │
│  Output: Enhanced Markdown Content                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ENHANCED CONTENT                              │
│                                                                  │
│  # Quantum Computing Research                                   │
│                                                                  │
│  ## Table of Contents                                           │
│  1. Introduction                                                │
│  2. Quantum Algorithms                                          │
│  3. Conclusion                                                  │
│  4. References                                                  │
│                                                                  │
│  ---PAGE_BREAK---                                              │
│                                                                  │
│  ## Introduction                                                │
│  Quantum computing represents...                                │
│                                                                  │
│  ---PAGE_BREAK---                                              │
│                                                                  │
│  ## Quantum Algorithms                                          │
│  Shor's algorithm provides...                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PDF GENERATION (jsPDF)                        │
│                                                                  │
│  Process Enhanced Content:                                      │
│  ┌────────────────────────────────────────────────────┐        │
│  │ 1. Parse markdown                                  │        │
│  │ 2. Apply styles (fonts, colors, sizes)            │        │
│  │ 3. Handle page breaks (---PAGE_BREAK---)          │        │
│  │ 4. Add page numbers                                │        │
│  │ 5. Generate PDF binary                             │        │
│  └────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    DOWNLOAD TO USER                              │
│                                                                  │
│  Quantum_Computing_Research_1234567890.pdf                      │
│                                                                  │
│  ✅ Professional formatting                                     │
│  ✅ Table of contents                                           │
│  ✅ Proper page breaks                                          │
│  ✅ Consistent styling                                          │
│  ✅ All citations preserved                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Comparison: With vs Without Export Agent

### Without Export Agent (Old Approach)
```
User → Export Button → export-utils.ts → jsPDF → PDF
                                          ↓
                                    Basic PDF
                                    - No TOC
                                    - Random page breaks
                                    - Inconsistent structure
```

### With Export Agent (Current Approach)
```
User → Export Button → export-utils.ts → Export Agent → Enhanced Content → jsPDF → PDF
                                              ↓                                      ↓
                                        AI Enhancement                      Professional PDF
                                        - Add TOC                           - Table of contents
                                        - Optimize breaks                   - Smart page breaks
                                        - Fix hierarchy                     - Consistent structure
                                        - Improve structure                 - Publication-ready
```

## Detailed Step-by-Step Flow

### Step 1: User Initiates Export
```typescript
// User clicks button in UI
<ExportButton 
  messages={messages} 
  conversationTitle="Quantum Computing Research"
/>
```

### Step 2: Export Function Called
```typescript
// components/ui/export-button.tsx
const handleExport = async (format: string) => {
  switch (format) {
    case 'pdf':
      await exportToPDF(messages, conversationTitle);
      break;
  }
};
```

### Step 3: Content Preparation
```typescript
// lib/export-utils.ts
export async function exportToPDF(messages, title) {
  // Combine all AI messages
  const rawContent = messages
    .filter(msg => msg.type === MessageType.AI)
    .map(msg => msg.content)
    .join('\n\n---\n\n');
  
  // Log start
  console.log('🤖 Using export agent to enhance content for PDF...');
  
  // Enhance with AI
  const enhancedContent = await enhanceContentForExport(
    rawContent,
    'pdf',
    title
  );
  
  // Log completion
  console.log('✅ Export agent enhancement complete');
  
  // Continue with PDF generation...
}
```

### Step 4: Export Agent Enhancement
```typescript
async function enhanceContentForExport(content, format, title) {
  const exportAgent = mastra.getAgent('exportAgent');
  
  const prompt = `
    You are preparing a research document for ${format} export.
    
    Title: ${title}
    
    Task:
    1. Add table of contents
    2. Insert page breaks (---PAGE_BREAK---)
    3. Optimize heading hierarchy
    4. Improve structure
    5. Preserve citations
    
    Content:
    ${content}
  `;
  
  const result = await exportAgent.generate(prompt, { maxSteps: 3 });
  return result.text || content; // Fallback if fails
}
```

### Step 5: AI Processing
```
Export Agent (Gemini 2.5 Flash Lite):
1. Analyzes document structure
2. Identifies main sections
3. Generates table of contents
4. Determines optimal page break locations
5. Validates heading hierarchy (h1 → h2 → h3)
6. Adds professional touches
7. Returns enhanced markdown
```

### Step 6: PDF Generation
```typescript
// jsPDF processes enhanced content
const lines = enhancedContent.split('\n');

lines.forEach(line => {
  if (line.includes('---PAGE_BREAK---')) {
    doc.addPage(); // New page
  } else if (line.startsWith('# ')) {
    // Render h1 heading
  } else if (line.startsWith('## ')) {
    // Render h2 heading
  } else {
    // Render paragraph
  }
});
```

### Step 7: Download
```typescript
// Save and download
doc.save(`${title}_${Date.now()}.pdf`);
```

## Error Handling Flow

```
enhanceContentForExport()
    ↓
Try: Call Export Agent
    ↓
    ├─ Success → Return enhanced content
    │
    └─ Error → Catch exception
              ↓
              Log error
              ↓
              Return original content (fallback)
              ↓
              Export continues with original content
```

**Result**: Export always works, even if export agent fails!

## Performance Metrics

```
┌─────────────────────────────────────────────────────────────┐
│                    Export Timeline                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  0s ────────────────────────────────────────────────── 10s  │
│  │                                                       │   │
│  │ User clicks                                           │   │
│  │ "Export"                                              │   │
│  │                                                       │   │
│  ├─ Combine messages (0.1s)                             │   │
│  │                                                       │   │
│  ├─ Export agent enhancement (2-4s)                     │   │
│  │  └─ AI processing                                    │   │
│  │                                                       │   │
│  ├─ PDF generation (1-2s)                               │   │
│  │  └─ jsPDF rendering                                  │   │
│  │                                                       │   │
│  └─ Download (0.1s)                                     │   │
│                                                              │
│  Total: 3-7 seconds                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Token Usage

```
┌─────────────────────────────────────────────────────────────┐
│                Export Agent Token Usage                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input Tokens:  300-700 (original content)                  │
│  Output Tokens: 400-800 (enhanced content)                  │
│  Total:         700-1500 tokens per export                  │
│                                                              │
│  Cost: ~$0.001-0.002 per export (Gemini Flash Lite)        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Multi-Format Support

```
                    ┌─────────────────┐
                    │  Raw Content    │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ↓            ↓            ↓
         ┌──────────┐ ┌──────────┐ ┌──────────┐
         │   PDF    │ │   HTML   │ │ Markdown │
         │ Export   │ │ Export   │ │ Export   │
         └────┬─────┘ └────┬─────┘ └────┬─────┘
              │            │            │
              ↓            ↓            ↓
      ┌──────────────────────────────────────┐
      │      Export Agent Enhancement        │
      │                                      │
      │  Format-specific optimizations:      │
      │  • PDF: Page breaks, TOC, margins    │
      │  • HTML: Semantic tags, anchors      │
      │  • Markdown: Clean syntax, rules     │
      └──────────────┬───────────────────────┘
                     │
                     ↓
              ┌──────────────┐
              │   Enhanced   │
              │   Content    │
              └──────────────┘
```

---

**This diagram shows the complete export workflow with the export agent as a central component for content enhancement.**
