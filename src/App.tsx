import React, { useState, useEffect, useMemo, useCallback } from 'react';
import rawSongs from './data/songs.json';
import { Song, ViewMode } from './types';
import { Navbar } from './components/Navbar';
import { SongList } from './components/SongList';
import { SongViewer } from './components/SongViewer';
import { SplashScreen } from './components/SplashScreen';

const songs: Song[] = rawSongs as Song[];

export function App() {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash once per session
    try {
      return !sessionStorage.getItem('carols_splash_shown');
    } catch {
      return true;
    }
  });

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

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

  const handleDismissSplash = useCallback(() => {
    setShowSplash(false);
    try {
      sessionStorage.setItem('carols_splash_shown', 'true');
    } catch {
      // Ignore storage errors
    }
  }, []);

  // PWA Install Prompt Handler
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
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
      }
      setDeferredPrompt(null);
    } else {
      alert(
        'To install on iPhone:\n1. Tap the Share button in Safari (box with arrow)\n2. Tap "Add to Home Screen"\n\nOn Android: Tap the 3 dots in Chrome and select "Install app".'
      );
    }
  };

  // Browser back-button handling
  useEffect(() => {
    const handlePopState = () => {
      setSelectedSong(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectSong = useCallback((song: Song) => {
    setSelectedSong(song);
    window.history.pushState({ songId: song.id }, '', `#song-${song.id}`);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedSong(null);
    if (window.location.hash) {
      window.history.back();
    }
  }, []);

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

  // Filtered songs
  const filteredSongs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return songs.filter((song) => {
      // Favorite filter
      if (showFavoritesOnly && !favorites.includes(song.id)) {
        return false;
      }

      // Search query filter (bilingual)
      if (!q) return true;

      const matchesId = song.id.toString() === q || `#${song.id}` === q;
      const matchesTamilTitle = song.titleTamil.toLowerCase().includes(q);
      const matchesEnglishTitle = song.titleEnglish.toLowerCase().includes(q);

      // Search lyrics content
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

  // Next and Prev navigation in SongViewer
  const currentSongIndex = useMemo(() => {
    if (!selectedSong) return -1;
    return songs.findIndex((s) => s.id === selectedSong.id);
  }, [selectedSong]);

  const handleNextSong = useMemo(() => {
    if (currentSongIndex < 0 || currentSongIndex >= songs.length - 1) return undefined;
    return () => setSelectedSong(songs[currentSongIndex + 1]);
  }, [currentSongIndex]);

  const handlePrevSong = useMemo(() => {
    if (currentSongIndex <= 0) return undefined;
    return () => setSelectedSong(songs[currentSongIndex - 1]);
  }, [currentSongIndex]);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col font-['Mukta_Malar',system-ui,sans-serif]">
      {showSplash && <SplashScreen onDismiss={handleDismissSplash} />}

      {selectedSong ? (
        <SongViewer
          song={selectedSong}
          onBack={handleBack}
          onNextSong={handleNextSong}
          onPrevSong={handlePrevSong}
          isFavorite={favorites.includes(selectedSong.id)}
          onToggleFavorite={(id) => handleToggleFavorite(id)}
          fontSize={fontSize}
          onChangeFontSize={handleChangeFontSize}
          viewMode={viewMode}
          onChangeViewMode={handleChangeViewMode}
        />
      ) : (
        <>
          <Navbar
            onShowFavorites={() => setShowFavoritesOnly((prev) => !prev)}
            showFavoritesOnly={showFavoritesOnly}
            favoritesCount={favorites.length}
            onInstallClick={handleInstallClick}
            isInstalled={isInstalled}
          />
          <SongList
            songs={filteredSongs}
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
        </>
      )}
    </div>
  );
}

export default App;
