import { describe, expect, it } from 'vitest';
import { collectionAbout } from '@/data/collectionAbout';
import { collections, heroGalleryImages } from '@/data/collections';

const collectionIds = ['studio-portraits', 'family-sessions', 'event-photography'] as const;

describe('collection marketing content', () => {
  it('uses Portraits as the public collection name while retaining the stable id', () => {
    const portraitCollection = collections.find(collection => collection.id === 'studio-portraits');

    expect(portraitCollection).toMatchObject({
      id: 'studio-portraits',
      title: 'Portraits',
      category: 'portrait',
    });
    expect(JSON.stringify({ collections, heroGalleryImages })).not.toContain('Studio Portraits');
  });

  it('maps each collection CTA to the approved booking service', () => {
    expect(collectionAbout['studio-portraits'].bookingCta.serviceId).toBe('portrait');
    expect(collectionAbout['family-sessions'].bookingCta.serviceId).toBe('portrait');
    expect(collectionAbout['event-photography'].bookingCta.serviceId).toBe('event');
  });

  it('states the approved image inclusions and event gallery estimate', () => {
    expect(JSON.stringify(collectionAbout['studio-portraits'])).toContain('10 fully edited images');
    expect(JSON.stringify(collectionAbout['family-sessions'])).toContain('10 fully edited images');
    expect(JSON.stringify(collectionAbout['event-photography'])).toContain('70 to 800');
    expect(JSON.stringify(collectionAbout['event-photography'])).toContain('Every final usable image');
  });

  it('contains no em dashes in the three collection entries', () => {
    collectionIds.forEach(collectionId => {
      expect(JSON.stringify(collectionAbout[collectionId])).not.toContain('—');
    });
  });
});
