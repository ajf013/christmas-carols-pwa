import React, { useState, useEffect, useMemo, useCallback } from 'react';
import rawSongs from './data/songs.json';
import { Song, ViewMode } from './types';
import { Navbar } from './components/Navbar';
import { SongList } from './components/SongList';
import { SongViewer } from './components/SongViewer';
import { SplashScreen } from './components/SplashScreen';
import { PrivacyPage } from './components/PrivacyPage';
import { TermsPage } from './components/TermsPage';
import { NotFoundPage } from './components/NotFoundPage';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { runViewTransition } from './utils/transitions';
import { initAnalytics, trackPageView, trackEvent } from './utils/analytics';

const songs: Song[] = rawSongs as Song[];

type AppRoute =
  | { view: 'home' }
  | { view: 'song'; song: Song }
  | { view: 'privacy' }
  | { view: 'terms' }
  | { view: 'not-found' };

function parseLocationRoute(pathname: string, hash: string): AppRoute {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';

  // Legacy hash URL support (#song-1)
  if ((cleanPath === '/' || cleanPath === '/index.html') && hash.startsWith('#song-')) {
    const id = Number(hash.replace('#song-', ''));
    const found = songs.find((s) => s.id === id);
    return found ? { view: 'song', song: found } : { view: 'not-found' };
  }

  if (cleanPath === '/' || cleanPath === '/index.html') {
    return { view: 'home' };
  }
  if (cleanPath === '/privacy') {
    return { view: 'privacy' };
  }
  if (cleanPath === '/terms') {
    return { view: 'terms' };
  }

  const songMatch = cleanPath.match(/^\/song\/(\d+)$/);
  if (songMatch) {
    const id = Number(songMatch[1]);
    const found = songs.find((s) => s.id === id);
    return found ? { view: 'song', song: found } : { view: 'not-found' };
  }

  return { view: 'not-found' };
}

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('carols_splash_shown');
    } catch {
      return true;
    }
  });

  const [route, setRoute] = useState<AppRoute>(() =>
    parseLocationRoute(window.location.pathname, window.location.hash)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const [showConsent, setShowConsent] = useState<boolean>(() => {
    try {
      return !localStorage.getItem('carol_cookie_consent');
    } catch {
      return false;
    }
  });

  // Persistent user preferences in localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('carol_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('carol_font_size');
      return saved ? Number(saved) : 20;
    } catch {
      return 20;
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('carol_view_mode');
      return (saved as ViewMode) || 'both';
    } catch {
      return 'both';
    }
  });

  const [lastSongId, setLastSongId] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('carol_last_song_id');
      return saved ? Number(saved) : null;
    } catch {
      return null;
    }
  });

  const lastSong = useMemo(
    () => (lastSongId ? songs.find((s) => s.id === lastSongId) || null : null),
    [lastSongId]
  );

  const handleDismissSplash = useCallback(() => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('carols_splash_shown', 'true');
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Initialize cookieless analytics when online & consented
  useEffect(() => {
    initAnalytics();
  }, []);

  // Update document title & track view on route change
  useEffect(() => {
    let title = 'Christmas Carols Lyrics — Tamil & English Offline Songbook';
    let path = '/';

    if (route.view === 'song') {
      title = `#${route.song.id} ${route.song.titleEnglish} — Christmas Carols`;
      path = `/song/${route.song.id}`;
    } else if (route.view === 'privacy') {
      title = 'Privacy Policy — Christmas Carols';
      path = '/privacy';
    } else if (route.view === 'terms') {
      title = 'Terms & Conditions — Christmas Carols';
      path = '/terms';
    } else if (route.view === 'not-found') {
      title = '404 Page Not Found — Christmas Carols';
      path = window.location.pathname;
    }

    document.title = title;
    trackPageView(path, title);
  }, [route]);

  // PWA Install Prompt Handler
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      trackEvent('pwa_installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        trackEvent('pwa_install_accepted');
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install on iPhone:\n1. Tap the Share button in Safari (box with arrow)\n2. Tap "Add to Home Screen"\n\nOn Android: Tap the 3 dots in Chrome and select "Install app".'
      );
    }
  };

  // Browser back/forward handling with Barba-style transition
  useEffect(() => {
    const handlePopState = () => {
      runViewTransition(() => {
        setRoute(parseLocationRoute(window.location.pathname, window.location.hash));
      });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = useCallback((path: string, nextRoute: AppRoute) => {
    runViewTransition(() => {
      setRoute(nextRoute);
      if (window.location.pathname !== path) {
        window.history.pushState({}, '', path);
      }
      window.scrollTo({ top: 0 });
    });
  }, []);

  const handleSelectSong = useCallback(
    (song: Song) => {
      setLastSongId(song.id);
      try {
        localStorage.setItem('carol_last_song_id', String(song.id));
      } catch {
        // Ignore storage errors
      }
      navigateTo(`/song/${song.id}`, { view: 'song', song });
    },
    [navigateTo]
  );

  const handleBackHome = useCallback(() => {
    navigateTo('/', { view: 'home' });
  }, [navigateTo]);

  // Toggle favorite
  const handleToggleFavorite = useCallback((eOrId: React.MouseEvent | number, maybeId?: number) => {
    const id = typeof eOrId === 'number' ? eOrId : maybeId!;
    if (typeof eOrId !== 'number') {
      eOrId.stopPropagation();
    }
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('carol_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  // Update Font size
  const handleChangeFontSize = useCallback((delta: number) => {
    setFontSize((prev) => {
      const next = Math.min(30, Math.max(14, prev + delta));
      localStorage.setItem('carol_font_size', String(next));
      return next;
    });
  }, []);

  // Update View Mode
  const handleChangeViewMode = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem('carol_view_mode', mode);
  }, []);

  // Cookie / storage consent handlers
  const handleAcceptAllConsent = useCallback(() => {
    try {
      localStorage.setItem('carol_cookie_consent', 'all');
    } catch {
      // Ignore storage errors
    }
    setShowConsent(false);
    initAnalytics();
  }, []);

  const handleEssentialOnlyConsent = useCallback(() => {
    try {
      localStorage.setItem('carol_cookie_consent', 'essential');
    } catch {
      // Ignore storage errors
    }
    setShowConsent(false);
  }, []);

  // Filtered songs
  const filteredSongs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return songs.filter((song) => {
      if (showFavoritesOnly && !favorites.includes(song.id)) {
        return false;
      }

      if (!q) return true;

      const matchesId = song.id.toString() === q || `#${song.id}` === q;
      const matchesTamilTitle = song.titleTamil.toLowerCase().includes(q);
      const matchesEnglishTitle = song.titleEnglish.toLowerCase().includes(q);

      const matchesLyrics = song.sections.some((sec) =>
        sec.lines.some(
          (line) =>
            line.tamil.toLowerCase().includes(q) ||
            line.english.toLowerCase().includes(q)
        )
      );

      return matchesId || matchesTamilTitle || matchesEnglishTitle || matchesLyrics;
    });
  }, [searchQuery, showFavoritesOnly, favorites]);

  const selectedSong = route.view === 'song' ? route.song : null;

  // Next and Prev navigation in SongViewer
  const currentSongIndex = useMemo(() => {
    if (!selectedSong) return -1;
    return songs.findIndex((s) => s.id === selectedSong.id);
  }, [selectedSong]);

  const handleNextSong = useMemo(() => {
    if (currentSongIndex < 0 || currentSongIndex >= songs.length - 1) return undefined;
    const nextSong = songs[currentSongIndex + 1];
    return () => handleSelectSong(nextSong);
  }, [currentSongIndex, handleSelectSong]);

  const handlePrevSong = useMemo(() => {
    if (currentSongIndex <= 0) return undefined;
    const prevSong = songs[currentSongIndex - 1];
    return () => handleSelectSong(prevSong);
  }, [currentSongIndex, handleSelectSong]);

  return (
    <div className="min-h-screen bg-[#07090F] candlelight-glow text-slate-100 flex flex-col font-['Mukta_Malar',system-ui,sans-serif]">
      {showSplash && <SplashScreen onDismiss={handleDismissSplash} />}

      {route.view === 'song' && (
        <SongViewer
          song={route.song}
          onBack={handleBackHome}
          onNextSong={handleNextSong}
          onPrevSong={handlePrevSong}
          isFavorite={favorites.includes(route.song.id)}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
          fontSize={fontSize}
          onChangeFontSize={handleChangeFontSize}
          viewMode={viewMode}
          onChangeViewMode={handleChangeViewMode}
        />
      )}

      {route.view !== 'song' && (
        <>
          <Navbar
            onShowFavorites={() => {
              if (route.view !== 'home') {
                handleBackHome();
              }
              setShowFavoritesOnly((prev) => !prev);
            }}
            showFavoritesOnly={showFavoritesOnly}
            favoritesCount={favorites.length}
            onInstallClick={handleInstallClick}
            isInstalled={isInstalled}
          />

          {route.view === 'home' && (
            <SongList
              songs={filteredSongs}
              allSongs={songs}
              lastSong={lastSong}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectSong={handleSelectSong}
              showFavoritesOnly={showFavoritesOnly}
              onResetFilters={() => {
                setSearchQuery('');
                setShowFavoritesOnly(false);
              }}
            />
          )}

          {route.view === 'privacy' && <PrivacyPage onBack={handleBackHome} />}
          {route.view === 'terms' && <TermsPage onBack={handleBackHome} />}
          {route.view === 'not-found' && <NotFoundPage onReturnHome={handleBackHome} />}

          <Footer
            onNavigate={(path) =>
              navigateTo(path, path === '/privacy' ? { view: 'privacy' } : { view: 'terms' })
            }
            onOpenConsent={() => setShowConsent(true)}
          />
        </>
      )}

      <CookieConsent
        isOpen={showConsent}
        onAcceptAll={handleAcceptAllConsent}
        onEssentialOnly={handleEssentialOnlyConsent}
        onOpenPrivacy={() => {
          setShowConsent(false);
          navigateTo('/privacy', { view: 'privacy' });
        }}
      />
    </div>
  );
}

export default App;
