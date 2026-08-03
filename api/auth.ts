import { createHmac, randomBytes } from 'node:crypto';
import { type VercelRequest, type VercelResponse } from '../server/http.js';

const getOrigin = () => process.env.VITE_SITE_URL || 'https://studiod.com';

const signState = (state: string, secret: string) => createHmac('sha256', secret).update(state).digest('hex');

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    response.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    response.status(503).json({ message: 'GitHub OAuth is not configured' });
    return;
  }

  const state = randomBytes(24).toString('hex');
  const signedState = `${state}.${signState(state, clientSecret)}`;
  const redirectUri = `${getOrigin()}/api/callback`;
  const githubUrl = new URL('https://github.com/login/oauth/authorize');
  githubUrl.searchParams.set('client_id', clientId);
  githubUrl.searchParams.set('redirect_uri', redirectUri);
  githubUrl.searchParams.set('scope', 'repo');
  githubUrl.searchParams.set('state', state);

  response.statusCode = 302;
  response.setHeader('Location', githubUrl.toString());
  response.setHeader('Set-Cookie', `decap_oauth_state=${signedState}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`);
  response.setHeader('Cache-Control', 'no-store');
  response.end();
}
