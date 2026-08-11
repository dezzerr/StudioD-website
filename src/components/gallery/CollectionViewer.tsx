import { useCallback, useEffect } from 'react';
import type { GalleryImage } from '@/types';
import { AdaptiveImageStage } from '@/components/gallery/AdaptiveImageStage';
import { useCollectionViewer } from '@/hooks/useCollectionViewer';

interface CollectionViewerProps {
  images: GalleryImage[];
  title: string;
  onBack: () => void;
}

export function CollectionViewer({ images, title, onBack }: CollectionViewerProps) {
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
    autoAdvanceInterval: 4000,
    pauseOnHover: true,
  });

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onBack]);

  const handleClick = useCallback((event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;

    if (clickX < rect.width / 2) {
      goToPrev();
    } else {
      goToNext();
    }
  }, [goToNext, goToPrev]);

  if (!currentImage || totalImages === 0) {
    return (
      <div className="fixed inset-0 bg-black z-30 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">{title}</p>
          <h2 className="text-2xl md:text-4xl font-light text-white/80 tracking-tight">No images yet</h2>
          <button
            onClick={onBack}
            className="mt-8 text-sm tracking-widest uppercase text-white/50 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black z-30 select-none"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocusCapture={handleFocus}
      onBlurCapture={handleBlur}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <AdaptiveImageStage
        image={currentImage}
        variant="hero"
        onClick={handleClick}
        onTransitionComplete={completeTransition}
      >
        <div className="absolute top-6 left-6 md:top-8 md:left-12 z-40">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs tracking-[0.2em] uppercase">Back</span>
          </button>
        </div>

        <div className="absolute top-6 right-6 md:top-8 md:right-12 z-40">
          <span className="text-xs tracking-[0.3em] uppercase text-white/40">{title}</span>
        </div>

        <div className="absolute bottom-20 left-0 right-0 flex justify-end px-6 md:px-12 z-40 pointer-events-none">
          <span className="text-xs tracking-[0.2em] uppercase text-white/40">
            {currentIndex + 1} / {totalImages}
          </span>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40">
          {Array.from({ length: totalImages }).map((_, index) => (
            <button
              key={index}
              onClick={(event) => {
                event.stopPropagation();
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
    </div>
  );
}
