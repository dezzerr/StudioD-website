import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getGalleryFeed } from '@/services/imagekit';
import type { Collection, GalleryFeedResponse, GalleryImage } from '@/types';

const POLL_INTERVAL_MS = 60_000;

const COLLECTION_ORDER = ['studio-portraits', 'family-sessions', 'event-photography'];

const DEFAULT_COLLECTIONS: Collection[] = [
  {
    id: 'studio-portraits',
    title: 'Studio Portraits',
    season: 'All Year',
    description: 'Studio portrait sessions with controlled lighting and timeless styling.',
    thumbnail: '',
    category: 'studio',
    featured: true,
    images: [],
  },
  {
    id: 'family-sessions',
    title: 'Family Sessions',
    season: 'All Year',
    description: 'Natural family moments captured with warmth, movement, and connection.',
    thumbnail: '',
    category: 'family',
    featured: true,
    images: [],
  },
  {
    id: 'event-photography',
    title: 'Event Photography',
    season: 'All Year',
    description: 'Candid and editorial event coverage for private and commercial occasions.',
    thumbnail: '',
    category: 'location',
    featured: true,
    images: [],
  },
];

const orderCollections = (items: Collection[]): Collection[] => {
  const byId = new Map(items.map(item => [item.id, item]));

  const ordered = COLLECTION_ORDER
    .map(id => byId.get(id))
    .filter((item): item is Collection => Boolean(item));

  const remaining = items.filter(item => !COLLECTION_ORDER.includes(item.id));

  return [...ordered, ...remaining];
};

const toCollectionOptions = (items: Collection[]): Collection[] => {
  const ordered = orderCollections(items);
  const byId = new Map(ordered.map(item => [item.id, item]));

  return DEFAULT_COLLECTIONS.map(defaultCollection => {
    const candidate = byId.get(defaultCollection.id);
    if (!candidate) {
      return defaultCollection;
    }

    return {
      ...defaultCollection,
      ...candidate,
      thumbnail: candidate.thumbnail || candidate.images[0]?.src || '',
      images: candidate.images || [],
    };
  });
};

export const useGalleryFeed = () => {
  const [feed, setFeed] = useState<GalleryFeedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isRefreshingRef = useRef(false);

  const refresh = useCallback(async () => {
    if (isRefreshingRef.current) {
      return;
    }

    isRefreshingRef.current = true;

    try {
      const nextFeed = await getGalleryFeed();

      setFeed({
        hero: nextFeed.hero || [],
        collections: toCollectionOptions(nextFeed.collections || []),
        updatedAt: nextFeed.updatedAt,
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery feed');
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    void refresh();

    const pollTimer = window.setInterval(() => {
      void refresh();
    }, POLL_INTERVAL_MS);

    const handleWindowFocus = () => {
      void refresh();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refresh();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(pollTimer);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refresh]);

  const heroImages: GalleryImage[] = useMemo(() => {
    if (feed) {
      return feed.hero;
    }

    return [];
  }, [feed]);

  const collectionItems: Collection[] = useMemo(() => {
    if (feed) {
      return feed.collections;
    }

    return DEFAULT_COLLECTIONS;
  }, [feed]);

  return {
    heroImages,
    collectionItems,
    isLoading,
    error,
    updatedAt: feed?.updatedAt,
    refresh,
  };
};
