import { describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/audit/route';
import { createAuditResult } from '@/lib/audit-engine';
import { generateSummary } from '@/lib/ai/generate-summary';
import { saveAuditToDatabase } from '@/lib/db/audits';

// Mock the dependencies
vi.mock('@/lib/audit-engine');
vi.mock('@/lib/ai/generate-summary');
vi.mock('@/lib/db/audits');

describe('API Audit Route', () => {
  describe('successful POST request', () => {
    it('returns audit result with summary', async () => {
      const mockAudit = {
        id: 'test-id',
        tools: [],
        recommendations: [],
        totalMonthlySavings: 100,
        totalYearlySavings: 1200,
        summary: 'Test summary'
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          teamSize: 5,
          primaryUseCase: 'Coding',
          email: 'test@example.com',
          tools: [
            {
              id: '1',
              tool: 'ChatGPT',
              plan: 'Team',
              monthlySpend: 100,
              seats: 2,
              useCase: 'Coding'
            }
          ]
        })
      };

      (createAuditResult as any).mockReturnValue(mockAudit);
      (generateSummary as any).mockResolvedValue('AI generated summary');
      (saveAuditToDatabase as any).mockResolvedValue(undefined);

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.audit).toEqual({ ...mockAudit, summary: 'AI generated summary' });
      expect(createAuditResult).toHaveBeenCalledWith(
        expect.any(Array),
        5,
        'Coding'
      );
      expect(generateSummary).toHaveBeenCalled();
      expect(saveAuditToDatabase).toHaveBeenCalledWith(
        { ...mockAudit, summary: 'AI generated summary' },
        'test@example.com'
      );
    });
  });

  describe('validation errors', () => {
    it('returns 400 for invalid payload', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          teamSize: 'invalid',
          tools: []
        })
      };

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid audit data');
      expect(data.details).toBeDefined();
    });

    it('returns 400 for missing required fields', async () => {
      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          primaryUseCase: 'Coding',
          tools: []
        })
      };

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid audit data');
    });
  });

  describe('invalid payload response', () => {
    it('handles malformed JSON', async () => {
      const mockRequest = {
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
      };

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toContain('Failed to generate audit');
    });
  });

  describe('JSON response structure', () => {
    it('returns proper JSON structure', async () => {
      const mockAudit = {
        id: 'test-id',
        tools: [],
        recommendations: [],
        totalMonthlySavings: 0,
        totalYearlySavings: 0,
        summary: null
      };

      const mockRequest = {
        json: vi.fn().mockResolvedValue({
          teamSize: 1,
          primaryUseCase: 'Writing',
          tools: [
            {
              id: '1',
              tool: 'ChatGPT',
              plan: 'Plus',
              monthlySpend: 20,
              seats: 1,
              useCase: 'Writing'
            }
          ]
        })
      };

      (createAuditResult as any).mockReturnValue(mockAudit);
      (generateSummary as any).mockRejectedValue(new Error('API error'));
      (saveAuditToDatabase as any).mockResolvedValue(undefined);

      const response = await POST(mockRequest as any);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('audit');
      expect(data.audit).toHaveProperty('id');
      expect(data.audit).toHaveProperty('tools');
      expect(data.audit).toHaveProperty('recommendations');
      expect(data.audit).toHaveProperty('totalMonthlySavings');
      expect(data.audit).toHaveProperty('totalYearlySavings');
    });
  });
});
