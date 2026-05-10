import { describe, expect, it } from 'vitest';
import { auditInputSchema } from '../lib/validators/audit-schema';

describe('Audit Schema Validation', () => {
  describe('valid payloads', () => {
    it('accepts valid audit input', () => {
      const validInput = {
        teamSize: 5,
        primaryUseCase: 'Coding',
        email: 'test@example.com',
        company: 'Test Corp',
        role: 'Developer',
        notes: 'Some notes',
        tools: [
          {
            id: '1',
            tool: 'ChatGPT',
            plan: 'Team',
            monthlySpend: 100,
            seats: 3,
            useCase: 'Coding'
          }
        ]
      };

      const result = auditInputSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('accepts minimal valid input', () => {
      const minimalInput = {
        teamSize: 1,
        primaryUseCase: 'Writing',
        tools: [
          {
            id: '1',
            tool: 'Claude',
            plan: 'Pro',
            monthlySpend: 50,
            seats: 1,
            useCase: 'Writing'
          }
        ]
      };

      const result = auditInputSchema.safeParse(minimalInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid payloads', () => {
    it('rejects missing teamSize', () => {
      const invalidInput = {
        primaryUseCase: 'Coding',
        tools: []
      };

      const result = auditInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('rejects invalid tool name', () => {
      const invalidInput = {
        teamSize: 5,
        primaryUseCase: 'Coding',
        tools: [
          {
            id: '1',
            tool: 'InvalidTool',
            plan: 'Free',
            monthlySpend: 0,
            seats: 1,
            useCase: 'Coding'
          }
        ]
      };

      const result = auditInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('rejects negative monthlySpend', () => {
      const invalidInput = {
        teamSize: 5,
        primaryUseCase: 'Coding',
        tools: [
          {
            id: '1',
            tool: 'ChatGPT',
            plan: 'Plus',
            monthlySpend: -10,
            seats: 1,
            useCase: 'Coding'
          }
        ]
      };

      const result = auditInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('missing fields', () => {
    it('rejects empty tools array', () => {
      const invalidInput = {
        teamSize: 5,
        primaryUseCase: 'Coding',
        tools: []
      };

      const result = auditInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const invalidInput = {
        teamSize: 5,
        primaryUseCase: 'Coding',
        email: 'invalid-email',
        tools: [
          {
            id: '1',
            tool: 'ChatGPT',
            plan: 'Plus',
            monthlySpend: 20,
            seats: 1,
            useCase: 'Coding'
          }
        ]
      };

      const result = auditInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });

  describe('incorrect tool names', () => {
    it('rejects unknown plan', () => {
      const invalidInput = {
        teamSize: 5,
        primaryUseCase: 'Coding',
        tools: [
          {
            id: '1',
            tool: 'ChatGPT',
            plan: 'UnknownPlan',
            monthlySpend: 20,
            seats: 1,
            useCase: 'Coding'
          }
        ]
      };

      const result = auditInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('rejects unknown useCase', () => {
      const invalidInput = {
        teamSize: 5,
        primaryUseCase: 'UnknownCase',
        tools: [
          {
            id: '1',
            tool: 'ChatGPT',
            plan: 'Plus',
            monthlySpend: 20,
            seats: 1,
            useCase: 'Coding'
          }
        ]
      };

      const result = auditInputSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
