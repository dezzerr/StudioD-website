import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { BASE_URL, SEO } from '@/components/SEO';
import discovery from '@/data/discovery.json';

export function AreasPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Photography Service Areas"
        description="Studio Derrick is based in Stoke-on-Trent for local portrait and family sessions, and travels across the Midlands, Northern England and beyond for events."
        path="/areas"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Studio Derrick photography service areas',
          url: `${BASE_URL}/areas`,
          description: 'Stoke-on-Trent based photography across Staffordshire, the Midlands and Northern England, with travel for events.',
        }}
      />
      <main className="min-h-screen bg-black pt-32 text-white md:pt-40">
        <div className="mx-auto max-w-6xl px-6 pb-24 md:px-12 lg:px-20">
          <p className="accent-kicker text-xs uppercase tracking-[0.3em]">Where we work</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-light tracking-tight md:text-6xl">Based in Stoke-on-Trent. Ready to travel for your event.</h1>
          <p className="mt-8 max-w-3xl text-lg font-light leading-relaxed text-white/70">
            Portraits, headshots and family sessions are arranged locally across Staffordshire and nearby areas. For events, Studio Derrick covers the Midlands, Northern England and other UK locations by arrangement.
          </p>

          <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-2">
            <section>
              <h2 className="text-2xl font-light">Around our home base</h2>
              <p className="mt-5 leading-relaxed text-white/65">Stoke-on-Trent, Stafford, Stone, Kidsgrove, Alsager, Crewe, Nantwich and surrounding parts of Staffordshire and Cheshire.</p>
            </section>
            <section>
              <h2 className="text-2xl font-light">Events further afield</h2>
              <p className="mt-5 leading-relaxed text-white/65">Manchester, Liverpool, Birmingham, Nottingham, Sheffield, Leeds, Northampton, Bristol and London. Other locations are welcome; send the date and venue to discuss travel.</p>
            </section>
          </div>

          <section className="mt-20">
            <p className="accent-kicker text-xs uppercase tracking-[0.3em]">Explore by need</p>
            <h2 className="mt-4 text-3xl font-light md:text-4xl">Find the right starting point</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {discovery.pages.map(page => (
                <Link key={page.path} to={page.path} className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  <span className="text-xs uppercase tracking-[0.2em] text-accent-strong">{page.eyebrow}</span>
                  <h3 className="mt-3 text-xl font-light text-white group-hover:text-accent-strong">{page.heading}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{page.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <p className="mt-14 text-sm leading-relaxed text-white/65">
            Planning somewhere else? <Link to="/contact" className="text-accent-strong underline underline-offset-4">Tell us the location and date</Link> and we will review the details.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
