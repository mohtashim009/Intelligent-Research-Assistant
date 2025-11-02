/**
 * Export Agent Usage Examples
 * 
 * This file demonstrates how the export agent is used in the application
 * to enhance content before exporting to different formats.
 */

import { mastra } from '@/lib/mastra';

/**
 * Example 1: Enhance content for PDF export
 * The export agent adds table of contents, page breaks, and optimizes structure
 */
async function enhanceForPDF() {
  const exportAgent = mastra.getAgent('exportAgent');
  
  const researchContent = `
# Quantum Computing Research

## Abstract
Quantum computing represents a paradigm shift...

## Introduction
Recent developments in quantum computing...

## Quantum Algorithms
Shor's algorithm and Grover's algorithm...

## Conclusion
The future of quantum computing...

## References
1. Nielsen, M. A., & Chuang, I. L. (2010). Quantum Computation...
  `;

  const result = await exportAgent.generate(
    `You are preparing a research document for PDF export.

**Original Title**: Quantum Computing Research

**Task**: Enhance this content for professional PDF export by:
1. Adding a table of contents
2. Ensuring proper heading hierarchy
3. Adding page break hints (use ---PAGE_BREAK--- marker before major sections)
4. Optimizing structure for PDF format
5. Preserving all citations and references exactly as they are

**CRITICAL**: Return ONLY the enhanced markdown content. No commentary.

**Content to enhance**:

${researchContent}`,
    { maxSteps: 3 }
  );

  console.log('Enhanced PDF content:', result.text);
  return result.text;
}

/**
 * Example 2: Enhance content for HTML export
 * The export agent optimizes for web display with semantic structure
 */
async function enhanceForHTML() {
  const exportAgent = mastra.getAgent('exportAgent');
  
  const researchContent = `
# AI in Healthcare

## Overview
Artificial intelligence is transforming healthcare...

## Applications
- Diagnostic imaging
- Drug discovery
- Patient monitoring
  `;

  const result = await exportAgent.generate(
    `You are preparing a research document for HTML export.

**Task**: Enhance this content for professional HTML export by:
1. Adding a table of contents with anchor links
2. Ensuring proper heading hierarchy (h1, h2, h3)
3. Optimizing structure for web display
4. Adding semantic sections

**CRITICAL**: Return ONLY the enhanced markdown content. No commentary.

**Content to enhance**:

${researchContent}`,
    { maxSteps: 3 }
  );

  console.log('Enhanced HTML content:', result.text);
  return result.text;
}

/**
 * Example 3: Enhance content for Markdown export
 * The export agent ensures clean, standard markdown syntax
 */
async function enhanceForMarkdown() {
  const exportAgent = mastra.getAgent('exportAgent');
  
  const researchContent = `
# Machine Learning Trends

Recent developments in ML...
  `;

  const result = await exportAgent.generate(
    `You are preparing a research document for Markdown export.

**Task**: Enhance this content for professional Markdown export by:
1. Ensuring clean, standard markdown syntax
2. Adding proper heading levels
3. Organizing content logically
4. Adding horizontal rules for section breaks

**CRITICAL**: Return ONLY the enhanced markdown content. No commentary.

**Content to enhance**:

${researchContent}`,
    { maxSteps: 3 }
  );

  console.log('Enhanced Markdown content:', result.text);
  return result.text;
}

/**
 * Example 4: Full export workflow
 * Shows how export agent integrates with the export utilities
 */
async function fullExportWorkflow() {
  // 1. User conducts research
  const masterAgent = mastra.getAgent('masterAgent');
  const researchResult = await masterAgent.generate([
    { role: 'user', content: 'Research quantum computing' }
  ]);
  
  console.log('Research completed:', researchResult.text.substring(0, 200) + '...');
  
  // 2. User requests export
  const exportRequest = await masterAgent.generate([
    { role: 'user', content: 'Research quantum computing' },
    { role: 'assistant', content: researchResult.text },
    { role: 'user', content: 'Export this as PDF' }
  ]);
  
  console.log('Export-ready content prepared');
  
  // 3. Export utilities use the enhanced content
  // (This happens automatically in lib/export-utils.ts)
  console.log('Content is now optimized for PDF export with:');
  console.log('- Table of contents');
  console.log('- Page break hints');
  console.log('- Proper heading hierarchy');
  console.log('- Professional structure');
}

// Export examples for use in other files
export {
  enhanceForPDF,
  enhanceForHTML,
  enhanceForMarkdown,
  fullExportWorkflow,
};

/**
 * How the Export Agent is Used in Production:
 * 
 * 1. User clicks "Export to PDF" button in UI
 * 2. components/ui/export-button.tsx calls exportToPDF()
 * 3. lib/export-utils.ts:exportToPDF() calls enhanceContentForExport()
 * 4. enhanceContentForExport() uses export agent to:
 *    - Add table of contents
 *    - Insert page breaks
 *    - Optimize structure
 *    - Improve formatting
 * 5. Enhanced content is passed to jsPDF for rendering
 * 6. User downloads professionally formatted PDF
 * 
 * Benefits of Using Export Agent:
 * - Intelligent content organization
 * - Automatic table of contents generation
 * - Format-specific optimizations
 * - Consistent professional output
 * - AI-powered structure improvements
 */
