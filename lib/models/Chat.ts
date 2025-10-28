import { ObjectId } from 'mongodb';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
    toolCalls?: any[];
  };
}

export interface ChatSession {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  isArchived: boolean;
  tags?: string[];
  metadata?: {
    totalMessages: number;
    totalTokens?: number;
    researchTopics?: string[];
  };
}

export interface Report {
  _id?: ObjectId;
  userId: ObjectId;
  chatSessionId: ObjectId;
  title: string;
  content: string;
  format: 'markdown' | 'ieee' | 'apa' | 'custom';
  createdAt: Date;
  updatedAt: Date;
  version: number;
  tags?: string[];
  metadata?: {
    wordCount?: number;
    referenceCount?: number;
    sections?: string[];
  };
  exports?: {
    format: 'pdf' | 'html' | 'markdown';
    url?: string;
    generatedAt: Date;
  }[];
}
