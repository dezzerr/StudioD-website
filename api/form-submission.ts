import { getJsonBody, json, methodNotAllowed, sameOriginHeaders, type VercelRequest, type VercelResponse } from '../server/http.js';

interface ContactFormData {
  name: string;
  email: string;
  sessionType?: string;
  message: string;
}

const isContactFormData = (data: ContactFormData) => Boolean(data.name && data.email && data.message);

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'OPTIONS') return json(response, 200, {}, sameOriginHeaders);
  if (request.method !== 'POST') return methodNotAllowed(request, response, 'POST, OPTIONS');

  try {
    const data = getJsonBody<ContactFormData>(request);
    if (!isContactFormData(data)) {
      return json(response, 400, { message: 'Name, email, and message are required' }, sameOriginHeaders);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return json(response, 400, { message: 'Invalid email format' }, sameOriginHeaders);
    }

    console.log('Contact form submission:', {
      ...data,
      timestamp: new Date().toISOString(),
      ip: request.headers['x-forwarded-for'] || request.headers['x-real-ip'] || 'unknown',
    });

    return json(response, 200, {
      success: true,
      message: 'Your message has been received. StudioD will review it shortly.',
    }, sameOriginHeaders);
  } catch (error) {
    console.error('Form submission error:', error);
    return json(response, 500, {
      message: error instanceof Error ? error.message : 'Failed to process submission',
    }, sameOriginHeaders);
  }
}
