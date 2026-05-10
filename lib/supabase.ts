/**
 * Supabase client initialization.
 * Configure with environment variables for backend access.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for server-side operations

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!supabaseKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Save audit to Supabase.
 */
export async function saveAuditToSupabase(audit: any, email: string) {
  const { error } = await supabase.from('audits').insert([
    {
      id: audit.id,
      user_email: email,
      tools: audit.tools,
      recommendations: audit.recommendations,
      monthly_savings: audit.totalMonthlySavings,
      yearly_savings: audit.totalYearlySavings,
      summary: audit.summary,
      created_at: audit.createdAt
    }
  ]);

  if (error) {
    console.error('Error saving audit to Supabase:', error);
    return null;
  }

  return audit.id;
}

/**
 * Save lead to Supabase.
 */
export async function saveLeadToSupabase(lead: any) {
  const { error } = await supabase.from('leads').insert([
    {
      id: lead.id || Math.random().toString(36).slice(2),
      email: lead.email,
      company: lead.company,
      role: lead.role,
      team_size: lead.teamSize,
      audit_id: lead.auditId,
      lead_token: lead.token,
      status: 'new'
    }
  ]);

  if (error) {
    console.error('Error saving lead to Supabase:', error);
    return null;
  }

  return lead.email;
}

/**
 * Get audit by ID from Supabase.
 */
export async function getAuditFromSupabase(id: string) {
  const { data, error } = await supabase.from('audits').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching audit from Supabase:', error);
    return null;
  }

  return data;
}

/**
 * Get lead by email from Supabase.
 */
export async function getLeadFromSupabase(email: string) {
  const { data, error } = await supabase.from('leads').select('*').eq('email', email).single();

  if (error) {
    console.error('Error fetching lead from Supabase:', error);
    return null;
  }

  return data;
}

/**
 * Update lead status in Supabase.
 */
export async function updateLeadStatusInSupabase(email: string, status: string) {
  const { error } = await supabase
    .from('leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('email', email);

  if (error) {
    console.error('Error updating lead status in Supabase:', error);
    return false;
  }

  return true;
}

/**
 * Log email send in Supabase.
 */
export async function logEmailToSupabase(emailLog: any) {
  const { error } = await supabase.from('email_logs').insert([
    {
      id: Math.random().toString(36).slice(2),
      recipient_email: emailLog.email,
      subject: emailLog.subject,
      email_type: emailLog.type,
      status: emailLog.status,
      audit_id: emailLog.auditId,
      lead_id: emailLog.leadId,
      error_message: emailLog.error
    }
  ]);

  if (error) {
    console.error('Error logging email in Supabase:', error);
    return false;
  }

  return true;
}
