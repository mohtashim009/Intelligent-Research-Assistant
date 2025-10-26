import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

/**
 * Convert markdown to HTML string
 * @param markdown - The markdown content to convert
 * @returns HTML string
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const processedContent = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown support
      .use(html, { sanitize: false }) // Convert to HTML
      .process(markdown);
    
    return processedContent.toString();
  } catch (error) {
    console.error('Error processing markdown:', error);
    return markdown; // Return original markdown if processing fails
  }
}
