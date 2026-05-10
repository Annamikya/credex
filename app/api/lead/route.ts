import { NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit, isHoneypotTriggered, isValidEmail, generateLeadToken } from '../../../lib/rate-limit';
import { sendEmailWithFallback } from '../../../lib/email';

const leadSchema = z.object({
  email: z.string().email(),
  company: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
  teamSize: z.number().min(1).optional(),
  auditId: z.string().optional(),
  honeypot: z.string().optional()
});

type LeadSubmission = z.infer<typeof leadSchema>;

// In-memory lead storage (replace with database in production)
interface StoredLead extends LeadSubmission {
  token: string;
  createdAt: string;
}

const leads: Map<string, StoredLead> = new Map();

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting: 3 lead submissions per hour per IP
    if (!checkRateLimit(`lead:${ip}`, 3, 3600000)) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot protection
    if (isHoneypotTriggered(body)) {
      // Silently accept to not alert spammers
      return NextResponse.json({ success: true });
    }

    // Validate
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid lead submission', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const lead = parsed.data;

    // Validate email
    if (!isValidEmail(lead.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Generate lead token
    const token = generateLeadToken();

    // Store lead
    const storedLead: StoredLead = {
      ...lead,
      token,
      createdAt: new Date().toISOString()
    };

    leads.set(token, storedLead);

    // Send welcome email
    const emailSent = await sendEmailWithFallback({
      to: lead.email,
      subject: 'Welcome to AI Spend Auditor',
      html: `
        <div style="font-family: system-ui;">
          <h2>Welcome to AI Spend Auditor</h2>
          <p>Thanks for using our service${lead.company ? ` at ${lead.company}` : ''}!</p>
          <p>We'll help you optimize your AI tool spending and uncover savings opportunities.</p>
          ${lead.auditId ? `<p>Your audit results are saved and can be accessed anytime.</p>` : ''}
        </div>
      `
    });

    return NextResponse.json({
      success: true,
      token,
      emailSent
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process lead submission' },
      { status: 500 }
    );
  }
}
