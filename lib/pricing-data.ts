import { AuditPlan, SupportedTool } from '../types';

export type PlanPricing = Record<AuditPlan, number | null>;

export const PRICING_DATA: Record<SupportedTool, PlanPricing> = {
  ChatGPT: {
    Free: 0,
    Plus: 20,
    Team: 30,
    Business: 60,
    Enterprise: 120,
    Custom: null,
    Pro: 20,
    Individual: 10,
    Advanced: 30
  },
  Claude: {
    Free: 0,
    Plus: 25,
    Team: 40,
    Business: 80,
    Enterprise: 140,
    Custom: null,
    Pro: 30,
    Individual: 15,
    Advanced: 40
  },
  Cursor: {
    Free: 0,
    Plus: null,
    Team: 35,
    Business: 70,
    Enterprise: 140,
    Custom: null,
    Pro: 18,
    Individual: 12,
    Advanced: 35
  },
  Copilot: {
    Free: 0,
    Plus: null,
    Team: null,
    Business: 21,
    Enterprise: 45,
    Custom: null,
    Pro: null,
    Individual: 10,
    Advanced: 35
  },
  Gemini: {
    Free: 0,
    Plus: null,
    Team: null,
    Business: 55,
    Enterprise: 110,
    Custom: null,
    Pro: 20,
    Individual: 15,
    Advanced: 20
  },
  'OpenAI API': {
    Free: null,
    Plus: null,
    Team: null,
    Business: null,
    Enterprise: null,
    Custom: null,
    Pro: null,
    Individual: null,
    Advanced: null
  },
  'Anthropic API': {
    Free: null,
    Plus: null,
    Team: null,
    Business: null,
    Enterprise: null,
    Custom: null,
    Pro: null,
    Individual: null,
    Advanced: null
  },
  Windsurf: {
    Free: 0,
    Plus: null,
    Team: 30,
    Business: 60,
    Enterprise: 110,
    Custom: null,
    Pro: 15,
    Individual: 10,
    Advanced: 25
  }
};

export function getMonthlyPrice(tool: SupportedTool, plan: AuditPlan): number | null {
  return PRICING_DATA[tool]?.[plan] ?? null;
}

export function getAnnualPrice(tool: SupportedTool, plan: AuditPlan): number | null {
  const monthly = getMonthlyPrice(tool, plan);
  return monthly === null ? null : monthly * 12;
}

export function isPayAsYouGo(tool: SupportedTool): boolean {
  return tool === 'OpenAI API' || tool === 'Anthropic API';
}
