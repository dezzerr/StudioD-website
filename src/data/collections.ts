import type { Collection, PricingPackage, NavItem } from '@/types';

export const navItems: NavItem[] = [
  { label: 'Work', href: '#collections' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export const heroGalleryImages = [
  {
    id: 'hero-1',
    src: '/images/portrait-1.jpg',
    alt: 'Elegant studio portrait',
    leftLabel: 'Studio Session',
    rightLabel: 'Winter 2025',
  },
  {
    id: 'hero-2',
    src: '/images/portrait-2.jpg',
    alt: 'Dramatic black and white portrait',
    leftLabel: 'Editorial',
    rightLabel: 'The Artisan Series',
  },
  {
    id: 'hero-3',
    src: '/images/portrait-3.jpg',
    alt: 'Fashion editorial portrait',
    leftLabel: 'Fashion',
    rightLabel: 'Avant-Garde',
  },
  {
    id: 'hero-4',
    src: '/images/portrait-5.jpg',
    alt: 'Creative portrait with colored lighting',
    leftLabel: 'Creative',
    rightLabel: 'Neon Dreams',
  },
  {
    id: 'hero-5',
    src: '/images/portrait-7.jpg',
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
    thumbnail: '/images/portrait-1.jpg',
    category: 'studio',
    featured: true,
    images: [
      {
        id: 'sp-1',
        src: '/images/portrait-1.jpg',
        alt: 'Studio portrait',
        leftLabel: 'Studio Session',
        rightLabel: 'Winter 2025',
      },
      {
        id: 'sp-2',
        src: '/images/portrait-6.jpg',
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
    thumbnail: '/images/portrait-2.jpg',
    category: 'editorial',
    featured: true,
    images: [
      {
        id: 'ed-1',
        src: '/images/portrait-2.jpg',
        alt: 'Editorial portrait',
        leftLabel: 'Editorial',
        rightLabel: 'The Artisan Series',
      },
      {
        id: 'ed-2',
        src: '/images/portrait-7.jpg',
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
    thumbnail: '/images/portrait-3.jpg',
    category: 'editorial',
    featured: false,
    images: [
      {
        id: 'ff-1',
        src: '/images/portrait-3.jpg',
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
    thumbnail: '/images/portrait-4.jpg',
    category: 'family',
    featured: true,
    images: [
      {
        id: 'fm-1',
        src: '/images/portrait-4.jpg',
        alt: 'Family portrait',
        leftLabel: 'Family',
        rightLabel: 'The Thompson Session',
      },
      {
        id: 'fm-2',
        src: '/images/portrait-8.jpg',
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
    thumbnail: '/images/portrait-5.jpg',
    category: 'studio',
    featured: false,
    images: [
      {
        id: 'cl-1',
        src: '/images/portrait-5.jpg',
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
