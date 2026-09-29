import { afterEach, describe, expect, it, vi } from 'vitest';
import formSubmission from '../api/form-submission.js';
import callback from '../api/callback.js';
import type { VercelRequest, VercelResponse } from '../server/http.js';

const smtp = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));
vi.mock('nodemailer', () => ({
  default: { createTransport: smtp.createTransport },
}));

interface MockResponseState {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
}

const createResponse = () => {
  const state: MockResponseState = { statusCode: 200, headers: {}, body: null };
  const response = {
    status(code: number) {
      state.statusCode = code;
      return response;
    },
    setHeader(name: string, value: string) {
      state.headers[name] = value;
    },
    json(body: unknown) {
      state.body = body;
      return response;
    },
    send(body: string) {
      state.body = body;
      return response;
    },
  } as unknown as VercelResponse;

  return { response, state };
};

describe('Vercel API routes', () => {
  afterEach(() => {
    delete process.env.LIVEMAIL_SMTP_PASSWORD;
    delete process.env.LIVEMAIL_SMTP_HOST;
    vi.clearAllMocks();
  });

  it('sends a valid inquiry to the Studio Derrick address before reporting success', async () => {
    process.env.LIVEMAIL_SMTP_PASSWORD = 'test-password';
    smtp.sendMail.mockResolvedValue({ accepted: ['hello@studioderrick.co.uk'] });
    smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail });
    const { response, state } = createResponse();
    const request = {
      method: 'POST',
      headers: {},
      body: {
        name: 'Test Client',
        email: 'client@example.com',
        sessionType: 'portrait',
        message: 'I would like to enquire about a portrait session.',
      },
    } as unknown as VercelRequest;

    await formSubmission(request, response);

    expect(state.statusCode).toBe(200);
    expect(state.body).toEqual({
      success: true,
      message: 'Your message has been sent to Studio Derrick.',
    });
    expect(smtp.createTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: 'smtp.livemail.co.uk',
      port: 587,
      requireTLS: true,
      auth: { user: 'hello@studioderrick.co.uk', pass: 'test-password' },
    }));
    expect(smtp.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'hello@studioderrick.co.uk',
      replyTo: 'client@example.com',
      text: expect.stringContaining('I would like to enquire about a portrait session.'),
    }));
  });

  it('does not report success when email delivery is unconfigured', async () => {
    const { response, state } = createResponse();
    const request = {
      method: 'POST',
      headers: {},
      body: { name: 'Test Client', email: 'client@example.com', message: 'Hello' },
    } as unknown as VercelRequest;

    await formSubmission(request, response);

    expect(state.statusCode).toBe(503);
    expect(state.body).toEqual({
      message: 'The form is temporarily unavailable. Please email hello@studioderrick.co.uk directly.',
    });
  });

  it('does not report success when the email provider rejects an inquiry', async () => {
    process.env.LIVEMAIL_SMTP_PASSWORD = 'test-password';
    smtp.sendMail.mockResolvedValue({ accepted: [] });
    smtp.createTransport.mockReturnValue({ sendMail: smtp.sendMail });
    const { response, state } = createResponse();
    const request = {
      method: 'POST',
      headers: {},
      body: { name: 'Test Client', email: 'client@example.com', message: 'Hello' },
    } as unknown as VercelRequest;

    await formSubmission(request, response);

    expect(state.statusCode).toBe(502);
    expect(state.body).toEqual({
      message: 'Your message could not be sent. Please email hello@studioderrick.co.uk directly.',
    });
  });

  it('rejects invalid contact submissions', async () => {
    const { response, state } = createResponse();
    const request = {
      method: 'POST',
      headers: {},
      body: { name: 'Test Client', email: 'not-an-email', message: '' },
    } as unknown as VercelRequest;

    await formSubmission(request, response);

    expect(state.statusCode).toBe(400);
    expect(state.body).toEqual({ message: 'Name, email, and message are required' });
  });

  it('returns the Decap OAuth callback failure through the popup protocol when parameters are missing', async () => {
    const { response, state } = createResponse();
    const request = {
      method: 'GET',
      url: '/api/callback',
      headers: { host: 'www.studioderrick.co.uk' },
    } as unknown as VercelRequest;

    await callback(request, response);

    expect(state.statusCode).toBe(200);
    expect(state.headers['Content-Type']).toContain('text/html');
    expect(String(state.body)).toContain('authorization:github:error');
  });
});
