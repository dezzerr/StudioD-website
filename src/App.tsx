import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { ImmersiveGallery } from '@/components/gallery/ImmersiveGallery';
import { CollectionsSection } from '@/sections/CollectionsSection';
import { PricingSection } from '@/sections/PricingSection';
import { AboutSection } from '@/sections/AboutSection';
import { ContactSection } from '@/sections/ContactSection';

import { useCustomCursor } from '@/hooks/useCustomCursor';
import { heroGalleryImages } from '@/data/collections';
import type { CursorType } from '@/types';

import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const { position, isVisible, isTouchDevice } = useCustomCursor();

  useEffect(() => {
    // Initial page load animation
    const tl = gsap.timeline();
    
    tl.fromTo(
      '.page-content',
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: 'power2.out' }
    );

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none none',
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleCursorChange = (type: CursorType) => {
    setCursorType(type);
  };

  return (
    <div className="page-content relative bg-black min-h-screen">
      {/* Custom Cursor */}
      {!isTouchDevice && (
        <CustomCursor
          position={position}
          cursorType={cursorType}
          isVisible={isVisible}
        />
      )}

      {/* Navigation */}
      <Navigation />

      {/* Hero Gallery - Full Screen */}
      <main className="relative">
        <ImmersiveGallery
          images={heroGalleryImages}
          onCursorChange={handleCursorChange}
        />

        {/* Collections Section */}
        <CollectionsSection />

        {/* Pricing Section */}
        <PricingSection />

        {/* About Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
