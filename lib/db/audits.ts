import { getSupabase } from '../supabase/server';
import { AuditResult } from '../../types';

export async function saveAuditToDatabase(audit: AuditResult, email?: string) {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn('Supabase client is not configured. Skipping audit persistence.');
    return null;
  }

  const response = await supabase.from('audits').insert([
    {
      id: audit.id,
      user_email: email || null,
      tools: audit.tools,
      recommendations: audit.recommendations,
      monthly_savings: audit.totalMonthlySavings,
      yearly_savings: audit.totalYearlySavings,
      summary: audit.summary,
      created_at: audit.createdAt
    }
  ]);

  const { data, error } = response as any;

  if (error) {
    console.error('Supabase audit save error:', error);
    return null;
  }

  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    return (data[0] as { id?: string }).id ?? null;
  }

  return null;
}

export async function getAuditById(id: string) {
  const supabase = getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from('audits').select('*').eq('id', id).single();

  if (error) {
    console.error('Supabase fetch audit error:', error);
    return null;
  }

  return data as AuditResult | null;
}
