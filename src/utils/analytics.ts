/**
 * Lightweight, cookieless analytics helper (Umami / Plausible compatible).
 * Gracefully no-ops offline, when unconfigured, or if analytics consent is declined.
 */

interface UmamiWindow extends Window {
  umami?: {
    track: (eventOrPayload?: string | Record<string, unknown>, data?: Record<string, unknown>) => void;
  };
}

let initialized = false;

export function initAnalytics(): void {
  if (initialized || typeof window === 'undefined' || !navigator.onLine) return;

  const websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID as string | undefined;
  const scriptSrc =
    (import.meta.env.VITE_UMAMI_SRC as string | undefined) ||
    'https://cloud.umami.is/script.js';

  if (!websiteId) return;

  try {
    const consent = localStorage.getItem('carol_cookie_consent');
    if (consent === 'essential') return;
  } catch {
    // Proceed if storage blocked
  }

  const script = document.createElement('script');
  script.defer = true;
  script.src = scriptSrc;
  script.setAttribute('data-website-id', websiteId);
  script.setAttribute('data-auto-track', 'false');
  document.head.appendChild(script);
  initialized = true;
}

export function trackPageView(path: string, title?: string): void {
  if (typeof window === 'undefined' || !navigator.onLine) return;
  const w = window as UmamiWindow;
  try {
    w.umami?.track({
      url: path,
      title: title || document.title,
    });
  } catch {
    // Safe no-op
  }
}

export function trackEvent(name: string, data?: Record<string, string | number>): void {
  if (typeof window === 'undefined' || !navigator.onLine) return;
  const w = window as UmamiWindow;
  try {
    w.umami?.track(name, data);
  } catch {
    // Safe no-op
  }
}
