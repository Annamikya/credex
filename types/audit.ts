export type ToolName = 
  | 'ChatGPT'
  | 'Claude'
  | 'Cursor'
  | 'GitHub Copilot'
  | 'Gemini'
  | 'OpenAI API'
  | 'Anthropic API'
  | 'Windsurf';

export type UseCase = 
  | 'Coding'
  | 'Writing'
  | 'Research'
  | 'Data Analysis'
  | 'Mixed';

export interface ToolUsage {
  name: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditFormData {
  tools: ToolUsage[];
  teamSize: number;
  primaryUseCase: UseCase;
  // Honeypot fields
  website?: string;
  phone?: string;
  url?: string;
}

export interface Recommendation {
  tool: ToolName;
  suggestion: string;
  reason: string;
  monthlySavings: number;
}

export interface AuditResult {
  id: string;
  tools: ToolUsage[];
  teamSize: number;
  primaryUseCase: UseCase;
  recommendations: Recommendation[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  yearlySavings: number;
  summary?: string;
  publicToken: string;
}

export interface LeadFormData {
  email: string;
  company?: string;
  role?: string;
  auditId: string;
  // Honeypot fields
  website?: string;
  phone?: string;
}

export interface AuditInput {
  tools: ToolUsage[];
  teamSize: number;
  primaryUseCase: UseCase;
  email?: string;
  company?: string;
  role?: string;
}

export interface SummaryInput {
  teamSize: number;
  primaryUseCase: UseCase;
  tools: ToolUsage[];
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  recommendations: Recommendation[];
}
