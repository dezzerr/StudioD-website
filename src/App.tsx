import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { AreasPage } from '@/pages/AreasPage';
import { DiscoveryPage } from '@/pages/DiscoveryPage';
import { FaqPage } from '@/pages/FaqPage';

import { useCustomCursor } from '@/hooks/useCustomCursor';
import type { CursorType } from '@/types';
import { trackPageView } from '@/lib/analytics';

import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const location = useLocation();
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const { position, isVisible, isTouchDevice } = useCustomCursor();

  useEffect(() => {
    const timer = window.setTimeout(() => trackPageView(location.pathname), 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);

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
        <Route path="/areas" element={<AreasPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/photographer-stoke-on-trent" element={<DiscoveryPage />} />
        <Route path="/family-photographer-stoke-on-trent" element={<DiscoveryPage />} />
        <Route path="/event-photographer-manchester" element={<DiscoveryPage />} />
        <Route path="/event-photographer-birmingham" element={<DiscoveryPage />} />
        <Route path="/collections/:collectionId" element={<CollectionGalleryPage />} />
      </Routes>
    </div>
  );
}

export default App;
