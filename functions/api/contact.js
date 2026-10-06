/**
 * Cloudflare Pages Function: /api/contact
 * Handles contact brief inquiries and dispatches emails via Resend API
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const data = await request.json();
    const { name, email, service, budget, message } = data || {};

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields (name, email, message).' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error: Missing RESEND_API_KEY.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const receiverEmail = env.CONTACT_RECEIVER_EMAIL || 'hainampham08@outlook.com';
    let fromEmail = env.CONTACT_FROM_EMAIL || 'work@scherre.com';

    // Editorial HTML Email Template
    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px 24px; background-color: #0d0d0d; color: #f2f2f2; border-radius: 8px; border: 1px solid #222;">
        <div style="border-bottom: 1px solid #262626; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 6px 0; font-size: 20px; font-weight: 500; color: #ffffff; letter-spacing: -0.5px;">New Project Inquiry</h2>
          <p style="margin: 0; font-size: 13px; color: #888888;">Submitted via scherre.com contact brief</p>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 4px;">Client Name</div>
          <div style="font-size: 16px; color: #ffffff; font-weight: 500;">${escapeHtml(name)}</div>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 4px;">Email Address</div>
          <div style="font-size: 15px; color: #ffffff;"><a href="mailto:${escapeHtml(email)}" style="color: #60a5fa; text-decoration: none;">${escapeHtml(email)}</a></div>
        </div>

        <table style="width: 100%; border-collapse: separate; border-spacing: 12px 0; margin-left: -12px; margin-bottom: 20px;">
          <tr>
            <td style="background: #161616; padding: 12px 14px; border-radius: 4px; border: 1px solid #262626; width: 50%;">
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 4px;">Discipline</div>
              <div style="font-size: 13px; color: #ffffff; font-weight: 500;">${escapeHtml(service || 'Not specified')}</div>
            </td>
            <td style="background: #161616; padding: 12px 14px; border-radius: 4px; border: 1px solid #262626; width: 50%;">
              <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 4px;">Budget Range</div>
              <div style="font-size: 13px; color: #ffffff; font-weight: 500;">${escapeHtml(budget || 'Not specified')}</div>
            </td>
          </tr>
        </table>

        <div style="margin-bottom: 24px;">
          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 6px;">Project Brief</div>
          <div style="font-size: 14px; line-height: 1.6; color: #e5e5e5; background: #161616; padding: 16px; border-radius: 6px; border: 1px solid #262626; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>

        <div style="border-top: 1px solid #262626; padding-top: 16px; font-size: 11px; color: #666; text-align: center;">
          Directly reply to this email to respond to ${escapeHtml(name)} (${escapeHtml(email)}).
        </div>
      </div>
    `;

    // Attempt sending via Resend API
    let resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [receiverEmail],
        reply_to: email,
        subject: `New Inquiry: ${name} [${service || 'General'}]`,
        html: htmlContent,
        text: `New Inquiry from ${name} (${email})\n\nDiscipline: ${service}\nBudget: ${budget}\n\nProject Brief:\n${message}`
      })
    });

    let resendData = await resendResponse.json();

    // If sending fails because domain is unverified on Resend, fallback to onboarding@resend.dev
    if (!resendResponse.ok && fromEmail !== 'onboarding@resend.dev' && resendData?.message?.includes('domain')) {
      console.warn('Custom domain not verified yet on Resend, attempting fallback with onboarding@resend.dev');
      resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: [receiverEmail],
          reply_to: email,
          subject: `New Inquiry: ${name} [${service || 'General'}]`,
          html: htmlContent,
          text: `New Inquiry from ${name} (${email})\n\nDiscipline: ${service}\nBudget: ${budget}\n\nProject Brief:\n${message}`
        })
      });
      resendData = await resendResponse.json();
    }

    if (!resendResponse.ok) {
      console.error('Resend API Error:', resendData);
      return new Response(
        JSON.stringify({ error: resendData.message || 'Failed to send email via provider.' }),
        { status: resendResponse.status || 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Contact handler error:', err);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred while processing your message.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
