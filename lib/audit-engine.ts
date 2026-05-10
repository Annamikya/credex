import { AuditPlan, AuditRecommendation, AuditResult, ToolInput, UseCase } from '../types';
import { getMonthlyPrice, isPayAsYouGo } from './pricing-data';

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `audit_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function buildRecommendation(
  tool: ToolInput,
  suggestion: string,
  reason: string,
  monthlySavings: number
): AuditRecommendation {
  return {
    tool: tool.tool,
    currentPlan: tool.plan,
    suggestion,
    reason,
    monthlySavings: Math.max(0, Math.round(monthlySavings))
  };
}

function calculateFallbackSavings(tool: ToolInput): number {
  if (isPayAsYouGo(tool.tool)) {
    return Math.round(tool.monthlySpend * 0.18);
  }
  const baselinePrice = getMonthlyPrice(tool.tool, tool.plan);
  return baselinePrice === null ? Math.round(tool.monthlySpend * 0.15) : Math.max(0, tool.monthlySpend - baselinePrice);
}

function auditTool(tool: ToolInput): AuditRecommendation {
  const spend = tool.monthlySpend;

  if (tool.tool === 'ChatGPT') {
    if (tool.plan === 'Team' && tool.seats <= 2) {
      return buildRecommendation(
        tool,
        'Switch to ChatGPT Plus.',
        'ChatGPT Team pricing is designed for larger organizations. For a very small group, Plus saves cost while keeping the same core experience.',
        spend - 20
      );
    }

    if (tool.plan === 'Business' && tool.seats < 10) {
      return buildRecommendation(
        tool,
        'Downgrade to ChatGPT Team.',
        'The Business tier is optimized for enterprise-scale usage. Smaller teams can keep productivity while lowering spend.',
        spend - 30
      );
    }
  }

  if (tool.tool === 'Claude') {
    if (tool.plan === 'Business' && spend > 1200) {
      return buildRecommendation(
        tool,
        'Request Anthropic volume pricing.',
        'Large Claude spend often qualifies for negotiated rates that reduce API costs significantly.',
        Math.round(spend * 0.22)
      );
    }

    if (tool.plan === 'Pro' && tool.useCase === 'Research' && spend > 400) {
      return buildRecommendation(
        tool,
        'Use Claude API with caching.',
        'Research workflows benefit from cached prompts and batching, which lowers repeated inference costs.',
        Math.round(spend * 0.3)
      );
    }
  }

  if (tool.tool === 'Cursor') {
    if (tool.plan === 'Business' && tool.seats < 5) {
      return buildRecommendation(
        tool,
        'Move to Cursor Pro.',
        'Cursor Business is built for larger engineering teams. Smaller groups can keep full capabilities on Pro.',
        Math.round(spend * 0.4)
      );
    }
  }

  if (tool.tool === 'Copilot') {
    if (tool.plan === 'Enterprise' && tool.seats < 15) {
      return buildRecommendation(
        tool,
        'Consolidate to GitHub Copilot Business.',
        'Enterprise pricing is best for large organizations. Mid-size teams often save by moving to Business.',
        Math.round(spend * 0.45)
      );
    }

    if (tool.plan === 'Business' && tool.seats <= 3) {
      return buildRecommendation(
        tool,
        'Switch to GitHub Copilot Individual.',
        'Individual licenses are more economical for very small teams while preserving collaboration workflows.',
        Math.max(0, spend - 30)
      );
    }
  }

  if (tool.tool === 'Gemini') {
    if (tool.plan === 'Business' && tool.seats < 8) {
      return buildRecommendation(
        tool,
        'Use Gemini Advanced individually.',
        'Smaller teams get better per-seat value from Advanced than from the broader business plan.',
        Math.max(0, spend - tool.seats * 20)
      );
    }
  }

  if (tool.tool === 'OpenAI API') {
    if (spend > 1500) {
      return buildRecommendation(
        tool,
        'Apply for OpenAI enterprise credits.',
        'High-volume API usage usually qualifies for enterprise discounts and committed-use pricing.',
        Math.round(spend * 0.2)
      );
    }

    if (spend > 500 && tool.useCase === 'Data Analysis') {
      return buildRecommendation(
        tool,
        'Implement API caching and batching.',
        'Data analysis workloads can reduce token usage by caching prompts and batching requests.',
        Math.round(spend * 0.25)
      );
    }
  }

  if (tool.tool === 'Anthropic API') {
    if (spend > 1500) {
      return buildRecommendation(
        tool,
        'Negotiate Anthropic committed usage.',
        'Anthropic often offers volume pricing for high monthly spend, reducing price per token.',
        Math.round(spend * 0.18)
      );
    }
  }

  if (tool.tool === 'Windsurf') {
    if (tool.plan === 'Team' && tool.seats < 5) {
      return buildRecommendation(
        tool,
        'Move to Windsurf Pro.',
        'Team plans are optimized for larger groups. Small teams usually save by switching to Pro.',
        Math.round(spend * 0.35)
      );
    }
  }

  return buildRecommendation(
    tool,
    'Your current plan appears appropriate.',
    'The current usage profile does not show an obvious plan-level savings opportunity.',
    0
  );
}

export function summarizeAudit(tools: ToolInput[], recommendations: AuditRecommendation[]): string {
  const savedTools = recommendations.filter((recommendation) => recommendation.monthlySavings > 0);
  const totalAnnual = recommendations.reduce((sum, recommendation) => sum + recommendation.monthlySavings * 12, 0);

  if (savedTools.length === 0) {
    return 'Your AI stack is well-aligned with the current plan mix. Continue monitoring usage and adjust as new needs emerge.';
  }

  const detailLine = savedTools
    .slice(0, 3)
    .map((recommendation) => `${recommendation.tool}: ${recommendation.suggestion}`)
    .join(' ');

  return `The audit identified ${savedTools.length} meaningful optimization opportunities. ${detailLine} These changes could save about $${Math.round(totalAnnual).toLocaleString()} annually while keeping your current workflows intact.`;
}

export function createAuditResult(tools: ToolInput[], teamSize: number, primaryUseCase: UseCase): AuditResult {
  const recommendations = tools.map(auditTool);
  const totalMonthlySavings = recommendations.reduce((sum, recommendation) => sum + recommendation.monthlySavings, 0);

  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    tools,
    recommendations,
    totalMonthlySavings,
    totalYearlySavings: totalMonthlySavings * 12,
    summary: summarizeAudit(tools, recommendations)
  };
}
