import { z } from 'zod';

const toolNames = [
  'ChatGPT',
  'Claude',
  'Cursor',
  'Copilot',
  'Gemini',
  'OpenAI API',
  'Anthropic API',
  'Windsurf'
] as const;

const planNames = [
  'Free',
  'Plus',
  'Team',
  'Business',
  'Enterprise',
  'Custom',
  'Pro',
  'Individual',
  'Advanced'
] as const;

const useCaseNames = ['Coding', 'Writing', 'Research', 'Data Analysis', 'Mixed'] as const;

export const SupportedToolEnum = z.enum(toolNames);
export const AuditPlanEnum = z.enum(planNames);
export const UseCaseEnum = z.enum(useCaseNames);

export const toolSchema = z.object({
  id: z.string().min(1),
  tool: SupportedToolEnum,
  plan: AuditPlanEnum,
  monthlySpend: z.number().min(0),
  seats: z.number().min(1),
  useCase: UseCaseEnum
});

export const auditInputSchema = z.object({
  teamSize: z.number().min(1, 'Team size is required'),
  primaryUseCase: z.enum(useCaseNames),
  email: z.string().email().optional(),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  tools: z.array(toolSchema).min(1, 'Add at least one AI tool')
});

export type AuditInput = z.infer<typeof auditInputSchema>;
