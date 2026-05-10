/**
 * Email service integration using Resend.
 * Sends transactional emails for audit confirmations and lead capture.
 */

import { Resend } from 'resend';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('Resend API key is not configured. Email sending will be skipped.');
    return null;
  }

  return new Resend(apiKey);
}

/**
 * Send an email via Resend.
 * Returns true if successful, false otherwise.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    return false;
  }

  try {
    const result = await resend.emails.send({
      from: 'AI Spend Auditor <audits@aispendauditor.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || 'support@aispendauditor.com'
    });

    return !!result.data?.id;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

/**
 * Send audit confirmation email with shareable link.
 */
export async function sendAuditConfirmationEmail(email: string, auditId: string, shareUrl: string, yearlySavings: number): Promise<boolean> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a; margin-bottom: 24px;">Your AI Spend Audit is Ready</h2>
        
        <p style="color: #475569; line-height: 1.6; margin-bottom: 16px;">
          We've analyzed your AI tool spending and identified significant savings opportunities.
        </p>

        <div style="background-color: #f1f5f9; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">Potential Annual Savings</h3>
          <p style="font-size: 32px; font-weight: bold; color: #06b6d4; margin: 16px 0 0 0;">
            $${Math.round(yearlySavings).toLocaleString()}
          </p>
        </div>

        <p style="color: #475569; margin-bottom: 24px;">
          <a href="${shareUrl}" style="display: inline-block; padding: 12px 24px; background-color: #06b6d4; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            View Your Audit Results
          </a>
        </p>

        <p style="color: #64748b; font-size: 14px; margin-bottom: 8px;">
          You can share this audit with your team or investors using the link above. Sensitive details are hidden from the public view.
        </p>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

        <p style="color: #64748b; font-size: 12px; margin-bottom: 0;">
          Questions? Reply to this email or visit our support page.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Your AI Spend Audit Results are Ready',
    html
  });
}

/**
 * Send welcome email to new leads.
 */
export async function sendWelcomeEmail(email: string, company?: string): Promise<boolean> {
  const companyLine = company ? ` at ${company}` : '';
  
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a; margin-bottom: 24px;">Welcome to AI Spend Auditor</h2>
        
        <p style="color: #475569; line-height: 1.6; margin-bottom: 16px;">
          Thanks for using AI Spend Auditor${companyLine}. We'll help you optimize your AI tool spending.
        </p>

        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #22c55e;">
          <p style="color: #166534; margin: 0; font-size: 14px;">
            Your audit results are private and secure. You can generate a shareable link to show to your team or investors.
          </p>
        </div>

        <p style="color: #475569; margin-bottom: 8px;">
          We'll occasionally send you:
        </p>
        <ul style="color: #475569; line-height: 1.8;">
          <li>Updates on new AI tools and pricing changes</li>
          <li>Tips for optimizing your AI spending</li>
          <li>Exclusive offers from partners</li>
        </ul>

        <p style="color: #64748b; font-size: 12px; margin-top: 32px;">
          You can manage your preferences or unsubscribe at any time.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to AI Spend Auditor',
    html
  });
}

/**
 * Send follow-up email to engaged leads.
 */
export async function sendFollowUpEmail(email: string): Promise<boolean> {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a; margin-bottom: 24px;">Next Steps to Save on AI Spending</h2>
        
        <p style="color: #475569; line-height: 1.6; margin-bottom: 24px;">
          Based on your audit, here are some quick wins you can implement:
        </p>

        <div style="margin-bottom: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 14px; font-weight: 600;">1. Review Plan Recommendations</h3>
          <p style="color: #475569; margin-bottom: 0; font-size: 14px;">
            Check if any tools can be downgraded without affecting your workflow.
          </p>
        </div>

        <div style="margin-bottom: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 14px; font-weight: 600;">2. Consolidate Overlapping Tools</h3>
          <p style="color: #475569; margin-bottom: 0; font-size: 14px;">
            If you're using multiple AI tools with similar capabilities, consider consolidating to reduce costs.
          </p>
        </div>

        <div style="margin-bottom: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 14px; font-weight: 600;">3. Share with Your Team</h3>
          <p style="color: #475569; margin-bottom: 0; font-size: 14px;">
            Get buy-in from your team before making changes. Use your shareable audit link to discuss.
          </p>
        </div>

        <p style="color: #64748b; font-size: 12px; margin-top: 32px;">
          Questions or need help? Reply to this email and we'll assist you.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Your AI Spending Optimization Plan',
    html
  });
}

/**
 * Fallback email sending if Resend is unavailable.
 * In production, queue these for retry or log for manual sending.
 */
export async function sendEmailWithFallback(options: EmailOptions): Promise<boolean> {
  try {
    return await sendEmail(options);
  } catch (error) {
    console.error('Email sending failed, logging for manual review:', {
      to: options.to,
      subject: options.subject,
      timestamp: new Date().toISOString()
    });
    // In production, queue for retry or log to external service
    return false;
  }
}
