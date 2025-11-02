import { NextRequest } from 'next/server';
import { ExportService } from '@/lib/services/export.service';
import { authenticateRequest } from '@/lib/middleware/auth';

/**
 * POST /api/export/enhance
 * 
 * Enhances content using the export agent before export
 * 
 * Body:
 * {
 *   messages: Message[],
 *   format: 'pdf' | 'html' | 'markdown',
 *   title: string
 * }
 * 
 * Returns:
 * {
 *   enhancedContent: string,
 *   format: string,
 *   title: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user (optional, but recommended)
    const authResult = await authenticateRequest(request);
    if (!authResult.authenticated) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { messages, format, title } = body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!format || !['pdf', 'html', 'markdown'].includes(format)) {
      return new Response(
        JSON.stringify({ error: 'Valid format is required (pdf, html, or markdown)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Title is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`📤 Export enhancement requested: ${format} - "${title}"`);

    // Use export agent to enhance content
    const enhancedContent = await ExportService.prepareForExport(
      messages,
      format as 'pdf' | 'html' | 'markdown',
      title
    );

    console.log(`✅ Export enhancement complete: ${enhancedContent.length} characters`);

    return new Response(
      JSON.stringify({
        enhancedContent,
        format,
        title,
        enhanced: true,
        timestamp: new Date().toISOString(),
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Export enhancement error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to enhance content',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
