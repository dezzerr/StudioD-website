import { imagekit, isAllowedPath, isImageKitConfigured, LEGACY_FOLDER_TO_PATH, normalizePath } from '../server/imagekit.js';
import { requireAdminSession } from '../server/admin.js';
import { json, methodNotAllowed, sameOriginHeaders, type VercelRequest, type VercelResponse } from '../server/http.js';

interface MultipartPart {
  name?: string;
  filename?: string;
  data?: Buffer;
}

const MAX_COMPATIBILITY_UPLOAD_BYTES = 4 * 1024 * 1024;

const readRequestBody = async (request: VercelRequest): Promise<Buffer> => {
  if (Buffer.isBuffer(request.body)) return request.body;
  if (typeof request.body === 'string') return Buffer.from(request.body, 'base64');

  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
};

const parseMultipart = (buffer: Buffer, boundary: string): MultipartPart[] => {
  const parts: MultipartPart[] = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let start = buffer.indexOf(boundaryBuffer);

  while (start !== -1) {
    const end = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length);
    const part = buffer.slice(start + boundaryBuffer.length, end !== -1 ? end : undefined);
    const headerEnd = part.indexOf('\r\n\r\n');

    if (headerEnd !== -1) {
      const headers = part.slice(0, headerEnd).toString();
      const data = part.slice(headerEnd + 4, part.length - 2);
      parts.push({
        name: headers.match(/name="([^"]+)"/)?.[1],
        filename: headers.match(/filename="([^"]+)"/)?.[1],
        data: data.length > 0 ? data : undefined,
      });
    }

    start = end;
  }

  return parts;
};

const resolveUploadPath = (parts: MultipartPart[]) => {
  const explicitPath = parts.find(part => part.name === 'path')?.data?.toString().trim();
  if (explicitPath) return normalizePath(explicitPath);

  const folder = parts.find(part => part.name === 'folder')?.data?.toString().trim();
  if (!folder) return '/studio-d/uploads';
  if (folder.startsWith('/')) return normalizePath(folder);
  return LEGACY_FOLDER_TO_PATH[folder] || normalizePath(`/studio-d/${folder}`);
};

const sanitizeFileName = (fileName: string) => fileName.toLowerCase()
  .replace(/[^a-z0-9.-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'OPTIONS') return json(response, 200, {}, sameOriginHeaders);
  if (request.method !== 'POST') return methodNotAllowed(request, response, 'POST, OPTIONS');
  if (!requireAdminSession(request, response)) return;
  if (!isImageKitConfigured()) return json(response, 500, { message: 'ImageKit not configured' }, sameOriginHeaders);

  const contentLength = Number(request.headers['content-length'] || 0);
  if (contentLength > MAX_COMPATIBILITY_UPLOAD_BYTES) {
    return json(response, 413, { message: 'Upload is too large. Use direct ImageKit upload.' }, sameOriginHeaders);
  }

  try {
    const contentType = request.headers['content-type'] || '';
    const boundary = contentType.split('boundary=')[1];
    if (!boundary) return json(response, 400, { message: 'Invalid request' }, sameOriginHeaders);

    const body = await readRequestBody(request);
    if (body.length > MAX_COMPATIBILITY_UPLOAD_BYTES) {
      return json(response, 413, { message: 'Upload is too large. Use direct ImageKit upload.' }, sameOriginHeaders);
    }

    const parts = parseMultipart(body, boundary);
    const filePart = parts.find(part => part.filename && part.data);
    if (!filePart?.data) return json(response, 400, { message: 'No file provided' }, sameOriginHeaders);

    const uploadPath = resolveUploadPath(parts);
    if (!isAllowedPath(uploadPath)) {
      return json(response, 400, {
        message: 'Invalid upload path. Allowed roots: /studio-d/hero, /studio-d/collections/*',
        path: uploadPath,
      }, sameOriginHeaders);
    }

    const fileName = parts.find(part => part.name === 'fileName')?.data?.toString() || filePart.filename || 'image.jpg';
    const tags = parts.find(part => part.name === 'tags')?.data?.toString().split(',').map(tag => tag.trim()).filter(Boolean).slice(0, 20) || [];
    const pathTag = uploadPath.split('/').filter(Boolean).pop() || 'uploads';
    const uploadResponse = await imagekit.upload({
      file: filePart.data,
      fileName: sanitizeFileName(fileName),
      folder: uploadPath,
      useUniqueFileName: true,
      tags: Array.from(new Set(['portfolio', pathTag, ...tags])),
    });

    return json(response, 200, {
      url: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      size: uploadResponse.size,
      filePath: uploadResponse.filePath,
    }, sameOriginHeaders);
  } catch (error) {
    console.error('Upload error:', error);
    return json(response, 500, {
      message: error instanceof Error ? error.message : 'Upload failed',
    }, sameOriginHeaders);
  }
}
