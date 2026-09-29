import { ImmersiveGallery } from '@/components/gallery/ImmersiveGallery';
import { CollectionsSection } from '@/sections/CollectionsSection';
import { Footer } from '@/components/Footer';
import { BASE_URL, SEO } from '@/components/SEO';
import { useGalleryFeed } from '@/hooks/useGalleryFeed';
import type { CursorType } from '@/types';
import { Link } from 'react-router-dom';

interface HomePageProps {
  onCursorChange: (type: CursorType) => void;
}

export function HomePage({ onCursorChange }: HomePageProps) {
  const { heroImages, collectionItems } = useGalleryFeed();

  return (
    <>
      <SEO
        title="Photographer in Stoke-on-Trent"
        description="Studio Derrick offers portrait, family and event photography from Stoke-on-Trent across Staffordshire, the Midlands and Northern England, with travel available for events."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'Studio Derrick',
          description: 'Portrait, family and event photography based in Stoke-on-Trent, serving Staffordshire, the Midlands and Northern England, with travel available for events.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Stoke-on-Trent',
            addressRegion: 'Staffordshire',
            addressCountry: 'GB',
          },
          areaServed: ['Staffordshire', 'West Midlands', 'East Midlands', 'North West England', 'Yorkshire'],
          email: 'hello@studioderrick.co.uk',
          url: BASE_URL,
        }}
      />
      <main className="relative">
        <h1 className="sr-only">Studio Derrick photography in Stoke-on-Trent</h1>
        <section className="home-hero-shell px-3 pb-4 pt-28 md:px-6 md:pb-6 md:pt-24">
          <ImmersiveGallery
            images={heroImages}
            onCursorChange={onCursorChange}
          />
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
          <p className="accent-kicker mb-4 text-xs uppercase tracking-[0.3em]">Based in Stoke-on-Trent</p>
          <h2 className="text-3xl font-light text-white md:text-5xl">Portraits, family sessions and event photography</h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
            Serving Staffordshire, the Midlands and the North of England, including Stafford, Manchester,
            Liverpool, Birmingham, Nottingham, Sheffield and Leeds. Available to travel further for events.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/photographer-stoke-on-trent" className="text-sm text-accent-strong underline underline-offset-4">Photography in Stoke-on-Trent</Link>
            <Link to="/family-photographer-stoke-on-trent" className="text-sm text-accent-strong underline underline-offset-4">Family sessions</Link>
            <Link to="/areas" className="text-sm text-accent-strong underline underline-offset-4">All service areas</Link>
          </div>
        </section>

        {/* Collections Section */}
        <CollectionsSection collections={collectionItems} />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
