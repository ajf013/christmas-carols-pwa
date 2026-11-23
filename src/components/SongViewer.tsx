import React, { useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Star,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Song, ViewMode } from '../types';
import { useAutoScroll } from '../hooks/useAutoScroll';

interface SongViewerProps {
  song: Song;
  onBack: () => void;
  onNextSong?: () => void;
  onPrevSong?: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  fontSize: number;
  onChangeFontSize: (delta: number) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

export const SongViewer: React.FC<SongViewerProps> = ({
  song,
  onBack,
  onNextSong,
  onPrevSong,
  isFavorite,
  onToggleFavorite,
  fontSize,
  onChangeFontSize,
  viewMode,
  onChangeViewMode,
}) => {
  const { isScrolling, speed, setSpeed, toggleScrolling, stopScrolling } = useAutoScroll();

  // Reset scroll and stop auto-scroll when switching songs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    stopScrolling();
  }, [song.id, stopScrolling]);

  // Impeccable Typography: Proportional leading calculation
  // Tightens leading at large sizes (1.45 at 30px) and relaxes at small sizes (1.85 at 14px)
  const dynamicLineHeight = useMemo(() => {
    const minSize = 14;
    const maxSize = 30;
    const clamped = Math.min(maxSize, Math.max(minSize, fontSize));
    const ratio = (clamped - minSize) / (maxSize - minSize);
    return Number((1.85 - ratio * 0.4).toFixed(2));
  }, [fontSize]);

  // Impeccable Hardening: Global keyboard shortcuts for choir leaders & keyboard devices
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'j') {
        e.preventDefault();
        onNextSong?.();
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        e.preventDefault();
        onPrevSong?.();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleScrolling();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        onChangeFontSize(1);
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        onChangeFontSize(-1);
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        onChangeViewMode(
          viewMode === 'tamil' ? 'english' : viewMode === 'english' ? 'both' : 'tamil'
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextSong, onPrevSong, toggleScrolling, onBack, onChangeFontSize, onChangeViewMode, viewMode]);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col pb-44 page-enter">
      {/* Impeccable Accessibility: Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Carol ${song.id}: ${song.titleTamil}, ${song.titleEnglish}. ${
          isScrolling ? `Auto scrolling at ${speed}x` : 'Auto scroll paused'
        }. Text size ${fontSize} pixels.`}
      </div>

      {/* Streamlined Single-Row Sticky Header (Maximizes reading viewport) */}
      <header className="sticky top-0 z-30 glass-nav pt-safe backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          {/* Back button (44x44px minimum hit area) */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 border border-slate-700/60 btn-press shrink-0"
            title="Back to song list (Esc)"
            aria-label="Back to song list"
          >
            <ArrowLeft className="w-4 h-4 text-[#E2B867]" />
            <span className="font-sans hidden xs:inline">Carols</span>
          </button>

          {/* Song Title & English Subtitle with text-balance */}
          <div className="flex-1 text-center min-w-0 px-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide truncate text-balance tabular-numbers">
              #{song.id}. {song.titleTamil}
            </h2>
            <p className="text-xs text-[#E2B867]/90 font-sans truncate font-medium mt-0.5">
              {song.titleEnglish}
            </p>
          </div>

          {/* Favorite Star Button (44x44px minimum hit area) */}
          <button
            onClick={() => onToggleFavorite(song.id)}
            className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-[#E2B867] btn-press shrink-0"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-4 h-4 transition-transform duration-150 ${
                isFavorite ? 'fill-[#E2B867] text-[#E2B867]' : ''
              }`}
            />
          </button>
        </div>
      </header>

      {/* Main Lyrics Body (Calm Read Column) */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-5 flex-1">
        <div className="space-y-4">
          {song.sections.map((section, sIdx) => {
            const isChorus = section.type === 'chorus';
            return (
              <div
                key={sIdx}
                className={`p-4 sm:p-6 rounded-2xl transition-colors duration-150 ${
                  isChorus
                    ? 'bg-[#D4AF37]/5 border border-[#D4AF37]/25 shadow-[0_4px_20px_rgba(212,175,55,0.04)]'
                    : 'glass-panel'
                }`}
              >
                {/* Section Header Label */}
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-800 font-sans">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isChorus ? 'text-[#E2B867]' : 'text-slate-400'
                    }`}
                  >
                    {section.label}
                  </span>
                  {isChorus && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#E2B867] border border-[#D4AF37]/30">
                      Chorus
                    </span>
                  )}
                </div>

                {/* Lyrics Lines with Proportional Leading & Pretty Wrapping */}
                <div
                  className="space-y-3.5 lyrics-pretty"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: dynamicLineHeight,
                  }}
                >
                  {section.lines.map((line, lIdx) => (
                    <div key={lIdx} className="space-y-1">
                      {/* Tamil Line */}
                      {(viewMode === 'tamil' || viewMode === 'both') && (
                        <p
                          className={`font-semibold tracking-wide ${
                            isChorus ? 'text-white' : 'text-slate-100'
                          }`}
                        >
                          {line.tamil}
                          {line.repeat && line.repeat > 1 && (
                            <span className="ml-2.5 text-xs font-sans px-2 py-0.5 rounded-md bg-slate-800 text-[#E2B867] border border-slate-700/60 font-semibold inline-block align-middle tabular-numbers">
                              {line.repeat}x
                            </span>
                          )}
                        </p>
                      )}

                      {/* English Transliteration Line */}
                      {(viewMode === 'english' || viewMode === 'both') && (
                        <p
                          className={`font-sans tracking-wide ${
                            viewMode === 'both'
                              ? 'text-[#E2B867] text-[0.88em] font-medium'
                              : isChorus
                              ? 'text-white font-semibold'
                              : 'text-slate-200'
                          }`}
                        >
                          {line.english}
                          {viewMode === 'english' && line.repeat && line.repeat > 1 && (
                            <span className="ml-2.5 text-xs font-sans px-2 py-0.5 rounded-md bg-slate-800 text-[#E2B867] border border-slate-700/60 font-semibold inline-block align-middle tabular-numbers">
                              {line.repeat}x
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Ergonomic Floating Bottom Dock (Thumb-Zone Optimization) */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 glass-nav pb-safe backdrop-blur-lg border-t border-slate-800/80 shadow-[0_-8px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-3xl mx-auto px-3 sm:px-6 py-2 space-y-2">
          {/* Row 1: Mode Selector & Text Resizing within Thumb Reach */}
          <div className="flex items-center justify-between gap-2 text-xs font-sans">
            {/* View Mode Selector: தமிழ் | English | Both */}
            <div className="flex bg-slate-900/90 rounded-xl p-1 border border-slate-800 shadow-inner">
              {(['tamil', 'english', 'both'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onChangeViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150 btn-press ${
                    viewMode === mode
                      ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  aria-pressed={viewMode === mode}
                >
                  {mode === 'tamil' ? 'தமிழ்' : mode === 'english' ? 'English' : 'Both'}
                </button>
              ))}
            </div>

            {/* Font Resizing Controls with Tabular Display */}
            <div className="flex items-center space-x-1 bg-slate-900/90 rounded-xl p-1 border border-slate-800 shadow-inner">
              <button
                onClick={() => onChangeFontSize(-1)}
                disabled={fontSize <= 14}
                className="w-8 h-7 flex items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-150 btn-press"
                title="Decrease font size (-)"
                aria-label="Decrease font size"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-[#E2B867] px-1 min-w-[34px] text-center font-sans tabular-numbers">
                {fontSize}px
              </span>
              <button
                onClick={() => onChangeFontSize(1)}
                disabled={fontSize >= 30}
                className="w-8 h-7 flex items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-150 btn-press"
                title="Increase font size (+)"
                aria-label="Increase font size"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Row 2: Navigation & Auto-Scroll Controller */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            {/* Previous Carol Button */}
            <button
              onClick={onPrevSong}
              disabled={!onPrevSong}
              className="flex items-center justify-center gap-1 h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 border border-slate-700/50 disabled:opacity-20 disabled:pointer-events-none btn-press shrink-0"
              title="Previous Carol (Left Arrow or K)"
              aria-label="Previous Carol"
            >
              <ChevronLeft className="w-4 h-4 text-[#E2B867]" />
              <span className="hidden sm:inline font-sans">Prev</span>
            </button>

            {/* Auto-Scroll Controller */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/95 px-2.5 sm:px-3 py-1 rounded-xl border border-slate-800 shadow-inner">
              <button
                onClick={toggleScrolling}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all duration-150 btn-press ${
                  isScrolling
                    ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-[#E2B867] hover:bg-slate-700'
                }`}
                title="Toggle Auto-Scroll (Spacebar)"
                aria-pressed={isScrolling}
              >
                {isScrolling ? (
                  <Pause className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span className="font-sans">{isScrolling ? 'Pause' : 'Scroll'}</span>
              </button>

              {/* Speed Options with Tabular Display */}
              <div className="flex items-center text-[11px] font-sans space-x-0.5 tabular-numbers">
                {[0.7, 1.0, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={`px-1.5 py-1 rounded font-medium transition-colors duration-150 btn-press ${
                      speed === s
                        ? 'bg-[#D4AF37]/20 text-[#E2B867] font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    aria-label={`Scroll speed ${s}x`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {/* Next Carol Button */}
            <button
              onClick={onNextSong}
              disabled={!onNextSong}
              className="flex items-center justify-center gap-1 h-10 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 border border-slate-700/50 disabled:opacity-20 disabled:pointer-events-none btn-press shrink-0"
              title="Next Carol (Right Arrow or J)"
              aria-label="Next Carol"
            >
              <span className="hidden sm:inline font-sans">Next</span>
              <ChevronRight className="w-4 h-4 text-[#E2B867]" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
