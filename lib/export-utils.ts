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
  let jsPDF;
  try {
    const jsPDFModule = await import('jspdf');
    jsPDF = jsPDFModule.default || jsPDFModule;
  } catch (error) {
    console.error('Failed to load jsPDF:', error);
    throw new Error('PDF export is not available. Please try HTML or Markdown export instead.');
  }
  
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

  // Helper to parse text with inline formatting (bold, italic, etc.)
  interface TextSegment {
    text: string;
    bold: boolean;
    italic: boolean;
  }

  const parseInlineFormatting = (text: string): TextSegment[] => {
    const segments: TextSegment[] = [];
    let currentPos = 0;
    
    // Protect numbered citations [1], [2], etc.
    const citations: Array<{match: string, pos: number}> = [];
    const citationRegex = /\[(\d+(?:,\s*\d+)*)\]/g;
    let match;
    while ((match = citationRegex.exec(text)) !== null) {
      citations.push({ match: match[0], pos: match.index });
    }
    
    // Replace citations temporarily
    let workingText = text;
    citations.reverse().forEach((cit, idx) => {
      const placeholder = `__CIT${idx}__`;
      workingText = workingText.substring(0, cit.pos) + placeholder + workingText.substring(cit.pos + cit.match.length);
    });
    
    // Parse bold (**text**) and italic (*text*)
    const formatRegex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|~~(.+?)~~)/g;
    let lastIndex = 0;
    
    while ((match = formatRegex.exec(workingText)) !== null) {
      // Add plain text before this match
      if (match.index > lastIndex) {
        const plainText = workingText.substring(lastIndex, match.index);
        if (plainText) {
          segments.push({ text: plainText, bold: false, italic: false });
        }
      }
      
      // Add formatted text
      if (match[2]) {
        // Bold + Italic (***text***)
        if (match[2].trim()) {
          segments.push({ text: match[2], bold: true, italic: true });
        }
      } else if (match[3]) {
        // Bold (**text**)
        if (match[3].trim()) {
          segments.push({ text: match[3], bold: true, italic: false });
        }
      } else if (match[4]) {
        // Italic (*text*)
        if (match[4].trim()) {
          segments.push({ text: match[4], bold: false, italic: true });
        }
      } else if (match[5]) {
        // Inline code (`text`) - treat as plain text without backticks
        if (match[5].trim()) {
          segments.push({ text: match[5], bold: false, italic: false });
        }
      } else if (match[6]) {
        // Strikethrough (~~text~~) - just remove formatting
        if (match[6].trim()) {
          segments.push({ text: match[6], bold: false, italic: false });
        }
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining plain text
    if (lastIndex < workingText.length) {
      const plainText = workingText.substring(lastIndex);
      if (plainText.trim()) {
        segments.push({ text: plainText, bold: false, italic: false });
      }
    }
    
    // Restore citations in segments
    segments.forEach(segment => {
      citations.forEach((cit, idx) => {
        segment.text = segment.text.replace(`__CIT${idx}__`, cit.match);
      });
    });
    
    // Remove markdown links [text](url) but keep the text
    segments.forEach(segment => {
      segment.text = segment.text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
    });
    
    // Remove any stray backticks that weren't part of inline code pairs
    segments.forEach(segment => {
      segment.text = segment.text.replace(/`/g, '');
    });
    
    return segments;
  };

  // Helper to render text with inline formatting
  const renderFormattedText = (text: string, x: number, y: number, maxWidth: number, options: { align?: 'left' | 'center' | 'right' | 'justify' } = {}) => {
    const segments = parseInlineFormatting(text);
    let currentX = x;
    let currentY = y;
    let lineStartX = x;
    
    segments.forEach((segment, segIdx) => {
      // Set font style
      if (segment.bold && segment.italic) {
        doc.setFont('helvetica', 'bolditalic');
      } else if (segment.bold) {
        doc.setFont('helvetica', 'bold');
      } else if (segment.italic) {
        doc.setFont('helvetica', 'italic');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      // Split text into words
      const words = segment.text.split(/(\s+)/); // Keep whitespace
      
      words.forEach((word, wordIdx) => {
        if (!word) return; // Skip empty strings
        
        const wordWidth = doc.getTextWidth(word);
        
        // Check if we need to wrap to next line
        if (currentX + wordWidth > x + maxWidth && currentX > lineStartX && word.trim()) {
          // Move to next line
          currentX = lineStartX;
          currentY += lineHeight * 0.95;
          
          // Check if we need a page break
          if (currentY + lineHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
            yPosition = margin; // Sync yPosition with currentY
          }
          
          // Skip leading whitespace on new line
          if (word.trim() === '') return;
        }
        
        // Render the word
        doc.text(word, currentX, currentY);
        currentX += wordWidth;
      });
    });
    
    // Reset to normal font
    doc.setFont('helvetica', 'normal');
    
    return currentY;
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
      doc.setTextColor(44, 62, 80);
      doc.setFont('helvetica', 'bold');
      const text = line.replace(/^#\s+/, '');
      
      // Split long titles across multiple lines
      const titleLines = doc.splitTextToSize(text, contentWidth);
      titleLines.forEach((titleLine: string) => {
        doc.text(titleLine, margin, yPosition);
        yPosition += lineHeight * 1.2;
      });
      yPosition += lineHeight * 0.5;
      doc.setDrawColor(44, 62, 80);
      doc.setLineWidth(0.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += lineHeight * 1.5;
    } else if (line.startsWith('## ')) {
      const text = line.replace(/^##\s+/, '');
      
      // Special formatting for "References" or "Sources" section
      if (text.toLowerCase().replace(/\*\*/g, '').trim() === 'references' || text.toLowerCase().replace(/\*\*/g, '').trim() === 'sources' || text.toLowerCase().replace(/\*\*/g, '').trim() === 'bibliography') {
        // References section needs space for heading + at least 5 reference entries
        const requiredSpace = lineHeight * 12;
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin + 10;
        }
        
        // Add extra space before Sources section
        yPosition += lineHeight;
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.setFont('helvetica', 'bold');
        const titleLines = doc.splitTextToSize(text, contentWidth);
        titleLines.forEach((titleLine: string) => {
          doc.text(titleLine, margin, yPosition);
          yPosition += lineHeight * 1.1;
        });
        yPosition += lineHeight * 0.1;
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
        doc.setTextColor(52, 73, 94);
        doc.setFont('helvetica', 'bold');
        const titleLines = doc.splitTextToSize(text, contentWidth);
        titleLines.forEach((titleLine: string) => {
          doc.text(titleLine, margin, yPosition);
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
      doc.setTextColor(52, 73, 94);
      doc.setFont('helvetica', 'bold');
      const text = line.replace(/^###\s+/, '');
      const titleLines = doc.splitTextToSize(text, contentWidth);
      titleLines.forEach((titleLine: string) => {
        doc.text(titleLine, margin, yPosition);
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
      doc.setTextColor(52, 73, 94);
      doc.setFont('helvetica', 'bold');
      const text = line.replace(/^####\s+/, '');
      const titleLines = doc.splitTextToSize(text, contentWidth);
      titleLines.forEach((titleLine: string) => {
        doc.text(titleLine, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight * 0.5;
    } else if (line.match(/^[\s]*[\*\-]\s/)) {
      // Bullet points with inline formatting support (including indented)
      checkPageBreak(lineHeight * 1.5);
      doc.setFontSize(10.5);
      doc.setTextColor(26, 26, 26);
      
      // Detect indentation level
      const indentMatch = line.match(/^(\s*)/);
      const indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0;
      const indent = margin + (indentLevel * 10);
      
      const text = line.replace(/^[\s]*[\*\-]\s+/, '');
      
      // Draw bullet
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('•', indent + 1, yPosition);
      doc.setFontSize(10.5);
      
      yPosition = renderFormattedText(text, indent + 7, yPosition, contentWidth - (indent - margin) - 7);
      yPosition += lineHeight * 1.25;
      checkPageBreak(); // Check after adding spacing
    } else if (line.match(/^\d+\.\s/)) {
      // Numbered lists with inline formatting support (including Sources)
      checkPageBreak(lineHeight * 1.5);
      doc.setFontSize(10);
      doc.setTextColor(26, 26, 26);
      const match = line.match(/^(\d+)\.\s+(.+)$/);
      if (match) {
        const num = match[1];
        const text = match[2];
        
        // Make the number bold for sources
        doc.setFont('helvetica', 'bold');
        doc.text(`[${num}]`, margin + 1, yPosition);
        doc.setFont('helvetica', 'normal');
        
        yPosition = renderFormattedText(text, margin + 12, yPosition, contentWidth - 12);
        yPosition += lineHeight * 1.3;
        checkPageBreak(); // Check after adding spacing
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
      // Blockquote with inline formatting
      checkPageBreak(lineHeight * 2);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      const text = line.replace(/^>\s*/, '');
      
      // Draw left border for blockquote
      doc.setDrawColor(52, 152, 219);
      doc.setLineWidth(1);
      const startY = yPosition;
      
      // Render with italic as base style
      const segments = parseInlineFormatting(text);
      let currentX = margin + 5;
      segments.forEach(segment => {
        if (segment.bold && segment.italic) {
          doc.setFont('helvetica', 'bolditalic');
        } else if (segment.bold) {
          doc.setFont('helvetica', 'bold');
        } else {
          doc.setFont('helvetica', 'italic'); // Default to italic for quotes
        }
        doc.text(segment.text, currentX, yPosition);
        currentX += doc.getTextWidth(segment.text + ' ');
      });
      
      yPosition += lineHeight * 0.95;
      doc.line(margin, startY - 2, margin, yPosition);
      yPosition += lineHeight * 0.5;
    } else {
      // Regular paragraph with inline formatting support
      checkPageBreak(lineHeight * 1.5);
      doc.setFontSize(10.5);
      doc.setTextColor(26, 26, 26);
      
      yPosition = renderFormattedText(line, margin, yPosition, contentWidth);
      yPosition += lineHeight * 1.35;
      checkPageBreak(); // Check after adding spacing
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

    // Handle both escaped \n and actual newlines
    let content = message.content;
    // If content has escaped newlines, unescape them
    if (content.includes('\\n') && !content.includes('\n\n')) {
      content = content.replace(/\\n/g, '\n');
    }
    
    // Split message into lines and process each
    const lines = content.split('\n');
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
