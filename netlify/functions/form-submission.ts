import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

interface ContactFormData {
  name: string;
  email: string;
  sessionType?: string;
  message: string;
}

export const handler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext
) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  try {
    const data: ContactFormData = JSON.parse(event.body || '{}');

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Name, email, and message are required' }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid email format' }),
      };
    }

    // Send notification email (if configured)
    const notificationEmail = process.env.CONTACT_EMAIL || 'hello@studiod.com';
    
    // Log submission (in production, send via email service)
    console.log('Contact form submission:', {
      ...data,
      timestamp: new Date().toISOString(),
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'],
    });

    // If SendGrid is configured, send email
    if (process.env.SENDGRID_API_KEY) {
      await sendSendGridEmail(data, notificationEmail);
    }

    // If Resend is configured, send email
    if (process.env.RESEND_API_KEY) {
      await sendResendEmail(data, notificationEmail);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
      }),
    };
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Failed to process submission',
      }),
    };
  }
};

async function sendSendGridEmail(data: ContactFormData, to: string): Promise<void> {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: to }],
      }],
      from: { email: 'noreply@studiod.com', name: 'StudioD' },
      reply_to: { email: data.email, name: data.name },
      subject: `New Contact Form Submission from ${data.name}`,
      content: [{
        type: 'text/plain',
        value: `
Name: ${data.name}
Email: ${data.email}
Session Type: ${data.sessionType || 'Not specified'}

Message:
${data.message}
        `.trim(),
      }],
    }),
  });

  if (!response.ok) {
    throw new Error(`SendGrid error: ${response.statusText}`);
  }
}

async function sendResendEmail(data: ContactFormData, to: string): Promise<void> {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'StudioD <noreply@studiod.com>',
      to: [to],
      reply_to: `${data.name} <${data.email}>`,
      subject: `New Contact Form Submission from ${data.name}`,
      text: `
Name: ${data.name}
Email: ${data.email}
Session Type: ${data.sessionType || 'Not specified'}

Message:
${data.message}
      `.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend error: ${response.statusText}`);
  }
}
