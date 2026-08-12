import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { photographyServices } from '@/data/services';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';

gsap.registerPlugin(ScrollTrigger);

export function PricingPage() {
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.pricing-card');
    const triggers: ScrollTrigger[] = [];

    cards.forEach((card, index) => {
      const tl = gsap.fromTo(
        card,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.15,
        }
      );

      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <SEO
        title="Pricing"
        description="Transparent hourly pricing for StudioD portrait, event, wedding, and engagement photography. Every booking has a 60-minute minimum."
        path="/pricing"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: 'StudioD Photography Services',
          itemListElement: photographyServices.map((service) => ({
            '@type': 'Offer',
            name: `${service.name} Photography`,
            price: service.rate,
            priceCurrency: 'GBP',
            description: `${service.rate} per hour, with a ${service.minimumDurationMinutes}-minute minimum.`,
          })),
        }}
      />
      <main className="relative bg-black pt-32 md:pt-40 min-h-screen">
        <section className="relative w-full py-16 md:py-24">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary to-background pointer-events-none" />

          <div className="relative w-full px-6 md:px-12 lg:px-20">
            {/* Header */}
            <div className="text-center mb-16 md:mb-24">
              <span className="accent-kicker mb-4 block text-xs uppercase tracking-[0.3em]">
                Investment
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
                Pricing
              </h1>
              <p className="mt-6 text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                Straightforward hourly pricing for photographs that feel considered,
                personal, and true to the occasion.
              </p>
            </div>

            {/* Pricing Cards */}
            <div
              ref={cardsRef}
              className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:grid-cols-4 xl:gap-5 max-w-7xl mx-auto"
            >
              {photographyServices.map((service) => (
                <div
                  key={service.id}
                  className="pricing-card relative flex flex-col rounded-2xl p-7 md:p-8 glass-card"
                >
                  <h2 className="text-xl font-light text-white tracking-wide mb-2">
                    {service.name}
                  </h2>

                  <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                    Photography
                  </span>

                  <div className="mt-8 mb-5">
                    <span className="text-5xl md:text-6xl font-light text-white tracking-tight">
                      £{service.rate}
                    </span>
                    <span className="ml-2 text-sm text-white/45">/ hour</span>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-8">
                    {service.description}
                  </p>

                  <div className="mt-auto border-t border-white/10 pt-5 text-xs uppercase tracking-[0.15em] text-white/45">
                    60-minute minimum
                  </div>

                  <Link
                    to={`/booking?service=${service.id}`}
                    className="accent-outline mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border bg-white/5 px-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Book {service.name}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-white/40 text-sm">
                Choose a category and request a time through the booking page.
                Every request is reviewed manually before it is confirmed.
                {' '}
                <Link
                  to="/contact"
                  className="text-white/60 underline underline-offset-4 transition-colors hover:text-accent-strong"
                >
                  Contact us
                </Link>
                {' '}if you have a question.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
