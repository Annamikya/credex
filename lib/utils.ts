import { AuditResult } from '../types';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

export function getDisplayTitle(tool: string, plan: string) {
  return `${tool} • ${plan}`;
}

export function createAuditId() {
  return `audit_${Math.random().toString(36).slice(2, 12)}`;
}

export function isAuditResult(value: unknown): value is AuditResult {
  return typeof value === 'object' && value !== null && 'recommendations' in value;
}
