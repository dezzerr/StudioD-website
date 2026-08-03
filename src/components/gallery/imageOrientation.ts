export type ImageOrientation = 'portrait' | 'landscape' | 'square';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface FrameBounds {
  maxWidth: number;
  maxHeight: number;
}

export interface FittedFrame {
  width: number;
  height: number;
  ratio: number;
  orientation: ImageOrientation;
}

const PORTRAIT_THRESHOLD = 0.87;
const LANDSCAPE_THRESHOLD = 1.15;
const MIN_DISPLAY_RATIO = 0.7;
const MAX_DISPLAY_RATIO = 1.85;

export const classifyImageOrientation = (
  width: number,
  height: number,
): ImageOrientation => {
  if (width <= 0 || height <= 0) {
    return 'square';
  }

  const ratio = width / height;

  if (ratio <= PORTRAIT_THRESHOLD) {
    return 'portrait';
  }

  if (ratio >= LANDSCAPE_THRESHOLD) {
    return 'landscape';
  }

  return 'square';
};

export const getDisplayRatio = (width: number, height: number): number => {
  if (width <= 0 || height <= 0) {
    return 1;
  }

  return Math.min(MAX_DISPLAY_RATIO, Math.max(MIN_DISPLAY_RATIO, width / height));
};

export const fitImageFrame = (
  dimensions: ImageDimensions,
  bounds: FrameBounds,
): FittedFrame => {
  const ratio = getDisplayRatio(dimensions.width, dimensions.height);
  const maxWidth = Math.max(1, bounds.maxWidth);
  const maxHeight = Math.max(1, bounds.maxHeight);

  let width = Math.min(maxWidth, maxHeight * ratio);
  let height = width / ratio;

  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }

  return {
    width,
    height,
    ratio,
    orientation: classifyImageOrientation(dimensions.width, dimensions.height),
  };
};
