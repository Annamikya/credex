import { z } from 'zod';

export const SupportedToolEnum = z.enum(['ChatGPT', 'Claude', 'Cursor', 'Copilot', 'Gemini', 'OpenAI API', 'Anthropic API']);
export const UseCaseEnum = z.enum(['Coding', 'Writing', 'Research', 'Data Analysis', 'Mixed']);
export const AuditPlanEnum = z.enum([
  'Free',
  'Plus',
  'Team',
  'Business',
  'Enterprise',
  'Custom',
  'Pro',
  'Individual',
  'Advanced'
]);

export const toolSchema = z.object({
  id: z.string().min(1),
  tool: SupportedToolEnum,
  plan: AuditPlanEnum,
  monthlySpend: z.number().min(0),
  seats: z.number().min(1),
  useCase: UseCaseEnum
});

export const auditFormSchema = z.object({
  teamSize: z.number().min(1, 'Team size is required'),
  email: z.string().email('Enter a valid email'),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  tools: z.array(toolSchema).min(1, 'Add at least one AI tool')
});

export type AuditFormValues = z.infer<typeof auditFormSchema>;
