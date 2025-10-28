'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokens?: number;
  };
}

export interface ChatSession {
  _id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  isArchived: boolean;
  tags?: string[];
}

export function useChatSessions() {
  const { token, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all chat sessions
  const fetchSessions = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/chats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chat sessions');
      }

      const data = await response.json();
      setSessions(data.chats || []);
    } catch (err: any) {
      console.error('Error fetching sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated]);

  // Create a new chat session
  const createSession = useCallback(async (title?: string) => {
    if (!token) return null;

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title || 'New Chat' }),
      });

      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }

      const data = await response.json();
      const newSession = data.chat;
      
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      
      return newSession;
    } catch (err: any) {
      console.error('Error creating session:', err);
      setError(err.message);
      return null;
    }
  }, [token]);

  // Add a message to the current session
  const addMessage = useCallback(async (
    sessionId: string,
    message: Omit<ChatMessage, 'id' | 'timestamp'>
  ) => {
    if (!token) return false;

    try {
      const response = await fetch(`/api/chats/${sessionId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to add message');
      }

      const data = await response.json();
      
      // Update sessions list (for sidebar) but NOT currentSession
      // This prevents triggering the useEffect in ChatInterface
      setSessions(prev => prev.map(session => {
        if (session._id === sessionId) {
          return {
            ...session,
            messages: [...session.messages, data.message],
            lastMessageAt: data.message.timestamp,
          };
        }
        return session;
      }));

      // Don't update currentSession here - let the UI manage its own state
      // Only update when explicitly loading a session

      return true;
    } catch (err: any) {
      console.error('Error adding message:', err);
      setError(err.message);
      return false;
    }
  }, [token, currentSession]);

  // Load a specific session
  const loadSession = useCallback(async (sessionId: string) => {
    if (!token) return null;

    try {
      const response = await fetch(`/api/chats/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load chat session');
      }

      const data = await response.json();
      setCurrentSession(data.chat);
      return data.chat;
    } catch (err: any) {
      console.error('Error loading session:', err);
      setError(err.message);
      return null;
    }
  }, [token]);

  // Update session title
  const updateSessionTitle = useCallback(async (sessionId: string, title: string) => {
    if (!token) return false;

    try {
      const response = await fetch(`/api/chats/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to update session title');
      }

      // Update local state
      setSessions(prev => prev.map(session => 
        session._id === sessionId ? { ...session, title } : session
      ));

      if (currentSession?._id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, title } : null);
      }

      return true;
    } catch (err: any) {
      console.error('Error updating title:', err);
      setError(err.message);
      return false;
    }
  }, [token, currentSession]);

  // Delete a session
  const deleteSession = useCallback(async (sessionId: string) => {
    if (!token) return false;

    try {
      const response = await fetch(`/api/chats/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      setSessions(prev => prev.filter(session => session._id !== sessionId));
      
      if (currentSession?._id === sessionId) {
        setCurrentSession(null);
      }

      return true;
    } catch (err: any) {
      console.error('Error deleting session:', err);
      setError(err.message);
      return false;
    }
  }, [token, currentSession]);

  // Generate title from first message
  const generateTitle = (firstMessage: string): string => {
    const maxLength = 50;
    const cleaned = firstMessage.trim();
    
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    
    return cleaned.substring(0, maxLength) + '...';
  };

  // Load sessions on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchSessions();
    }
  }, [isAuthenticated, fetchSessions]);

  return {
    sessions,
    currentSession,
    loading,
    error,
    createSession,
    loadSession,
    addMessage,
    updateSessionTitle,
    deleteSession,
    refreshSessions: fetchSessions,
    generateTitle,
  };
}
