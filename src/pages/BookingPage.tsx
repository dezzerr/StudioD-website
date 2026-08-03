import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle, Clock3, MapPin, ShieldCheck } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { CalEmbed } from '@/components/booking/CalEmbed';
import { Footer } from '@/components/Footer';
import { SEO } from '@/components/SEO';
import {
  getPhotographyService,
  getPhotographyServiceId,
  photographyServices,
} from '@/data/services';
import type { PhotographyServiceId } from '@/types';

export function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedServiceId = useMemo(
    () => getPhotographyServiceId(new URLSearchParams(location.search).get('service')),
    [location.search],
  );
  const [requestReceivedFor, setRequestReceivedFor] = useState<PhotographyServiceId | null>(null);
  const selectedServiceId = requestedServiceId;
  const requestReceived = requestReceivedFor === selectedServiceId;
  const selectedService = useMemo(() => getPhotographyService(selectedServiceId), [selectedServiceId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBookingRequested = useCallback(() => {
    setRequestReceivedFor(selectedServiceId);
  }, [selectedServiceId]);

  const handleServiceChange = (serviceId: PhotographyServiceId) => {
    navigate(`/booking?service=${serviceId}`, { replace: true });
  };

  return (
    <>
      <SEO
        title="Booking"
        description="Request a portrait, event, wedding, or engagement photography booking with StudioD. Rates start at £110 per hour with a 60-minute minimum."
        path="/booking"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'OfferCatalog',
          name: 'Book StudioD Photography',
          itemListElement: photographyServices.map((service) => ({
            '@type': 'Offer',
            name: `${service.name} Photography`,
            price: service.rate,
            priceCurrency: 'GBP',
            description: `${service.rate} per hour, with a ${service.minimumDurationMinutes}-minute minimum.`,
          })),
        }}
      />

      <main className="relative min-h-screen bg-black pt-32 md:pt-40">
        <section className="relative w-full overflow-hidden pb-20 md:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_38%),linear-gradient(to_bottom,#000,#0a0a0a_55%,#000)]" />

          <div className="relative mx-auto w-full max-w-[1440px] px-6 md:px-12 lg:px-20">
            <div className="mx-auto max-w-3xl text-center">
              <span className="block text-xs uppercase tracking-[0.3em] text-white/50">
                Reserve your time
              </span>
              <h1 className="mt-4 text-4xl font-light tracking-tight text-white md:text-6xl lg:text-7xl">
                Let&apos;s make something worth remembering.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base font-light leading-relaxed text-white/60 md:text-lg">
                Choose the kind of session you have in mind, then request a time that works for you.
                Every request is reviewed personally before it is confirmed.
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-6xl gap-10 lg:mt-20 lg:grid-cols-[minmax(240px,0.72fr)_minmax(0,1.28fr)] lg:items-start lg:gap-16">
              <aside className="space-y-8 lg:sticky lg:top-28">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/40">01 / Choose a service</p>
                  <h2 className="mt-3 text-2xl font-light text-white">Start with what you need.</h2>
                </div>

                <div className="space-y-3" role="radiogroup" aria-label="Photography service">
                  {photographyServices.map((service) => {
                    const isSelected = service.id === selectedServiceId;

                    return (
                      <button
                        key={service.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => handleServiceChange(service.id)}
                        className={`group w-full rounded-xl border p-5 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                          isSelected
                            ? 'border-white/40 bg-white text-black'
                            : 'border-white/10 bg-white/[0.03] text-white hover:border-white/25 hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-current opacity-50">
                              {service.rate} per hour
                            </span>
                            <span className="mt-2 block text-base font-light">{service.name} Photography</span>
                          </div>
                          <ArrowRight
                            size={17}
                            className={`mt-1 shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${
                              isSelected ? 'text-black/70' : 'text-white/50'
                            }`}
                            aria-hidden="true"
                          />
                        </div>
                        <span className="mt-4 block text-xs uppercase tracking-[0.16em] opacity-55">
                          60-minute minimum
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-5 border-t border-white/10 pt-7">
                  <div className="flex gap-3">
                    <Clock3 size={18} className="mt-0.5 shrink-0 text-white/50" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-white/55">
                      Your selected time is held as a review request while StudioD checks the details.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-white/50" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-white/55">
                      Nothing is treated as confirmed until you receive an approval email.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <MapPin size={18} className="mt-0.5 shrink-0 text-white/50" aria-hidden="true" />
                    <p className="text-sm leading-relaxed text-white/55">
                      Studio and London on-location sessions are available. Location details are requested where they are needed for the service.
                    </p>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <div className="mb-6 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/40">02 / Choose a time</p>
                    <h2 className="mt-2 text-2xl font-light text-white">{selectedService.name} Photography</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/40">
                    <CalendarDays size={15} aria-hidden="true" />
                    £{selectedService.rate} / hour · Europe / London
                  </div>
                </div>

                {requestReceived ? (
                  <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-16 text-center md:px-14">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10">
                      <CheckCircle size={30} className="text-white" aria-hidden="true" />
                    </div>
                    <p className="mt-7 text-xs uppercase tracking-[0.3em] text-white/45">Request received</p>
                    <h2 className="mt-4 text-3xl font-light text-white md:text-4xl">We&apos;ll be in touch shortly.</h2>
                    <p className="mt-5 max-w-lg text-base font-light leading-relaxed text-white/60">
                      Your {selectedService.name.toLowerCase()} photography request is now with StudioD. We&apos;ll review the details and email you when the time is approved. Please check your inbox for the request summary.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRequestReceivedFor(null)}
                      className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      Make another request
                    </button>
                  </div>
                ) : selectedService.calLink ? (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-2 md:p-4">
                    <CalEmbed
                      key={selectedService.calLink}
                      calLink={selectedService.calLink}
                      onBookingRequested={handleBookingRequested}
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.025] px-6 py-16 text-center md:px-14">
                    <CalendarDays size={30} className="text-white/40" aria-hidden="true" />
                    <h2 className="mt-6 text-2xl font-light text-white">The calendar is almost ready.</h2>
                    <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
                      StudioD still needs to connect this booking type to Cal.com. Add the public Cal.com booking URL for this option, then the live availability will appear here.
                    </p>
                    <Link
                      to="/contact"
                      className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:border-white/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      Contact StudioD
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  </div>
                )}

                {!requestReceived && selectedService.calLink && (
                  <p className="mt-4 text-xs leading-relaxed text-white/40">
                    Select a one-hour starting slot. If you need longer coverage, include the requested number of hours in the Cal.com form; StudioD will review and confirm the final duration manually.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
