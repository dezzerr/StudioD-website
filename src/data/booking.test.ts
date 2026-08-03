import { describe, expect, it } from 'vitest';
import {
  BOOKING_QUESTION_IDS,
  bookingEventOptions,
  getBookingEventOption,
  getPhotographyServiceId,
} from '@/data/booking';

describe('booking configuration', () => {
  it('includes the approved booking options and durations', () => {
    expect(bookingEventOptions.map((option) => option.id)).toEqual([
      'portrait',
      'event',
      'wedding',
      'engagement',
    ]);
    expect(bookingEventOptions.map((option) => option.rate)).toEqual([110, 125, 130, 125]);
    expect(bookingEventOptions.every((option) => option.minimumDurationMinutes === 60)).toBe(true);
  });

  it('uses stable CRM-ready booking question identifiers', () => {
    expect(BOOKING_QUESTION_IDS).toContain('booking_purpose');
    expect(BOOKING_QUESTION_IDS).toContain('event_start_time');
    expect(BOOKING_QUESTION_IDS).toContain('coverage_hours');
    expect(BOOKING_QUESTION_IDS).toContain('privacy_consent');
  });

  it('returns the selected option and falls back to Portrait', () => {
    expect(getBookingEventOption('wedding')?.locationRequired).toBe(true);
    expect(getBookingEventOption('portrait')?.locationRequired).toBe(false);
    expect(getBookingEventOption('missing')?.id).toBe('portrait');
  });

  it('normalizes booking query values to a valid service', () => {
    expect(getPhotographyServiceId('engagement')).toBe('engagement');
    expect(getPhotographyServiceId(null)).toBe('portrait');
    expect(getPhotographyServiceId('signature')).toBe('portrait');
  });
});
