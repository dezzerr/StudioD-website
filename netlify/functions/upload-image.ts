import type { Handler, HandlerEvent } from '@netlify/functions';
import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
});

interface UploadResponse {
  url: string;
  thumbnailUrl: string;
  fileId: string;
  name: string;
  size: number;
  filePath?: string;
}

const LEGACY_FOLDER_TO_PATH: Record<string, string> = {
  hero: '/hero',
  'studio-portraits': '/collections/studio-portraits',
  'family-sessions': '/collections/family-sessions',
  'event-photography': '/collections/event-photography',
  uploads: '/studio-d-uploads',
};

const ALLOWED_EXACT_PATHS = new Set([
  '/studio-d/hero',
  '/hero',
  '/studio-d/uploads',
  '/studio-d-uploads',
]);

const ALLOWED_PREFIX_PATHS = [
  '/studio-d/collections/',
  '/collections/',
  '/studio-d-collections/',
];

export const handler: Handler = async (
  event: HandlerEvent
) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  // Check if ImageKit is configured
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'ImageKit not configured' }),
    };
  }

  try {
    // Parse multipart form data
    const boundary = event.headers['content-type']?.split('boundary=')[1];
    if (!boundary || !event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Invalid request' }),
      };
    }

    // Decode base64 body
    const bodyBuffer = Buffer.from(event.body, 'base64');
    
    // Parse multipart data (simplified)
    const parts = parseMultipart(bodyBuffer, boundary);
    const filePart = parts.find(p => p.filename);
    
    if (!filePart || !filePart.data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'No file provided' }),
      };
    }

    const uploadPath = resolveUploadPath(parts);

    if (!isAllowedPath(uploadPath)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: 'Invalid upload path. Allowed roots: /studio-d/hero, /studio-d/collections/*',
          path: uploadPath,
        }),
      };
    }

    // Get filename
    const fileNamePart = parts.find(p => p.name === 'fileName');
    const fileName = fileNamePart?.data?.toString() || filePart.filename || 'image.jpg';

    const tagsPart = parts.find(p => p.name === 'tags');
    const userTags = parseTags(tagsPart?.data?.toString());
    const pathSegments = uploadPath.split('/').filter(Boolean);
    const pathTag = pathSegments[pathSegments.length - 1] || 'uploads';

    const tags = Array.from(new Set(['portfolio', pathTag, ...userTags]));

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: filePart.data,
      fileName: sanitizeFileName(fileName),
      folder: uploadPath,
      useUniqueFileName: true,
      tags,
    });

    const response: UploadResponse = {
      url: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
      size: uploadResponse.size,
      filePath: uploadResponse.filePath,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Upload failed',
      }),
    };
  }
};

// Simple multipart parser
interface MultipartPart {
  name?: string;
  filename?: string;
  contentType?: string;
  data?: Buffer;
}

const normalizePath = (rawPath: string): string => {
  const trimmed = rawPath.trim();
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '');

  return withoutTrailingSlash || '/';
};

const resolveUploadPath = (parts: MultipartPart[]): string => {
  const pathPart = parts.find(p => p.name === 'path')?.data?.toString().trim();
  if (pathPart) {
    return normalizePath(pathPart);
  }

  const folderPart = parts.find(p => p.name === 'folder')?.data?.toString().trim();
  if (!folderPart) {
    return '/studio-d/uploads';
  }

  if (folderPart.startsWith('/')) {
    return normalizePath(folderPart);
  }

  if (LEGACY_FOLDER_TO_PATH[folderPart]) {
    return LEGACY_FOLDER_TO_PATH[folderPart];
  }

  return normalizePath(`/studio-d/${folderPart}`);
};

const isAllowedPath = (path: string): boolean => {
  if (ALLOWED_EXACT_PATHS.has(path)) {
    return true;
  }

  return ALLOWED_PREFIX_PATHS.some(prefix => path.startsWith(prefix));
};

const parseTags = (raw: string | undefined): string[] => {
  if (!raw) {
    return [];
  }

  return raw
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
};

function parseMultipart(buffer: Buffer, boundary: string): MultipartPart[] {
  const parts: MultipartPart[] = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  
  let start = buffer.indexOf(boundaryBuffer);
  
  while (start !== -1) {
    const end = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length);
    const part = buffer.slice(start + boundaryBuffer.length, end !== -1 ? end : undefined);
    
    // Parse headers
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd !== -1) {
      const headers = part.slice(0, headerEnd).toString();
      const data = part.slice(headerEnd + 4, part.length - 2); // Remove trailing \r\n
      
      const nameMatch = headers.match(/name="([^"]+)"/);
      const filenameMatch = headers.match(/filename="([^"]+)"/);
      const contentTypeMatch = headers.match(/Content-Type: ([^\r\n]+)/);
      
      parts.push({
        name: nameMatch?.[1],
        filename: filenameMatch?.[1],
        contentType: contentTypeMatch?.[1],
        data: data.length > 0 ? data : undefined,
      });
    }
    
    start = end;
  }
  
  return parts;
}

function sanitizeFileName(fileName: string): string {
  // Remove special characters and spaces
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
