'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Message } from '@/types/schema';
import { exportToPDF, exportToHTML, exportToMarkdown } from '@/lib/export-utils';

interface ExportButtonProps {
  messages: Message[];
  conversationTitle?: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  messages,
  conversationTitle = 'Research Report',
  variant = 'outline',
  size = 'sm',
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'html' | 'markdown') => {
    setIsExporting(true);
    try {
      switch (format) {
        case 'pdf':
          await exportToPDF(messages, conversationTitle);
          break;
        case 'html':
          await exportToHTML(messages, conversationTitle);
          break;
        case 'markdown':
          await exportToMarkdown(messages, conversationTitle);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting || messages.length === 0}>
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('html')}>
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('markdown')}>
          Export as Markdown
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
