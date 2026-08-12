import { imagekit, isImageKitConfigured } from '../server/imagekit.js';
import { requireAdminSession } from '../server/admin.js';
import { json, methodNotAllowed, sameOriginHeaders, type VercelRequest, type VercelResponse } from '../server/http.js';

export default function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'OPTIONS') return json(response, 200, {}, sameOriginHeaders);
  if (request.method !== 'GET') return methodNotAllowed(request, response, 'GET, OPTIONS');
  if (!requireAdminSession(request, response)) return;
  if (!isImageKitConfigured()) return json(response, 500, { message: 'ImageKit not configured' }, sameOriginHeaders);

  try {
    return json(response, 200, imagekit.getAuthenticationParameters(), sameOriginHeaders);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return json(response, 500, {
      message: error instanceof Error ? error.message : 'Authentication failed',
    }, sameOriginHeaders);
  }
}
