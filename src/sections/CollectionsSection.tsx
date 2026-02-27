import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { collections } from '@/data/collections';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function CollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardsRef.current) return;

    const cards = cardsRef.current.querySelectorAll('.collection-card');
    
    const triggers: ScrollTrigger[] = [];
    
    cards.forEach((card, index) => {
      const tl = gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.1,
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
      id="collections"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black py-24 md:py-32"
    >
      <div className="w-full px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <span className="text-xs tracking-[0.3em] uppercase text-white/50 block mb-4">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
            Collections
          </h2>
          <p className="mt-6 text-white/60 max-w-xl text-lg font-light leading-relaxed">
            Each collection represents a unique story, captured through our lens 
            with attention to light, emotion, and authentic expression.
          </p>
        </div>

        {/* Collections Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="collection-card group relative overflow-hidden rounded-lg cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={collection.thumbnail}
                  alt={collection.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-white/50 block mb-2">
                      {collection.season}
                    </span>
                    <h3 className="text-xl md:text-2xl font-light text-white tracking-tight">
                      {collection.title}
                    </h3>
                    <p className="mt-2 text-sm text-white/60 font-light line-clamp-2">
                      {collection.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-300">
                      <ArrowUpRight 
                        size={18} 
                        className="text-white group-hover:text-black transition-colors duration-300" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Tag */}
              <div className="absolute top-4 left-4">
                <span className="text-[10px] tracking-[0.2em] uppercase px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/70">
                  {collection.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
