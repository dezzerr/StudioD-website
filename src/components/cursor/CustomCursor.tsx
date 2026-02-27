import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import type { CursorType } from '@/types';

interface CustomCursorProps {
  position: { x: number; y: number };
  cursorType: CursorType;
  isVisible: boolean;
}

export function CustomCursor({ position, cursorType, isVisible }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current) return;

    gsap.to(cursorRef.current, {
      x: position.x,
      y: position.y,
      duration: 0.08,
      ease: 'power2.out',
    });
  }, [position]);

  useEffect(() => {
    if (!cursorRef.current) return;

    gsap.to(cursorRef.current, {
      opacity: isVisible ? 1 : 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  }, [isVisible]);

  const renderCursorContent = () => {
    switch (cursorType) {
      case 'left':
        return (
          <div ref={arrowRef} className="flex items-center justify-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="text-white"
            >
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        );
      case 'right':
        return (
          <div ref={arrowRef} className="flex items-center justify-center">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="text-white"
            >
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        );
      case 'view':
        return (
          <div ref={arrowRef} className="flex items-center justify-center">
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="text-white"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-2 h-2 bg-white rounded-full" />
        );
    }
  };

  const getCursorSize = () => {
    switch (cursorType) {
      case 'left':
      case 'right':
      case 'view':
        return 'w-14 h-14';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div
      ref={cursorRef}
      className={`custom-cursor-element fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 ${getCursorSize()} rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm bg-white/5`}
      style={{
        left: 0,
        top: 0,
        opacity: 0,
      }}
    >
      {renderCursorContent()}
    </div>
  );
}
