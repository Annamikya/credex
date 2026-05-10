# Error Handling & Recovery Guide

## Overview

The audit system includes comprehensive error handling with graceful fallbacks at every layer:
- API validation errors (400)
- Rate limit errors (429)
- Service errors (500)
- Database errors (with fallback)
- Email failures (with logging)

## Error Categories

### 1. Validation Errors (400)

**Cause**: Invalid input data (missing fields, wrong types, out of range values)

**Handling**:
```typescript
// Zod validation with detailed error feedback
const parsed = auditFormSchema.safeParse(body);
if (!parsed.success) {
  return NextResponse.json(
    { error: 'Invalid audit data', details: parsed.error.format() },
    { status: 400 }
  );
}
```

**User-Facing Message**: "Please check your input and try again."

### 2. Rate Limit Errors (429)

**Cause**: Exceeding request limits
- Audits: 5 per minute per IP
- Leads: 3 per hour per IP
- Summaries: 10 per minute per IP

**Handling**:
```typescript
if (!checkRateLimit(`audit:${ip}`, 5, 60000)) {
  return NextResponse.json(
    { error: 'Rate limit exceeded. Please try again in a moment.' },
    { status: 429 }
  );
}
```

**User-Facing Message**: "Too many requests. Please try again later."

### 3. Email Service Failures

**Failure Points**:
- API key missing
- Resend API unreachable
- Email address invalid
- Rate limit hit

**Handling**:
```typescript
// Attempt send, log failures
const emailSent = await sendEmailWithFallback({
  to: email,
  subject: 'Your Audit Results',
  html: template
});

// If failed, log for manual review
if (!emailSent) {
  console.error('Email failed - queued for retry', { email, auditId });
  // In production: push to retry queue
}
```

**Fallback**: Silent failure with server-side logging. User is not blocked.

### 4. Database Errors

**Failure Points**:
- Supabase connection timeout
- Table doesn't exist
- Permission denied

**Handling**:
```typescript
// In production, Supabase integration:
const { error } = await supabase.from('audits').insert([...]);
if (error) {
  console.error('Database error:', error);
  // Fall back to in-memory storage
  saveAuditLocally(audit);
  return audit;
}
```

**Fallback**: In-memory storage (for development) or queued for batch retry (production)

### 5. AI Summary Generation Failures

**Failure Points**:
- API key missing
- API rate limits exceeded
- API timeout (>10s)

**Handling**:
```typescript
// Try OpenAI (3 retries)
let summary = await generateSummaryWithOpenAI(input);

// Fallback to Anthropic (3 retries)
if (!summary) {
  summary = await generateSummaryWithAnthropic(input);
}

// Fallback to template
if (!summary) {
  summary = getTemplateSummary(input);
}
```

**User-Facing**: Users always get a summary (AI or template)

## Production Error Logging

### Log Levels

**ERROR** (immediate attention):
- Database failures
- Authentication failures
- API key missing
- Critical business logic errors

**WARN** (monitor):
- Rate limits hit
- Email send failures
- Slow API responses (>5s)
- Validation errors

**INFO** (operational):
- Audit created
- Email sent
- Lead captured

### Logging to External Services

Add to `.env`:
```
SENTRY_DSN=https://xxxx@xxxx.ingest.sentry.io/xxxx
```

Then configure:
```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.captureException(error, { level: 'error' });
```

## Recovery Strategies

### Email Failures

1. **Immediate Retry** (on same request):
   - Retry up to 3 times with exponential backoff
   - Wait 1s, 2s, 4s between attempts

2. **Queue for Batch Retry** (if immediate fails):
   - Store failed email in database
   - Run retry job every 5 minutes
   - Limit retries to 24 hours

3. **Manual Notification**:
   - Alert support team if email fails after 24 hours
   - Allow manual email resend from admin panel

### Rate Limit Recovery

1. **In-Memory** (single server):
   - Rates reset on memory window (60s or 1h)
   - User must wait then retry

2. **Distributed** (multiple servers with Redis):
   - Redis-backed rate limiter (replace in-memory)
   - Consistent limits across all servers

### Database Failures

1. **Connection Retry**:
   - Exponential backoff up to 10 retries
   - Max 30s total wait

2. **Fallback Storage**:
   - Keep in-memory cache
   - Sync to database when connection restored

3. **Notification**:
   - Alert ops team after 3 failed retries
   - User sees friendly message (not technical error)

## User-Facing Error Messages

### API Errors

```typescript
// 400 - Validation Error
{
  error: "Invalid input",
  details: { teamSize: ["Must be at least 1"] }
}

// 429 - Rate Limited
{
  error: "Too many requests. Please try again in a moment."
}

// 500 - Server Error
{
  error: "Failed to generate audit. Please try again."
}
```

### Frontend Handling

```typescript
catch (error) {
  if (error.status === 429) {
    showNotification('Rate limited', 'Please wait a moment and try again');
  } else if (error.status === 400) {
    showValidationErrors(error.details);
  } else {
    showNotification('Error', 'Something went wrong. Please try again.');
  }
}
```

## Monitoring Checklist

- [ ] Error rate < 1% of requests
- [ ] Email delivery rate > 95%
- [ ] API response time < 2s (median)
- [ ] Database queries < 500ms (p99)
- [ ] Rate limit errors < 0.5% of requests

## Incident Response

1. **Monitor Sentry/logs** for error spikes
2. **Check API status** pages (OpenAI, Supabase, Resend)
3. **Review rate limits** - if many 429s, investigate DDoS
4. **Check database** - if many 500s, verify Supabase connection
5. **Escalate** to support team if customer-impacting
