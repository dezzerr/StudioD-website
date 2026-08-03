import { useEffect, useRef, useState } from 'react';

const CAL_SCRIPT_URL = 'https://app.cal.com/embed/embed.js';

interface CalBookingEvent {
  uid?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

interface CalFunction {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns?: Record<string, CalFunction>;
  q?: unknown[][];
}

declare global {
  interface Window {
    Cal?: CalFunction;
  }
}

interface CalEmbedProps {
  calLink: string;
  onBookingRequested: (event: CalBookingEvent) => void;
}

type EmbedState = 'loading' | 'ready' | 'error';

function createCalStub() {
  if (window.Cal) return window.Cal;

  const cal = ((...args: unknown[]) => {
    const queue = (target: CalFunction, queuedArgs: unknown[]) => {
      target.q = target.q || [];
      target.q.push(queuedArgs);
    };

    if (!cal.loaded) {
      cal.ns = {};
      cal.q = [];
      cal.loaded = true;
    }

    if (args[0] === 'init' && typeof args[1] === 'string') {
      const namespace = args[1];
      const api = ((...apiArgs: unknown[]) => queue(api, apiArgs)) as CalFunction;
      api.q = api.q || [];
      cal.ns = cal.ns || {};
      cal.ns[namespace] = api;
      queue(api, args);
      queue(cal, ['initNamespace', namespace]);
      return;
    }

    queue(cal, args);
  }) as CalFunction;

  window.Cal = cal;
  return cal;
}

function loadCalScript(cal: CalFunction): Promise<CalFunction> {
  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-studiod-cal-embed="true"]',
  );

  if (existingScript?.dataset.loaded === 'true') {
    return Promise.resolve(cal);
  }

  return new Promise((resolve, reject) => {
    const script = existingScript ?? document.createElement('script');
    let settled = false;

    const finish = (callback: () => void) => {
      if (settled) return;
      settled = true;
      callback();
    };

    script.addEventListener('load', () => {
      script.dataset.loaded = 'true';
      finish(() => resolve(window.Cal ?? cal));
    });
    script.addEventListener('error', () => {
      finish(() => reject(new Error('Cal.com could not be loaded.')));
    });

    if (!existingScript) {
      script.async = true;
      script.src = CAL_SCRIPT_URL;
      script.dataset.studiodCalEmbed = 'true';
      document.head.appendChild(script);
    }
  });
}

function getCalLink(link: string) {
  const trimmedLink = link.trim();

  try {
    const url = new URL(trimmedLink);
    return url.pathname.replace(/^\/+/, '');
  } catch {
    return trimmedLink.replace(/^\/+/, '');
  }
}

function getCalNamespace(link: string) {
  return getCalLink(link).replace(/[^a-zA-Z0-9_-]/g, '-').replace(/-+/g, '-');
}

export function CalEmbed({ calLink, onBookingRequested }: CalEmbedProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const requestHandlerRef = useRef(onBookingRequested);
  const [state, setState] = useState<EmbedState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    requestHandlerRef.current = onBookingRequested;
  }, [onBookingRequested]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let isActive = true;
    mount.replaceChildren();

    const cal = createCalStub();
    const namespace = getCalNamespace(calLink);
    cal('init', namespace, { origin: 'https://cal.com' });
    const scopedCal = cal.ns?.[namespace] || cal;
    scopedCal('ui', {
          cssVarsPerTheme: {
            light: {
              'cal-brand': '#111111',
              'cal-brand-emphasis': '#2a2a2a',
              'cal-brand-text': '#ffffff',
              'cal-brand-subtle': '#eeeeee',
            },
            dark: {
              'cal-brand': '#ffffff',
              'cal-brand-emphasis': '#e5e5e5',
              'cal-brand-text': '#111111',
              'cal-brand-subtle': '#2a2a2a',
            },
          },
    });
    scopedCal('on', {
          action: 'linkReady',
          callback: () => {
            if (isActive) setState('ready');
          },
    });
    scopedCal('on', {
          action: 'linkFailed',
          callback: (event: { msg?: string }) => {
            if (!isActive) return;
            setState('error');
            setError(event?.msg || 'Cal.com could not load this booking type.');
          },
    });
    scopedCal('on', {
          action: 'bookingSuccessfulV2',
          callback: (event: CalBookingEvent) => {
            if (isActive) requestHandlerRef.current(event);
          },
    });
    scopedCal('inline', {
      elementOrSelector: mount,
      calLink: getCalLink(calLink),
      config: {
        theme: 'dark',
        layout: 'month_view',
        useSlotsViewOnSmallScreen: true,
      },
    });

    loadCalScript(cal)
      .catch((loadError: unknown) => {
        if (!isActive) return;
        setState('error');
        setError(loadError instanceof Error ? loadError.message : 'Cal.com could not be loaded.');
      });

    return () => {
      isActive = false;
      mount.replaceChildren();
    };
  }, [calLink, retryCount]);

  return (
    <div className="booking-cal-embed relative min-h-[680px]" aria-live="polite">
      {state === 'loading' && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950/90 px-5 py-4 text-sm text-white/60 backdrop-blur-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white/80" aria-hidden="true" />
          Preparing the calendar…
        </div>
      )}

      {state === 'error' && (
        <div className="absolute inset-x-0 top-0 z-10 rounded-xl border border-red-300/20 bg-red-950/40 px-5 py-4 text-sm text-red-100">
          <p className="font-medium">The booking calendar is unavailable right now.</p>
          <p className="mt-1 text-red-100/70">{error || 'Please try again shortly or contact StudioD directly.'}</p>
          <button
            type="button"
            onClick={() => {
              setState('loading');
              setError(null);
              setRetryCount((count) => count + 1);
            }}
            className="mt-4 min-h-10 rounded-full border border-red-100/30 px-4 text-xs uppercase tracking-[0.16em] text-red-50 transition-colors hover:bg-red-100/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            Try again
          </button>
        </div>
      )}

      <div ref={mountRef} className="min-h-[680px] w-full" />
    </div>
  );
}
