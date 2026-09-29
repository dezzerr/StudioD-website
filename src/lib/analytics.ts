declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackPageView(path: string) {
  window.gtag?.('event', 'page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
}

export function trackLead(source: 'contact_form' | 'booking_request', service?: string) {
  window.gtag?.('event', 'generate_lead', {
    lead_source: source,
    ...(service ? { service_type: service } : {}),
  });
}
