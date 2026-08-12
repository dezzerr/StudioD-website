import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type {
  FocusEventHandler,
  MouseEventHandler,
  ReactNode,
  TouchEventHandler,
} from 'react';
import type { GalleryImage } from '@/types';
import {
  fitImageFrame,
  type ImageOrientation,
  type ImageDimensions,
} from '@/components/gallery/imageOrientation';

export interface AdaptiveImageStageProps {
  image: GalleryImage | null;
  variant: 'hero' | 'embedded';
  onClick?: MouseEventHandler<HTMLDivElement>;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
  onTouchStart?: TouchEventHandler<HTMLDivElement>;
  onTouchEnd?: TouchEventHandler<HTMLDivElement>;
  onFocusCapture?: FocusEventHandler<HTMLDivElement>;
  onBlurCapture?: FocusEventHandler<HTMLDivElement>;
  onTransitionComplete?: () => void;
  children?: ReactNode;
}

const FRAME_MORPH_DURATION = 0.55;
const IMAGE_FADE_DURATION = 0.7;

const getImageKey = (image: GalleryImage | null): string => {
  if (!image) {
    return '';
  }

  return `${image.id}:${image.src}`;
};

const loadImageIntoElement = (
  element: HTMLImageElement,
  image: GalleryImage,
): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      element.onload = null;
      element.onerror = null;
    };

    const finish = async () => {
      if (settled) {
        return;
      }

      if (!element.naturalWidth || !element.naturalHeight) {
        cleanup();
        settled = true;
        reject(new Error(`Unable to determine dimensions for ${image.src}`));
        return;
      }

      try {
        await element.decode?.();
      } catch {
        // Some browsers reject decode() for an image that has already loaded.
        // The natural dimensions are still safe to use in that case.
      }

      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      resolve({
        width: element.naturalWidth,
        height: element.naturalHeight,
      });
    };

    element.onload = () => {
      void finish();
    };
    element.onerror = () => {
      if (settled) {
        return;
      }

      settled = true;
      cleanup();
      reject(new Error(`Unable to load image ${image.src}`));
    };

    element.alt = image.alt;
    element.decoding = 'async';
    element.src = image.src;

    if (element.complete) {
      void finish();
    }
  });
};

const getFrameBounds = (
  stage: HTMLDivElement,
  variant: AdaptiveImageStageProps['variant'],
): { maxWidth: number; maxHeight: number } => {
  const isSmallViewport = window.innerWidth < 768;
  const horizontalInset = variant === 'hero'
    ? isSmallViewport ? 32 : 96
    : 32;
  const verticalInset = variant === 'hero'
    ? isSmallViewport ? 96 : 64
    : 88;

  return {
    maxWidth: Math.max(1, stage.clientWidth - horizontalInset),
    maxHeight: Math.max(1, stage.clientHeight - verticalInset),
  };
};

const getFittedFrame = (
  stage: HTMLDivElement,
  dimensions: ImageDimensions,
  variant: AdaptiveImageStageProps['variant'],
) => fitImageFrame(dimensions, getFrameBounds(stage, variant));

