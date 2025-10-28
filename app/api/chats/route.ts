import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, createAuthErrorResponse } from '@/lib/middleware/auth';
import { ChatService } from '@/lib/services/chat.service';

// GET /api/chats - Get all chat sessions for the user
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { searchParams } = new URL(request.url);
    const includeArchived = searchParams.get('includeArchived') === 'true';
    const search = searchParams.get('search');

    let chats;
    if (search) {
      chats = await ChatService.searchChatSessions(auth.userId!, search);
    } else {
      chats = await ChatService.getUserChatSessions(auth.userId!, includeArchived);
    }

    return NextResponse.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error('Get chats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}

// POST /api/chats - Create a new chat session
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { title } = await request.json();

    const chat = await ChatService.createChatSession(auth.userId!, title);

    return NextResponse.json({
      success: true,
      chat,
    }, { status: 201 });
  } catch (error) {
    console.error('Create chat error:', error);
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    );
  }
}
