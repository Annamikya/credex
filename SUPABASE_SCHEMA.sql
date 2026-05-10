/**
 * SUPABASE_SCHEMA.sql
 *
 * Database schema for AI Spend Auditor.
 * Run this in Supabase SQL editor to set up the database.
 */

-- Audits table
CREATE TABLE audits (
  id TEXT PRIMARY KEY,
  user_email TEXT NOT NULL,
  company TEXT,
  role TEXT,
  team_size INT,
  tools JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  monthly_savings INT DEFAULT 0,
  yearly_savings INT DEFAULT 0,
  summary TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  public_token TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX audits_user_email_idx ON audits(user_email);
CREATE INDEX audits_public_token_idx ON audits(public_token);
CREATE INDEX audits_created_at_idx ON audits(created_at DESC);

-- Leads table (email capture)
CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  company TEXT,
  role TEXT,
  team_size INT,
  audit_id TEXT REFERENCES audits(id),
  lead_token TEXT UNIQUE,
  email_sent BOOLEAN DEFAULT FALSE,
  email_opened BOOLEAN DEFAULT FALSE,
  is_qualified BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new', -- new, contacted, converted, unsubscribed
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX leads_email_idx ON leads(email);
CREATE INDEX leads_status_idx ON leads(status);
CREATE INDEX leads_created_at_idx ON leads(created_at DESC);

-- Email logs table
CREATE TABLE email_logs (
  id TEXT PRIMARY KEY,
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  email_type TEXT, -- audit_confirmation, welcome, follow_up, etc
  status TEXT DEFAULT 'sent', -- sent, failed, bounced
  audit_id TEXT REFERENCES audits(id),
  lead_id TEXT REFERENCES leads(id),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX email_logs_recipient_idx ON email_logs(recipient_email);
CREATE INDEX email_logs_audit_idx ON email_logs(audit_id);
CREATE INDEX email_logs_lead_idx ON email_logs(lead_id);

-- Rate limit tracking table
CREATE TABLE rate_limits (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL, -- IP address or user ID
  request_type TEXT NOT NULL, -- audit, lead, summary, etc
  count INT DEFAULT 1,
  reset_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX rate_limits_identifier_idx ON rate_limits(identifier);
CREATE INDEX rate_limits_reset_at_idx ON rate_limits(reset_at);

-- Audit feedback table (optional)
CREATE TABLE audit_feedback (
  id TEXT PRIMARY KEY,
  audit_id TEXT NOT NULL REFERENCES audits(id),
  feedback TEXT,
  helpful BOOLEAN,
  suggestions TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX audit_feedback_audit_idx ON audit_feedback(audit_id);

-- Row-level security policies (optional)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own audits
CREATE POLICY "Users can view own audits" ON audits
  FOR SELECT USING (user_email = current_user_email());

CREATE POLICY "Users can insert own audits" ON audits
  FOR INSERT WITH CHECK (user_email = current_user_email());

-- Public audit access without auth
CREATE POLICY "Public audits are readable" ON audits
  FOR SELECT USING (is_public = TRUE);
