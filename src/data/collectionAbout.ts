import type { PhotographyServiceId } from '@/types';

export interface CollectionAbout {
  headline: string;
  seoDescription: string;
  paragraphs: string[];
  highlights: { label: string; description: string }[];
  bookingCta: {
    headline: string;
    buttonLabel: string;
    serviceId: PhotographyServiceId;
  };
}

export const collectionAbout: Record<string, CollectionAbout> = {
  'studio-portraits': {
    headline: 'Portraits That Feel Like You',
    seoDescription: 'Portrait photography in London with indoor studio or outdoor sessions. Includes 10 fully edited images, with additional photographs available to purchase.',
    paragraphs: [
      'A portrait should feel like more than a record of how you looked on the day. It should hold your confidence, character and the small expressions that make you recognisably you. Whether you need a polished professional image, a creative portrait or simply want to mark this chapter of your life, we shape the session around the story you want the photographs to tell.',
      'Choose an indoor studio session for privacy, controlled lighting and a clean, timeless finish. Prefer something more natural and full of movement? An outdoor session uses the light, colour and character of a location you love to create images that feel relaxed and alive. Outdoor sessions are weather permitting, and we will agree a backup plan if the forecast changes.',
      'You do not need to know how to pose. With over 12 years and 500+ sessions of experience, we guide you through wardrobe, movement and expression so you can settle in and enjoy the process. Every portrait session includes your choice of 10 fully edited images, with the option to purchase additional photographs after you view your gallery.',
    ],
    highlights: [
      { label: 'Studio or Outdoor', description: 'Controlled studio polish or natural, location-led storytelling' },
      { label: 'Guidance Throughout', description: 'Clear direction for wardrobe, posing, movement and expression' },
      { label: '10 Edited Images Included', description: 'Choose your favourites, with additional images available to purchase' },
      { label: 'Made Around You', description: 'From professional headshots to creative personal portraits' },
    ],
    bookingCta: {
      headline: 'Let\'s create portraits that feel like you',
      buttonLabel: 'Book a portrait session',
      serviceId: 'portrait',
    },
  },
  'family-sessions': {
    headline: 'The Way Your Family Feels Right Now',
    seoDescription: 'Relaxed family portrait sessions in London, indoors or outdoors. Includes 10 fully edited images, with additional photographs available to purchase.',
    paragraphs: [
      'Family photographs become more valuable with time because they bring back the details that are easy to miss in the middle of a busy week: the way your child reaches for your hand, the laugh everyone recognises and the closeness you share. Our family sessions make space for those moments, so you leave with photographs that feel warm, natural and unmistakably yours.',
      'Choose the studio for a calm, private setting with consistent lighting and a timeless finish, or head outdoors for natural light, open space and room for children to move and play. Outdoor sessions are weather permitting, and we will agree a backup plan if the forecast changes.',
      'We keep the experience relaxed and offer gentle direction when you need it, without forcing everyone into stiff poses. Every family session includes your choice of 10 fully edited images. Once you have seen the gallery, you can purchase additional photographs if there are more moments you want to keep.',
    ],
    highlights: [
      { label: 'Studio or Outdoor', description: 'Choose the setting that best suits your family' },
      { label: 'Relaxed and Child-Friendly', description: 'Patient sessions with room for children to be themselves' },
      { label: '10 Edited Images Included', description: 'Select your favourites, with additional images available to purchase' },
      { label: 'Real Connection', description: 'Warm photographs built around genuine interaction' },
    ],
    bookingCta: {
      headline: 'Plan your family portrait session',
      buttonLabel: 'Book a family session',
      serviceId: 'portrait',
    },
  },
  'event-photography': {
    headline: 'Event Coverage That Tells the Full Story',
    seoDescription: 'Story-led event photography in London with every final usable image edited and included. Galleries typically contain approximately 70 to 800 photographs.',
    paragraphs: [
      'Your event is made up of more than the moments on the running order. It is the anticipation before the doors open, the people seeing one another, the laughter between speeches and the atmosphere you worked hard to create. We photograph the full story, from the key moments you expect to the small exchanges you may not see while the day is unfolding.',
      'We work calmly and discreetly, moving through private celebrations, corporate functions and larger gatherings without interrupting the experience. You can stay present with your guests while we document the people, details and energy that made the occasion yours.',
      'Every final usable image captured during your coverage is professionally edited and included in your gallery. The number of photographs depends on the length and pace of the event, but clients can typically expect approximately 70 to 800 images. There is no separate image selection and no additional charge to unlock the rest of the finished gallery.',
    ],
    highlights: [
      { label: 'All Final Images Included', description: 'Every usable photograph is professionally edited and delivered' },
      { label: 'Approximately 70 to 800 Images', description: 'Gallery size reflects the length and pace of the event' },
      { label: 'Discreet Storytelling', description: 'Natural coverage without interrupting the occasion' },
      { label: 'Private and Commercial Events', description: 'From intimate gatherings to large functions' },
    ],
    bookingCta: {
      headline: 'Tell us about your event',
      buttonLabel: 'Book event photography',
      serviceId: 'event',
    },
  },
};
