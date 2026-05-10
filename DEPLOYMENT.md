# Deployment Guide - Vercel

## Pre-Deployment Checklist

- [ ] All tests passing: `npm run test`
- [ ] Linting clean: `npm run lint`
- [ ] Build successful: `npm run build`
- [ ] Environment variables configured
- [ ] Database schema created in Supabase
- [ ] API keys obtained (Resend, OpenAI/Anthropic optional)
- [ ] Domain configured (if custom domain)
- [ ] Analytics setup (optional)

## Step 1: Prepare Environment Variables

### Supabase Setup

1. **Create Supabase project**:
   - Go to https://supabase.com/dashboard
   - Create new project
   - Wait for it to initialize (5-10 minutes)

2. **Run database schema**:
   - Copy entire `SUPABASE_SCHEMA.sql`
   - Go to SQL Editor in Supabase dashboard
   - Paste and execute
   - Verify tables are created

3. **Get API keys**:
   - Go to Settings → API
   - Copy `Project URL` → `SUPABASE_URL`
   - Copy `Service Role Secret` → `SUPABASE_SERVICE_ROLE_KEY` (for server-side)

### Resend Setup (Required for Email)

1. **Create Resend account**:
   - Go to https://resend.com
   - Sign up and verify email

2. **Get API key**:
   - Go to API Keys
   - Click "Create API Key"
   - Copy and save securely → `RESEND_API_KEY`

3. **Configure domain** (optional for branded emails):
   - Go to Domains
   - Add your domain (e.g., `aispendauditor.com`)
   - Follow DNS verification steps
   - Update `NEXT_PUBLIC_EMAIL_FROM` to use your domain

### OpenAI Setup (Optional for AI Summaries)

1. **Create OpenAI account**:
   - Go to https://platform.openai.com
   - Sign up

2. **Create API key**:
   - Go to Account → API keys
   - Create new secret key
   - Copy → `OPENAI_API_KEY`

3. **Set usage limits**:
   - Go to Account → Billing
   - Set monthly limit to prevent runaway costs

### Anthropic Setup (Optional - Fallback for AI Summaries)

1. **Create Anthropic account**:
   - Go to https://console.anthropic.com
   - Sign up

2. **Create API key**:
   - Go to Account → Keys
   - Create new key
   - Copy → `ANTHROPIC_API_KEY`

## Step 2: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/credex.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Search for your GitHub repo
   - Click Import

3. **Configure environment variables**:
   - In Vercel project settings → Environment Variables
   - Add all variables from `.env.example`:
     - `SUPABASE_URL`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `RESEND_API_KEY`
     - `OPENAI_API_KEY` (optional)
     - `ANTHROPIC_API_KEY` (optional)

4. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete (5-10 minutes)
   - Verify deployment is successful

### Option B: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Follow prompts**:
   - Select project name
   - Configure environment variables when prompted
   - Deploy

## Step 3: Post-Deployment Verification

### Test Critical Flows

1. **Landing page**:
   - Visit https://your-domain.vercel.app
   - Check all sections load
   - Verify form validation works

2. **Audit generation**:
   - Fill out audit form with test data
   - Verify audit results display
   - Check recommendations are shown

3. **Email sending** (if Resend configured):
   - Submit audit with test email
   - Check inbox for audit confirmation
   - Verify shareable link works

4. **Public sharing**:
   - Get share link from results
   - Open in incognito/private window
   - Verify data is sanitized (no email/company shown)

### Health Checks

```bash
# Check API status
curl https://your-domain.vercel.app/api/audit -X OPTIONS

# Check database connection
curl https://your-domain.vercel.app/api/health

# Check rate limiting
for i in {1..10}; do
  curl https://your-domain.vercel.app/api/audit \
    -H "Content-Type: application/json" \
    -d '{"tools":[]}' &
done
```

## Step 4: Domain Configuration (Optional)

### Add Custom Domain

