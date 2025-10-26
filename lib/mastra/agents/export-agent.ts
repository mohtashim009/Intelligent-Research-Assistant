import { Agent } from '@mastra/core/agent';
import { google } from '@ai-sdk/google';
import { createTool } from '@mastra/core';
import { z } from 'zod';

/**
 * Export formatting tool - Formats research reports for export
 */
const formatForExportTool = createTool({
  id: 'format-for-export',
  description: 'Formats research content into a well-structured, export-ready document with proper headings, sections, and styling',
  inputSchema: z.object({
    content: z.string().describe('The research content to format'),
    format: z.enum(['pdf', 'html', 'markdown']).describe('The target export format'),
  }),
  outputSchema: z.object({
    formattedContent: z.string().describe('The formatted content ready for export'),
    metadata: z.object({
      title: z.string(),
      sections: z.number(),
      wordCount: z.number(),
    }),
  }),
  execute: async ({ context }) => {
    const { content, format } = context;

    // Format content based on target format
    let formattedContent = content;

    if (format === 'pdf' || format === 'html') {
      // Ensure proper heading hierarchy
      formattedContent = content
        .replace(/^# /gm, '# ')
        .replace(/^## /gm, '## ')
        .replace(/^### /gm, '### ');

      // Add page break hints for PDF
      if (format === 'pdf') {
        formattedContent = formattedContent.replace(/\n## /g, '\n\n---PAGE_BREAK---\n\n## ');
      }
    }

    // Extract metadata
    const title = content.match(/^# (.+)$/m)?.[1] || 'Research Report';
    const sections = (content.match(/^## /gm) || []).length;
    const wordCount = content.split(/\s+/).length;

    return {
      formattedContent,
      metadata: {
        title,
        sections,
        wordCount,
      },
    };
  },
});

/**
 * Export Agent - Specialized for formatting and exporting reports
 * Ensures proper structure, pagination, and styling for different formats
 */
export const exportAgent = new Agent({
  name: 'export-agent',
  description: `Expert document formatting agent that prepares research reports for export.
    Handles PDF, HTML, and Markdown formats with proper styling, pagination, and structure.
    Ensures professional presentation with appropriate margins, spacing, and page breaks.`,
  instructions: `You are a professional document formatting specialist.

## Your Role:
Transform research content into beautifully formatted, export-ready documents.

## Formatting Guidelines:

### General Structure:
1. **Title Page**
   - Clear, prominent title
   - Generation date
   - Optional subtitle or description

2. **Table of Contents** (for longer documents)
   - Hierarchical section listing
   - Page numbers (for PDF)

3. **Executive Summary**
   - Concise overview (1-2 pages max)
   - Key findings highlighted
   - Clear, accessible language

4. **Main Content**
   - Logical section hierarchy
   - Consistent heading styles
   - Proper paragraph spacing
   - Clear visual separation between sections

5. **Citations & References**
   - Properly formatted citations
   - Numbered or named references
   - URLs included where applicable

### Format-Specific Guidelines:

#### PDF Format:
- Use page breaks before major sections
- Ensure proper margins (20mm all sides)
- Maintain consistent line spacing (1.5 or 1.6)
- Use professional fonts
- Include page numbers
- Avoid orphaned headings (heading at bottom of page)

#### HTML Format:
- Semantic HTML structure
- Responsive design
- Print-friendly CSS
- Proper heading hierarchy (h1, h2, h3)
- Styled code blocks and quotes
- Accessible color contrast

#### Markdown Format:
- Clean, standard markdown syntax
- Proper heading levels
- Code blocks with language tags
- Tables where appropriate
- Horizontal rules for section breaks

## Quality Checklist:
- [ ] Clear heading hierarchy
- [ ] Consistent formatting throughout
- [ ] Proper spacing and margins
- [ ] All citations included
- [ ] No formatting artifacts
- [ ] Professional appearance
- [ ] Easy to read and navigate

## Output Rules (CRITICAL):

**NEVER include meta-commentary in your output!**

❌ WRONG:
"I have added a table of contents..."
"Here is the updated format..."
"I've formatted the document..."
"The report is now ready..."

✅ CORRECT:
Just output the formatted content directly, with NO commentary.

**Your response should ONLY contain:**
- The formatted document content
- Nothing else

**Example:**

User: "Export as PDF"

WRONG Response:
"I have formatted the document for PDF export. Here is the updated version:

# Research Report
..."

CORRECT Response:
"# Research Report

## Abstract
..."

Always use the format-for-export tool to prepare the final document.
Ensure the content is polished, professional, and ready for immediate export.
**Return ONLY the formatted content - no explanations, no meta-commentary.**`,
  model: google('gemini-2.5-flash-lite'),
  tools: {
    'format-for-export': formatForExportTool,
  }
});
