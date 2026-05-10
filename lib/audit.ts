import { AuditRecommendation, AuditResult, ToolInput } from '../types';
import { createAuditId } from './utils';

/**
 * Rule-based audit recommendations engine.
 * Each rule returns a recommendation if the condition is met, or null otherwise.
 * No AI is used—all recommendations follow deterministic rule sets.
 */
const ruleSets = {
  ChatGPT: [
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Team' && input.seats <= 2) {
        return {
          suggestion: 'Switch to ChatGPT Plus.',
          reason: 'ChatGPT Team is priced for teams of 3+ members. Your team size warrants a Plus subscription, which costs less and includes all essentials.',
          monthlySavings: Math.max(0, input.monthlySpend - 20)
        };
      }
      return null;
    },
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Business' && input.seats < 10) {
        return {
          suggestion: 'Downgrade to ChatGPT Team.',
          reason: 'Business plan is enterprise-grade; for teams under 10, Team plan provides nearly identical capability at 50% lower cost.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.35))
        };
      }
      return null;
    },
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Team' && input.useCase === 'Coding' && input.seats >= 5 && input.monthlySpend > 500) {
        return {
          suggestion: 'Consider API-only approach with shared credits.',
          reason: 'Your coding-focused team can reduce costs by using ChatGPT API with batch processing and cached prompts instead of per-user subscriptions.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.25))
        };
      }
      return null;
    }
  ],
  Claude: [
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Business' && input.monthlySpend > 1200) {
        return {
          suggestion: 'Negotiate with Anthropic for volume credits.',
          reason: 'At this spend level, direct API with negotiated rates or batch processing often provides 20-30% savings.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.22))
        };
      }
      return null;
    },
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Pro' && input.useCase === 'Research' && input.monthlySpend > 400) {
        return {
          suggestion: 'Switch to Claude API with caching.',
          reason: 'Research workflows benefit from prompt caching, which reduces costs by up to 50% compared to subscription access.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.3))
        };
      }
      return null;
    }
  ],
  Cursor: [
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Business' && input.seats < 5) {
        return {
          suggestion: 'Downgrade to Cursor Pro.',
          reason: 'Cursor Business is designed for organizations with 5+ developers. Smaller teams can use Pro tier without losing core features.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.4))
        };
      }
      return null;
    }
  ],
  Copilot: [
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Enterprise' && input.seats < 15) {
        return {
          suggestion: 'Consolidate to GitHub Copilot Business.',
          reason: 'Enterprise pricing is for organizations with 50+ developers. At your size, Business tier covers all needs with significant savings.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.45))
        };
      }
      return null;
    },
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Business' && input.seats <= 3) {
        return {
          suggestion: 'Switch to GitHub Copilot Individual.',
          reason: 'Small teams benefit from individual licenses at $10/month with team collaboration through VS Code Live Share.',
          monthlySavings: Math.max(0, (input.monthlySpend || 0) - 30)
        };
      }
      return null;
    }
  ],
  Gemini: [
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Business' && input.seats < 8) {
        return {
          suggestion: 'Move team to Gemini Advanced individually.',
          reason: 'At your team size, individual Advanced subscriptions ($20/month each) cost less than the Business tier.',
          monthlySavings: Math.max(0, input.monthlySpend - input.seats * 20)
        };
      }
      return null;
    }
  ],
  'OpenAI API': [
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.monthlySpend > 2000) {
        return {
          suggestion: 'Apply for OpenAI enterprise program.',
          reason: 'High-volume API customers qualify for 15-25% discounts through the enterprise program plus dedicated support.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.2))
        };
      }
      return null;
    },
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.monthlySpend > 500 && input.useCase === 'Data Analysis') {
        return {
          suggestion: 'Implement caching and batch processing.',
          reason: 'Data analysis workflows can cache system prompts and batch requests, reducing per-token costs by 20-50%.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.25))
        };
      }
      return null;
    }
  ],
  'Anthropic API': [
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.monthlySpend > 1500) {
        return {
          suggestion: 'Explore Anthropic volume credits and batch API.',
          reason: 'High-volume users benefit from committed-use discounts (up to 20% savings) and batch processing for off-peak inference.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.18))
        };
      }
      return null;
    }
  ],
  Windsurf: [
    (input: ToolInput): Partial<AuditRecommendation> | null => {
      if (input.plan === 'Team' && input.seats < 5) {
        return {
          suggestion: 'Use Windsurf Pro for individual developers.',
          reason: 'Windsurf Team is for larger teams. Your size gets better value from individual Pro subscriptions.',
          monthlySavings: Math.max(0, Math.round(input.monthlySpend * 0.35))
        };
      }
      return null;
    }
  ]
};

/**
 * Generate audit recommendations for a single tool.
 */
export function auditTool(tool: ToolInput): AuditRecommendation {
  const rules = (ruleSets as any)[tool.tool] ?? [];

  const recommendation = rules
    .map((rule: any) => rule(tool))
    .find((result: any) => result !== null) as Partial<AuditRecommendation> | undefined;

  if (recommendation) {
    return {
      tool: tool.tool,
      currentPlan: tool.plan,
      suggestion: recommendation.suggestion ?? 'Review this tool usage.',
      reason: recommendation.reason ?? 'Our analysis found a potential optimization.',
      monthlySavings: Math.max(0, recommendation.monthlySavings ?? 0)
    };
  }

  return {
    tool: tool.tool,
    currentPlan: tool.plan,
    suggestion: 'Your current plan appears well-suited to your team size and use case.',
    reason: 'No immediate optimization detected for your configuration.',
    monthlySavings: 0
  };
}

/**
 * Generate a multi-tool summary highlighting key recommendations.
 */
export function summarizeAudit(tools: ToolInput[], recommendations: AuditRecommendation[]): string {
  const highSavingTools = recommendations
    .filter((r) => r.monthlySavings >= 50)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)
    .slice(0, 2)
    .map((r) => r.tool);

  const totalYearlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings * 12, 0);

  const baseSummary =
    highSavingTools.length > 0
      ? `Immediate savings opportunities exist in ${highSavingTools.join(' and ')}. `
      : 'Your AI stack is moderately optimized. ';

  return (
    baseSummary +
    `By implementing these recommendations, you could save approximately $${Math.round(totalYearlySavings).toLocaleString()} annually. ` +
    `The optimizations maintain your current workflow while improving cost efficiency through plan consolidation and smarter tool usage patterns.`
  );
}

/**
 * Create a complete audit result from a list of tools.
 */
export function createAuditResult(tools: ToolInput[]): AuditResult {
  const recommendations = tools.map(auditTool);
  const totalMonthlySavings = recommendations.reduce((sum, r) => sum + r.monthlySavings, 0);

  const summary = summarizeAudit(tools, recommendations);

  return {
    id: createAuditId(),
    createdAt: new Date().toISOString(),
    tools,
    recommendations,
    totalMonthlySavings,
    totalYearlySavings: totalMonthlySavings * 12,
    summary
  };
}

/**
 * In-memory storage for public audits.
 * Replace with Supabase in production.
 */
const samplePublicAudits: Record<string, AuditResult> = {};

export async function saveAudit(audit: AuditResult): Promise<AuditResult> {
  samplePublicAudits[audit.id] = audit;
  return audit;
}

export async function getPublicAudit(id: string): Promise<AuditResult | null> {
  return samplePublicAudits[id] ?? null;
}
