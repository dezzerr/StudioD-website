import { describe, expect, it } from 'vitest';
import formSubmission from '../api/form-submission.js';
import callback from '../api/callback.js';
import type { VercelRequest, VercelResponse } from '../server/http.js';

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
  it('accepts a valid contact submission without promising email delivery', () => {
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

    formSubmission(request, response);

    expect(state.statusCode).toBe(200);
    expect(state.body).toEqual({
      success: true,
      message: 'Your message has been received. StudioD will review it shortly.',
    });
  });

  it('rejects invalid contact submissions', () => {
    const { response, state } = createResponse();
    const request = {
      method: 'POST',
      headers: {},
      body: { name: 'Test Client', email: 'not-an-email', message: '' },
    } as unknown as VercelRequest;

    formSubmission(request, response);

    expect(state.statusCode).toBe(400);
    expect(state.body).toEqual({ message: 'Name, email, and message are required' });
  });

  it('returns the Decap OAuth callback failure through the popup protocol when parameters are missing', async () => {
    const { response, state } = createResponse();
    const request = {
      method: 'GET',
      url: '/api/callback',
      headers: { host: 'studiod.com' },
    } as unknown as VercelRequest;

    await callback(request, response);

    expect(state.statusCode).toBe(200);
    expect(state.headers['Content-Type']).toContain('text/html');
    expect(String(state.body)).toContain('authorization:github:error');
  });
});
