export type SupportedTool = 'ChatGPT' | 'Claude' | 'Cursor' | 'Copilot' | 'Gemini' | 'OpenAI API' | 'Anthropic API' | 'Windsurf';

export type UseCase = 'Coding' | 'Writing' | 'Research' | 'Data Analysis' | 'Mixed';

export type AuditPlan =
  | 'Free'
  | 'Plus'
  | 'Team'
  | 'Business'
  | 'Enterprise'
  | 'Custom'
  | 'Pro'
  | 'Individual'
  | 'Advanced';

export interface ToolInput {
  id: string;
  tool: SupportedTool;
  plan: AuditPlan;
  monthlySpend: number;
  seats: number;
  useCase: UseCase;
}

export interface AuditRecommendation {
  tool: SupportedTool;
  currentPlan: AuditPlan;
  suggestion: string;
  reason: string;
  monthlySavings: number;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  tools: ToolInput[];
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalYearlySavings: number;
  summary: string;
}