export function AdaptiveImageStage({
  image,
  variant,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  onFocusCapture,
  onBlurCapture,
  onTransitionComplete,
  children,
}: AdaptiveImageStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const imgARef = useRef<HTMLImageElement>(null);
  const imgBRef = useRef<HTMLImageElement>(null);
  const activeLayerRef = useRef<'a' | 'b'>('a');
  const activeImageKeyRef = useRef<string | null>(null);
  const activeDimensionsRef = useRef<ImageDimensions | null>(null);
  const transitionTokenRef = useRef(0);
  const [visibleLayer, setVisibleLayer] = useState<'a' | 'b'>('a');
  const [displayedImage, setDisplayedImage] = useState<GalleryImage | null>(null);
  const [orientation, setOrientation] = useState<ImageOrientation>('square');
  const [isReady, setIsReady] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const imageKey = getImageKey(image);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener?.('change', handleChange);

    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  const completeTransition = useCallback(() => {
    onTransitionComplete?.();
  }, [onTransitionComplete]);

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;

    if (!stage || !frame || !activeDimensionsRef.current) {
      return;
    }

    const updateFrameForResize = () => {
      const dimensions = activeDimensionsRef.current;
      if (!dimensions) {
        return;
      }

      const fitted = getFittedFrame(stage, dimensions, variant);
      gsap.to(frame, {
        width: fitted.width,
        height: fitted.height,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      });
    };

    const observer = new ResizeObserver(updateFrameForResize);
    observer.observe(stage);
    window.addEventListener('resize', updateFrameForResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFrameForResize);
    };
  }, [isReady, variant]);

  useEffect(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    const layerA = imgARef.current;
    const layerB = imgBRef.current;

    if (!stage || !frame || !layerA || !layerB || !image) {
      return;
    }

    const token = transitionTokenRef.current + 1;
    transitionTokenRef.current = token;
    let cancelled = false;
    const isInitialImage = activeImageKeyRef.current === null;
    const incomingLayer = isInitialImage
      ? layerA
      : activeLayerRef.current === 'a' ? layerB : layerA;
    const outgoingLayer = isInitialImage
      ? layerB
      : activeLayerRef.current === 'a' ? layerA : layerB;

    const finishIfCurrent = (callback: () => void) => {
      if (!cancelled && transitionTokenRef.current === token) {
        callback();
      }
    };

    void loadImageIntoElement(incomingLayer, image)
      .then((dimensions) => {
        finishIfCurrent(() => {
          const fitted = getFittedFrame(stage, dimensions, variant);

          gsap.killTweensOf([frame, incomingLayer, outgoingLayer]);
          gsap.set(incomingLayer, {
            opacity: isInitialImage ? 1 : 0,
            scale: 1,
          });

          if (isInitialImage) {
            gsap.set(frame, {
              width: fitted.width,
              height: fitted.height,
              opacity: 1,
            });
            gsap.set(outgoingLayer, { opacity: 0 });
            activeLayerRef.current = 'a';
            activeImageKeyRef.current = imageKey;
            activeDimensionsRef.current = dimensions;
            setOrientation(fitted.orientation);
            setVisibleLayer('a');
            setDisplayedImage(image);
            setHasImageError(false);
            setIsReady(true);

            completeTransition();
            return;
          }

          const complete = () => {
            activeLayerRef.current = activeLayerRef.current === 'a' ? 'b' : 'a';
            activeImageKeyRef.current = imageKey;
            activeDimensionsRef.current = dimensions;
            setOrientation(fitted.orientation);
            setVisibleLayer(activeLayerRef.current);
            setDisplayedImage(image);
            setHasImageError(false);
            completeTransition();
          };

          if (prefersReducedMotion) {
            gsap.set(frame, {
              width: fitted.width,
              height: fitted.height,
            });
            gsap.set(incomingLayer, { opacity: 1 });
            gsap.set(outgoingLayer, { opacity: 0 });
            complete();
            return;
          }

          gsap.timeline({ onComplete: complete })
            .to(frame, {
              width: fitted.width,
              height: fitted.height,
              duration: FRAME_MORPH_DURATION,
              ease: 'power2.inOut',
            }, 0)
            .to(incomingLayer, {
              opacity: 1,
              duration: IMAGE_FADE_DURATION,
              ease: 'power2.inOut',
            }, 0)
            .to(outgoingLayer, {
              opacity: 0,
              duration: IMAGE_FADE_DURATION,
              ease: 'power2.inOut',
            }, 0);
        });
      })
      .catch(() => {
        finishIfCurrent(() => {
          gsap.killTweensOf(incomingLayer);
          gsap.set(incomingLayer, { opacity: 0 });
          setHasImageError(true);
          completeTransition();
        });
      });

    return () => {
      cancelled = true;
      if (transitionTokenRef.current === token) {
        transitionTokenRef.current += 1;
      }
    };
  }, [completeTransition, image, imageKey, prefersReducedMotion, variant]);

  if (!image) {
    return null;
  }

  const stageClassName = variant === 'hero'
    ? 'adaptive-image-stage adaptive-image-stage--hero absolute inset-0 flex items-center justify-center px-6 pt-24 pb-32'
    : 'adaptive-image-stage adaptive-image-stage--embedded relative flex items-center justify-center rounded-lg overflow-hidden bg-black select-none';

  return (
    <div
      ref={stageRef}
      className={stageClassName}
      role="region"
      aria-roledescription="carousel"
      aria-label={variant === 'hero' ? 'Featured photography gallery' : 'Collection photography gallery'}
      tabIndex={0}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
    >
      <div
        ref={frameRef}
        className="adaptive-image-stage__frame relative overflow-hidden rounded-lg bg-black"
        data-ready={isReady}
        data-orientation={orientation}
        style={{ opacity: isReady ? 1 : 0 }}
      >
        <img
          ref={imgARef}
          src={undefined}
          alt={visibleLayer === 'a' ? displayedImage?.alt || image.alt : ''}
          aria-hidden={visibleLayer !== 'a'}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
          style={{ opacity: 0 }}
        />
        <img
          ref={imgBRef}
          src={undefined}
          alt={visibleLayer === 'b' ? displayedImage?.alt || image.alt : ''}
          aria-hidden={visibleLayer !== 'b'}
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
          style={{ opacity: 0 }}
        />
      </div>

      {hasImageError && (
        <span className="sr-only" role="status">
          This image could not be loaded.
        </span>
      )}

      {children}
    </div>
  );
}
