import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getGalleryFeed } from '@/services/imagekit';
import { collections as fallbackCollections, heroGalleryImages } from '@/data/collections';
import type { Collection, GalleryFeedResponse, GalleryImage } from '@/types';

const POLL_INTERVAL_MS = 60_000;

const COLLECTION_ORDER = ['studio-portraits', 'family-sessions', 'event-photography'];

const EMPTY_COLLECTIONS: Collection[] = fallbackCollections.map(collection => ({
  ...collection,
  thumbnail: '',
  images: [],
}));

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

  return fallbackCollections.map(defaultCollection => {
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

    return error ? heroGalleryImages : [];
  }, [error, feed]);

  const collectionItems: Collection[] = useMemo(() => {
    if (feed) {
      return feed.collections;
    }

    return error ? fallbackCollections : EMPTY_COLLECTIONS;
  }, [error, feed]);

  return {
    heroImages,
    collectionItems,
    isLoading,
    error,
    updatedAt: feed?.updatedAt,
    refresh,
  };
};
