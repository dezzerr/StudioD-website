import { describe, expect, it } from 'vitest';
import {
  classifyImageOrientation,
  fitImageFrame,
  getDisplayRatio,
} from '@/components/gallery/imageOrientation';

describe('image orientation', () => {
  it('classifies portrait, landscape, and square images', () => {
    expect(classifyImageOrientation(864, 1184)).toBe('portrait');
    expect(classifyImageOrientation(1600, 900)).toBe('landscape');
    expect(classifyImageOrientation(1000, 1000)).toBe('square');
  });

  it('bounds extreme ratios without changing the source image', () => {
    expect(getDisplayRatio(3000, 1000)).toBe(1.85);
    expect(getDisplayRatio(400, 1000)).toBe(0.7);
  });

  it('fits the display frame within its available bounds', () => {
    const frame = fitImageFrame(
      { width: 1600, height: 900 },
      { maxWidth: 800, maxHeight: 500 },
    );

    expect(frame.orientation).toBe('landscape');
    expect(frame.width).toBe(800);
    expect(frame.height).toBeCloseTo(450);
  });

  it('uses the height bound for a tall portrait frame', () => {
    const frame = fitImageFrame(
      { width: 864, height: 1184 },
      { maxWidth: 800, maxHeight: 500 },
    );

    expect(frame.orientation).toBe('portrait');
    expect(frame.height).toBe(500);
    expect(frame.width).toBeCloseTo(364.86, 1);
  });
});
