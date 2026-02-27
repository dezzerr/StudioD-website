import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { pricingPackages } from '@/data/collections';
import { Check, Star } from 'lucide-react';

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
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black pointer-events-none" />

      <div className="relative w-full px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="text-xs tracking-[0.3em] uppercase text-white/50 block mb-4">
            Investment
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
            Pricing
          </h2>
          <p className="mt-6 text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Transparent pricing for exceptional portrait photography. 
            Each package is designed to deliver stunning results that you'll treasure forever.
          </p>
        </div>

        {/* Pricing Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {pricingPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`pricing-card relative rounded-2xl p-8 md:p-10 ${
                pkg.popular
                  ? 'glass-card border-white/20 scale-105 md:scale-110 z-10'
                  : 'glass-card'
              }`}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white text-black text-[10px] tracking-[0.2em] uppercase rounded-full font-medium">
                    <Star size={12} fill="currentColor" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Package Name */}
              <h3 className="text-xl font-light text-white tracking-wide mb-2">
                {pkg.name}
              </h3>

              {/* Duration */}
              <span className="text-sm text-white/50 block mb-6">
                {pkg.duration}
              </span>

              {/* Price */}
              <div className="mb-6">
                <span className="text-5xl md:text-6xl font-light text-white tracking-tight">
                  £{pkg.price}
                </span>
              </div>

              {/* Description */}
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {pkg.description}
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={18} className="text-white/70 mt-0.5 flex-shrink-0" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-lg text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-white/40 text-sm">
            All packages include a pre-session consultation and professional editing.
            {' '}
            <button className="text-white/60 hover:text-white underline underline-offset-4 transition-colors">
              Contact us
            </button>
            {' '}
            for custom packages.
          </p>
        </div>
      </div>
    </section>
  );
}
