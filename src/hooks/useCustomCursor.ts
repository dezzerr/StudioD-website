import { useState, useEffect, useCallback, useRef } from 'react';
import type { CursorType } from '@/types';

interface CursorPosition {
  x: number;
  y: number;
}

export function useCustomCursor() {
  const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const rafId = useRef<number | null>(null);
  const targetPosition = useRef<CursorPosition>({ x: 0, y: 0 });

  useEffect(() => {
    // Detect touch device
    const checkTouch = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    // Add custom cursor class to body
    if (!isTouchDevice) {
      document.body.classList.add('custom-cursor');
    }

    return () => {
      document.body.classList.remove('custom-cursor');
    };
  }, [isTouchDevice]);

  const updatePosition = useCallback(() => {
    setPosition(prev => ({
      x: prev.x + (targetPosition.current.x - prev.x) * 0.15,
      y: prev.y + (targetPosition.current.y - prev.y) * 0.15,
    }));
    rafId.current = requestAnimationFrame(updatePosition);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    rafId.current = requestAnimationFrame(updatePosition);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isTouchDevice, isVisible, updatePosition]);

  const setCursor = useCallback((type: CursorType) => {
    setCursorType(type);
  }, []);

  return {
    position,
    cursorType,
    isVisible,
    isTouchDevice,
    setCursor,
  };
}
