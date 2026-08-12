import { imagekit, isImageKitConfigured } from '../server/imagekit.js';
import { requireAdminSession } from '../server/admin.js';
import { getJsonBody, json, methodNotAllowed, sameOriginHeaders, type VercelRequest, type VercelResponse } from '../server/http.js';

interface DeleteImageBody {
  fileId?: string;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'OPTIONS') return json(response, 200, {}, sameOriginHeaders);
  if (request.method !== 'POST') return methodNotAllowed(request, response, 'POST, OPTIONS');
  if (!requireAdminSession(request, response)) return;
  if (!isImageKitConfigured()) return json(response, 500, { message: 'ImageKit not configured' }, sameOriginHeaders);

  try {
    const { fileId } = getJsonBody<DeleteImageBody>(request);
    if (!fileId) return json(response, 400, { message: 'File ID required' }, sameOriginHeaders);

    await imagekit.deleteFile(fileId);
    return json(response, 200, { success: true }, sameOriginHeaders);
  } catch (error) {
    console.error('Delete error:', error);
    return json(response, 500, {
      message: error instanceof Error ? error.message : 'Delete failed',
    }, sameOriginHeaders);
  }
}
