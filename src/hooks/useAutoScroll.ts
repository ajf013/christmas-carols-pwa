import { useState, useEffect, useRef, useCallback } from 'react';

export function useAutoScroll(defaultSpeed = 1.0) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [speed, setSpeed] = useState(defaultSpeed); // 0.5x, 1.0x, 1.5x, 2.0x
  const scrollIntervalRef = useRef<number | null>(null);

  const stopScrolling = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
    setIsScrolling(false);
  }, []);

  const startScrolling = useCallback(() => {
    stopScrolling();
    setIsScrolling(true);

    const stepMs = 30;
    // Base speed: 1.0 = ~25px per second
    const pixelsPerStep = (speed * 25 * stepMs) / 1000;

    scrollIntervalRef.current = window.setInterval(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 5) {
        stopScrolling();
        return;
      }
      window.scrollBy({ top: pixelsPerStep, behavior: 'auto' });
    }, stepMs);
  }, [speed, stopScrolling]);

  const toggleScrolling = useCallback(() => {
    if (isScrolling) {
      stopScrolling();
    } else {
      startScrolling();
    }
  }, [isScrolling, startScrolling, stopScrolling]);

  // Clean up on unmount or speed change
  useEffect(() => {
    if (isScrolling) {
      startScrolling();
    }
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [speed]);

  return { isScrolling, speed, setSpeed, toggleScrolling, stopScrolling };
}
