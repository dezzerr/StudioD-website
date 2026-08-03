import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navigation } from '@/components/Navigation';
import { CustomCursor } from '@/components/cursor/CustomCursor';
import { HomePage } from '@/pages/HomePage';
import { CollectionGalleryPage } from '@/pages/CollectionGalleryPage';
import { PricingPage } from '@/pages/PricingPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { BookingPage } from '@/pages/BookingPage';

import { useCustomCursor } from '@/hooks/useCustomCursor';
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

      <Routes>
        <Route path="/" element={<HomePage onCursorChange={handleCursorChange} />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/collections/:collectionId" element={<CollectionGalleryPage />} />
      </Routes>
    </div>
  );
}

export default App;
