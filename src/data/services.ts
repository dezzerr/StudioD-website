import type { PhotographyService, PhotographyServiceId } from '@/types';

// These are public Cal.com URLs, so keep a safe built-in value for deployments
// where a Vercel environment variable is missing or has been redacted.
const defaultCalLinks: Record<PhotographyServiceId, string> = {
  portrait: 'https://cal.com/derrick-rfm57g/portrait-session',
  event: 'https://cal.com/derrick-rfm57g/event-shoot',
  wedding: 'https://cal.com/derrick-rfm57g/wedding-shoot',
  engagement: 'https://cal.com/derrick-rfm57g/engagement-shoot',
};

function resolveCalLink(value: string | undefined, fallback: string) {
  const normalizedValue = value?.trim().replace(/^['"]|['"]$/g, '');

  if (!normalizedValue || normalizedValue.includes('[SENSITIVE]')) {
    return fallback;
  }

  return normalizedValue;
}

const calLinks: Record<PhotographyServiceId, string> = {
  portrait: resolveCalLink(import.meta.env.VITE_CAL_EVENT_PORTRAIT_URL, defaultCalLinks.portrait),
  event: resolveCalLink(import.meta.env.VITE_CAL_EVENT_EVENT_URL, defaultCalLinks.event),
  wedding: resolveCalLink(import.meta.env.VITE_CAL_EVENT_WEDDING_URL, defaultCalLinks.wedding),
  engagement: resolveCalLink(import.meta.env.VITE_CAL_EVENT_ENGAGEMENT_URL, defaultCalLinks.engagement),
};

export const photographyServices: PhotographyService[] = [
  {
    id: 'portrait',
    name: 'Portrait',
    rate: 110,
    minimumDurationMinutes: 60,
    description: 'Studio or outdoor portraits for individuals and families, with 10 fully edited images included.',
    calLink: calLinks.portrait,
    locationRequired: false,
  },
  {
    id: 'event',
    name: 'Events',
    rate: 125,
    minimumDurationMinutes: 60,
    description: 'Discreet, story-led coverage with every final usable image professionally edited and included.',
    calLink: calLinks.event,
    locationRequired: true,
  },
  {
    id: 'wedding',
    name: 'Weddings',
    rate: 130,
    minimumDurationMinutes: 60,
    description: 'Thoughtful coverage of the moments, people, and atmosphere that make the day yours.',
    calLink: calLinks.wedding,
    locationRequired: true,
  },
  {
    id: 'engagement',
    name: 'Engagements',
    rate: 125,
    minimumDurationMinutes: 60,
    description: 'A relaxed, story-led session for the two of you, wherever it feels natural.',
    calLink: calLinks.engagement,
    locationRequired: true,
  },
];

export function isPhotographyServiceId(value: string | null | undefined): value is PhotographyServiceId {
  return photographyServices.some((service) => service.id === value);
}

export function getPhotographyServiceId(value: string | null | undefined): PhotographyServiceId {
  return isPhotographyServiceId(value) ? value : 'portrait';
}

export function getPhotographyService(id: PhotographyServiceId | string | null | undefined) {
  return photographyServices.find((service) => service.id === id) ?? photographyServices[0];
}
