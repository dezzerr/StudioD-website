import { useRef, useCallback } from 'react';
import type { GalleryImage } from '@/types';
import { useImmersiveGallery } from '@/hooks/useImmersiveGallery';
import { AdaptiveImageStage } from '@/components/gallery/AdaptiveImageStage';

interface ImmersiveGalleryProps {
  images: GalleryImage[];
  onCursorChange?: (type: 'default' | 'left' | 'right' | 'view') => void;
}

export function ImmersiveGallery({ images, onCursorChange }: ImmersiveGalleryProps) {
  const {
    currentIndex,
    currentImage,
    containerRef,
    completeTransition,
    goToNext,
    goToPrev,
    goToIndex,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleTouchStart,
    handleTouchEnd,
    totalImages,
  } = useImmersiveGallery({
    images,
    autoAdvanceInterval: 4000,
    pauseOnHover: true,
    resumeDelay: 2000,
  });

  const leftZoneRef = useRef<HTMLButtonElement>(null);
  const rightZoneRef = useRef<HTMLButtonElement>(null);

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
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect) return;

    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;

    if (clickX < centerX) {
      goToPrev();
    } else {
      goToNext();
    }
  }, [goToNext, goToPrev]);

  if (!currentImage || totalImages === 0) {
    return (
      <div className="relative h-[calc(100svh-7rem)] min-h-[560px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black md:h-[calc(100svh-6rem)]">
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

  return (
    <div 
      ref={containerRef}
      className="relative h-[calc(100svh-7rem)] min-h-[560px] w-full overflow-hidden rounded-2xl border border-white/10 bg-black md:h-[calc(100svh-6rem)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left Navigation Zone */}
      <button
        ref={leftZoneRef}
        type="button"
        aria-label="Previous image"
        className="absolute left-0 top-0 w-1/4 h-full z-20 hidden md:block border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
        onMouseEnter={handleLeftZoneEnter}
        onMouseLeave={handleZoneLeave}
        onClick={goToPrev}
      />

      {/* Right Navigation Zone */}
      <button
        ref={rightZoneRef}
        type="button"
        aria-label="Next image"
        className="absolute right-0 top-0 w-1/4 h-full z-20 hidden md:block border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-1 focus-visible:outline-white/40"
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

      <AdaptiveImageStage
        image={currentImage}
        variant="hero"
        onClick={handleImageClick}
        onTransitionComplete={completeTransition}
      />

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
        <span className="text-[10px] tracking-widest uppercase text-accent-strong">Scroll to explore</span>
        <div className="h-8 w-px bg-gradient-to-b from-accent to-transparent" />
      </div>
    </div>
  );
}