1. **In Vercel dashboard**:
   - Go to Project Settings → Domains
   - Add custom domain
   - Update DNS records as shown

2. **DNS Configuration**:
   - For `aispendauditor.com` (root domain):
     - Create A record pointing to Vercel
     - Or add CNAME record

3. **SSL Certificate**:
   - Vercel automatically provisions SSL (HTTPS)
   - Wait 5-15 minutes for certificate issuance

4. **Update Resend domain**:
   - If using custom domain, configure in Resend
   - Add DNS records for email verification
   - Update `NEXT_PUBLIC_EMAIL_FROM` environment variable

## Step 5: Monitoring & Logs

### View Deployment Logs

```bash
# Using Vercel CLI
vercel logs --prod

# Or check in Vercel dashboard
# Projects → Select project → Deployments → Recent deployment
```

### Monitor Performance

1. **Vercel Analytics**:
   - Dashboard → Analytics
   - Check Core Web Vitals
   - Monitor error rate

2. **Sentry (if configured)**:
   - Set up at https://sentry.io
   - Add `SENTRY_DSN` environment variable
   - View real-time error tracking

3. **Supabase Analytics**:
   - Go to Supabase dashboard
   - Check Query Performance
   - Monitor database usage

## Step 6: CI/CD Pipeline (Optional)

### GitHub Actions for Automated Testing

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install --legacy-peer-deps
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
```

## Scaling Considerations

### Database Connection Pooling

For high-traffic deployments, configure Supabase connection pooling:
- Supabase dashboard → Database → Connection pooling
- Enable for "Session" mode
- Set max connections to 10-20

### Rate Limiting at Edge

For large scale, upgrade rate limiting to Redis:
1. Add Redis URL to environment variables
2. Update `lib/rate-limit.ts` to use Redis client
3. Deploy and verify

### CDN Caching

Configure Vercel Edge Caching:
- Static pages: Cache for 1 day
- API responses: Cache for 5 minutes (if applicable)
- Configure in `next.config.js`

## Troubleshooting

### Build Failures

1. **Check build logs**:
   ```bash
   vercel logs --prod
   ```

2. **Common issues**:
   - TypeScript errors: Run `npm run build` locally
   - Missing dependencies: Check `package.json`
   - Environment variables: Verify all required vars are set

### API Errors in Production

1. **Enable detailed logging**:
   - Add `DEBUG=* vercel dev` locally
   - Check Sentry for error details

2. **Test API locally**:
   ```bash
   npm run dev
   curl http://localhost:3000/api/audit
   ```

3. **Check external services**:
   - Supabase status page
   - Resend status page
   - OpenAI status page

### Email Not Sending

1. **Verify Resend API key**:
   - Check environment variables in Vercel dashboard
   - Test in local development first

2. **Check email logs**:
   - Supabase dashboard → `email_logs` table
   - Look for failures

3. **Verify domain**:
   - If using custom domain, ensure DNS is configured
   - Test sending to personal email first

## Cost Optimization

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Supabase**: Free tier includes 500MB database, 1GB bandwidth
- **Resend**: $0.20 per email (first 100 emails free)
- **OpenAI**: ~$0.01 per summary (if using)

## Maintenance

### Regular Tasks

- [ ] Weekly: Monitor error rates in Sentry
- [ ] Weekly: Check database usage in Supabase
- [ ] Monthly: Review audit statistics
- [ ] Monthly: Update dependencies: `npm update`
- [ ] Quarterly: Audit security dependencies: `npm audit`

### Backup Strategy

- Supabase: Automatic daily backups included
- Manual export: `pg_dump` from Supabase
- Frequency: Weekly manual backup to S3 or GitHub

## Rollback Plan

If deployment goes wrong:

1. **Using Vercel dashboard**:
   - Go to Deployments
   - Find previous stable deployment
   - Click "Rollback"

2. **Using Git**:
   ```bash
   git revert HEAD
   git push origin main
   # Vercel auto-deploys on push
   ```
