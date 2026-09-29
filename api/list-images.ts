import { imagekit, isAllowedPath, isImageKitConfigured, LEGACY_FOLDER_TO_PATH, normalizePath } from '../server/imagekit.js';
import { requireAdminSession } from '../server/admin.js';
import { getQueryValue, json, methodNotAllowed, sameOriginHeaders, type VercelRequest, type VercelResponse } from '../server/http.js';

interface ImageKitFileRecord {
  fileId: string;
  name: string;
  url: string;
  thumbnail?: string;
  filePath?: string;
  createdAt?: string;
  updatedAt?: string;
  size?: number;
  fileType?: string;
  isPrivateFile?: boolean;
  tags?: string[];
}

const resolveRequestedPath = (request: VercelRequest) => {
  const exactPath = getQueryValue(request, 'path');
  if (exactPath) return normalizePath(exactPath);

  const folder = getQueryValue(request, 'folder');
  if (!folder) return '/studio-d/uploads';
  if (folder.startsWith('/')) return normalizePath(folder);
  return LEGACY_FOLDER_TO_PATH[folder] || normalizePath(`/studio-d/${folder}`);
};

const sortByCreatedAtDesc = (a: ImageKitFileRecord, b: ImageKitFileRecord) => (
  (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0)
);

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'OPTIONS') return json(response, 200, {}, sameOriginHeaders);
  if (request.method !== 'GET') return methodNotAllowed(request, response, 'GET, OPTIONS');
  if (!requireAdminSession(request, response)) return;
  if (!isImageKitConfigured()) return json(response, 500, { message: 'ImageKit not configured' }, sameOriginHeaders);

  const requestedPath = resolveRequestedPath(request);
  if (!isAllowedPath(requestedPath)) {
    return json(response, 400, {
      message: 'Invalid path. Allowed roots: /studio-d/hero, /studio-d/collections/*',
      path: requestedPath,
    }, sameOriginHeaders);
  }

  try {
    const files = await imagekit.listFiles({ path: requestedPath, limit: 200 }) as ImageKitFileRecord[];
    const results = files.map(file => ({
      fileId: file.fileId,
      name: file.name,
      url: file.url,
      thumbnailUrl: file.thumbnail || file.url,
      filePath: file.filePath,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      size: file.size,
      fileType: file.fileType,
      isPrivateFile: Boolean(file.isPrivateFile),
      tags: Array.isArray(file.tags) ? file.tags : [],
    })).sort(sortByCreatedAtDesc);

    return json(response, 200, results, sameOriginHeaders);
  } catch (error) {
    console.error('List error:', { path: requestedPath, error });
    return json(response, 500, {
      message: error instanceof Error ? error.message : 'Failed to list images',
      path: requestedPath,
    }, sameOriginHeaders);
  }
}
