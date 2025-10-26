'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CodeBlock } from './code-block';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: React.ReactNode[] = [];
    let currentOrderedList: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-3 ml-4">
            {currentList}
          </ul>
        );
        currentList = [];
      }
    };

    const flushOrderedList = () => {
      if (currentOrderedList.length > 0) {
        elements.push(
          <ol key={`ol-${elements.length}`} className="list-decimal list-inside space-y-1 my-3 ml-4">
            {currentOrderedList}
          </ol>
        );
        currentOrderedList = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <CodeBlock
            key={`code-${elements.length}`}
            code={codeBlockContent.join('\n')}
            language={codeBlockLanguage || undefined}
          />
        );
        codeBlockContent = [];
        codeBlockLanguage = '';
      }
    };

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock();
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
          codeBlockLanguage = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      // Handle empty lines
      if (line.trim() === '') {
        flushList();
        flushOrderedList();
        if (elements.length > 0) {
          elements.push(<div key={`space-${elements.length}`} className="h-2" />);
        }
        return;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        flushList();
        flushOrderedList();
        elements.push(
          <h1 key={`h1-${elements.length}`} className="text-heading-lg font-bold my-4">
            {parseInlineMarkdown(line.slice(2))}
          </h1>
        );
        return;
      }

      if (line.startsWith('## ')) {
        flushList();
        flushOrderedList();
        elements.push(
          <h2 key={`h2-${elements.length}`} className="text-heading-md font-semibold my-3">
            {parseInlineMarkdown(line.slice(3))}
          </h2>
        );
        return;
      }

      if (line.startsWith('### ')) {
        flushList();
        flushOrderedList();
        elements.push(
          <h3 key={`h3-${elements.length}`} className="text-body-lg font-semibold my-2">
            {parseInlineMarkdown(line.slice(4))}
          </h3>
        );
        return;
      }

      if (line.startsWith('#### ')) {
        flushList();
        flushOrderedList();
        elements.push(
          <h4 key={`h4-${elements.length}`} className="text-body-md font-semibold my-2">
            {parseInlineMarkdown(line.slice(5))}
          </h4>
        );
        return;
      }

      if (line.startsWith('##### ')) {
        flushList();
        flushOrderedList();
        elements.push(
          <h5 key={`h5-${elements.length}`} className="text-body-md font-medium my-2">
            {parseInlineMarkdown(line.slice(6))}
          </h5>
        );
        return;
      }

      if (line.startsWith('###### ')) {
        flushList();
        flushOrderedList();
        elements.push(
          <h6 key={`h6-${elements.length}`} className="text-body-sm font-medium my-2">
            {parseInlineMarkdown(line.slice(7))}
          </h6>
        );
        return;
      }

      // Handle horizontal rules
      if (line.trim() === '---' || line.trim() === '***') {
        flushList();
        flushOrderedList();
        elements.push(<Separator key={`hr-${elements.length}`} className="my-4" />);
        return;
      }

      // Handle task list items (GitHub Flavored Markdown)
      const taskListMatch = line.match(/^[\s]*[•\-\*]\s\[([ xX])\]\s(.+)$/);
      if (taskListMatch) {
        const isChecked = taskListMatch[1].toLowerCase() === 'x';
        const content = taskListMatch[2];
        currentList.push(
          <li key={`li-${elements.length}-${currentList.length}`} className="text-body-md flex items-start gap-2">
            <input
              type="checkbox"
              checked={isChecked}
              disabled
              className="mt-1 cursor-not-allowed"
            />
            <span className={isChecked ? 'line-through opacity-70' : ''}>
              {parseInlineMarkdown(content)}
            </span>
          </li>
        );
        return;
      }

      // Handle regular list items
      if (line.match(/^[\s]*[•\-\*]\s/)) {
        const content = line.replace(/^[\s]*[•\-\*]\s/, '');
        currentList.push(
          <li key={`li-${elements.length}-${currentList.length}`} className="text-body-md">
            {parseInlineMarkdown(content)}
          </li>
        );
        return;
      }

      // Handle numbered lists
      if (line.match(/^[\s]*\d+\.\s/)) {
        flushList(); // Flush unordered list if any
        const content = line.replace(/^[\s]*\d+\.\s/, '');
        currentOrderedList.push(
          <li key={`oli-${elements.length}-${currentOrderedList.length}`} className="text-body-md">
            {parseInlineMarkdown(content)}
          </li>
        );
        return;
      }

      // Handle blockquotes
      if (line.startsWith('> ')) {
        flushList();
        flushOrderedList();
        elements.push(
          <blockquote key={`quote-${elements.length}`} className="border-l-4 border-primary pl-4 my-3 italic text-muted-foreground">
            {parseInlineMarkdown(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Handle regular paragraphs
      flushList();
      flushOrderedList();
      elements.push(
        <p key={`p-${elements.length}`} className="text-body-md my-2 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    });

    // Flush any remaining items
    flushList();
    flushOrderedList();
    flushCodeBlock();

    return elements;
  };

  const parseInlineMarkdown = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let key = 0;

    // Handle inline code first
    currentText = currentText.replace(/`([^`]+)`/g, (match, code) => {
      const placeholder = `__INLINE_CODE_${key}__`;
      parts.push(
        <Badge key={`code-${key}`} variant="secondary" className="font-mono text-xs mx-1">
          {code}
        </Badge>
      );
      key++;
      return placeholder;
    });

    // Handle bold text
    currentText = currentText.replace(/\*\*([^*]+)\*\*/g, (match, bold) => {
      const placeholder = `__BOLD_${key}__`;
      parts.push(
        <strong key={`bold-${key}`} className="font-semibold">
          {bold}
        </strong>
      );
      key++;
      return placeholder;
    });

    // Handle italic text (avoid matching bold)
    currentText = currentText.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (match, italic) => {
      const placeholder = `__ITALIC_${key}__`;
      parts.push(
        <em key={`italic-${key}`} className="italic">
          {italic}
        </em>
      );
      key++;
      return placeholder;
    });

    // Handle strikethrough
    currentText = currentText.replace(/~~([^~]+)~~/g, (match, strike) => {
      const placeholder = `__STRIKE_${key}__`;
      parts.push(
        <del key={`strike-${key}`} className="line-through opacity-70">
          {strike}
        </del>
      );
      key++;
      return placeholder;
    });

    // Handle links (improved regex to handle complex URLs)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(currentText)) !== null) {
      const placeholder = `__LINK_${key}__`;
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];

      parts.push(
        <a
          key={`link-${key}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline break-words"
        >
          {linkText}
        </a>
      );

      currentText = currentText.replace(linkMatch[0], placeholder);
      key++;
    }

    // Split by placeholders and reconstruct
    const tokens = currentText.split(/(__[A-Z_]+_\d+__)/);
    const result: React.ReactNode[] = [];

    tokens.forEach((token, index) => {
      if (token.startsWith('__') && token.endsWith('__')) {
        // Find the corresponding component
        const matchingPart = parts.find((part: any) =>
          part.key && token.includes(part.key.split('-')[1])
        );
        if (matchingPart) {
          result.push(matchingPart);
        }
      } else if (token) {
        result.push(token);
      }
    });

    return result.length > 0 ? result : text;
  };

  // Prevent hydration mismatch by only rendering on client
  if (!mounted) {
    return (
      <div className={`markdown-content ${className}`}>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className={`markdown-content ${className}`}>
      {parseMarkdown(content)}
    </div>
  );
};