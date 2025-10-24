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
import { ChatInterfaceProps } from '../../types/schema';
import { MessageType, MessageStatus, ChatStatus } from '../../types/enums';
import { ResearchService } from '../../lib/research-service';

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  initialMessages, 
  chatSessions, 
  currentChatStatus, 
  userAvatar, 
  aiAvatar 
}) => {
  const [messages, setMessages] = useState(initialMessages);
  const [chatStatus, setChatStatus] = useState(currentChatStatus);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deepResearchMode, setDeepResearchMode] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, chatStatus]);

  // Keep view pinned to bottom on viewport/keyboard changes (mobile)
  useEffect(() => {
    const handler = () => {
      if (!scrollAreaRef.current) return;
      const sc = scrollAreaRef.current.querySelector('[data-slot="scroll-area-viewport"]') as HTMLElement | null;
      if (sc) sc.scrollTop = sc.scrollHeight;
    };
    const vv = (typeof window !== 'undefined' && (window as any).visualViewport) ? (window as any).visualViewport : null;
    vv?.addEventListener('resize', handler);
    window.addEventListener('resize', handler);
    window.addEventListener('orientationchange', handler);
    return () => {
      vv?.removeEventListener('resize', handler);
      window.removeEventListener('resize', handler);
      window.removeEventListener('orientationchange', handler);
    };
  }, []);

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage = {
      id: Date.now().toString(),
      content,
      type: MessageType.USER,
      timestamp: new Date(),
      status: MessageStatus.SENT
    };

    setMessages(prev => [...prev, userMessage]);
    setChatStatus(ChatStatus.THINKING);

    // Generate AI response using research service if in deep research mode
    console.log('Deep research mode:', deepResearchMode);
    console.log('PERPLEXITY_API_KEY available:', !!process.env.PERPLEXITY_API_KEY);
    console.log('Environment variables:', process.env);
    
    if (deepResearchMode && process.env.PERPLEXITY_API_KEY) {
      console.log('Using research service for query:', content);
      
      try {
        const aiResponse = await ResearchService.generateResearchMessage(content);
        
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          type: MessageType.AI,
          timestamp: new Date(),
          status: MessageStatus.DELIVERED
        };

        setMessages(prev => [...prev, aiMessage]);
        setChatStatus(ChatStatus.IDLE);
      } catch (error) {
        console.error('Research service error:', error);
        
        // Fallback to mock responses if research service fails
        const aiResponses = [
          "I apologize, but I'm currently unable to access real-time research data. Here's a general response based on my knowledge:\n\n## Research Insights\n\n• **Key Finding 1**: General information about the topic\n• **Key Finding 2**: Additional context and background\n• **Key Finding 3**: Related areas of interest\n\n> **Note**: For the most current research, please ensure your API keys are properly configured.\n\nWould you like me to approach this from a different angle?",
          "I'm experiencing difficulties accessing the research databases right now. However, I can provide some foundational knowledge:\n\n### Background Information\n\n• **Historical Context**: How this field has evolved\n• **Current Understanding**: What we know today\n• **Future Directions**: Where research is heading\n\n```\nResearch Limitations:\n- Real-time data access currently unavailable\n- Response based on general knowledge\n- Please check API configuration\n```\n\nWhat specific aspect would you like me to focus on despite these limitations?"
        ];

        const fallbackResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: fallbackResponse,
          type: MessageType.AI,
          timestamp: new Date(),
          status: MessageStatus.DELIVERED
        };

        setMessages(prev => [...prev, aiMessage]);
        setChatStatus(ChatStatus.IDLE);
      }
    } else {
      // Simulate AI response delay
      setTimeout(() => {
        const aiResponses = [
          "That's a fascinating question! Let me research that for you. Based on current data and recent studies, here's what I've found:\n\n## Key Findings\n\n• **Primary research** indicates significant developments in this area\n• **Recent studies** show promising results with `95% accuracy`\n• **Industry applications** are expanding rapidly\n\n> **Note**: This analysis is based on the latest available data from peer-reviewed sources.\n\nWould you like me to dive deeper into any specific aspect?",
          "I'd be happy to help you explore that topic! Here are some key insights:\n\n### Current State\n\n• **Market trends** show exponential growth\n• **Technical challenges** are being addressed through innovative approaches\n• **Future outlook** remains highly optimistic\n\n```\nKey Metrics:\n- Growth Rate: 45% YoY\n- Market Size: $2.3B\n- Adoption Rate: 78%\n```\n\nWhat specific area would you like to explore further?",
          "Excellent point! This is an area with significant recent developments:\n\n## Recent Breakthroughs\n\n🔬 **Research Advances**: New methodologies showing **breakthrough results**\n\n📊 **Data Analysis**: Comprehensive studies reveal important patterns\n\n🚀 **Innovation**: Cutting-edge solutions emerging from top institutions\n\n> The field is evolving rapidly with new discoveries published weekly.\n\nShall I provide more detailed analysis on any particular aspect?",
          "That's a complex topic with multiple perspectives. Here's a comprehensive analysis:\n\n### Different Viewpoints\n\n1. **Academic Perspective**: Focus on theoretical foundations\n2. **Industry Perspective**: Emphasis on practical applications\n3. **Regulatory Perspective**: Concerns about compliance and ethics\n\n**Consensus Areas:**\n• Need for standardization\n• Importance of ethical considerations\n• Potential for significant impact\n\nWould you like me to elaborate on any specific perspective?",
          "Great question! I've analyzed recent publications and data sources:\n\n## Research Summary\n\n📚 **Literature Review**: 150+ papers analyzed from top-tier journals\n\n📈 **Trend Analysis**: Clear patterns emerging in the data\n\n🎯 **Key Insights**:\n• **Methodology improvements** leading to better outcomes\n• **Cross-disciplinary collaboration** driving innovation\n• **Real-world applications** showing measurable impact\n\n```markdown\n# Quick Stats\n- Papers reviewed: 150+\n- Time period: Last 24 months\n- Confidence level: High\n```\n\nWhat specific aspect interests you most?"
        ];

        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          type: MessageType.AI,
          timestamp: new Date(),
          status: MessageStatus.DELIVERED
        };

        setMessages(prev => [...prev, aiMessage]);
        setChatStatus(ChatStatus.IDLE);
      }, 2000);
    }
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setSidebarOpen(false);
    // In a real app, you would load messages for this session
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setChatStatus(ChatStatus.IDLE);
    setSidebarOpen(false);
  };

  const handleCopyMessage = () => {
    // Show a toast or notification that message was copied
    console.log('Message copied to clipboard');
  };

  return (
  <div className="min-h-dvh w-full relative bg-black z-10">
    {/* X Organizations Black Background with Top Glow */}
    <div
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{
       background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(120, 180, 255, 0.25), transparent 70%), #000000",
      }}
    />
  
    <div className="min-h-dvh bg-background flex">
      {/* Desktop Sidebar */}
      <div className="fixed z-10 hidden lg:block w-80 h-full">
        <ChatSidebar
          sessions={chatSessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
          <ChatSidebar
            sessions={chatSessions}
            currentSessionId={currentSessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
          />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full lg:ml-80">
        {/* Header */}
        <Card className="sticky top-0 z-10 p-4 pt-[env(safe-area-inset-top)] border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex items-center gap-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Bars3CenterLeftIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          
          <div className="flex-1">
            <h1 className="text-heading-md text-foreground">
              Research Assistant
            </h1>
            <p className="text-body-sm text-muted-foreground">
              How can I help you with your research today?
            </p>
          </div>
        </Card>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-3 sm:p-4">
            <div className="max-w-4xl mx-auto px-2 sm:px-0 pb-28 sm:pb-32">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h2 className="text-heading-lg text-foreground mb-2">
                      Welcome to your Research Assistant
                    </h2>
                    <p className="text-body-md text-muted-foreground">
                      Start a conversation by typing your research question below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isUser={message.type === MessageType.USER}
                      avatar={message.type === MessageType.USER ? userAvatar : aiAvatar}
                      onCopy={handleCopyMessage}
                    />
                  ))}
                  
                  {chatStatus === ChatStatus.THINKING && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                        AI
                      </div>
                      <TypingIndicator />
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 sm:p-4 pb-[env(safe-area-inset-bottom)] border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky bottom-0">
            <div className="max-w-4xl mx-auto px-2 sm:px-0">
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={chatStatus === ChatStatus.THINKING}
                placeholder="Ask me anything about your research..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};