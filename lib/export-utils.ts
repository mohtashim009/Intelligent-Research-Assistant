import { Message } from '@/types/schema';
import { MessageType } from '@/types/enums';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

// Convert markdown to HTML
async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const processedContent = await remark()
      .use(remarkGfm)
      .use(html, { sanitize: false })
      .process(markdown);
    
    return processedContent.toString();
  } catch (error) {
    console.error('Error processing markdown:', error);
    return markdown.replace(/\n/g, '<br>');
  }
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
  const margin = 25;
  const contentWidth = pageWidth - (2 * margin);
  const lineHeight = 6;
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

  // Helper to clean and format text for PDF
  const cleanTextForPDF = (text: string): string => {
    // Remove markdown formatting
    let cleaned = text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
      .replace(/\*(.+?)\*/g, '$1') // Italic  
      .replace(/`(.+?)`/g, '"$1"') // Inline code to quotes
      .replace(/~~(.+?)~~/g, '$1'); // Strikethrough
    
    // Handle links but PRESERVE numbered citations [1], [2], etc.
    // First, protect numbered citations
    const citations: string[] = [];
    cleaned = cleaned.replace(/\[(\d+(?:,\s*\d+)*)\]/g, (match) => {
      const placeholder = `__CITATION_${citations.length}__`;
      citations.push(match);
      return placeholder;
    });
    
    // Now remove markdown links (but not citations)
    cleaned = cleaned.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
    
    // Restore numbered citations
    citations.forEach((citation, index) => {
      cleaned = cleaned.replace(`__CITATION_${index}__`, citation);
    });
    
    return cleaned;
  };

  // Helper to process markdown-like text
  const processMarkdownLine = (line: string) => {
    // Check for headers
    if (line.startsWith('# ')) {
      // H1 needs space for heading + underline + at least 3 lines of content
      const requiredSpace = lineHeight * 8;
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin + 10;
      }
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      const text = cleanTextForPDF(line.replace(/^#\s+/, ''));
      const headerLines = doc.splitTextToSize(text, contentWidth);
      headerLines.forEach((hLine: string) => {
        doc.text(hLine, margin, yPosition);
        yPosition += lineHeight * 1.2;
      });
      yPosition += lineHeight * 0.5;
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += lineHeight * 1.5;
    } else if (line.startsWith('## ')) {
      const text = cleanTextForPDF(line.replace(/^##\s+/, ''));
      
      // Special formatting for "References" or "Sources" section
      if (text.toLowerCase() === 'references' || text.toLowerCase() === 'sources' || text.toLowerCase() === 'bibliography') {
        // References section needs space for heading + at least 5 reference entries
        const requiredSpace = lineHeight * 12;
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin + 10;
        }
        
        // Add extra space before Sources section
        yPosition += lineHeight;
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(44, 62, 80);
        doc.text(text, margin, yPosition);
        yPosition += lineHeight * 1.2;
        // Add underline for Sources
        doc.setDrawColor(44, 62, 80);
        doc.setLineWidth(0.5);
        doc.line(margin, yPosition, margin + 40, yPosition);
        yPosition += lineHeight * 1.5;
      } else {
        // H2 needs space for heading + at least 2 lines of content
        const requiredSpace = lineHeight * 6;
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin + 10;
        }
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(52, 73, 94);
        const headerLines = doc.splitTextToSize(text, contentWidth);
        headerLines.forEach((hLine: string) => {
          doc.text(hLine, margin, yPosition);
          yPosition += lineHeight * 1.1;
        });
        yPosition += lineHeight;
      }
    } else if (line.startsWith('### ')) {
      // H3 needs space for heading + at least 2 lines of content
      const requiredSpace = lineHeight * 5;
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin + 10;
      }
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 73, 94);
      const text = cleanTextForPDF(line.replace(/^###\s+/, ''));
      const headerLines = doc.splitTextToSize(text, contentWidth);
      headerLines.forEach((hLine: string) => {
        doc.text(hLine, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight * 0.8;
    } else if (line.startsWith('#### ')) {
      // H4 needs space for heading + at least 1 line of content
      const requiredSpace = lineHeight * 4;
      if (yPosition + requiredSpace > pageHeight - margin) {
        doc.addPage();
        yPosition = margin + 10;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(52, 73, 94);
      const text = cleanTextForPDF(line.replace(/^####\s+/, ''));
      doc.text(text, margin, yPosition);
      yPosition += lineHeight * 1.5;
    } else if (line.match(/^[\*\-]\s/)) {
      // Bullet points with justified text
      checkPageBreak(lineHeight * 1.5);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(26, 26, 26);
      const text = cleanTextForPDF(line.replace(/^[\*\-]\s+/, ''));
      const bulletLines = doc.splitTextToSize(text, contentWidth - 7);
      
      // Draw bullet
      doc.setFontSize(12);
      doc.text('•', margin + 1, yPosition);
      doc.setFontSize(10.5);
      
      bulletLines.forEach((bLine: string, idx: number) => {
        if (idx > 0) checkPageBreak();
        // Justify all lines except the last
        if (idx < bulletLines.length - 1) {
          doc.text(bLine, margin + 7, yPosition, { align: 'justify', maxWidth: contentWidth - 7 });
        } else {
          doc.text(bLine, margin + 7, yPosition);
        }
        yPosition += lineHeight * 0.95;
      });
      yPosition += lineHeight * 0.3;
    } else if (line.match(/^\d+\.\s/)) {
      // Numbered lists with justified text (including Sources)
      checkPageBreak(lineHeight * 1.5);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(26, 26, 26);
      const match = line.match(/^(\d+)\.\s+(.+)$/);
      if (match) {
        const num = match[1];
        const text = cleanTextForPDF(match[2]);
        const numLines = doc.splitTextToSize(text, contentWidth - 12);
        
        // Make the number bold for sources
        doc.setFont('helvetica', 'bold');
        doc.text(`[${num}]`, margin + 1, yPosition);
        doc.setFont('helvetica', 'normal');
        
        numLines.forEach((nLine: string, idx: number) => {
          if (idx > 0) checkPageBreak();
          // Don't justify source citations - keep them left-aligned for readability
          doc.text(nLine, margin + 12, yPosition);
          yPosition += lineHeight * 0.9;
        });
        yPosition += lineHeight * 0.4;
      }
    } else if (line.trim() === '---' || line.trim() === '***') {
      // Horizontal rule
      checkPageBreak(lineHeight * 2);
      yPosition += lineHeight * 0.5;
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += lineHeight * 1.5;
    } else if (line.trim() === '') {
      // Empty line - add spacing
      yPosition += lineHeight * 0.7;
    } else if (line.startsWith('>')) {
      // Blockquote
      checkPageBreak(lineHeight * 2);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(100, 100, 100);
      const text = cleanTextForPDF(line.replace(/^>\s*/, ''));
      const quoteLines = doc.splitTextToSize(text, contentWidth - 8);
      
      // Draw left border for blockquote
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(1);
      const quoteHeight = quoteLines.length * lineHeight * 0.95;
      doc.line(margin, yPosition - 2, margin, yPosition + quoteHeight);
      
      quoteLines.forEach((qLine: string) => {
        checkPageBreak();
        doc.text(qLine, margin + 5, yPosition);
        yPosition += lineHeight * 0.95;
      });
      yPosition += lineHeight * 0.5;
    } else {
      // Regular paragraph with justified alignment
      checkPageBreak(lineHeight * 1.5);
      doc.setFontSize(10.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(26, 26, 26);
      
      const cleanLine = cleanTextForPDF(line);
      const textLines = doc.splitTextToSize(cleanLine, contentWidth);
      
      textLines.forEach((tLine: string, idx: number) => {
        checkPageBreak();
        // Use justify alignment for all lines except the last one in a paragraph
        if (idx < textLines.length - 1) {
          doc.text(tLine, margin, yPosition, { align: 'justify', maxWidth: contentWidth });
        } else {
          doc.text(tLine, margin, yPosition, { align: 'left' });
        }
        yPosition += lineHeight * 0.95;
      });
      yPosition += lineHeight * 0.4;
    }
  };

  // Title Page - centered and professional
  yPosition = pageHeight / 3; // Start 1/3 down the page
  
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  const titleLines = doc.splitTextToSize(conversationTitle, contentWidth - 20);
  titleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += lineHeight * 2;
  });
  
  yPosition += lineHeight * 2;
  
  // Decorative line
  doc.setDrawColor(52, 152, 219);
  doc.setLineWidth(1);
  const lineStart = pageWidth / 2 - 30;
  const lineEnd = pageWidth / 2 + 30;
  doc.line(lineStart, yPosition, lineEnd, yPosition);
  
  yPosition += lineHeight * 3;
  
  // Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(127, 140, 141);
  const dateStr = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(dateStr, pageWidth / 2, yPosition, { align: 'center' });
  
  // Start content on new page
  doc.addPage();
  yPosition = margin + 10;

  // Filter to only AI messages
  const aiMessages = filterAIMessages(messages);

  // Process each AI message
  aiMessages.forEach((message, index) => {
    if (index > 0) {
      checkPageBreak(lineHeight * 2);
      yPosition += lineHeight;
    }

    // Split message into lines and process each
    const lines = message.content.split('\n');
    lines.forEach(line => {
      processMarkdownLine(line);
    });
  });

  // Add footer with page numbers
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  }

  // Save the PDF
  doc.save(`${conversationTitle.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
}

export async function exportToHTML(messages: Message[], conversationTitle: string = 'Research Report'): Promise<void> {
  // Filter to only AI messages
  const aiMessages = filterAIMessages(messages);
  
  // Convert all markdown content to HTML
  const htmlContents = await Promise.all(
    aiMessages.map(msg => markdownToHtml(msg.content))
  );
  
  const htmlDoc = `
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
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.8;
      color: #1a1a1a;
      background: #ffffff;
      padding: 60px 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .header {
      margin-bottom: 50px;
      padding-bottom: 30px;
      border-bottom: 3px solid #2c3e50;
      text-align: center;
    }
    
    .header h1 {
      font-size: 36px;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 15px;
      letter-spacing: -0.5px;
    }
    
    .date {
      color: #7f8c8d;
      font-size: 14px;
      font-style: italic;
    }
    
    .content {
      font-size: 16px;
      line-height: 1.8;
    }
    
    .content h1 {
      font-size: 32px;
      font-weight: 700;
      color: #2c3e50;
      margin-top: 40px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #ecf0f1;
    }
    
    .content h2 {
      font-size: 26px;
      font-weight: 600;
      color: #34495e;
      margin-top: 35px;
      margin-bottom: 15px;
    }
    
    .content h3 {
      font-size: 22px;
      font-weight: 600;
      color: #34495e;
      margin-top: 30px;
      margin-bottom: 12px;
    }
    
    .content h4 {
      font-size: 19px;
      font-weight: 600;
      color: #34495e;
      margin-top: 25px;
      margin-bottom: 10px;
    }
    
    .content p {
      margin-bottom: 18px;
      text-align: justify;
    }
    
    .content ul,
    .content ol {
      margin-left: 30px;
      margin-bottom: 18px;
      padding-left: 10px;
    }
    
    .content li {
      margin-bottom: 10px;
      line-height: 1.7;
    }
    
    .content code {
      background: #f8f9fa;
      padding: 3px 8px;
      border-radius: 4px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      color: #e74c3c;
      border: 1px solid #ecf0f1;
    }
    
    .content pre {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 20px;
      border-radius: 6px;
      overflow-x: auto;
      margin: 25px 0;
      border-left: 4px solid #3498db;
    }
    
    .content pre code {
      background: none;
      padding: 0;
      color: inherit;
      border: none;
    }
    
    .content blockquote {
      border-left: 5px solid #3498db;
      padding-left: 20px;
      margin: 25px 0;
      color: #555;
      font-style: italic;
      background: #f8f9fa;
      padding: 15px 20px;
      border-radius: 0 4px 4px 0;
    }
    
    .content strong {
      font-weight: 700;
      color: #2c3e50;
    }
    
    .content em {
      font-style: italic;
    }
    
    .content a {
      color: #3498db;
      text-decoration: none;
      border-bottom: 1px solid #3498db;
      transition: all 0.2s;
    }
    
    .content a:hover {
      color: #2980b9;
      border-bottom-color: #2980b9;
    }
    
    .content hr {
      border: none;
      border-top: 2px solid #ecf0f1;
      margin: 40px 0;
    }
    
    .content table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
    }
    
    .content th,
    .content td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    .content th {
      background: #34495e;
      color: white;
      font-weight: 600;
    }
    
    .content tr:nth-child(even) {
      background: #f8f9fa;
    }
    
    @media print {
      body {
        padding: 40px;
      }
      
      .content h1,
      .content h2,
      .content h3 {
        page-break-after: avoid;
      }
      
      .content p,
      .content ul,
      .content ol,
      .content blockquote {
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
  
  <div class="content">
    ${htmlContents.join('\n<hr>\n')}
  </div>
</body>
</html>
  `.trim();

  // Create and download the HTML file
  const blob = new Blob([htmlDoc], { type: 'text/html' });
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
