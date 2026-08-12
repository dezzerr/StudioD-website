import type { Collection, NavItem } from '@/types';

export const navItems: NavItem[] = [
  { label: 'Work', href: '#collections' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Booking', href: '/booking' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const galleryImagePrimary = '/images/portrait-1.jpg';
const galleryImageSecondary = '/images/portrait-2.jpg';

// Fallback content used when dynamic ImageKit feed cannot be loaded.
export const heroGalleryImages = [
  {
    id: 'hero-1',
    src: galleryImagePrimary,
    alt: 'Elegant portrait',
    leftLabel: 'Portrait Session',
    rightLabel: 'Winter 2025',
  },
  {
    id: 'hero-2',
    src: galleryImageSecondary,
    alt: 'Dramatic black and white portrait',
    leftLabel: 'Editorial',
    rightLabel: 'The Artisan Series',
  },
  {
    id: 'hero-3',
    src: galleryImagePrimary,
    alt: 'Fashion editorial portrait',
    leftLabel: 'Fashion',
    rightLabel: 'Avant-Garde',
  },
  {
    id: 'hero-4',
    src: galleryImageSecondary,
    alt: 'Creative portrait with colored lighting',
    leftLabel: 'Creative',
    rightLabel: 'Neon Dreams',
  },
  {
    id: 'hero-5',
    src: galleryImagePrimary,
    alt: 'Artistic portrait',
    leftLabel: 'Editorial',
    rightLabel: 'Raw Expression',
  },
];

export const collections: Collection[] = [
  {
    id: 'studio-portraits',
    title: 'Portraits',
    season: 'All Year',
    description: 'Indoor or outdoor portrait sessions, with 10 fully edited images included.',
    thumbnail: galleryImagePrimary,
    category: 'portrait',
    featured: true,
    images: [
      {
        id: 'sp-1',
        src: galleryImagePrimary,
        alt: 'Portrait',
        leftLabel: 'Portraits',
        rightLabel: 'Latest work',
      },
      {
        id: 'sp-2',
        src: galleryImageSecondary,
        alt: 'Portrait',
        leftLabel: 'Portraits',
        rightLabel: 'Latest work',
      },
    ],
  },
  {
    id: 'family-sessions',
    title: 'Family Sessions',
    season: 'All Year',
    description: 'Relaxed studio or outdoor family sessions, with 10 fully edited images included.',
    thumbnail: galleryImageSecondary,
    category: 'family',
    featured: true,
    images: [
      {
        id: 'fm-1',
        src: galleryImageSecondary,
        alt: 'Family portrait',
        leftLabel: 'Family Sessions',
        rightLabel: 'Latest work',
      },
      {
        id: 'fm-2',
        src: galleryImagePrimary,
        alt: 'Family portrait',
        leftLabel: 'Family Sessions',
        rightLabel: 'Latest work',
      },
    ],
  },
  {
    id: 'event-photography',
    title: 'Event Photography',
    season: 'All Year',
    description: 'Story-led event coverage with every final usable edited image included.',
    thumbnail: galleryImagePrimary,
    category: 'location',
    featured: true,
    images: [
      {
        id: 'ev-1',
        src: galleryImagePrimary,
        alt: 'Event photograph',
        leftLabel: 'Event Photography',
        rightLabel: 'Latest work',
      },
      {
        id: 'ev-2',
        src: galleryImageSecondary,
        alt: 'Event photograph',
        leftLabel: 'Event Photography',
        rightLabel: 'Latest work',
      },
    ],
  },
];
