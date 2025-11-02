'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ArrowDownTrayIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { Message } from '@/types/schema';
import { MessageType, MessageStatus } from '@/types/enums';
import { exportToPDF, exportToHTML, exportToMarkdown } from '@/lib/export-utils';
import { useAuth } from '@/lib/contexts/AuthContext';

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
  const [exportStatus, setExportStatus] = useState<string>('');
  const { token } = useAuth();

  const handleExport = async (format: 'pdf' | 'html' | 'markdown') => {
    setIsExporting(true);
    setExportStatus('Exporting...');
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
      setExportStatus('');
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('Export failed');
      setTimeout(() => setExportStatus(''), 2000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleEnhancedExport = async (format: 'pdf' | 'html' | 'markdown') => {
    setIsExporting(true);
    setExportStatus('Enhancing with AI...');
    
    try {
      // Call API to enhance content with export agent
      const response = await fetch('/api/export/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify({
          messages,
          format,
          title: conversationTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Enhancement failed');
      }

      const { enhancedContent } = await response.json();
      
      setExportStatus('Generating document...');

      // Create a temporary message array with enhanced content
      const enhancedMessages: Message[] = [{
        id: 'enhanced',
        content: enhancedContent,
        type: MessageType.AI,
        timestamp: new Date(),
        status: MessageStatus.DELIVERED,
      }];

      // Export using the enhanced content
      switch (format) {
        case 'pdf':
          await exportToPDF(enhancedMessages, conversationTitle);
          break;
        case 'html':
          await exportToHTML(enhancedMessages, conversationTitle);
          break;
        case 'markdown':
          await exportToMarkdown(enhancedMessages, conversationTitle);
          break;
      }

      setExportStatus('');
    } catch (error) {
      console.error('Enhanced export failed:', error);
      setExportStatus('Enhancement failed');
      setTimeout(() => setExportStatus(''), 2000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting || messages.length === 0}>
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          {exportStatus || (isExporting ? 'Exporting...' : 'Export')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick Export</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('html')}>
          Export as HTML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('markdown')}>
          Export as Markdown
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="flex items-center">
          <SparklesIcon className="h-4 w-4 mr-2" />
          AI-Enhanced Export
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleEnhancedExport('pdf')}>
          <SparklesIcon className="h-3 w-3 mr-2 opacity-50" />
          Enhanced PDF (with TOC)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEnhancedExport('html')}>
          <SparklesIcon className="h-3 w-3 mr-2 opacity-50" />
          Enhanced HTML (with TOC)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleEnhancedExport('markdown')}>
          <SparklesIcon className="h-3 w-3 mr-2 opacity-50" />
          Enhanced Markdown (with TOC)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
