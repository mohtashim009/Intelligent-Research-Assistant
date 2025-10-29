'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Bars3CenterLeftIcon } from '@heroicons/react/24/outline';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';
import { ChatSidebar } from './chat-sidebar';
import { TypingIndicator } from '../ui/typing-indicator';
import { ExportButton } from '../ui/export-button';
import { UserMenu } from '../auth/UserMenu';
import { ThemeToggle } from '../ui/theme-toggle';
import { MessageType, MessageStatus, ChatStatus } from '../../types/enums';
import { ResearchService } from '../../lib/research-service';
import { useChatSessions } from '@/lib/hooks/useChatSessions';
import { useAuth } from '@/lib/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  status: MessageStatus;
}

export const ChatInterfaceWithPersistence: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    sessions,
    currentSession,
    loading: sessionsLoading,
    createSession,
    loadSession,
    addMessage,
    updateSessionTitle,
    deleteSession,
    generateTitle,
  } = useChatSessions();

  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStatus, setChatStatus] = useState(ChatStatus.IDLE);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('AI is thinking...');
  const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);
  const [processingSessionId, setProcessingSessionId] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const topSentinelRef = useRef<HTMLDivElement>(null);

  // Load messages when switching to a different session
  useEffect(() => {
    if (currentSession && currentSession._id !== loadedSessionId) {
      const formattedMessages: Message[] = currentSession.messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        type: msg.role === 'user' ? MessageType.USER : MessageType.AI,
        timestamp: new Date(msg.timestamp),
        status: MessageStatus.DELIVERED,
      }));
      setMessages(formattedMessages);
      setLoadedSessionId(currentSession._id);
    } else if (!currentSession && loadedSessionId) {
      setMessages([]);
      setLoadedSessionId(null);
    }
  }, [currentSession, loadedSessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, chatStatus]);

  // Scroll detection for hiding/showing input using Intersection Observer
  useEffect(() => {
    const topSentinel = topSentinelRef.current;
    if (!topSentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When top sentinel is visible, show input
        // When top sentinel is not visible (scrolled down), hide input
        setShowInput(entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -90% 0px', // Trigger when scrolled past 10% of viewport
      }
    );

    observer.observe(topSentinel);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Detect operation type from user message
  const detectOperationType = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('convert') || 
        lowerMessage.includes('change format') ||
        lowerMessage.includes('add a section') ||
        lowerMessage.includes('modify') ||
        lowerMessage.includes('restructure')) {
      return 'Drafting in progress...';
    }
    
    if (lowerMessage.includes('export') || 
        lowerMessage.includes('download') ||
        lowerMessage.includes('save as')) {
      return 'Preparing export...';
    }
    
    return 'Conducting deep research...';
  };

  const handleSendMessage = async (content: string) => {
    // Create session if none exists
    let sessionId = currentSession?._id;
    if (!sessionId) {
      const title = generateTitle(content);
      const newSession = await createSession(title);
      if (!newSession) {
        console.error('Failed to create session');
        return;
      }
      sessionId = newSession._id;
      // Mark this session as loaded to prevent useEffect from clearing messages
      setLoadedSessionId(sessionId);
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      type: MessageType.USER,
      timestamp: new Date(),
      status: MessageStatus.SENT
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to database (in background, don't wait)
    addMessage(sessionId, {
      role: 'user',
      content,
    }).catch(err => console.error('Failed to save user message:', err));

    // Update session title if it's the first message
    if (currentSession && currentSession.messages.length === 0) {
      const title = generateTitle(content);
      updateSessionTitle(sessionId, title).catch(err => console.error('Failed to update title:', err));
    }

    // Detect operation type and set loading message
    const operationMessage = detectOperationType(content);
    setLoadingMessage(operationMessage);
    setChatStatus(ChatStatus.THINKING);
    setProcessingSessionId(sessionId); // Track which session is processing

    try {
      // Prepare conversation history for context (last 10 messages)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.type === MessageType.USER ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      // Generate AI response using research service with conversation history
      const aiResponse = await ResearchService.generateResearchMessage(content, conversationHistory);
      
      const aiMessage: Message = {
        id: `temp-${Date.now() + 1}`,
        content: aiResponse,
        type: MessageType.AI,
        timestamp: new Date(),
        status: MessageStatus.DELIVERED
      };

      setMessages(prev => [...prev, aiMessage]);
      setChatStatus(ChatStatus.IDLE);
      setProcessingSessionId(null); // Clear processing state

      // Save AI message to database (in background, don't wait)
      addMessage(sessionId, {
        role: 'assistant',
        content: aiResponse,
      }).catch(err => console.error('Failed to save AI message:', err));

    } catch (error) {
      console.error('Research service error:', error);
      
      // Fallback response
      const fallbackResponse = "I apologize, but I'm currently unable to access real-time research data. Please ensure your API keys are properly configured.\n\nWould you like me to try a different approach?";
      
      const aiMessage: Message = {
        id: `temp-${Date.now() + 1}`,
        content: fallbackResponse,
        type: MessageType.AI,
        timestamp: new Date(),
        status: MessageStatus.DELIVERED
      };

      setMessages(prev => [...prev, aiMessage]);
      setChatStatus(ChatStatus.IDLE);
      setProcessingSessionId(null); // Clear processing state

      // Save fallback message to database (in background, don't wait)
      addMessage(sessionId, {
        role: 'assistant',
        content: fallbackResponse,
      }).catch(err => console.error('Failed to save fallback message:', err));
    }
  };

  const handleSessionSelect = async (sessionId: string) => {
    setLoadedSessionId(null); // Reset to trigger reload
    await loadSession(sessionId);
    setSidebarOpen(false);
    // Don't reset chatStatus or processingSessionId - let background research continue
  };

  const handleNewChat = async () => {
    setMessages([]);
    setChatStatus(ChatStatus.IDLE);
    setSidebarOpen(false);
    setLoadedSessionId(null);
    // Don't create session yet - wait for first message
  };

  const handleDeleteSession = async (sessionId: string) => {
    await deleteSession(sessionId);
    if (currentSession?._id === sessionId) {
      setMessages([]);
    }
  };

  // Format sessions for sidebar
  const formattedSessions = sessions.map(session => ({
    id: session._id,
    title: session.title,
    lastMessage: session.messages[session.messages.length - 1]?.content || '',
    timestamp: new Date(session.lastMessageAt),
    messageCount: session.messages.length,
  }));

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-dvh w-full max-w-full relative bg-black z-10 overflow-x-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
        }}
      />
  
      <div className="min-h-dvh bg-background flex max-w-full overflow-x-hidden">
        {/* Desktop Sidebar */}
        <div className="fixed z-10 hidden lg:block w-80 h-full">
          <ChatSidebar
            sessions={formattedSessions}
            currentSessionId={currentSession?._id || null}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
            onDeleteSession={handleDeleteSession}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80">
            <ChatSidebar
              sessions={formattedSessions}
              currentSessionId={currentSession?._id || null}
              onSessionSelect={handleSessionSelect}
              onNewChat={handleNewChat}
              onDeleteSession={handleDeleteSession}
            />
          </SheetContent>
        </Sheet>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full lg:ml-80 max-w-full overflow-x-hidden">
          {/* Header */}
          <Card className="sticky top-0 z-10 p-4 pt-[env(safe-area-inset-top)] border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="flex items-center gap-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Bars3CenterLeftIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-heading-md text-foreground truncate">
                  {currentSession?.title || 'Research Assistant'}
                </h1>
                <p className="text-body-sm text-muted-foreground hidden sm:block">
                  {currentSession 
                    ? `${currentSession.messages.length} message${currentSession.messages.length !== 1 ? 's' : ''}`
                    : 'How can I help you with your research today?'
                  }
                </p>
              </div>
              
              {messages.length > 0 && (
                <ExportButton 
                  messages={messages.map(m => ({
                    id: m.id,
                    content: m.content,
                    type: m.type,
                    timestamp: m.timestamp,
                    status: m.status,
                  }))} 
                  conversationTitle={currentSession?.title || 'Research Report'}
                />
              )}
              
              <ThemeToggle />
              
              <div className="hidden lg:block">
                <UserMenu />
              </div>
            </div>
          </Card>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 sm:p-4">
              <div className="max-w-4xl mx-auto px-2 sm:px-4 pb-28 sm:pb-32">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="text-6xl mb-4">🔬</div>
                    <h2 className="text-heading-lg text-foreground mb-2">
                      Start Your Research Journey
                    </h2>
                    <p className="text-body-md text-muted-foreground max-w-md">
                      Ask me anything! I'll conduct deep research using multiple sources
                      and provide comprehensive, well-cited answers.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Sentinel element for scroll detection */}
                    <div ref={topSentinelRef} className="h-1" />
                    
                    {messages.map((message) => {
                      const isUser = message.type === MessageType.USER;
                      const userInitials = user?.name
                        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                        : 'U';
                      return (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isUser={isUser}
                          avatar={isUser ? userInitials : 'AI'}
                          onCopy={() => navigator.clipboard.writeText(message.content)}
                        />
                      );
                    })}
                    {chatStatus === ChatStatus.THINKING && processingSessionId === currentSession?._id && (
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                          AI
                        </div>
                        <div className="flex-1">
                          <TypingIndicator message={loadingMessage} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div 
              className="fixed bottom-0 left-0 right-0 lg:left-80 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ease-in-out z-20"
              style={{
                transform: showInput ? 'translateY(0)' : 'translateY(100%)',
              }}
            >
              <div className="max-w-4xl mx-auto p-3 sm:p-4">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  disabled={chatStatus === ChatStatus.THINKING && processingSessionId === currentSession?._id}
                  placeholder={
                    chatStatus === ChatStatus.THINKING && processingSessionId === currentSession?._id
                      ? 'AI is researching...'
                      : 'Ask me anything...'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
