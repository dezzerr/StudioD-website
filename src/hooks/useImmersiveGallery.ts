import { useState, useEffect, useRef, useCallback } from 'react';
import type { GalleryImage } from '@/types';

interface UseImmersiveGalleryProps {
  images: GalleryImage[];
  autoAdvanceInterval?: number;
  pauseOnHover?: boolean;
  resumeDelay?: number;
}

export function useImmersiveGallery({
  images,
  autoAdvanceInterval = 4000,
  pauseOnHover = true,
  resumeDelay = 2000,
}: UseImmersiveGalleryProps) {
  const touchResumeDelay = 4000;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInViewportRef = useRef(true);
  const totalImages = images.length;
  const safeCurrentIndex = totalImages === 0 ? 0 : currentIndex % totalImages;

  // Preload images
  useEffect(() => {
    if (images.length < 2) {
      return;
    }

    const preloadCount = 2;
    for (let i = 1; i <= preloadCount; i++) {
      const nextIdx = (safeCurrentIndex + i) % images.length;
      const prevIdx = (safeCurrentIndex - i + images.length) % images.length;
      [nextIdx, prevIdx].forEach(idx => {
        const img = new Image();
        img.src = images[idx].src;
      });
    }
  }, [images, safeCurrentIndex]);

  // Intersection Observer to pause when not in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const goToNext = useCallback(() => {
    if (isTransitioning || images.length < 2) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length, isTransitioning]);

  const goToPrev = useCallback(() => {
    if (isTransitioning || images.length < 2) return;
    setIsTransitioning(true);
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length, isTransitioning]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || images.length === 0 || index === safeCurrentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [images.length, isTransitioning, safeCurrentIndex]);

  const completeTransition = useCallback(() => {
    setIsTransitioning(false);
  }, []);

  // Auto-advance functionality
  useEffect(() => {
    if (isPaused || !isInViewportRef.current || totalImages < 2) return;

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
    if (pauseOnHover) {
      setIsPaused(true);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    }
  }, [pauseOnHover]);

  const scheduleResume = useCallback((delay: number) => {
    if (!pauseOnHover) {
      return;
    }

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, delay);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      scheduleResume(resumeDelay);
    }
  }, [pauseOnHover, resumeDelay, scheduleResume]);

  const handleFocus = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    }
  }, [pauseOnHover]);

  const handleBlur = useCallback(() => {
    scheduleResume(resumeDelay);
  }, [resumeDelay, scheduleResume]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrev();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    }
  }, [goToNext, goToPrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch/swipe handling
  const touchStartX = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (pauseOnHover) {
      setIsPaused(true);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    }
    touchStartX.current = e.touches[0].clientX;
  }, [pauseOnHover]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) goToNext();
      else goToPrev();
    }

    scheduleResume(touchResumeDelay);
  }, [goToNext, goToPrev, scheduleResume]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  return {
    currentIndex: safeCurrentIndex,
    currentImage: images[safeCurrentIndex] || null,
    isTransitioning,
    containerRef,
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
    totalImages,
  };
}
