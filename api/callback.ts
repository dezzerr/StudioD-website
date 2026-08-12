import { createHmac, timingSafeEqual } from 'node:crypto';
import { type VercelRequest, type VercelResponse } from '../server/http.js';
import { createAdminSessionCookie } from '../server/admin.js';

const getOrigin = () => process.env.VITE_SITE_URL || 'https://studiod.com';

const signState = (state: string, secret: string) => createHmac('sha256', secret).update(state).digest('hex');

const readCookie = (cookieHeader: string | undefined, name: string) => (
  cookieHeader?.split(';').map(part => part.trim()).find(part => part.startsWith(`${name}=`))?.slice(name.length + 1)
);

const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

const renderOAuthResponse = (response: VercelResponse, status: 'success' | 'error', content: unknown) => {
  const encodedContent = safeJson(content);
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>StudioD authorisation</title></head>
<body><p>You can close this window.</p>
<script>
  const content = ${encodedContent};
  const receiveMessage = (message) => {
    if (!window.opener) return;
    window.opener.postMessage('authorization:github:${status}:' + JSON.stringify(content), message.origin);
    window.removeEventListener('message', receiveMessage, false);
    window.close();
  };
  window.addEventListener('message', receiveMessage, false);
  window.opener?.postMessage('authorizing:github', '*');
</script></body></html>`;

  response.status(200);
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.send(html);
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method !== 'GET') {
    response.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  const url = new URL(request.url || '/', `https://${request.headers.host || 'localhost'}`);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthError = url.searchParams.get('error');

  if (oauthError) {
    renderOAuthResponse(response, 'error', { error: oauthError });
    return;
  }

  if (!clientId || !clientSecret || !code || !state) {
    renderOAuthResponse(response, 'error', { error: 'Incomplete GitHub OAuth response' });
    return;
  }

  const storedState = readCookie(request.headers.cookie, 'decap_oauth_state');
  const [storedValue, storedSignature] = storedState?.split('.') || [];
  const expectedSignature = signState(state, clientSecret);

  if (!storedValue || !storedSignature || storedValue !== state || storedSignature.length !== expectedSignature.length || !timingSafeEqual(Buffer.from(storedSignature), Buffer.from(expectedSignature))) {
    renderOAuthResponse(response, 'error', { error: 'Invalid OAuth state' });
    return;
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: `${getOrigin()}/api/callback` }),
    });
    const tokenData = await tokenResponse.json() as { access_token?: string; error?: string; error_description?: string };

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || tokenData.error || 'GitHub token exchange failed');
    }

    const repository = process.env.GITHUB_REPO || 'dezzerr/StudioD-website';
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${tokenData.access_token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const user = await userResponse.json() as { login?: string };
    if (!userResponse.ok || !user.login) throw new Error('Unable to identify GitHub admin');

    const permissionResponse = await fetch(`https://api.github.com/repos/${repository}/collaborators/${encodeURIComponent(user.login)}/permission`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${tokenData.access_token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    const permission = await permissionResponse.json() as { permission?: string };
    if (!permissionResponse.ok || !['admin', 'maintain', 'write'].includes(permission.permission || '')) {
      throw new Error('GitHub account does not have write access to the StudioD repository');
    }

    response.setHeader('Set-Cookie', createAdminSessionCookie(user.login));
    renderOAuthResponse(response, 'success', { token: tokenData.access_token, provider: 'github' });
  } catch (error) {
    renderOAuthResponse(response, 'error', { error: error instanceof Error ? error.message : 'GitHub authorisation failed' });
  }
}
