'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { PlusCircleIcon, Cog6ToothIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ChatSidebarProps } from '../../types/schema';
import { formatMessageTime } from '../../utils/formatters';
import { UserMenu } from '../auth/UserMenu';

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  sessions, 
  currentSessionId, 
  onSessionSelect, 
  onNewChat,
  onDeleteSession
}) => {
  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-heading-md text-sidebar-foreground mb-4">
          Personal Deep Research Assistant
        </h1>
        
        <Button 
          onClick={onNewChat}
          className="w-full bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
        >
          <PlusCircleIcon className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4">
          <h2 className="text-body-sm font-medium text-sidebar-foreground mb-3">
            Chat History
          </h2>
        </div>
        
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-1">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className={`p-3 cursor-pointer transition-smooth border-none group relative ${
                  currentSessionId === session.id
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
                onClick={() => onSessionSelect(session.id)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-body-sm font-medium truncate flex-1">
                      {session.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {session.messageCount}
                      </Badge>
                      {onDeleteSession && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm('Delete this chat session?')) {
                              onDeleteSession(session.id);
                            }
                          }}
                        >
                          <TrashIcon className="h-3 w-3 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground truncate">
                    {session.lastMessage}
                  </p>
                  
                  <span className="text-xs text-muted-foreground">
                    {formatMessageTime(session.timestamp)}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Separator className="mb-4" />
        
        <div className="lg:hidden mb-3">
          <UserMenu />
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Cog6ToothIcon className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};