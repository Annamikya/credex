/**
 * Rate limiting and security utilities for the API.
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const rateLimitStore: RateLimitStore = {};

/**
 * Simple in-memory rate limiter (replace with Redis in production).
 * Returns true if the request should be allowed, false if rate limited.
 */
export function checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = identifier;

  if (!rateLimitStore[key]) {
    rateLimitStore[key] = { count: 1, resetAt: now + windowMs };
    return true;
  }

  const record = rateLimitStore[key];

  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    return true;
  }

  if (record.count < maxRequests) {
    record.count += 1;
    return true;
  }

  return false;
}

/**
 * Extract honeypot value from request.
 * Used to detect spam bots submitting forms.
 */
export function getHoneypotValue(data: any): string | undefined {
  // Common honeypot field names
  const honeypotFields = ['url', 'website', 'phone', 'message2', 'checkbox'];
  for (const field of honeypotFields) {
    if (data[field] !== undefined && data[field] !== '' && data[field] !== null) {
      return data[field];
    }
  }
  return undefined;
}

/**
 * Validate honeypot: if it has a value, it's likely a bot.
 */
export function isHoneypotTriggered(data: any): boolean {
  return !!getHoneypotValue(data);
}

/**
 * Generate a signature for public audit sharing.
 * Ensures the audit ID is valid before displaying public data.
 */
export function generateAuditSignature(auditId: string, secret: string): string {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(`${auditId}:${secret}`).digest('hex');
}

/**
 * Verify the audit signature matches expected value.
 */
export function verifyAuditSignature(auditId: string, signature: string, secret: string): boolean {
  const expectedSignature = generateAuditSignature(auditId, secret);
  return signature === expectedSignature;
}

/**
 * Sanitize audit data for public sharing.
 * Remove sensitive information like exact email, company details.
 */
export function sanitizeAuditForPublic(audit: any) {
  return {
    id: audit.id,
    createdAt: audit.createdAt,
    tools: audit.tools.map((tool: any) => ({
      tool: tool.tool,
      plan: tool.plan,
      useCase: tool.useCase
    })),
    recommendations: audit.recommendations,
    totalMonthlySavings: audit.totalMonthlySavings,
    totalYearlySavings: audit.totalYearlySavings,
    summary: audit.summary
  };
}

/**
 * Validate email format (basic check).
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Generate a random token for lead capture tracking.
 */
export function generateLeadToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
