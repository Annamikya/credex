import { describe, expect, it } from 'vitest';
import { createAuditResult } from '../lib/audit-engine';
import { ToolInput } from '../types';

describe('Audit Engine', () => {
  describe('savings calculation', () => {
    it('calculates monthly savings correctly for ChatGPT downgrade', () => {
      const tools: ToolInput[] = [
        {
          id: '1',
          tool: 'ChatGPT',
          plan: 'Team',
          monthlySpend: 100,
          seats: 2,
          useCase: 'Coding'
        }
      ];

      const result = createAuditResult(tools, 5, 'Coding');

      expect(result.recommendations).toHaveLength(1);
      expect(result.recommendations[0].monthlySavings).toBe(80); // 100 - 20
      expect(result.totalMonthlySavings).toBe(80);
      expect(result.totalYearlySavings).toBe(960); // 80 * 12
    });

    it('calculates zero savings when no optimization found', () => {
      const tools: ToolInput[] = [
        {
          id: '1',
          tool: 'ChatGPT',
          plan: 'Plus',
          monthlySpend: 20,
          seats: 1,
          useCase: 'Coding'
        }
      ];

      const result = createAuditResult(tools, 5, 'Coding');

      expect(result.recommendations[0].monthlySavings).toBe(0);
      expect(result.totalMonthlySavings).toBe(0);
      expect(result.totalYearlySavings).toBe(0);
    });
  });

  describe('downgrade recommendation logic', () => {
    it('recommends downgrade for small ChatGPT Team usage', () => {
      const tools: ToolInput[] = [
        {
          id: '1',
          tool: 'ChatGPT',
          plan: 'Team',
          monthlySpend: 50,
          seats: 2,
          useCase: 'Coding'
        }
      ];

      const result = createAuditResult(tools, 5, 'Coding');

      expect(result.recommendations[0].suggestion).toBe('Switch to ChatGPT Plus.');
      expect(result.recommendations[0].monthlySavings).toBe(30);
    });

    it('recommends downgrade for small Copilot Business usage', () => {
      const tools: ToolInput[] = [
        {
          id: '1',
          tool: 'Copilot',
          plan: 'Business',
          monthlySpend: 100,
          seats: 3,
          useCase: 'Coding'
        }
      ];

      const result = createAuditResult(tools, 5, 'Coding');

      expect(result.recommendations[0].suggestion).toBe('Switch to GitHub Copilot Individual.');
      expect(result.recommendations[0].monthlySavings).toBe(70); // max(0, 100 - 30)
    });
  });

  describe('invalid input handling', () => {
    it('handles unknown tool gracefully', () => {
      const tools: ToolInput[] = [
        {
          id: '1',
          tool: 'UnknownTool' as any,
          plan: 'Free',
          monthlySpend: 0,
          seats: 1,
          useCase: 'Coding'
        }
      ];

      const result = createAuditResult(tools, 5, 'Coding');

      expect(result.recommendations).toHaveLength(1);
      expect(result.recommendations[0].monthlySavings).toBe(0);
    });
  });

  describe('recommendation generation', () => {
    it('generates multiple recommendations', () => {
      const tools: ToolInput[] = [
        {
          id: '1',
          tool: 'ChatGPT',
          plan: 'Team',
          monthlySpend: 100,
          seats: 2,
          useCase: 'Coding'
        },
        {
          id: '2',
          tool: 'Copilot',
          plan: 'Business',
          monthlySpend: 100,
          seats: 3,
          useCase: 'Coding'
        }
      ];

      const result = createAuditResult(tools, 5, 'Coding');

      expect(result.recommendations).toHaveLength(2);
      expect(result.totalMonthlySavings).toBe(150);
      expect(result.totalYearlySavings).toBe(1800);
    });

    it('includes summary in result', () => {
      const tools: ToolInput[] = [
        {
          id: '1',
          tool: 'ChatGPT',
          plan: 'Team',
          monthlySpend: 100,
          seats: 2,
          useCase: 'Coding'
        }
      ];

      const result = createAuditResult(tools, 5, 'Coding');

      expect(result.summary).toContain('optimization opportunities');
      expect(result.summary).toContain('$960'); // 80 * 12
    });
  });
});
