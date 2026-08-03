import { useCallback } from 'react';
import type { GalleryImage } from '@/types';
import { useCollectionViewer } from '@/hooks/useCollectionViewer';
import { AdaptiveImageStage } from '@/components/gallery/AdaptiveImageStage';

interface EmbeddedGalleryProps {
  images: GalleryImage[];
  title: string;
}

export function EmbeddedGallery({ images, title }: EmbeddedGalleryProps) {
  const {
    currentIndex,
    currentImage,
    totalImages,
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
  } = useCollectionViewer({
    images,
    autoAdvanceInterval: 5000,
    pauseOnHover: true,
  });

  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 2) {
      goToPrev();
    } else {
      goToNext();
    }
  }, [goToNext, goToPrev]);

  if (!currentImage || totalImages === 0) {
    return (
      <div className="adaptive-image-stage adaptive-image-stage--embedded relative flex items-center justify-center rounded-lg overflow-hidden bg-neutral-900">
        <div className="text-center px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">{title}</p>
          <h2 className="text-2xl md:text-4xl font-light text-white/80 tracking-tight">No images yet</h2>
        </div>
      </div>
    );
  }

  return (
    <AdaptiveImageStage
      image={currentImage}
      variant="embedded"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTransitionComplete={completeTransition}
    >
      {/* Image metadata */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6 z-10 pointer-events-none">
        <span className="text-xs tracking-[0.2em] uppercase text-white/40">
          {currentImage.alt}
        </span>
        <span className="text-xs tracking-[0.2em] uppercase text-white/40">
          {currentIndex + 1} / {totalImages}
        </span>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {Array.from({ length: totalImages }).map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              goToIndex(index);
            }}
            className={`rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-6 h-1.5 bg-white/80'
                : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </AdaptiveImageStage>
  );
}
