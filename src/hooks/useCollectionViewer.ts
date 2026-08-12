import { useState, useEffect, useRef, useCallback } from 'react';
import type { GalleryImage } from '@/types';

interface UseCollectionViewerProps {
  images: GalleryImage[];
  autoAdvanceInterval?: number;
  pauseOnHover?: boolean;
}

export function useCollectionViewer({
  images,
  autoAdvanceInterval = 4000,
  pauseOnHover = true,
}: UseCollectionViewerProps) {
  const touchResumeDelay = 4000;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalImages = images.length;
  const safeCurrentIndex = totalImages === 0 ? 0 : currentIndex % totalImages;

  // Preload adjacent images
  useEffect(() => {
    if (totalImages < 2) return;

    const preloadCount = 2;
    for (let i = 1; i <= preloadCount; i++) {
      const nextIdx = (safeCurrentIndex + i) % totalImages;
      const prevIdx = (safeCurrentIndex - i + totalImages) % totalImages;
      [nextIdx, prevIdx].forEach(idx => {
        const img = new Image();
        img.src = images[idx].src;
      });
    }
  }, [images, safeCurrentIndex, totalImages]);

  const goToNext = useCallback(() => {
    if (isTransitioning || totalImages < 2) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev + 1) % totalImages);
  }, [isTransitioning, totalImages]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || totalImages < 2) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev - 1 + totalImages) % totalImages);
  }, [isTransitioning, totalImages]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || totalImages === 0 || index === safeCurrentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [isTransitioning, totalImages, safeCurrentIndex]);

  const completeTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused || totalImages < 2) return;

    autoAdvanceTimerRef.current = setInterval(() => {
      goToNext();
    }, autoAdvanceInterval);

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    };
  }, [autoAdvanceInterval, currentIndex, goToNext, isPaused, totalImages]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const handleFocus = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleBlur = useCallback(() => {
    if (pauseOnHover) {
      window.setTimeout(() => setIsPaused(false), 2000);
    }
  }, [pauseOnHover]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        goToPrev();
      } else if (e.key === 'Escape') {
        // handled by page component for navigation
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch/swipe
  const touchStartX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (pauseOnHover) setIsPaused(true);
    touchStartX.current = e.touches[0].clientX;
  }, [pauseOnHover]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goToNext();
      else goToPrev();
    }

    if (pauseOnHover) {
      window.setTimeout(() => setIsPaused(false), touchResumeDelay);
    }
  }, [goToNext, goToPrev, pauseOnHover]);

  return {
    currentIndex: safeCurrentIndex,
    currentImage: images[safeCurrentIndex] || null,
    totalImages,
    isTransitioning,
    goToNext,
    goToPrev,
    goToIndex,
    completeTransition,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleTouchStart,
    handleTouchEnd,
  };
}
