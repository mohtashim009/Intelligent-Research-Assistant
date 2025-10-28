import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, createAuthErrorResponse } from '@/lib/middleware/auth';
import { ReportService } from '@/lib/services/report.service';

// GET /api/reports/[reportId] - Get a specific report
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { reportId } = await params;
    const report = await ReportService.getReport(reportId, auth.userId!);

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Get report error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
}

// PATCH /api/reports/[reportId] - Update a report
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { reportId } = await params;
    const { content, incrementVersion } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const report = await ReportService.updateReport(
      reportId,
      auth.userId!,
      content,
      incrementVersion !== false
    );

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Update report error:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}

// DELETE /api/reports/[reportId] - Delete a report
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const auth = await authenticateRequest(request);
  if (!auth.authenticated) {
    return createAuthErrorResponse(auth.error || 'Unauthorized');
  }

  try {
    const { reportId } = await params;
    const deleted = await ReportService.deleteReport(reportId, auth.userId!);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Report deleted',
    });
  } catch (error) {
    console.error('Delete report error:', error);
    return NextResponse.json(
      { error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}
