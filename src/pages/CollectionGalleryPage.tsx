import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check } from 'lucide-react';
import { useGalleryFeed } from '@/hooks/useGalleryFeed';
import { EmbeddedGallery } from '@/components/gallery/EmbeddedGallery';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import { collectionAbout } from '@/data/collectionAbout';

gsap.registerPlugin(ScrollTrigger);

export function CollectionGalleryPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const { collectionItems, isLoading } = useGalleryFeed();
  const contentRef = useRef<HTMLDivElement>(null);

  const collection = collectionItems.find(c => c.id === collectionId);
  const about = collectionId ? collectionAbout[collectionId] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [collectionId]);

  useEffect(() => {
    if (!contentRef.current) return;

    const elements = contentRef.current.querySelectorAll('.animate-in');
    const triggers: ScrollTrigger[] = [];

    elements.forEach((el, index) => {
      const tl = gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.08,
        }
      );

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, [collection, isLoading]);

  const handleBack = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <span className="text-xs tracking-[0.3em] uppercase text-white/40">Loading</span>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="fixed inset-0 bg-black z-30 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">Collection</p>
          <h2 className="text-2xl md:text-4xl font-light text-white/80 tracking-tight">
            Not found
          </h2>
          <p className="mt-4 text-white/50 text-sm">
            The collection "{collectionId}" could not be found.
          </p>
          <button
            onClick={handleBack}
            className="mt-8 text-sm tracking-widest uppercase text-white/50 hover:text-white transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${collection.title} — StudioD`}
        description={about ? about.paragraphs[0] : collection.description}
        path={`/collections/${collection.id}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: collection.title,
          description: collection.description,
        }}
      />
      <main className="relative bg-black pt-24 md:pt-28 min-h-screen">
        <div
          ref={contentRef}
          className="w-full px-6 md:px-12 lg:px-20 max-w-7xl mx-auto"
        >
          {/* Back button */}
          <button
            onClick={handleBack}
            className="animate-in flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 mb-12 md:mb-16"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs tracking-[0.2em] uppercase">Back to home</span>
          </button>

          {/* Gallery Section */}
          <section className="mb-20 md:mb-28">
            <div className="animate-in mb-6 md:mb-8">
              <span className="text-xs tracking-[0.3em] uppercase text-white/50">
                Gallery
              </span>
            </div>
            <div className="animate-in">
              <EmbeddedGallery
                images={collection.images}
                title={collection.title}
              />
            </div>
          </section>

          {/* About Section */}
          {about && (
            <section className="mb-20 md:mb-28">
              {/* Category label */}
              <span className="animate-in text-xs tracking-[0.3em] uppercase text-white/50 block mb-4">
                {collection.title}
              </span>

              {/* Headline */}
              <h1 className="animate-in text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-10">
                {about.headline}
              </h1>

              {/* Paragraphs */}
              <div className="animate-in space-y-6 text-white/70 font-light leading-relaxed max-w-2xl">
                {about.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Highlights */}
              <div className="animate-in mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-3xl">
                {about.highlights.map((highlight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/[0.02]"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full border border-white/20 flex items-center justify-center mt-0.5">
                      <Check size={14} className="text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/90">{highlight.label}</p>
                      <p className="text-sm text-white/50 font-light mt-1">{highlight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
