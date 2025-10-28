import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, createAuthErrorResponse } from '@/lib/middleware/auth';
import { ChatService } from '@/lib/services/chat.service';
import { Message } from '@/lib/models/Chat';

// GET /api/chats/[chatId]/messages - Get messages for a chat
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { chatId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const messages = await ChatService.getChatMessages(chatId, auth.userId!, limit);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// POST /api/chats/[chatId]/messages - Add a message to a chat
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { chatId } = await params;
    const messageData = await request.json();

    const message: Message = {
      id: messageData.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      role: messageData.role,
      content: messageData.content,
      timestamp: new Date(),
      metadata: messageData.metadata,
    };

    const success = await ChatService.addMessage(chatId, auth.userId!, message);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to add message' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message,
    }, { status: 201 });
  } catch (error) {
    console.error('Add message error:', error);
    return NextResponse.json(
      { error: 'Failed to add message' },
      { status: 500 }
    );
  }
}
