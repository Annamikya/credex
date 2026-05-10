import { NextResponse } from 'next/server';
import { createAuditResult } from '../../../lib/audit-engine';
import { auditInputSchema } from '../../../lib/validators/audit-schema';
import { generateSummary } from '../../../lib/ai/generate-summary';
import { saveAuditToDatabase } from '../../../lib/db/audits';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = auditInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid audit data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const audit = createAuditResult(parsed.data.tools, parsed.data.teamSize, parsed.data.primaryUseCase);

    try {
      audit.summary = await generateSummary({
        teamSize: parsed.data.teamSize,
        primaryUseCase: parsed.data.primaryUseCase,
        tools: parsed.data.tools.map((tool) => tool.tool),
        totalMonthlySpend: parsed.data.tools.reduce((sum, tool) => sum + tool.monthlySpend, 0),
        totalMonthlySavings: audit.totalMonthlySavings,
        recommendations: audit.recommendations.map((recommendation) => ({
          tool: recommendation.tool,
          suggestion: recommendation.suggestion
        }))
      });
    } catch (error) {
      console.error('AI summary generation failed, using fallback:', error);
    }

    await saveAuditToDatabase(audit, parsed.data.email);

    return NextResponse.json({ audit });
  } catch (error) {
    console.error('Audit route error:', error);
    return NextResponse.json({ error: 'Failed to generate audit. Please try again.' }, { status: 500 });
  }
}
