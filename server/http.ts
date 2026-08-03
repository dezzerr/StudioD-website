import type { IncomingMessage, ServerResponse } from 'node:http';

export interface VercelRequest extends IncomingMessage {
  body?: unknown;
  query?: Record<string, string | string[] | undefined>;
}

export interface VercelResponse extends ServerResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  send: (body: string) => VercelResponse;
}

export const json = (
  response: VercelResponse,
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
) => {
  response.status(status);
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');

  Object.entries(headers).forEach(([name, value]) => response.setHeader(name, value));

  return response.json(body);
};

export const methodNotAllowed = (
  request: VercelRequest,
  response: VercelResponse,
  allowed: string,
) => {
  response.setHeader('Allow', allowed);
  return json(response, 405, { message: 'Method not allowed' });
};

export const getQueryValue = (request: VercelRequest, key: string): string | undefined => {
  const queryValue = request.query?.[key];

  if (Array.isArray(queryValue)) return queryValue[0];
  if (typeof queryValue === 'string') return queryValue;

  const url = new URL(request.url || '/', `https://${request.headers.host || 'localhost'}`);
  return url.searchParams.get(key) || undefined;
};

export const getJsonBody = <T>(request: VercelRequest): T => {
  if (typeof request.body === 'string') return JSON.parse(request.body) as T;
  return (request.body || {}) as T;
};

export const sameOriginHeaders = {
  'Access-Control-Allow-Origin': 'https://studiod.com',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  Vary: 'Origin',
};
