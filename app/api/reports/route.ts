import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, createAuthErrorResponse } from '@/lib/middleware/auth';
import { ReportService } from '@/lib/services/report.service';

// GET /api/reports - Get all reports for the user
export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const chatId = searchParams.get('chatId');

    let reports;
    if (search) {
      reports = await ReportService.searchReports(auth.userId!, search);
    } else if (chatId) {
      reports = await ReportService.getChatReports(chatId, auth.userId!);
    } else {
      reports = await ReportService.getUserReports(auth.userId!);
    }

    return NextResponse.json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create a new report
export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { chatSessionId, title, content, format } = await request.json();

    if (!chatSessionId || !title || !content) {
      return NextResponse.json(
        { error: 'chatSessionId, title, and content are required' },
        { status: 400 }
      );
    }

    const report = await ReportService.createReport(
      auth.userId!,
      chatSessionId,
      title,
      content,
      format
    );

    return NextResponse.json({
      success: true,
      report,
    }, { status: 201 });
  } catch (error) {
    console.error('Create report error:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
