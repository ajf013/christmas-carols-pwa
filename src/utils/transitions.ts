import { flushSync } from 'react-dom';

/**
 * Barba-inspired fluid transition wrapper using the native View Transitions API
 * with graceful fallback for browsers without support or reduced-motion preference.
 */
export function runViewTransition(updateState: () => void): void {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> };
  };

  if (!prefersReduced && typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(() => {
      flushSync(() => {
        updateState();
      });
    });
  } else {
    updateState();
  }
}
