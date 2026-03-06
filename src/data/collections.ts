import type { Collection, PricingPackage, NavItem } from '@/types';
import { buildImageUrl } from '@/services/imagekit';

export const navItems: NavItem[] = [
  { label: 'Work', href: '#collections' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const galleryImagePrimary = buildImageUrl('studio-d-gallery/0_0.png');
const galleryImageSecondary = buildImageUrl('studio-d-gallery/0_1.png');

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
    id: 'studio-portraits-2025',
    title: 'Studio Portraits',
    season: 'Winter 2025',
    description: 'Intimate studio sessions capturing authentic personality and emotion.',
    thumbnail: galleryImagePrimary,
    category: 'studio',
    featured: true,
    images: [
      {
        id: 'sp-1',
        src: galleryImagePrimary,
        alt: 'Studio portrait',
        leftLabel: 'Studio Session',
        rightLabel: 'Winter 2025',
      },
      {
        id: 'sp-2',
        src: galleryImageSecondary,
        alt: 'Corporate headshot',
        leftLabel: 'Corporate',
        rightLabel: 'Executive Series',
      },
    ],
  },
  {
    id: 'editorial-collection',
    title: 'Editorial Work',
    season: 'Fall 2024',
    description: 'High-fashion editorial portraits for magazines and brand campaigns.',
    thumbnail: galleryImageSecondary,
    category: 'editorial',
    featured: true,
    images: [
      {
        id: 'ed-1',
        src: galleryImageSecondary,
        alt: 'Editorial portrait',
        leftLabel: 'Editorial',
        rightLabel: 'The Artisan Series',
      },
      {
        id: 'ed-2',
        src: galleryImagePrimary,
        alt: 'Artistic editorial',
        leftLabel: 'Editorial',
        rightLabel: 'Raw Expression',
      },
    ],
  },
  {
    id: 'fashion-avantgarde',
    title: 'Fashion Forward',
    season: 'Spring 2025',
    description: 'Bold, avant-garde fashion photography pushing creative boundaries.',
    thumbnail: galleryImagePrimary,
    category: 'editorial',
    featured: false,
    images: [
      {
        id: 'ff-1',
        src: galleryImagePrimary,
        alt: 'Fashion portrait',
        leftLabel: 'Fashion',
        rightLabel: 'Avant-Garde',
      },
    ],
  },
  {
    id: 'family-moments',
    title: 'Family Sessions',
    season: 'All Year',
    description: 'Heartwarming family portraits capturing precious moments together.',
    thumbnail: galleryImageSecondary,
    category: 'family',
    featured: true,
    images: [
      {
        id: 'fm-1',
        src: galleryImageSecondary,
        alt: 'Family portrait',
        leftLabel: 'Family',
        rightLabel: 'The Thompson Session',
      },
      {
        id: 'fm-2',
        src: galleryImagePrimary,
        alt: 'Couple portrait',
        leftLabel: 'Couples',
        rightLabel: 'Golden Hour',
      },
    ],
  },
  {
    id: 'creative-lighting',
    title: 'Creative Lighting',
    season: 'Summer 2024',
    description: 'Experimental portraits using colored gels and dramatic lighting techniques.',
    thumbnail: galleryImageSecondary,
    category: 'studio',
    featured: false,
    images: [
      {
        id: 'cl-1',
        src: galleryImageSecondary,
        alt: 'Creative portrait',
        leftLabel: 'Creative',
        rightLabel: 'Neon Dreams',
      },
    ],
  },
];

export const pricingPackages: PricingPackage[] = [
  {
    id: 'essential',
    name: 'Essential',
    price: 130,
    duration: '30 minutes',
    description: 'Perfect for quick headshots and professional updates.',
    features: [
      '30-minute studio session',
      '5 edited digital images',
      'Online gallery',
      'Print release',
      '2 outfit changes',
    ],
  },
  {
    id: 'signature',
    name: 'Signature',
    price: 170,
    duration: '60 minutes',
    description: 'Our most popular choice for comprehensive portrait sessions.',
    features: [
      '60-minute studio session',
      '15 edited digital images',
      'Online gallery',
      'Print release',
      '4 outfit changes',
      'Professional makeup consultation',
    ],
    popular: true,
  },
  {
    id: 'experience',
    name: 'Experience',
    price: 295,
    duration: '2 hours',
    description: 'The ultimate portrait experience with full creative direction.',
    features: [
      '2-hour studio session',
      '30 edited digital images',
      'Online gallery',
      'Print release',
      'Unlimited outfit changes',
      'Professional makeup included',
      'Priority booking',
      'Complimentary 8x10 print',
    ],
  },
];
