'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Square2StackIcon, EllipsisHorizontalIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { MessageBubbleProps } from '../../types/schema';
import { formatTimestamp } from '../../utils/formatters';
import { MessageType } from '../../types/enums';
import { MarkdownRenderer } from '../ui/markdown-renderer';
import { exportToPDF, exportToHTML, exportToMarkdown } from '@/lib/export-utils';

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isUser,
  avatar,
  onCopy
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    onCopy?.();
  };

  const handleExportMessage = async (format: 'pdf' | 'html' | 'markdown') => {
    try {
      const messageTitle = `Message_${message.id}`;
      switch (format) {
        case 'pdf':
          await exportToPDF([message], messageTitle);
          break;
        case 'html':
          await exportToHTML([message], messageTitle);
          break;
        case 'markdown':
          await exportToMarkdown([message], messageTitle);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className={`flex gap-2 sm:gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Hide avatars on mobile for better spacing, show on desktop */}
      <Avatar className={`w-8 h-8 flex-shrink-0 hidden sm:flex ${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <AvatarFallback className="text-xs">
          {avatar}
        </AvatarFallback>
      </Avatar>

      <div className={`flex flex-col flex-1 min-w-0 ${isUser ? 'items-end' : 'items-start'}`}>
        <Card className={`p-3 sm:p-4 transition-smooth ${
          isUser 
            ? 'max-w-[95%] sm:max-w-[80%] bg-chat-user-bg text-chat-user-text border-none' 
            : 'max-w-[95%] sm:max-w-[80%] bg-chat-ai-bg text-chat-ai-text border-border'
          }`} style={{ wordBreak: 'break-word', overflowWrap: 'break-word', overflow: 'hidden' }}>
          {message.type === MessageType.AI ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <div className="text-body-md whitespace-pre-wrap" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{message.content}</div>
          )}
        </Card>

        <div className={`flex items-center gap-2 mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-xs text-muted-foreground">
            {mounted ? formatTimestamp(message.timestamp) : ''}
          </span>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={handleCopy}
                  >
                    <Square2StackIcon className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                >
                  <EllipsisHorizontalIcon className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isUser ? 'end' : 'start'}>
                <DropdownMenuItem onClick={handleCopy}>
                  <Square2StackIcon className="h-4 w-4 mr-2" />
                  Copy message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportMessage('pdf')}>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportMessage('html')}>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as HTML
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportMessage('markdown')}>
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export as Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};