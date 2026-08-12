import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-white/10 py-12">
      <div className="w-full px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="text-center md:text-left">
            <span className="text-lg tracking-[0.2em] font-light text-white">
              STUDIOD
            </span>
            <p className="text-white/40 text-sm mt-2">
              Portrait Photography
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link
              to="/#collections"
              className="text-sm text-white/50 transition-colors hover:text-accent-strong"
            >
              Work
            </Link>
            <Link
              to="/pricing"
              className="text-sm text-white/50 transition-colors hover:text-accent-strong"
            >
              Pricing
            </Link>
            <Link
              to="/booking"
              className="text-sm text-white/50 transition-colors hover:text-accent-strong"
            >
              Booking
            </Link>
            <Link
              to="/about"
              className="text-sm text-white/50 transition-colors hover:text-accent-strong"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-sm text-white/50 transition-colors hover:text-accent-strong"
            >
              Contact
            </Link>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com/studiod"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/50 transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="mailto:hello@studiod.com"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/50 transition-all hover:border-accent hover:bg-accent hover:text-accent-foreground"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            {currentYear} StudioD. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-white/30 text-xs hover:text-white/50 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/30 text-xs hover:text-white/50 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
