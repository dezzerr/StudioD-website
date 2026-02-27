# StudioD - Photography Portfolio

A premium photography portfolio website for StudioD, a UK-based portrait photography business. Built with React, TypeScript, Tailwind CSS, and GSAP for immersive animations.

## Features

- **Immersive Gallery**: Full-screen hero gallery with GSAP-powered 3D transitions
- **Custom Cursor**: Directional cursor indicators for navigation zones
- **Auto-Advance**: Gallery auto-rotates every 4 seconds with pause on hover
- **Keyboard Navigation**: Arrow keys for image navigation
- **Touch/Swipe Support**: Mobile-friendly swipe gestures
- **Glassmorphism Pricing Cards**: Modern translucent pricing cards
- **Responsive Design**: Optimized for all screen sizes
- **Decap CMS Integration**: Content management for collections and pricing

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **CMS**: Decap CMS (formerly Netlify CMS)
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd studio-d

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

## Project Structure

```
├── public/
│   ├── admin/              # Decap CMS admin panel
│   ├── images/             # Portfolio images
│   └── ...
├── src/
│   ├── components/         # React components
│   │   ├── cursor/         # Custom cursor component
│   │   ├── gallery/        # Immersive gallery
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── sections/           # Page sections
│   │   ├── CollectionsSection.tsx
│   │   ├── PricingSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── ContactSection.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useCustomCursor.ts
│   │   └── useImmersiveGallery.ts
│   ├── data/               # Static data
│   │   └── collections.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── content/                # CMS content (collections, pricing)
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## GSAP Animation Configuration

### Image Transition Timing

The gallery uses a 3D rotation transition effect. To adjust timing:

```typescript
// In src/hooks/useImmersiveGallery.ts
const tl = gsap.timeline({
  onComplete: () => {
    setCurrentIndex(newIndex);
    setIsTransitioning(false);
    gsap.set([currentImage, nextImage], { clearProps: 'all' });
  },
});

// Adjust duration here (default: 0.4s per phase, 0.8s total)
tl.to(currentImage, {
  rotateY: rotateOut,
  opacity: 0,
  duration: 0.4,  // Change this
  ease: 'power2.in',
}, 0)
.to(nextImage, {
  rotateY: 0,
  opacity: 1,
  duration: 0.4,  // Change this
  ease: 'power2.out',
}, 0);
```

### Auto-Advance Interval

```typescript
// In src/hooks/useImmersiveGallery.ts
useImmersiveGallery({
  images,
  autoAdvanceInterval: 4000,  // Change this (milliseconds)
  pauseOnHover: true,
  resumeDelay: 2000,
});
```

## Decap CMS Setup

### 1. Enable Identity

1. Go to your Netlify site dashboard
2. Navigate to **Identity**
3. Click **Enable Identity**
4. Configure registration preferences (recommended: invite-only)

### 2. Add Git Gateway

1. In Identity settings, go to **Services**
2. Click **Enable Git Gateway**

### 3. Invite Users

1. In Identity, go to **Users**
2. Click **Invite users**
3. Enter email addresses for content editors

### 4. Access the CMS

Navigate to `https://your-site.netlify.app/admin/` and log in with your credentials.

## Adding New Collections

### Via CMS

1. Go to `/admin/`
2. Click **Collections** in the left sidebar
3. Click **New Collections**
4. Fill in the required fields:
   - Title
   - Season/Date
   - Description
   - Thumbnail image
   - Category
   - Gallery images with labels
5. Click **Publish**

### Via Code

Add to `src/data/collections.ts`:

```typescript
export const collections: Collection[] = [
  // ... existing collections
  {
    id: 'new-collection',
    title: 'New Collection',
    season: 'Spring 2025',
    description: 'Description here',
    thumbnail: '/images/new-thumbnail.jpg',
    category: 'studio',
    featured: true,
    images: [
      {
        id: 'nc-1',
        src: '/images/new-image.jpg',
        alt: 'Description',
        leftLabel: 'Studio Session',
        rightLabel: 'Spring 2025',
      },
    ],
  },
];
```

## ImageKit Integration

To use ImageKit for image optimization:

1. Create an account at [imagekit.io](https://imagekit.io)
2. Get your URL endpoint
3. Update image URLs:

```typescript
// Instead of:
const imageUrl = '/images/portrait-1.jpg';

// Use:
const imageUrl = 'https://ik.imagekit.io/your-endpoint/portrait-1.jpg?tr=w-800,h-1000,fo-auto';
```

### Transformation Parameters

- `w-800`: Width 800px
- `h-1000`: Height 1000px
- `fo-auto`: Smart crop focus
- `q-80`: Quality 80%
- `f-webp`: WebP format

## Browser Support

- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)

## Performance Optimizations

- GPU-accelerated animations (`transform3d`, `will-change`)
- Image preloading (next 2 images, previous 1 image)
- Intersection Observer to pause animations when not in viewport
- Passive event listeners for scroll/touch
- Reduced motion support for accessibility

## License

© 2025 StudioD. All rights reserved.
