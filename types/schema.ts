import { MessageType, MessageStatus, ChatStatus, ThemeMode } from './enums';

// Props types for components
export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
  status: MessageStatus;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export interface ChatInterfaceProps {
  initialMessages: Message[];
  chatSessions: ChatSession[];
  currentChatStatus: ChatStatus;
  userAvatar: string;
  aiAvatar: string;
}

export interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  avatar: string;
  onCopy?: () => void;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession?: (sessionId: string) => void;
}

// Store types for global state
export interface ChatState {
  messages: Message[];
  currentSessionId: string | null;
  chatStatus: ChatStatus;
  sidebarOpen: boolean;
  theme: ThemeMode;
}

export interface UIState {
  sidebarCollapsed: boolean;
  settingsOpen: boolean;
  currentTheme: ThemeMode;
}

// Query types for API responses
export interface SendMessageResponse {
  messageId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
}

export interface ChatSessionResponse {
  sessions: ChatSession[];
  totalCount: number;
}