import { ImmersiveGallery } from '@/components/gallery/ImmersiveGallery';
import { CollectionsSection } from '@/sections/CollectionsSection';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { useGalleryFeed } from '@/hooks/useGalleryFeed';
import type { CursorType } from '@/types';

interface HomePageProps {
  onCursorChange: (type: CursorType) => void;
}

export function HomePage({ onCursorChange }: HomePageProps) {
  const { heroImages, collectionItems } = useGalleryFeed();

  return (
    <>
      <SEO
        title="StudioD"
        description="StudioD is a boutique portrait photography studio based in London, UK. Specialising in portraits, family sessions, and event photography with a timeless, artistic approach."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'StudioD',
          description: 'Boutique portrait photography studio in London specialising in portraits, family sessions, and event photography.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'London',
            addressCountry: 'GB',
          },
          url: import.meta.env.VITE_SITE_URL || 'https://studiod.com',
        }}
      />
      <main className="relative">
        <h1 className="sr-only">StudioD portrait photography</h1>
        <section className="home-hero-shell px-3 pb-4 pt-28 md:px-6 md:pb-6 md:pt-24">
          <ImmersiveGallery
            images={heroImages}
            onCursorChange={onCursorChange}
          />
        </section>

        {/* Collections Section */}
        <CollectionsSection collections={collectionItems} />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
