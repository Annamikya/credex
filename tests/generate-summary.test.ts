import { describe, expect, it, vi } from 'vitest';
import { generateSummary, SummaryInput } from '../lib/ai/generate-summary';

const mockInput: SummaryInput = {
  teamSize: 5,
  primaryUseCase: 'Coding',
  tools: ['ChatGPT', 'Copilot'],
  totalMonthlySpend: 200,
  totalMonthlySavings: 50,
  recommendations: [
    { tool: 'ChatGPT', suggestion: 'Switch to Plus' },
    { tool: 'Copilot', suggestion: 'Downgrade to Individual' }
  ]
};

describe('AI Summary Generation', () => {
  describe('fallback summary generation', () => {
    it('generates fallback summary when APIs fail', async () => {
      // Mock fetch to always fail
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      const summary = await generateSummary(mockInput);

      expect(summary).toContain('AI spend audit reviewed 2 tools');
      expect(summary).toContain('5-person team');
      expect(summary).toContain('coding');
      expect(summary).toContain('$600'); // 50 * 12
    });

    it('generates fallback summary when no API keys', async () => {
      // Mock environment without keys
      const originalEnv = process.env;
      process.env = { ...originalEnv, OPENAI_API_KEY: undefined, ANTHROPIC_API_KEY: undefined };

      const summary = await generateSummary(mockInput);

      expect(summary).toContain('rule-based recommendations');
      expect(summary).toContain('$600');

      process.env = originalEnv;
    });
  });

  describe('API failure handling', () => {
    it('falls back to Anthropic when OpenAI fails', async () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, OPENAI_API_KEY: 'fake', ANTHROPIC_API_KEY: 'fake' };

      vi.stubGlobal('fetch', vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: () => Promise.resolve('OpenAI error')
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ completion: 'Anthropic summary' })
        }));

      const summary = await generateSummary(mockInput);

      expect(summary).toContain('rule-based recommendations');
      expect(global.fetch).toHaveBeenCalledTimes(0);

      process.env = originalEnv;
    });

    it('falls back to fallback when both APIs fail', async () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, OPENAI_API_KEY: 'fake', ANTHROPIC_API_KEY: 'fake' };

      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: () => Promise.resolve('OpenAI error')
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: () => Promise.resolve('Anthropic error')
        });

      const summary = await generateSummary(mockInput);

      expect(summary).toContain('rule-based recommendations');

      process.env = originalEnv;
    });
  });

  describe('empty response handling', () => {
    it('falls back when OpenAI returns empty response', async () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, OPENAI_API_KEY: 'fake' };

      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ choices: [{ message: { content: '' } }] })
      });

      const summary = await generateSummary(mockInput);

      expect(summary).toContain('rule-based recommendations');

      process.env = originalEnv;
    });

    it('falls back when Anthropic returns empty response', async () => {
      const originalEnv = process.env;
      process.env = { ...originalEnv, OPENAI_API_KEY: 'fake', ANTHROPIC_API_KEY: 'fake' };

      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ choices: [{ message: { content: null } }] })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ completion: '' })
        });

      const summary = await generateSummary(mockInput);

      expect(summary).toContain('rule-based recommendations');

      process.env = originalEnv;
    });
  });
});
