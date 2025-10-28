import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, createAuthErrorResponse } from '@/lib/middleware/auth';
import { ChatService } from '@/lib/services/chat.service';

// GET /api/chats/[chatId] - Get a specific chat session
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
    const chat = await ChatService.getChatSession(chatId, auth.userId!);

    if (!chat) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error('Get chat error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat session' },
      { status: 500 }
    );
  }
}

// PATCH /api/chats/[chatId] - Update chat session (title, archive, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { chatId } = await params;
    const { title, archive } = await request.json();

    if (title !== undefined) {
      await ChatService.updateChatTitle(chatId, auth.userId!, title);
    }

    if (archive !== undefined) {
      await ChatService.archiveChatSession(chatId, auth.userId!);
    }

    const updatedChat = await ChatService.getChatSession(chatId, auth.userId!);

    return NextResponse.json({
      success: true,
      chat: updatedChat,
    });
  } catch (error) {
    console.error('Update chat error:', error);
    return NextResponse.json(
      { error: 'Failed to update chat session' },
      { status: 500 }
    );
  }
}

// DELETE /api/chats/[chatId] - Delete a chat session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { chatId } = await params;
    const deleted = await ChatService.deleteChatSession(chatId, auth.userId!);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted',
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    return NextResponse.json(
      { error: 'Failed to delete chat session' },
      { status: 500 }
    );
  }
}
