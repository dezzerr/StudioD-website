import type { Handler, HandlerEvent } from '@netlify/functions';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
});

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

const normalizePath = (rawPath: string): string => {
  const trimmed = rawPath.trim();
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '');

  return withoutTrailingSlash || '/';
};

const resolveRequestedPath = (event: HandlerEvent): string => {
  const exactPath = event.queryStringParameters?.path;
  if (exactPath) {
    return normalizePath(exactPath);
  }

  const folder = event.queryStringParameters?.folder;
  if (!folder) {
    return '/studio-d/uploads';
  }

  const trimmedFolder = folder.trim();
  if (!trimmedFolder) {
    return '/studio-d/uploads';
  }

  if (trimmedFolder.startsWith('/')) {
    return normalizePath(trimmedFolder);
  }

  if (LEGACY_FOLDER_TO_PATH[trimmedFolder]) {
    return LEGACY_FOLDER_TO_PATH[trimmedFolder];
  }

  return normalizePath(`/studio-d/${trimmedFolder}`);
};

const isAllowedPath = (path: string): boolean => {
  if (ALLOWED_EXACT_PATHS.has(path)) {
    return true;
  }

  return ALLOWED_PREFIX_PATHS.some(prefix => path.startsWith(prefix));
};

const sortByCreatedAtDesc = (a: ImageKitFileRecord, b: ImageKitFileRecord): number => {
  const aTimestamp = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bTimestamp = b.createdAt ? new Date(b.createdAt).getTime() : 0;

  return bTimestamp - aTimestamp;
};

export const handler: Handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: 'Method not allowed' }),
    };
  }

  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'ImageKit not configured' }),
    };
  }

  const requestedPath = resolveRequestedPath(event);

  if (!isAllowedPath(requestedPath)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        message: 'Invalid path. Allowed roots: /studio-d/hero, /studio-d/collections/*',
        path: requestedPath,
      }),
    };
  }

  try {
    const files = await imagekit.listFiles({
      path: requestedPath,
      limit: 200,
    }) as ImageKitFileRecord[];

    const results = files
      .map(file => ({
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
      }))
      .sort(sortByCreatedAtDesc);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('List error:', { path: requestedPath, error });

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Failed to list images',
        path: requestedPath,
      }),
    };
  }
};
