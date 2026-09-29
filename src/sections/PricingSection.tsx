import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { photographyServices } from '@/data/services';

gsap.registerPlugin(ScrollTrigger);

export function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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
    <section
      id="pricing"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black py-24 md:py-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary to-background pointer-events-none" />

      <div className="relative w-full px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="accent-kicker mb-4 block text-xs uppercase tracking-[0.3em]">
            Investment
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
            Pricing
          </h2>
          <p className="mt-6 text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Straightforward hourly pricing for portraits, events, weddings, and engagements.
            Every booking has a 60-minute minimum.
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
              <h3 className="text-xl font-light text-white tracking-wide mb-2">
                {service.name}
              </h3>

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

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            Choose a category to request a time. Every request is reviewed manually before it is confirmed.
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
  );
}
