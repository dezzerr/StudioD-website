import { useRef, useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import type { GalleryImage } from '@/types';
import { useImmersiveGallery } from '@/hooks/useImmersiveGallery';

interface ImmersiveGalleryProps {
  images: GalleryImage[];
  onCursorChange?: (type: 'default' | 'left' | 'right' | 'view') => void;
}

export function ImmersiveGallery({ images, onCursorChange }: ImmersiveGalleryProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const {
    currentIndex,
    currentImage,
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
    totalImages,
  } = useImmersiveGallery({
    images,
    autoAdvanceInterval: 4000,
    pauseOnHover: true,
    resumeDelay: 2000,
  });

  const leftZoneRef = useRef<HTMLDivElement>(null);
  const rightZoneRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const handleLeftZoneEnter = useCallback(() => {
    onCursorChange?.('left');
  }, [onCursorChange]);

  const handleRightZoneEnter = useCallback(() => {
    onCursorChange?.('right');
  }, [onCursorChange]);

  const handleZoneLeave = useCallback(() => {
    onCursorChange?.('default');
  }, [onCursorChange]);

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    const rect = imageWrapperRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;

    if (clickX < centerX) {
      goToPrev();
    } else {
      goToNext();
    }
  }, [goToNext, goToPrev]);

  // Initial load animation
  useEffect(() => {
    if (isLoaded || totalImages === 0) return;
    
    const timer = setTimeout(() => {
      const target = imageWrapperRef.current;
      if (!target) {
        return;
      }

      setIsLoaded(true);
      gsap.fromTo(
        target,
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
      );
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isLoaded, totalImages]);

  // Get the three images to display (prev, current, next)
  const getImageStack = () => {
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    const nextIndex = (currentIndex + 1) % images.length;
    
    return [
      { image: images[prevIndex], key: `prev-${prevIndex}` },
      { image: images[currentIndex], key: `current-${currentIndex}` },
      { image: images[nextIndex], key: `next-${nextIndex}` },
    ];
  };

  if (!currentImage || totalImages === 0) {
    return (
      <div className="relative w-full h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">Portfolio</p>
            <h2 className="text-2xl md:text-4xl font-light text-white/80 tracking-tight">Gallery updates soon</h2>
            <p className="mt-4 text-white/50 text-sm md:text-base">
              Upload images to the ImageKit <code className="text-white/80">/studio-d/hero</code> folder.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const imageStack = getImageStack();

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left Navigation Zone */}
      <div
        ref={leftZoneRef}
        className="absolute left-0 top-0 w-1/4 h-full z-20 hidden md:block"
        onMouseEnter={handleLeftZoneEnter}
        onMouseLeave={handleZoneLeave}
        onClick={goToPrev}
      />

      {/* Right Navigation Zone */}
      <div
        ref={rightZoneRef}
        className="absolute right-0 top-0 w-1/4 h-full z-20 hidden md:block"
        onMouseEnter={handleRightZoneEnter}
        onMouseLeave={handleZoneLeave}
        onClick={goToNext}
      />

      {/* Left Label */}
      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 z-10 hidden md:block pointer-events-none">
        <span className="gallery-label writing-mode-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>
          {currentImage.leftLabel}
        </span>
      </div>

      {/* Right Label */}
      <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 z-10 hidden md:block pointer-events-none">
        <span className="gallery-label writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
          {currentImage.rightLabel}
        </span>
      </div>

      {/* Mobile Labels */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-between px-8 md:hidden z-10 pointer-events-none">
        <span className="gallery-label text-[10px]">{currentImage.leftLabel}</span>
        <span className="gallery-label text-[10px]">{currentImage.rightLabel}</span>
      </div>

      {/* Image Container - Vertical Stack */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        onClick={handleImageClick}
      >
        <div 
          ref={imageWrapperRef}
          className="relative w-full max-w-[500px] aspect-[3/4] mx-4 overflow-hidden rounded-lg"
          style={{ opacity: 0 }}
        >
          {/* Images Container - Stacked Vertically */}
          <div 
            ref={imagesContainerRef}
            className="absolute inset-0 flex flex-col"
            style={{ 
              height: '300%',
              top: '-100%',
            }}
          >
            {imageStack.map(({ image, key }) => (
              <div 
                key={key}
                className="relative w-full flex-shrink-0"
                style={{ height: '33.333%' }}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
        {Array.from({ length: totalImages }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`progress-dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-50 pointer-events-none">
        <span className="text-[10px] tracking-widest uppercase">Scroll to explore</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </div>
  );
}
