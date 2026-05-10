# Architecture

## Project Structure

### Core Directories
- `app/` — Next.js App Router pages and API routes
  - `page.tsx` — Landing page
  - `audit/page.tsx` — Audit form
  - `results/page.tsx` — Results dashboard
  - `share/[id]/page.tsx` — Public audit page
  - `api/` — Backend endpoints
- `components/` — React UI components
  - `audit/` — Audit-specific components
  - `site/` — Landing page sections
  - `ui/` — Reusable UI primitives
  - `shared/` — Shared utilities
- `lib/` — Backend logic and utilities
  - `audit.ts` — Rule-based audit engine
  - `pricing-config.ts` — Tool pricing tiers
  - `validators.ts` — Zod form schemas
  - `audit.ts` — Audit generation logic
  - `email.ts` — Email service (Resend)
  - `ai-summary.ts` — AI summary generation
  - `rate-limit.ts` — Rate limiting and security
  - `supabase.ts` — Database client
- `types/` — TypeScript type definitions
- `hooks/` — Custom React hooks
- `tests/` — Vitest unit tests

## Audit Engine Design

### Rule-Based Logic (NOT AI-Generated)

The audit engine uses deterministic rule sets for each tool. Each rule checks specific conditions (team size, plan, spend level, use case) and returns a recommendation or null.

#### Example Rule (ChatGPT):
```typescript
if (plan === 'Team' && seats <= 2) {
  return {
    suggestion: 'Switch to ChatGPT Plus',
    reason: 'Team is priced for 3+ members',
    monthlySavings: monthlySpend - 20
  }
}
```

#### Supported Tools:
- ChatGPT (Plus, Team, Business)
- Claude (Plus/Pro, Team, Business)
- Cursor (Pro, Business)
- GitHub Copilot (Individual, Business, Enterprise)
- Gemini (Advanced, Business)
- OpenAI API (pay-as-you-go)
- Anthropic API (pay-as-you-go)
- Windsurf (Pro, Team)

### Recommendation Logic
1. Rules are executed in priority order
2. First matching rule returns recommendation
3. If no rule matches, default "well-optimized" message is shown
4. Monthly savings always >= 0
5. Yearly savings = monthly savings × 12

## Backend Architecture

### API Routes

#### POST `/api/audit`
- **Purpose**: Generate audit from tool list
- **Rate Limit**: 5 audits per minute per IP
- **Security**: Honeypot protection, rate limiting
- **Response**: Full audit with recommendations
- **Flow**:
  1. Validate input with Zod
  2. Check honeypot
  3. Generate rule-based recommendations
  4. Generate AI summary (OpenAI or Anthropic)
  5. Save to in-memory store (or Supabase)
  6. Return sanitized response

#### POST `/api/lead`
- **Purpose**: Capture email and company info
- **Rate Limit**: 3 submissions per hour per IP
- **Security**: Honeypot, email validation
- **Response**: Success with lead token
- **Flow**:
  1. Validate email format
  2. Check honeypot
  3. Generate lead token
  4. Store lead in database
  5. Send welcome email
  6. Return token for tracking

#### POST `/api/summary`
- **Purpose**: Generate AI-powered summary
- **Rate Limit**: 10 requests per minute per IP
- **Response**: 100-word personalized summary
- **AI Options**:
  - OpenAI GPT-4 (preferred)
  - Anthropic Claude (fallback)
  - Rule-based template (if both fail)

### Security Features

#### Rate Limiting
- Per-IP tracking in memory
- Configurable windows (audit: 60s, lead: 1h, summary: 60s)
- Returns 429 status when exceeded

#### Honeypot Protection
- Hidden form fields (`url`, `website`, `phone`)
- If populated, submission silently accepted (no alert)
- Prevents bot form submission spam

#### Input Validation
- Zod schemas for all inputs
- Email format validation
- Team size and spend boundaries

#### Data Sanitization
- Public audit pages hide:
  - User email
  - Company name
  - Team size
  - Personal details
- Only shows tools, plans, recommendations, and savings

## Database Schema (Supabase)

### Tables
- **audits** — Audit records with full details
- **leads** — Email captures for follow-up
- **email_logs** — Transactional email tracking
- **rate_limits** — Rate limit tracking (optional)
- **audit_feedback** — User feedback on recommendations

## Email Service

### Integration: Resend
- Transactional email provider
- Used for audit confirmations and follow-ups

### Email Types
- Audit confirmation (with public URL)
- Welcome email
- Follow-up recommendations
- Newsletter (optional)

## AI Summary Generation

### Flow
1. Try OpenAI GPT-4 (3 retries with exponential backoff)
2. Fallback to Anthropic Claude
3. Fallback to rule-based template

### Fallback Template
If no API is available:
```
Your audit identified significant savings opportunities across your 
AI stack. By optimizing your current plans and consolidating overlapping 
tools, you could reduce monthly spend by {{percentage}}%. The recommendations 
above provide specific, actionable steps to maintain productivity while 
improving financial efficiency.
```

## Performance Considerations

- **Audit generation**: ~100ms (no API calls)
- **With AI summary**: ~2-5s (API dependent)
- **Public audit page**: ~50ms (cached)
- **Rate limiting**: O(1) in-memory lookup

## Deployment Considerations

- **Database**: Replace in-memory storage with Supabase
- **Email**: Configure Resend API key
- **AI**: Optional OpenAI or Anthropic keys
- **Rate limiting**: Consider Redis for distributed systems
- **Public URLs**: Add signature verification before displaying
