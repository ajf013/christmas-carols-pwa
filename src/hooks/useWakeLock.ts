import { useState, useEffect, useCallback } from 'react';

export function useWakeLock() {
  const [isLocked, setIsLocked] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [wakeLockSentinel, setWakeLockSentinel] = useState<any>(null);

  useEffect(() => {
    setIsSupported('wakeLock' in navigator);
  }, []);

  const requestLock = useCallback(async () => {
    if (!('wakeLock' in navigator)) return false;
    try {
      const sentinel = await (navigator as any).wakeLock.request('screen');
      setWakeLockSentinel(sentinel);
      setIsLocked(true);

      sentinel.addEventListener('release', () => {
        setIsLocked(false);
        setWakeLockSentinel(null);
      });
      return true;
    } catch (err) {
      console.warn('Wake Lock request failed:', err);
      setIsLocked(false);
      return false;
    }
  }, []);

  const releaseLock = useCallback(() => {
    if (wakeLockSentinel) {
      wakeLockSentinel.release().catch(console.warn);
      setWakeLockSentinel(null);
      setIsLocked(false);
    }
  }, [wakeLockSentinel]);

  // Re-acquire lock on visibility change (e.g. user unlocks phone or switches back)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isLocked && !wakeLockSentinel) {
        await requestLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isLocked, wakeLockSentinel, requestLock]);

  return { isLocked, isSupported, requestLock, releaseLock };
}
