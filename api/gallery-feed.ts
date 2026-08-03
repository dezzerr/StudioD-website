import { imagekit, isImageKitConfigured } from '../server/imagekit.js';
import { json, methodNotAllowed, sameOriginHeaders, type VercelRequest, type VercelResponse } from '../server/http.js';

interface ImageKitFileRecord {
  fileId: string;
  name: string;
  url: string;
  filePath?: string;
  createdAt?: string;
}

interface CollectionConfig {
  id: string;
  title: string;
  season: string;
  description: string;
  category: 'studio' | 'family' | 'location';
  featured: boolean;
  paths: string[];
}

const HERO_PATHS = ['/studio-d/hero', '/hero', '/studio-d-hero'];
const COLLECTION_CONFIGS: CollectionConfig[] = [
  {
    id: 'studio-portraits',
    title: 'Studio Portraits',
    season: 'All Year',
    description: 'Studio portrait sessions with controlled lighting and timeless styling.',
    category: 'studio',
    featured: true,
    paths: ['/studio-d/collections/studio-portraits', '/collections/studio-portraits', '/studio-d-collections/studio-portraits'],
  },
  {
    id: 'family-sessions',
    title: 'Family Sessions',
    season: 'All Year',
    description: 'Natural family moments captured with warmth, movement, and connection.',
    category: 'family',
    featured: true,
    paths: ['/studio-d/collections/family-sessions', '/collections/family-sessions', '/studio-d-collections/family-sessions'],
  },
  {
    id: 'event-photography',
    title: 'Event Photography',
    season: 'All Year',
    description: 'Candid and editorial event coverage for private and commercial occasions.',
    category: 'location',
    featured: true,
    paths: ['/studio-d/collections/event-photography', '/collections/event-photography', '/studio-d-collections/event-photography'],
  },
];

const sortByCreatedAtDesc = (a: ImageKitFileRecord, b: ImageKitFileRecord) => (
  (b.createdAt ? new Date(b.createdAt).getTime() : 0) - (a.createdAt ? new Date(a.createdAt).getTime() : 0)
);

const toReadableText = (value: string) => {
  const raw = value.replace(/\.[a-zA-Z0-9]+$/, '').replace(/[_-]+/g, ' ').trim();
  if (!raw) return 'Portfolio image';
  return raw.split(' ').filter(Boolean).map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
};

const toDateLabel = (createdAt?: string) => {
  if (!createdAt) return 'Latest work';
  const date = new Date(createdAt);
  return Number.isNaN(date.getTime()) ? 'Latest work' : date.toLocaleString('en-GB', { month: 'short', year: 'numeric' });
};

const dedupeByFileId = (files: ImageKitFileRecord[]) => {
  const unique = new Map<string, ImageKitFileRecord>();
  files.forEach(file => { if (file.fileId && !unique.has(file.fileId)) unique.set(file.fileId, file); });
  return Array.from(unique.values()).sort(sortByCreatedAtDesc);
};

const listFolder = async (path: string): Promise<ImageKitFileRecord[]> => {
  try {
    return await imagekit.listFiles({ path, limit: 200 }) as ImageKitFileRecord[];
  } catch (error) {
    console.warn('gallery-feed list failed', { path, error: error instanceof Error ? error.message : 'unknown_error' });
    return [];
  }
};

const listFromCandidatePaths = async (paths: string[]) => dedupeByFileId((await Promise.all(paths.map(listFolder))).flat());

const withSafeDeliveryTransform = (url: string) => {
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.get('tr')) parsed.searchParams.set('tr', 'orig-true');
    return parsed.toString();
  } catch {
    return `${url}${url.includes('?') ? '&' : '?'}tr=orig-true`;
  }
};

const getHeroLabel = (file: ImageKitFileRecord) => {
  const filePath = (file.filePath || '').toLowerCase();
  if (filePath.includes('/studio-portraits')) return 'Studio Portraits';
  if (filePath.includes('/family-sessions')) return 'Family Sessions';
  if (filePath.includes('/event-photography')) return 'Event Photography';
  return 'Featured Work';
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  if (request.method === 'OPTIONS') return json(response, 200, {}, sameOriginHeaders);
  if (request.method !== 'GET') return methodNotAllowed(request, response, 'GET, OPTIONS');
  if (!isImageKitConfigured()) return json(response, 500, { message: 'ImageKit not configured' }, sameOriginHeaders);

  try {
    const collectionResults = await Promise.all(COLLECTION_CONFIGS.map(async collection => {
      const files = await listFromCandidatePaths(collection.paths);
      const images = files.map(file => ({
        id: file.fileId,
        src: withSafeDeliveryTransform(file.url),
        alt: toReadableText(file.name),
        leftLabel: collection.title,
        rightLabel: toDateLabel(file.createdAt),
      }));
      return {
        id: collection.id,
        title: collection.title,
        season: collection.season,
        description: collection.description,
        thumbnail: images[0]?.src || '',
        category: collection.category,
        featured: collection.featured,
        images,
      };
    }));

    const hero = (await listFromCandidatePaths(HERO_PATHS)).slice(0, 10).map(file => ({
      id: file.fileId,
      src: withSafeDeliveryTransform(file.url),
      alt: toReadableText(file.name),
      leftLabel: getHeroLabel(file),
      rightLabel: toDateLabel(file.createdAt),
    }));

    return json(response, 200, { hero, collections: collectionResults, updatedAt: new Date().toISOString() }, sameOriginHeaders);
  } catch (error) {
    console.error('gallery-feed error:', error);
    return json(response, 500, { message: error instanceof Error ? error.message : 'Failed to generate gallery feed' }, sameOriginHeaders);
  }
}
