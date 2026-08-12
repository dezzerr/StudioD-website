export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  leftLabel: string;
  rightLabel: string;
}

export interface Collection {
  id: string;
  title: string;
  season: string;
  description: string;
  thumbnail: string;
  images: GalleryImage[];
  category: 'portrait' | 'studio' | 'location' | 'family' | 'editorial' | 'corporate';
  featured: boolean;
}

export interface GalleryFeedResponse {
  hero: GalleryImage[];
  collections: Collection[];
  updatedAt: string;
}

export type PhotographyServiceId =
  | 'portrait'
  | 'event'
  | 'wedding'
  | 'engagement';

export interface PhotographyService {
  id: PhotographyServiceId;
  name: string;
  rate: number;
  minimumDurationMinutes: number;
  description: string;
  calLink: string;
  locationRequired: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export type CursorType = 'default' | 'left' | 'right' | 'view';
