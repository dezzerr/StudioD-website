import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = 'StudioD';
const BASE_URL = import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'https://studiod.com');

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-seo-id="${id}"]`);
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.setAttribute('data-seo-id', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function SEO({ title, description, path, image, type = 'website', jsonLd }: SEOProps) {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${BASE_URL}${path}`;
  const ogImage = image || `${BASE_URL}/images/og-default.jpg`;

  useEffect(() => {
    document.title = fullTitle;

    upsertMeta('name', 'description', description);

    // Open Graph
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:image', ogImage);

    // Twitter Card
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:image', ogImage);

    // Canonical
    upsertLink('canonical', url);

    // JSON-LD structured data
    if (jsonLd) {
      upsertJsonLd('page-jsonld', jsonLd);
    } else {
      const existing = document.head.querySelector('script[data-seo-id="page-jsonld"]');
      if (existing) existing.remove();
    }
  }, [fullTitle, description, url, ogImage, type, jsonLd]);

  return null;
}
