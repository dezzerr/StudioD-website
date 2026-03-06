import type { Handler } from '@netlify/functions';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
});

interface ImageKitFileRecord {
  fileId: string;
  name: string;
  url: string;
  filePath?: string;
  createdAt?: string;
  tags?: string[];
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

const HERO_DELIVERY_TRANSFORM = 'orig-true';
const COLLECTION_DELIVERY_TRANSFORM = 'orig-true';

const HERO_PATHS = ['/studio-d/hero', '/hero', '/studio-d-hero'];

const COLLECTION_CONFIGS: CollectionConfig[] = [
  {
    id: 'studio-portraits',
    title: 'Studio Portraits',
    season: 'All Year',
    description: 'Studio portrait sessions with controlled lighting and timeless styling.',
    category: 'studio',
    featured: true,
    paths: [
      '/studio-d/collections/studio-portraits',
      '/collections/studio-portraits',
      '/studio-d-collections/studio-portraits',
    ],
  },
  {
    id: 'family-sessions',
    title: 'Family Sessions',
    season: 'All Year',
    description: 'Natural family moments captured with warmth, movement, and connection.',
    category: 'family',
    featured: true,
    paths: [
      '/studio-d/collections/family-sessions',
      '/collections/family-sessions',
      '/studio-d-collections/family-sessions',
    ],
  },
  {
    id: 'event-photography',
    title: 'Event Photography',
    season: 'All Year',
    description: 'Candid and editorial event coverage for private and commercial occasions.',
    category: 'location',
    featured: true,
    paths: [
      '/studio-d/collections/event-photography',
      '/collections/event-photography',
      '/studio-d-collections/event-photography',
    ],
  },
];

const sortByCreatedAtDesc = (a: ImageKitFileRecord, b: ImageKitFileRecord): number => {
  const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
  const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

  return bTime - aTime;
};

const toReadableText = (value: string): string => {
  const raw = value.replace(/\.[a-zA-Z0-9]+$/, '').replace(/[_-]+/g, ' ').trim();
  if (!raw) {
    return 'Portfolio image';
  }

  return raw
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
};

const toDateLabel = (createdAt?: string): string => {
  if (!createdAt) {
    return 'Latest work';
  }

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return 'Latest work';
  }

  return date.toLocaleString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
};

const dedupeByFileId = (files: ImageKitFileRecord[]): ImageKitFileRecord[] => {
  const fileMap = new Map<string, ImageKitFileRecord>();

  files.forEach(file => {
    if (!file.fileId) {
      return;
    }

    if (!fileMap.has(file.fileId)) {
      fileMap.set(file.fileId, file);
    }
  });

  return Array.from(fileMap.values());
};

const listFolder = async (path: string): Promise<ImageKitFileRecord[]> => {
  try {
    const files = await imagekit.listFiles({
      path,
      limit: 200,
    }) as ImageKitFileRecord[];

    return files;
  } catch (error) {
    console.warn('gallery-feed list failed', {
      path,
      error: error instanceof Error ? error.message : 'unknown_error',
    });

    return [];
  }
};

const listFromCandidatePaths = async (paths: string[]): Promise<ImageKitFileRecord[]> => {
  const listed = await Promise.all(paths.map(listFolder));
  return dedupeByFileId(listed.flat()).sort(sortByCreatedAtDesc);
};

const getHeroLabel = (file: ImageKitFileRecord): string => {
  const filePath = (file.filePath || '').toLowerCase();

  if (filePath.includes('/studio-portraits')) {
    return 'Studio Portraits';
  }
  if (filePath.includes('/family-sessions')) {
    return 'Family Sessions';
  }
  if (filePath.includes('/event-photography')) {
    return 'Event Photography';
  }

  return 'Featured Work';
};

const withSafeDeliveryTransform = (url: string, transform: string): string => {
  try {
    const parsed = new URL(url);

    if (!parsed.searchParams.get('tr')) {
      parsed.searchParams.set('tr', transform);
    }

    return parsed.toString();
  } catch {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}tr=${encodeURIComponent(transform)}`;
  }
};

export const handler: Handler = async (event) => {
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

  try {
    const collectionResults = await Promise.all(
      COLLECTION_CONFIGS.map(async collection => {
        const files = await listFromCandidatePaths(collection.paths);

        const images = files.map(file => ({
          id: file.fileId,
          src: withSafeDeliveryTransform(file.url, COLLECTION_DELIVERY_TRANSFORM),
          alt: toReadableText(file.name),
          leftLabel: collection.title,
          rightLabel: toDateLabel(file.createdAt),
        }));

        return {
          config: collection,
          files,
          payload: {
            id: collection.id,
            title: collection.title,
            season: collection.season,
            description: collection.description,
            thumbnail: images[0]?.src || '',
            category: collection.category,
            featured: collection.featured,
            images,
          },
        };
      })
    );

    const heroFiles = (await listFromCandidatePaths(HERO_PATHS))
      .sort(sortByCreatedAtDesc)
      .slice(0, 10);

    const hero = heroFiles.map(file => ({
      id: file.fileId,
      src: withSafeDeliveryTransform(file.url, HERO_DELIVERY_TRANSFORM),
      alt: toReadableText(file.name),
      leftLabel: getHeroLabel(file),
      rightLabel: toDateLabel(file.createdAt),
    }));

    const collections = collectionResults.map(result => result.payload);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        hero,
        collections,
        updatedAt: new Date().toISOString(),
      }),
    };
  } catch (error) {
    console.error('gallery-feed error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: error instanceof Error ? error.message : 'Failed to generate gallery feed',
      }),
    };
  }
};
