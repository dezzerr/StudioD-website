import { useCallback, useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import type { GalleryImage } from '@/types';

interface ImageLightboxProps {
  image: GalleryImage;
  onClose: () => void;
}

const CLOSE_TRANSITION_MS = 240;

export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);
  const closeTimeoutRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const finishClose = useCallback(() => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    closeTimeoutRef.current = window.setTimeout(() => {
      previousActiveElementRef.current?.focus();
      onClose();
    }, CLOSE_TRANSITION_MS);
  }, [onClose]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    finishClose();
  }, [finishClose]);

  useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;

    const frame = window.requestAnimationFrame(() => {
      setIsOpen(true);
      closeButtonRef.current?.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [image]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="image-lightbox"
      data-open={isOpen}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded image: ${image.alt}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="image-lightbox__backdrop"
        aria-hidden="true"
        onMouseDown={handleClose}
      />
      <div className="image-lightbox__content">
        <button
          ref={closeButtonRef}
          type="button"
          className="image-lightbox__close"
          onClick={handleClose}
          aria-label="Close expanded image"
        >
          <X size={24} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <img
          src={image.src}
          alt={image.alt}
          className="image-lightbox__image"
          decoding="async"
          draggable={false}
        />

        <div className="image-lightbox__meta" aria-hidden="true">
          <span>{image.leftLabel}</span>
          <span>{image.rightLabel}</span>
        </div>
      </div>
    </div>
  );
}
