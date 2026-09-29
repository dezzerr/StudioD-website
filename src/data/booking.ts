import {
  getPhotographyService,
  getPhotographyServiceId,
  photographyServices,
} from '@/data/services';
import type { PhotographyServiceId } from '@/types';

export type BookingEventId = PhotographyServiceId;

export const BOOKING_QUESTION_IDS = [
  'phone',
  'booking_purpose',
  'subject_relationship',
  'location',
  'event_date',
  'event_start_time',
  'event_end_time',
  'guest_count',
  'coverage_hours',
  'booking_notes',
  'privacy_consent',
  'marketing_opt_in',
] as const;

export type BookingQuestionId = (typeof BOOKING_QUESTION_IDS)[number];

export const bookingEventOptions = photographyServices;

export function getBookingEventOption(id: BookingEventId | string | null | undefined) {
  return getPhotographyService(id);
}

export { getPhotographyServiceId };
