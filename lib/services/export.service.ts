/**
 * Server-Side Export Service
 * Uses export agent to enhance content before export
 * This runs on the server, so it can safely use Mastra
 */

import { mastra } from '../mastra';
import { Message } from '@/types/schema';
import { MessageType } from '@/types/enums';

export class ExportService {
  /**
   * Filter messages to only include AI responses
   */
  private static filterAIMessages(messages: Message[]): Message[] {
    return messages.filter(msg => msg.type === MessageType.AI);
  }

  /**
   * Use export agent to enhance content before export
   * Adds table of contents, improves structure, optimizes for format
   */
  static async enhanceContentForExport(
    content: string,
    format: 'pdf' | 'html' | 'markdown',
    conversationTitle: string
  ): Promise<string> {
    try {
      console.log(`🤖 Using export agent to enhance content for ${format.toUpperCase()}...`);

      const exportAgent = mastra.getAgent('exportAgent');

      const prompt = `You are preparing a research document for ${format.toUpperCase()} export.

**Original Title**: ${conversationTitle}

**Task**: Enhance this content for professional ${format} export by:
1. Adding a table of contents (for PDF/HTML, if content is long enough)
2. Ensuring proper heading hierarchy
3. ${format === 'pdf' ? 'ONLY add ---PAGE_BREAK--- markers SPARINGLY before MAJOR sections (like after TOC, before Introduction, before Conclusion, before References). DO NOT add page breaks before every section - only before the most important ones (3-5 page breaks maximum for a typical document).' : 'Optimizing structure for web/markdown format'}
4. Optimizing structure for ${format} format
5. Preserving all citations and references exactly as they are

**CRITICAL RULES**:
- Return ONLY the enhanced markdown content. No commentary.
- For PDF: Use page breaks SPARINGLY (3-5 maximum). Only before major sections like:
  * After Table of Contents
  * Before Introduction
  * Before Conclusion
  * Before References
- DO NOT add page breaks before every h2 heading
- Let the PDF generator handle natural page breaks

**Content to enhance**:

${content}`;

      const result = await exportAgent.generate(prompt, {
        maxSteps: 3,
      });

      console.log('✅ Export agent enhancement complete');
      return result.text || content; // Fallback to original if agent fails
    } catch (error) {
      console.error('Export agent enhancement failed, using original content:', error);
      return content; // Graceful fallback
    }
  }

  /**
   * Prepare content for export with AI enhancement
   */
  static async prepareForExport(
    messages: Message[],
    format: 'pdf' | 'html' | 'markdown',
    conversationTitle: string
  ): Promise<string> {
    // Filter to only AI messages
    const aiMessages = this.filterAIMessages(messages);

    // Combine messages into single document
    const rawContent = aiMessages.map(msg => msg.content).join('\n\n---\n\n');

    // Enhance with export agent
    const enhancedContent = await this.enhanceContentForExport(
      rawContent,
      format,
      conversationTitle
    );

    return enhancedContent;
  }
}
