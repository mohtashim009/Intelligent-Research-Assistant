'use client';

import React from 'react';
import { ChatInterfaceWithPersistence } from '../components/chat/ChatInterfaceWithPersistence';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ChatAIPage() {
  return (
    <ProtectedRoute>
      <ChatInterfaceWithPersistence />
    </ProtectedRoute>
  );
}