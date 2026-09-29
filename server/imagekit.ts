import ImageKit from 'imagekit';

export const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
});

export const isImageKitConfigured = () => Boolean(process.env.IMAGEKIT_PRIVATE_KEY);

export const normalizePath = (rawPath: string): string => {
  const trimmed = rawPath.trim();
  const withLeadingSlash = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const withoutTrailingSlash = withLeadingSlash.replace(/\/+$/, '');
  return withoutTrailingSlash || '/';
};

export const LEGACY_FOLDER_TO_PATH: Record<string, string> = {
  hero: '/hero',
  'studio-portraits': '/collections/studio-portraits',
  'family-sessions': '/collections/family-sessions',
  'event-photography': '/collections/event-photography',
  uploads: '/studio-d-uploads',
};

export const ALLOWED_EXACT_PATHS = new Set([
  '/studio-d/hero',
  '/hero',
  '/studio-d/uploads',
  '/studio-d-uploads',
]);

export const ALLOWED_PREFIX_PATHS = [
  '/studio-d/collections/',
  '/collections/',
  '/studio-d-collections/',
];

export const isAllowedPath = (path: string): boolean => (
  ALLOWED_EXACT_PATHS.has(path) || ALLOWED_PREFIX_PATHS.some(prefix => path.startsWith(prefix))
);
