/**
 * ImageKit Service
 * Handles image uploads, transformations, and optimization
 * https://imagekit.io/
 */

import type { GalleryFeedResponse } from '@/types';

export interface ImageKitConfig {
  urlEndpoint: string;
  publicKey: string;
}

export interface ImageTransformations {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpeg' | 'png' | 'avif';
  crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
  focus?: 'center' | 'top' | 'left' | 'bottom' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'auto';
  blur?: number;
  grayscale?: boolean;
}

// Get config from environment
const getConfig = (): ImageKitConfig => ({
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '',
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '',
});

/**
 * Build ImageKit transformation URL
 */
export const buildImageUrl = (
  imagePath: string,
  transformations: ImageTransformations = {}
): string => {
  const { urlEndpoint } = getConfig();
  const normalizedEndpoint = urlEndpoint.replace(/\/+$/, '');
  
  // If no ImageKit config, return local path
  if (!normalizedEndpoint) {
    return imagePath;
  }

  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  const baseUrl = `${normalizedEndpoint}/${cleanPath}`;
  
  // Build transformation string
  const transformParams: string[] = [];
  
  if (transformations.width) {
    transformParams.push(`w-${transformations.width}`);
  }
  if (transformations.height) {
    transformParams.push(`h-${transformations.height}`);
  }
  if (transformations.quality) {
    transformParams.push(`q-${transformations.quality}`);
  }
  if (transformations.format && transformations.format !== 'auto') {
    transformParams.push(`f-${transformations.format}`);
  } else if (transformations.format === 'auto') {
    transformParams.push('f-auto');
  }
  if (transformations.crop) {
    transformParams.push(`c-${transformations.crop}`);
  }
  if (transformations.focus) {
    transformParams.push(`fo-${transformations.focus}`);
  }
  if (transformations.blur) {
    transformParams.push(`bl-${transformations.blur}`);
  }
  if (transformations.grayscale) {
    transformParams.push('e-grayscale');
  }

  // No transformations requested - return original image URL.
  // This avoids ImageKit transformation limits on very large source images.
  if (transformParams.length === 0) {
    return baseUrl;
  }

  // Add default optimizations
  if (!transformParams.some(p => p.startsWith('f-'))) {
    transformParams.push('f-auto'); // Auto format (WebP/AVIF when supported)
  }
  if (!transformParams.some(p => p.startsWith('q-'))) {
    transformParams.push('q-85'); // Default quality
  }

  const transformString = transformParams.join(',');
  
  return `${baseUrl}?tr=${transformString}`;
};

/**
 * Get responsive image srcset
 */
export const getResponsiveSrcSet = (
  imagePath: string,
  widths: number[] = [400, 800, 1200, 1600]
): string => {
  return widths
    .map(width => {
      const url = buildImageUrl(imagePath, { width, format: 'auto' });
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Get placeholder/low-quality image URL (LQIP)
 */
export const getPlaceholderUrl = (imagePath: string): string => {
  return buildImageUrl(imagePath, {
    width: 20,
    quality: 30,
    blur: 10,
    format: 'jpeg',
  });
};

/**
 * Get optimized image for gallery
 */
export const getGalleryImageUrl = (imagePath: string, isMain: boolean = false): string => {
  if (isMain) {
    // Main gallery image - higher quality
    return buildImageUrl(imagePath, {
      width: 1200,
      height: 1600,
      quality: 90,
      crop: 'maintain_ratio',
      focus: 'auto',
      format: 'auto',
    });
  }
  // Thumbnail
  return buildImageUrl(imagePath, {
    width: 400,
    height: 533,
    quality: 80,
    crop: 'maintain_ratio',
    format: 'auto',
  });
};

/**
 * Get collection thumbnail
 */
export const getCollectionThumbnailUrl = (imagePath: string): string => {
  return buildImageUrl(imagePath, {
    width: 800,
    height: 1000,
    quality: 85,
    crop: 'maintain_ratio',
    focus: 'auto',
    format: 'auto',
  });
};

/**
 * Check if ImageKit is configured
 */
export const isImageKitConfigured = (): boolean => {
  const config = getConfig();
  return Boolean(config.urlEndpoint && config.publicKey);
};

/**
 * Upload image directly to ImageKit using short-lived server-generated auth
 * parameters. This keeps large photo files away from Vercel's function payload
 * limit while keeping the private ImageKit key server-side.
 */
export interface UploadResult {
  url: string;
  thumbnailUrl: string;
  fileId: string;
  name: string;
  size: number;
  filePath?: string;
}

export interface ImageKitFile {
  url: string;
  thumbnailUrl: string;
  fileId: string;
  name: string;
  size: number;
  filePath?: string;
  createdAt?: string;
  updatedAt?: string;
  fileType?: string;
  isPrivateFile?: boolean;
  tags?: string[];
}

interface UploadImageOptions {
  path?: string;
  tags?: string[];
}

interface ListImagesOptions {
  folder?: string;
  path?: string;
}

interface ImageKitAuthenticationParameters {
  token: string;
  expire: number;
  signature: string;
}

export const uploadImage = async (
  file: File,
  folder: string = 'uploads',
  options: UploadImageOptions = {}
): Promise<UploadResult> => {
  const config = getConfig();
  if (!config.publicKey) {
    throw new Error('ImageKit is not configured');
  }

  const authResponse = await fetch('/api/imagekit-auth');
  if (!authResponse.ok) {
    const error = await authResponse.json();
    throw new Error(error.message || 'ImageKit authentication failed');
  }

  const auth = await authResponse.json() as ImageKitAuthenticationParameters;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('publicKey', config.publicKey);
  formData.append('token', auth.token);
  formData.append('expire', String(auth.expire));
  formData.append('signature', auth.signature);
  formData.append('fileName', file.name);
  formData.append('folder', folder.startsWith('/') ? folder : `/studio-d/${folder}`);
  formData.append('useUniqueFileName', 'true');

  if (options.path) {
    formData.set('folder', options.path);
  }

  if (options.tags?.length) {
    formData.append('tags', options.tags.join(','));
  }

  const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

/**
 * Delete image from ImageKit
 */
export const deleteImage = async (fileId: string): Promise<void> => {
  const response = await fetch('/api/delete-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Delete failed');
  }
};

/**
 * List images in a folder
 */
export const listImages = async (
  options: ListImagesOptions | string = 'uploads'
): Promise<ImageKitFile[]> => {
  const query = new URLSearchParams();

  if (typeof options === 'string') {
    query.set('folder', options);
  } else if (options.path) {
    query.set('path', options.path);
  } else {
    query.set('folder', options.folder || 'uploads');
  }

  const response = await fetch(`/api/list-images?${query.toString()}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to list images');
  }

  return response.json();
};

/**
 * Get dynamic gallery feed (hero + collection folders)
 */
export const getGalleryFeed = async (): Promise<GalleryFeedResponse> => {
  const response = await fetch('/api/gallery-feed');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch gallery feed');
  }

  return response.json();
};
