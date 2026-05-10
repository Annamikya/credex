import { NextResponse } from 'next/server';
import { generateAISummary } from '../../../lib/ai-summary';
import { checkRateLimit } from '../../../lib/rate-limit';

interface SummaryRequest {
  teamSize: number;
  useCase: string;
  tools: Array<{ tool: string }>;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  recommendations: Array<{ tool: string; suggestion: string }>;
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting: 10 summary requests per minute per IP
    if (!checkRateLimit(`summary:${ip}`, 10, 60000)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = (await request.json()) as SummaryRequest;

    // Validate required fields
    if (!Array.isArray(body.tools) || body.tools.length === 0) {
      return NextResponse.json(
        { error: 'Tools are required' },
        { status: 400 }
      );
    }

    // Generate AI summary
    const summary = await generateAISummary({
      teamSize: body.teamSize || 1,
      useCase: body.useCase || 'Mixed',
      toolsList: body.tools.map((t) => t.tool),
      totalMonthlySpend: body.totalMonthlySpend || 0,
      totalMonthlySavings: body.totalMonthlySavings || 0,
      recommendations: body.recommendations || []
    });

    return NextResponse.json({
      summary,
      generated: true,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary. Please try again.' },
      { status: 500 }
    );
  }
}
