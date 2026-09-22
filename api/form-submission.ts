import { getJsonBody, json, methodNotAllowed, sameOriginHeaders, type VercelRequest, type VercelResponse } from '../server/http.js';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  sessionType?: string;
  message: string;
}

const CONTACT_EMAIL = 'hello@studioderrick.co.uk';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'OPTIONS') return json(response, 200, {}, sameOriginHeaders);
  if (request.method !== 'POST') return methodNotAllowed(request, response, 'POST, OPTIONS');

  let data: ContactFormData;
  try {
    data = getJsonBody<ContactFormData>(request);
  } catch {
    return json(response, 400, { message: 'Invalid request body' }, sameOriginHeaders);
  }

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const message = typeof data.message === 'string' ? data.message.trim() : '';
  const sessionType = typeof data.sessionType === 'string' ? data.sessionType.trim() : '';

  if (!name || !email || !message) {
    return json(response, 400, { message: 'Name, email, and message are required' }, sameOriginHeaders);
  }
  if (!EMAIL_PATTERN.test(email)) {
    return json(response, 400, { message: 'Invalid email format' }, sameOriginHeaders);
  }
  if (name.length > 120 || email.length > 254 || sessionType.length > 120 || message.length > 10_000) {
    return json(response, 400, { message: 'One or more fields are too long' }, sameOriginHeaders);
  }

  const smtpPassword = process.env.LIVEMAIL_SMTP_PASSWORD;
  if (!smtpPassword) {
    console.error('Contact email delivery is not configured');
    return json(response, 503, {
      message: `The form is temporarily unavailable. Please email ${CONTACT_EMAIL} directly.`,
    }, sameOriginHeaders);
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.LIVEMAIL_SMTP_HOST || 'smtp.livemail.co.uk',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: { user: CONTACT_EMAIL, pass: smtpPassword },
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 10_000,
      disableFileAccess: true,
      disableUrlAccess: true,
    });
    const delivery = await transporter.sendMail({
      from: { name: 'Studio Derrick Website', address: CONTACT_EMAIL },
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: 'New Studio Derrick enquiry',
      text: `Name: ${name}\nEmail: ${email}\nSession type: ${sessionType || 'Not specified'}\n\nMessage:\n${message}`,
    });
    if (!delivery.accepted.includes(CONTACT_EMAIL)) {
      console.error('Contact email was not accepted by the mail server');
      return json(response, 502, {
        message: `Your message could not be sent. Please email ${CONTACT_EMAIL} directly.`,
      }, sameOriginHeaders);
    }

    return json(response, 200, {
      success: true,
      message: 'Your message has been sent to Studio Derrick.',
    }, sameOriginHeaders);
  } catch (error) {
    console.error('Contact email delivery failed', error);
    return json(response, 502, {
      message: `Your message could not be sent. Please email ${CONTACT_EMAIL} directly.`,
    }, sameOriginHeaders);
  }
}
