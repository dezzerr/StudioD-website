import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesContainerRef = useRef<HTMLDivElement>(null);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInViewportRef = useRef(true);

  // Preload images
  useEffect(() => {
    const preloadImages = () => {
      const preloadCount = 2;
      for (let i = 1; i <= preloadCount; i++) {
        const nextIndex = (currentIndex + i) % images.length;
        const prevIndex = (currentIndex - i + images.length) % images.length;
        
        [nextIndex, prevIndex].forEach(idx => {
          const img = new Image();
          img.src = images[idx].src;
        });
      }
    };
    preloadImages();
  }, [currentIndex, images]);

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

  // Auto-advance functionality
  useEffect(() => {
    if (isPaused || !isInViewportRef.current) return;

    autoAdvanceTimerRef.current = setInterval(() => {
      goToNext();
    }, autoAdvanceInterval);

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    };
  }, [isPaused, autoAdvanceInterval, currentIndex]);

  const performTransition = useCallback((newIndex: number, dir: 'next' | 'prev') => {
    if (isTransitioning || !imagesContainerRef.current) return;
    
    setIsTransitioning(true);
    setDirection(dir);

    const container = imagesContainerRef.current;
    const imageHeight = container.offsetHeight;
    
    // Calculate target translateY
    const targetY = dir === 'next' ? -imageHeight : imageHeight;

    // GSAP Timeline for smooth vertical slide transition
    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentIndex(newIndex);
        setIsTransitioning(false);
        // Reset position instantly without animation
        gsap.set(container, { y: 0 });
      },
    });

    // Smooth slide transition
    tl.to(container, {
      y: targetY,
      duration: 0.8,
      ease: 'power3.inOut',
    });
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    const newIndex = (currentIndex + 1) % images.length;
    performTransition(newIndex, 'next');
  }, [currentIndex, images.length, isTransitioning, performTransition]);

  const goToPrev = useCallback(() => {
    if (isTransitioning) return;
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    performTransition(newIndex, 'prev');
  }, [currentIndex, images.length, isTransitioning, performTransition]);

  const goToIndex = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    const dir = index > currentIndex ? 'next' : 'prev';
    performTransition(index, dir);
  }, [currentIndex, isTransitioning, performTransition]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true);
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current);
      }
    }
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      resumeTimerRef.current = setTimeout(() => {
        setIsPaused(false);
      }, resumeDelay);
    }
  }, [pauseOnHover, resumeDelay]);

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

  // Touch/swipe handling - vertical for swipe up/down
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartY.current - touchEndY.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe up - go to next
        goToNext();
      } else {
        // Swipe down - go to prev
        goToPrev();
      }
    }
  }, [goToNext, goToPrev]);

  // Get visible images for the stack
  const getVisibleImages = useCallback(() => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    
    return [
      { ...images[prevIndex], position: 'prev' as const },
      { ...images[currentIndex], position: 'current' as const },
      { ...images[nextIndex], position: 'next' as const },
    ];
  }, [currentIndex, images]);

  return {
    currentIndex,
    currentImage: images[currentIndex],
    visibleImages: getVisibleImages(),
    isTransitioning,
    direction,
    containerRef,
    imagesContainerRef,
    goToNext,
    goToPrev,
    goToIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    totalImages: images.length,
  };
}
