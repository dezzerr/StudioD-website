import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { QuestionList } from '@/components/QuestionList';
import { SEO } from '@/components/SEO';
import discovery from '@/data/discovery.json';

export function FaqPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title="Photography FAQs"
        description="Answers about Studio Derrick photography pricing, locations, portrait and family sessions, event coverage, booking and edited images."
        path="/faq"
      />
      <main className="min-h-screen bg-black pt-32 text-white md:pt-40">
        <div className="mx-auto max-w-5xl px-6 pb-24 md:px-12 lg:px-20">
          <p className="accent-kicker text-xs uppercase tracking-[0.3em]">Before you book</p>
          <h1 className="mt-5 text-4xl font-light tracking-tight md:text-6xl">Photography questions, answered</h1>
          <p className="mt-7 max-w-3xl text-lg font-light leading-relaxed text-white/70">
            Here are the details people ask about most often. For a specific date, venue or project, tell us what you have in mind.
          </p>
          <div className="mt-14"><QuestionList questions={discovery.generalQuestions} /></div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/pricing" className="text-sm text-accent-strong underline underline-offset-4">See pricing</Link>
            <Link to="/booking" className="text-sm text-accent-strong underline underline-offset-4">Request a booking</Link>
            <Link to="/contact" className="text-sm text-accent-strong underline underline-offset-4">Contact Studio Derrick</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
