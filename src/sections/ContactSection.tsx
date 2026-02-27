import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, MapPin, Instagram, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

gsap.registerPlugin(ScrollTrigger);

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sessionType: '',
    message: '',
  });

  useEffect(() => {
    if (!sectionRef.current) return;

    const elements = sectionRef.current.querySelectorAll('.animate-in');
    
    const triggers: ScrollTrigger[] = [];
    
    elements.forEach((el, index) => {
      const tl = gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          delay: index * 0.1,
        }
      );
      
      if (tl.scrollTrigger) {
        triggers.push(tl.scrollTrigger);
      }
    });

    return () => {
      triggers.forEach(trigger => trigger.kill());
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/form-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setIsSubmitted(true);
      setFormData({ name: '', email: '', sessionType: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full min-h-screen bg-black py-24 md:py-32"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-black pointer-events-none" />

      <div className="relative w-full px-6 md:px-12 lg:px-20">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-24">
          <span className="animate-in text-xs tracking-[0.3em] uppercase text-white/50 block mb-4">
            Get in Touch
          </span>
          <h2 className="animate-in text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-tight">
            Contact
          </h2>
          <p className="animate-in mt-6 text-white/60 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Ready to create something beautiful together? We'd love to hear from you. 
            Reach out and let's discuss your vision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="animate-in space-y-10">
            <div>
              <h3 className="text-xl font-light text-white mb-6">Let's Connect</h3>
              <p className="text-white/60 font-light leading-relaxed">
                Whether you have a specific project in mind or just want to explore 
                possibilities, we're here to help. Drop us a message and we'll get 
                back to you within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <a
                href="mailto:hello@finuestudio.com"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail size={20} className="text-white/70" />
                </div>
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-1">
                    Email
                  </span>
                  <span className="text-white group-hover:text-white/80 transition-colors">
                    hello@finuestudio.com
                  </span>
                </div>
              </a>

              <a
                href="tel:+441234567890"
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone size={20} className="text-white/70" />
                </div>
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-1">
                    Phone
                  </span>
                  <span className="text-white group-hover:text-white/80 transition-colors">
                    +44 123 456 7890
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
                  <MapPin size={20} className="text-white/70" />
                </div>
                <div>
                  <span className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-1">
                    Studio
                  </span>
                  <span className="text-white">
                    London, United Kingdom
                  </span>
                </div>
              </div>
            </div>

            {/* Social */}
            <div>
              <span className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-4">
                Follow Us
              </span>
              <a
                href="https://instagram.com/finuestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <Instagram size={24} />
                <span>@finuestudio</span>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-in">
            {isSubmitted ? (
              <div className="glass-card rounded-2xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-light text-white mb-4">
                  Message Sent!
                </h3>
                <p className="text-white/60">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="glass-card rounded-2xl p-8 md:p-10 space-y-6"
              >
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-2">
                    Session Type
                  </label>
                  <Input
                    type="text"
                    name="sessionType"
                    value={formData.sessionType}
                    onChange={handleChange}
                    placeholder="e.g., Portrait, Family, Corporate"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30"
                  />
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-white/50 block mb-2">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your vision..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/30 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 bg-white text-black hover:bg-white/90 rounded-lg text-sm tracking-[0.15em] uppercase font-medium transition-all duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
