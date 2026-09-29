import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Camera, Award, Users, Heart } from 'lucide-react';
import { useGalleryFeed } from '@/hooks/useGalleryFeed';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Camera, value: '100+', label: 'Sessions' },
  { icon: Award, value: '8', label: 'Years of Experience' },
  { icon: Users, value: '100+', label: 'Happy Clients' },
  { icon: Heart, value: '100%', label: 'Satisfaction' },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { heroImages } = useGalleryFeed();
  const profileImage = heroImages[0];

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
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black py-24 md:py-32"
    >
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div
          ref={contentRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto"
        >
          {/* Image Column */}
          <div className="animate-in relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src={profileImage?.src || '/images/portrait-1.jpg'}
                alt={profileImage?.alt || 'Studio Derrick Photographer'}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 -z-10 h-48 w-48 rounded-lg border border-accent/30" />
          </div>

          {/* Content Column */}
          <div>
            <span className="animate-in accent-kicker mb-4 block text-xs uppercase tracking-[0.3em]">
              About Us
            </span>
            
            <h2 className="animate-in text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight mb-8">
              Capturing Moments, <br />
              <span className="text-white/60">Creating Memories</span>
            </h2>
            
            <div className="animate-in space-y-6 text-white/70 font-light leading-relaxed">
              <p>
                Studio Derrick is a photography business based in Stoke-on-Trent,
                creating natural, considered images for people, families and businesses.
                With eight years of experience, we make every session feel relaxed and
                purposeful so the final photographs feel like you.
              </p>
              <p>
                We work across Stoke-on-Trent and Staffordshire, including Stafford, Stone,
                Kidsgrove, Alsager, Crewe and Nantwich. We also cover Manchester, Liverpool,
                Birmingham, Nottingham, Sheffield, Leeds, Northampton, Bristol and London,
                with travel available for events across the UK.
              </p>
              <p>
                From portraits and headshots to family sessions, engagements and events,
                we bring a thoughtful eye, careful direction and attention to detail. More
                than 100 happy clients have trusted us to preserve the moments that matter.
              </p>
            </div>

            {/* Signature */}
            <div className="animate-in mt-10 pt-8 border-t border-white/10">
              <p className="text-white/40 text-sm italic">
                "Photography is the story I fail to put into words."
              </p>
              <p className="text-white/60 text-sm mt-2">
                — The Studio Derrick Team
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-in mt-24 md:mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon size={24} className="mx-auto mb-4 text-accent-strong" />
              <span className="block text-3xl md:text-4xl font-light text-white mb-1">
                {stat.value}
              </span>
              <span className="text-xs tracking-[0.2em] uppercase text-white/50">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
