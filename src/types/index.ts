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
  category: 'studio' | 'location' | 'family' | 'editorial' | 'corporate';
  featured: boolean;
}

export interface PricingPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export type CursorType = 'default' | 'left' | 'right' | 'view';
