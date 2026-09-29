import { createHmac, timingSafeEqual } from 'node:crypto';
import { type VercelRequest, type VercelResponse } from './http.js';

const COOKIE_NAME = 'studiod_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60;

const getSessionSecret = () => process.env.STUDIO_ADMIN_SESSION_SECRET || process.env.GITHUB_OAUTH_CLIENT_SECRET || '';

const signatureFor = (value: string) => createHmac('sha256', getSessionSecret()).update(value).digest('hex');

const readCookie = (cookieHeader: string | undefined) => (
  cookieHeader?.split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1)
);

export const createAdminSessionCookie = (login: string) => {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;
  const value = `${login}.${expiresAt}`;
  const signedValue = `${value}.${signatureFor(value)}`;
  return `${COOKIE_NAME}=${signedValue}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_MAX_AGE_SECONDS}`;
};

export const hasAdminSession = (request: VercelRequest) => {
  const secret = getSessionSecret();
  const value = readCookie(request.headers.cookie);
  if (!secret || !value) return false;

  const [login, expiresAt, signature] = value.split('.');
  if (!login || !expiresAt || !signature || Number(expiresAt) < Math.floor(Date.now() / 1000)) return false;

  const payload = `${login}.${expiresAt}`;
  const expectedSignature = signatureFor(payload);
  return signature.length === expectedSignature.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

export const requireAdminSession = (request: VercelRequest, response: VercelResponse) => {
  if (hasAdminSession(request)) return true;
  response.status(401).json({ message: 'Admin authentication required' });
  return false;
};
