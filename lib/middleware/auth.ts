import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../auth/jwt';
import { UserService } from '../services/user.service';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  userEmail?: string;
}

export async function authenticateRequest(request: NextRequest): Promise<{
  authenticated: boolean;
  userId?: string;
  userEmail?: string;
  error?: string;
}> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { authenticated: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return { authenticated: false, error: 'Invalid or expired token' };
    }

    // Verify user still exists
    const user = await UserService.getUserById(payload.userId);
    if (!user) {
      return { authenticated: false, error: 'User not found' };
    }

    return {
      authenticated: true,
      userId: payload.userId,
      userEmail: payload.email,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { authenticated: false, error: 'Authentication failed' };
  }
}

export function createAuthErrorResponse(error: string, status = 401) {
  return NextResponse.json({ error }, { status });
}
