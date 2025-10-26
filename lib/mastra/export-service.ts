import { mastra } from './index';
import { Message } from '@/types/schema';
import { MessageType } from '@/types/enums';

/**
 * Export Service - Uses the export agent to format and export research reports
 */
export class ExportService {
  /**
   * Filter messages to only include AI responses
   */
  private static filterAIMessages(messages: Message[]): Message[] {
    return messages.filter(msg => msg.type === MessageType.AI);
  }

  /**
   * Prepare content for export using the export agent
   */
  private static async prepareContentForExport(
    messages: Message[],
    format: 'pdf' | 'html' | 'markdown',
    conversationTitle: string
  ): Promise<string> {
    const aiMessages = this.filterAIMessages(messages);
    
    // Combine all AI messages into a single document
    let content = `# ${conversationTitle}\n\n`;
    content += `*Generated on ${new Date().toLocaleString()}*\n\n`;
    content += `---\n\n`;

    aiMessages.forEach((message, index) => {
      if (index > 0) {
        content += `\n---\n\n`;
      }
      content += `${message.content}\n\n`;
    });

    // Use export agent to format the content
    const exportAgent = mastra.getAgent('exportAgent');
    
    const result = await exportAgent.generate(
      `Format this research content for ${format} export. Ensure proper structure, pagination, and professional styling:\n\n${content}`,
      {
        maxSteps: 5,
      }
    );

    return result.text;
  }

  /**
   * Export to PDF with proper formatting
   */
  static async exportToPDF(messages: Message[], conversationTitle: string = 'Research Report'): Promise<void> {
    try {
      // Get formatted content from export agent
      const formattedContent = await this.prepareContentForExport(messages, 'pdf', conversationTitle);
      
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import('jspdf')).default;
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Configuration
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      const lineHeight = 7;
      let yPosition = margin;

      // Helper to add new page if needed
      const checkPageBreak = (requiredSpace: number = lineHeight) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(conversationTitle, margin, yPosition);
      yPosition += lineHeight * 2;

      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition);
      yPosition += lineHeight * 2;

      // Process formatted content
      const lines = formattedContent.split('\n');
      
      lines.forEach((line) => {
        // Handle page breaks
        if (line.includes('---PAGE_BREAK---')) {
          doc.addPage();
          yPosition = margin;
          return;
        }

        // Handle headings
        if (line.startsWith('# ')) {
          checkPageBreak(lineHeight * 2);
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          const text = line.substring(2);
          doc.text(text, margin, yPosition);
          yPosition += lineHeight * 1.5;
        } else if (line.startsWith('## ')) {
          checkPageBreak(lineHeight * 1.5);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          const text = line.substring(3);
          doc.text(text, margin, yPosition);
          yPosition += lineHeight * 1.2;
        } else if (line.startsWith('### ')) {
          checkPageBreak(lineHeight * 1.2);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          const text = line.substring(4);
          doc.text(text, margin, yPosition);
          yPosition += lineHeight;
        } else if (line.trim() === '---') {
          // Separator line
          checkPageBreak(lineHeight);
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += lineHeight;
        } else if (line.trim()) {
          // Regular text
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          
          const textLines = doc.splitTextToSize(line, contentWidth);
          textLines.forEach((textLine: string) => {
            checkPageBreak();
            doc.text(textLine, margin, yPosition);
            yPosition += lineHeight;
          });
        } else {
          // Empty line
          yPosition += lineHeight * 0.5;
        }
      });

      // Save the PDF
      doc.save(`${conversationTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      throw error;
    }
  }

  /**
   * Export to HTML with proper formatting
   */
  static async exportToHTML(messages: Message[], conversationTitle: string = 'Research Report'): Promise<void> {
    try {
      const formattedContent = await this.prepareContentForExport(messages, 'html', conversationTitle);
      
      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${conversationTitle}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
      padding: 40px 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e5e5;
    }
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #000;
      margin-bottom: 10px;
      margin-top: 30px;
    }
    
    h2 {
      font-size: 24px;
      font-weight: 600;
      color: #000;
      margin-top: 25px;
      margin-bottom: 15px;
    }
    
    h3 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    
    .date {
      color: #666;
      font-size: 14px;
    }
    
    .content {
      font-size: 15px;
      line-height: 1.7;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    p {
      margin-bottom: 15px;
    }
    
    hr {
      border: none;
      border-top: 1px solid #e5e5e5;
      margin: 30px 0;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      h1, h2, h3 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${conversationTitle}</h1>
    <div class="date">Generated on ${new Date().toLocaleString()}</div>
  </div>
  
  <div class="content">
    ${formattedContent.replace(/\n/g, '<br>')}
  </div>
</body>
</html>
      `.trim();

      // Create and download the HTML file
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${conversationTitle.replace(/\s+/g, '_')}_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to HTML:', error);
      throw error;
    }
  }

  /**
   * Export to Markdown with proper formatting
   */
  static async exportToMarkdown(messages: Message[], conversationTitle: string = 'Research Report'): Promise<void> {
    try {
      const formattedContent = await this.prepareContentForExport(messages, 'markdown', conversationTitle);

      // Create and download the markdown file
      const blob = new Blob([formattedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${conversationTitle.replace(/\s+/g, '_')}_${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Markdown:', error);
      throw error;
    }
  }
}
