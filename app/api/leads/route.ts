import { NextRequest, NextResponse } from 'next/server';

// In-memory storage (for Vercel, use Vercel KV or external DB for persistence)
// Leads are also sent to webhook for notifications
const WEBHOOK_URL = process.env.LEADS_WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const leadRecord = {
      ...data,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    };
    
    // Log to console (visible in Vercel logs)
    console.log('📧 NEW LEAD:', JSON.stringify({
      name: data.lead?.name,
      email: data.lead?.email,
      company: data.lead?.company,
      role: data.lead?.role,
      complete: data.complete || false,
      timestamp: leadRecord.createdAt,
    }, null, 2));
    
    // Send to webhook if configured (e.g., Slack, Zapier, etc.)
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🎯 New AI Roadmap Lead!\n\n*Name:* ${data.lead?.name}\n*Email:* ${data.lead?.email}\n*Company:* ${data.lead?.company}\n*Role:* ${data.lead?.role || 'N/A'}\n*Completed:* ${data.complete ? 'Yes ✅' : 'Just started'}\n\n${data.complete ? '👉 They finished the roadmap - hot lead!' : ''}`,
          }),
        });
      } catch (webhookError) {
        console.error('Webhook failed:', webhookError);
      }
    }
    
    // Send email notification via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'AI Roadmap Tool <leads@1labs.ai>',
            to: ['heemang@1labs.ai'],
            subject: `🎯 New Lead: ${data.lead?.name} from ${data.lead?.company}`,
            html: `
              <h2>New AI Roadmap Lead</h2>
              <p><strong>Name:</strong> ${data.lead?.name}</p>
              <p><strong>Email:</strong> ${data.lead?.email}</p>
              <p><strong>Company:</strong> ${data.lead?.company}</p>
              <p><strong>Role:</strong> ${data.lead?.role || 'N/A'}</p>
              <p><strong>Completed Roadmap:</strong> ${data.complete ? 'Yes ✅' : 'No (just started)'}</p>
              <hr/>
              <p>View in <a href="https://app.instantly.ai">Instantly CRM</a></p>
            `,
          }),
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
    }
    
    return NextResponse.json({ success: true, id: leadRecord.id });
  } catch (error) {
    console.error('Failed to save lead:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Leads API - POST to submit leads',
    note: 'Leads are logged to Vercel console and sent to configured webhooks'
  });
}
