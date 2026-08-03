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
    alt: 'Elegant studio portrait',
    leftLabel: 'Studio Session',
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
    title: 'Studio Portraits',
    season: 'All Year',
    description: 'Studio portrait sessions with controlled lighting and timeless styling.',
    thumbnail: galleryImagePrimary,
    category: 'studio',
    featured: true,
    images: [
      {
        id: 'sp-1',
        src: galleryImagePrimary,
        alt: 'Studio portrait',
        leftLabel: 'Studio Portraits',
        rightLabel: 'Latest work',
      },
      {
        id: 'sp-2',
        src: galleryImageSecondary,
        alt: 'Studio portrait',
        leftLabel: 'Studio Portraits',
        rightLabel: 'Latest work',
      },
    ],
  },
  {
    id: 'family-sessions',
    title: 'Family Sessions',
    season: 'All Year',
    description: 'Natural family moments captured with warmth, movement, and connection.',
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
    description: 'Candid and editorial event coverage for private and commercial occasions.',
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
