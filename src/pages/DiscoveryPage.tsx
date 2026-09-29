import { useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { QuestionList } from '@/components/QuestionList';
import { BASE_URL, SEO } from '@/components/SEO';
import discovery from '@/data/discovery.json';

export function DiscoveryPage() {
  const { pathname } = useLocation();
  const page = discovery.pages.find(item => item.path === pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!page) return <Navigate to="/" replace />;

  return (
    <>
      <SEO
        title={page.title}
        description={page.description}
        path={page.path}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: page.title,
          serviceType: page.serviceType,
          areaServed: page.areaServed,
          description: page.description,
          url: `${BASE_URL}${page.path}`,
          provider: { '@type': 'LocalBusiness', name: 'Studio Derrick', url: BASE_URL },
        }}
      />
      <main className="min-h-screen bg-black pt-32 text-white md:pt-40">
        <div className="mx-auto max-w-7xl px-6 pb-24 md:px-12 lg:px-20">
          <div className="max-w-4xl border-b border-white/10 pb-16 md:pb-20">
            <p className="accent-kicker text-xs uppercase tracking-[0.3em]">{page.eyebrow}</p>
            <h1 className="mt-5 text-4xl font-light tracking-tight md:text-6xl">{page.heading}</h1>
            <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-white/70 md:text-xl">{page.lead}</p>
            <Link
              to={`/booking?service=${page.bookingService}`}
              className="accent-button mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-full border px-6 text-xs font-medium uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Request a booking <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid gap-10 py-16 md:grid-cols-3 md:gap-8 md:py-24">
            {page.sections.map(section => (
              <section key={section.heading} className="border-t border-white/15 pt-6">
                <h2 className="text-2xl font-light tracking-tight md:text-3xl">{section.heading}</h2>
                <p className="mt-5 text-sm leading-relaxed text-white/65 md:text-base">{section.body}</p>
              </section>
            ))}
          </div>

          <section className="max-w-4xl border-t border-white/10 py-16 md:py-20">
            <p className="accent-kicker text-xs uppercase tracking-[0.3em]">Good to know</p>
            <h2 className="mb-8 mt-4 text-3xl font-light md:text-4xl">Questions about this service</h2>
            <QuestionList questions={page.questions} />
            <Link to="/faq" className="mt-6 inline-block text-sm text-accent-strong underline underline-offset-4">Read all frequently asked questions</Link>
          </section>

          <section className="border-t border-white/10 py-12">
            <h2 className="text-2xl font-light">Explore the work and plan your session</h2>
            <div className="mt-6 flex flex-wrap gap-4">
              {page.related.map(link => (
                <Link key={link.path} to={link.path} className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm text-white/80 transition-colors hover:border-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
