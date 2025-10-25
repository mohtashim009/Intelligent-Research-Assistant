import { Message } from '@/types/schema';
import { MessageType } from '@/types/enums';

// Helper to strip markdown and get plain text
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/#{1,6}\s+/g, '') // Headers
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/`(.+?)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
    .replace(/>\s+/g, '') // Blockquotes
    .replace(/[-*+]\s+/g, '• ') // Lists
    .trim();
}

// Filter messages to only include AI responses (no User: or AI: labels)
function filterAIMessages(messages: Message[]): Message[] {
  return messages.filter(msg => msg.type === MessageType.AI);
}

export async function exportToPDF(messages: Message[], conversationTitle: string = 'Research Report'): Promise<void> {
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

  // Filter to only AI messages
  const aiMessages = filterAIMessages(messages);

  // Process each AI message
  aiMessages.forEach((message, index) => {
    doc.setTextColor(0, 0, 0);
    
    // Message separator (except for first message)
    if (index > 0) {
      checkPageBreak(lineHeight);
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += lineHeight;
    }

    // Message content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const lines = doc.splitTextToSize(message.content, contentWidth);
    
    lines.forEach((line: string) => {
      checkPageBreak();
      doc.text(line, margin, yPosition);
      yPosition += lineHeight;
    });

    yPosition += lineHeight * 0.5; // Extra space between messages
  });

  // Save the PDF
  doc.save(`${conversationTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}

export async function exportToHTML(messages: Message[], conversationTitle: string = 'Research Report'): Promise<void> {
  // Filter to only AI messages
  const aiMessages = filterAIMessages(messages);
  
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
    }
    
    .date {
      color: #666;
      font-size: 14px;
    }
    
    .message {
      margin-bottom: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #0066cc;
    }
    
    .message-content {
      font-size: 15px;
      line-height: 1.7;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    .message-content h1,
    .message-content h2,
    .message-content h3 {
      margin-top: 20px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    
    .message-content h1 { font-size: 24px; }
    .message-content h2 { font-size: 20px; }
    .message-content h3 { font-size: 18px; }
    
    .message-content p {
      margin-bottom: 12px;
    }
    
    .message-content ul,
    .message-content ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }
    
    .message-content li {
      margin-bottom: 6px;
    }
    
    .message-content code {
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 14px;
    }
    
    .message-content pre {
      background: #2d2d2d;
      color: #f8f8f2;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      margin: 15px 0;
    }
    
    .message-content pre code {
      background: none;
      padding: 0;
      color: inherit;
    }
    
    .message-content blockquote {
      border-left: 4px solid #ddd;
      padding-left: 15px;
      margin: 15px 0;
      color: #666;
      font-style: italic;
    }
    
    .message-content strong {
      font-weight: 600;
      color: #000;
    }
    
    .message-content em {
      font-style: italic;
    }
    
    .message-content a {
      color: #0066cc;
      text-decoration: none;
    }
    
    .message-content a:hover {
      text-decoration: underline;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .message {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${conversationTitle}</h1>
    <div class="date">Generated on ${new Date().toLocaleString()}</div>
  </div>
  
  <div class="messages">
    ${aiMessages.map(message => `
      <div class="message">
        <div class="message-content">${message.content}</div>
      </div>
    `).join('')}
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
}

export async function exportToMarkdown(messages: Message[], conversationTitle: string = 'Research Report'): Promise<void> {
  // Filter to only AI messages
  const aiMessages = filterAIMessages(messages);
  
  let markdown = `# ${conversationTitle}\n\n`;
  markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
  markdown += `---\n\n`;

  aiMessages.forEach((message, index) => {
    if (index > 0) {
      markdown += `\n---\n\n`;
    }
    markdown += `${message.content}\n\n`;
  });

  // Create and download the markdown file
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${conversationTitle.replace(/\s+/g, '_')}_${Date.now()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
