import type { PhotographyService, PhotographyServiceId } from '@/types';

const calLinks: Record<PhotographyServiceId, string> = {
  portrait: import.meta.env.VITE_CAL_EVENT_PORTRAIT_URL?.trim() ?? '',
  event: import.meta.env.VITE_CAL_EVENT_EVENT_URL?.trim() ?? '',
  wedding: import.meta.env.VITE_CAL_EVENT_WEDDING_URL?.trim() ?? '',
  engagement: import.meta.env.VITE_CAL_EVENT_ENGAGEMENT_URL?.trim() ?? '',
};

export const photographyServices: PhotographyService[] = [
  {
    id: 'portrait',
    name: 'Portrait',
    rate: 110,
    minimumDurationMinutes: 60,
    description: 'Intentional portraits with room for direction, expression, and a considered final frame.',
    calLink: calLinks.portrait,
    locationRequired: false,
  },
  {
    id: 'event',
    name: 'Events',
    rate: 125,
    minimumDurationMinutes: 60,
    description: 'Candid, editorial coverage for private celebrations and meaningful gatherings.',
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
