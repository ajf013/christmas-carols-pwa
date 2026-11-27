import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  ArrowLeft,
  Star,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
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
  const [spotlightEnabled, setSpotlightEnabled] = useState(true);
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Reset scroll, spotlight, and stop auto-scroll when switching songs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    stopScrolling();
    setActiveSectionIdx(0);
  }, [song.id, stopScrolling]);

  // Track which verse/chorus is centered in the reading viewport
  useEffect(() => {
    if (!spotlightEnabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-section-idx'));
            if (!Number.isNaN(idx)) {
              setActiveSectionIdx(idx);
            }
          }
        }
      },
      {
        rootMargin: '-35% 0px -45% 0px',
        threshold: 0.1,
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [song.id, song.sections.length, spotlightEnabled]);

  const focusSection = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(song.sections.length - 1, idx));
    setActiveSectionIdx(clamped);
    sectionRefs.current[clamped]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [song.sections.length]);

  const cycleSpeed = useCallback(() => {
    const speeds = [0.7, 1.0, 1.5];
    const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
    setSpeed(speeds[nextIdx]);
  }, [speed, setSpeed]);

  // Dynamic Proportional Leading Formula
  const dynamicLineHeight = useMemo(() => {
    const minSize = 14;
    const maxSize = 30;
    const clamped = Math.min(maxSize, Math.max(minSize, fontSize));
    const ratio = (clamped - minSize) / (maxSize - minSize);
    return Number((1.85 - ratio * 0.4).toFixed(2));
  }, [fontSize]);

  // Global keyboard shortcuts
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
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusSection(activeSectionIdx + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusSection(activeSectionIdx - 1);
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
  }, [
    onNextSong,
    onPrevSong,
    focusSection,
    activeSectionIdx,
    toggleScrolling,
    onBack,
    onChangeFontSize,
    onChangeViewMode,
    viewMode,
  ]);

  return (
    <div className="min-h-screen bg-[#07090F] candlelight-glow text-slate-100 flex flex-col pb-32 page-enter">
      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Carol ${song.id}: ${song.titleTamil}, ${song.titleEnglish}. ${
          isScrolling ? `Auto scrolling at ${speed}x` : 'Auto scroll paused'
        }. Text size ${fontSize} pixels.`}
      </div>

      {/* Streamlined Obsidian Header with Warm Candlelight Backdrop */}
      <header className="sticky top-0 z-30 glass-nav pt-safe backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-[#0E131F] text-xs font-medium text-slate-200 hover:bg-slate-800 border border-slate-700/60 btn-press shrink-0"
            title="Back to song list (Esc)"
            aria-label="Back to song list"
          >
            <ArrowLeft className="w-4 h-4 text-[#E2B867]" />
            <span className="font-sans hidden xs:inline">Carols</span>
          </button>

          <div className="flex-1 text-center min-w-0 px-1">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide truncate text-balance tabular-numbers">
              #{song.id}. {song.titleTamil}
            </h2>
            <p className="text-xs text-[#E2B867]/90 font-sans truncate font-medium mt-0.5">
              {song.titleEnglish}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Spotlight Toggle */}
            <button
              type="button"
              onClick={() => setSpotlightEnabled((prev) => !prev)}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center btn-press transition-colors duration-150 ${
                spotlightEnabled
                  ? 'bg-[#D4AF37]/15 border-[#D4AF37]/50 text-[#E2B867]'
                  : 'bg-[#0E131F] border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
              title={spotlightEnabled ? 'Active Verse Spotlight: On' : 'Active Verse Spotlight: Off'}
              aria-label="Toggle active verse spotlight"
              aria-pressed={spotlightEnabled}
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Favorite Star Button */}
            <button
              type="button"
              onClick={() => onToggleFavorite(song.id)}
              className="w-10 h-10 rounded-xl bg-[#0E131F] border border-slate-700/60 flex items-center justify-center text-slate-400 hover:text-[#E2B867] btn-press"
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
        </div>
      </header>

      {/* Main Lyrics Body with Option B Active Verse Spotlight */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-5 flex-1">
        <div className="space-y-4">
          {song.sections.map((section, sIdx) => {
            const isChorus = section.type === 'chorus';
            const isFocused = !spotlightEnabled || activeSectionIdx === sIdx;

            return (
              <div
                key={sIdx}
                ref={(el) => {
                  sectionRefs.current[sIdx] = el;
                }}
                data-section-idx={sIdx}
                onClick={() => spotlightEnabled && focusSection(sIdx)}
                className={`p-4 sm:p-6 rounded-2xl transition-all duration-300 ${
                  spotlightEnabled ? 'cursor-pointer' : ''
                } ${
                  isFocused
                    ? isChorus || spotlightEnabled
                      ? 'spotlight-active opacity-100'
                      : 'glass-panel opacity-100'
                    : 'glass-panel opacity-45 hover:opacity-85'
                }`}
              >
                {/* Section Header Label */}
                <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-slate-800/80 font-sans">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isFocused || isChorus ? 'text-[#E2B867]' : 'text-slate-300'
                    }`}
                  >
                    {viewMode === 'english'
                      ? (section.label.match(/\(([^)]+)\)/)?.[1] || section.label)
                      : section.label}
                  </span>
                  {isChorus && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#E2B867] border border-[#D4AF37]/30">
                      Chorus
                    </span>
                  )}
                </div>

                {/* Lyrics Lines */}
                <div
                  className="space-y-3.5 lyrics-pretty"
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: dynamicLineHeight,
                  }}
                >
                  {section.lines.map((line, lIdx) => (
                    <div key={lIdx} className="space-y-1">
                      {(viewMode === 'tamil' || viewMode === 'both') && (
                        <p
                          className={`font-semibold tracking-wide ${
                            isFocused ? 'text-white' : 'text-slate-200'
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

                      {(viewMode === 'english' || viewMode === 'both') && (
                        <p
                          className={`font-sans tracking-wide ${
                            viewMode === 'both'
                              ? 'text-[#E2B867] text-[0.88em] font-medium'
                              : isFocused
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

      {/* Option B: Sleek Floating Pill Dock */}
      <footer className="fixed bottom-3 sm:bottom-5 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none pb-[env(safe-area-inset-bottom,0px)]">
        <div className="max-w-xl mx-auto pointer-events-auto rounded-2xl bg-[#0E131F]/92 backdrop-blur-xl border border-[#D4AF37]/30 shadow-[0_12px_40px_rgba(0,0,0,0.85)] px-2 sm:px-3 py-2 flex items-center justify-between gap-1.5 sm:gap-2 font-sans">
          {/* Previous Carol */}
          <button
            type="button"
            onClick={onPrevSong}
            disabled={!onPrevSong}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 disabled:opacity-25 disabled:pointer-events-none btn-press shrink-0"
            title="Previous Carol (Left Arrow)"
            aria-label="Previous Carol"
          >
            <ChevronLeft className="w-4 h-4 text-[#E2B867]" />
          </button>

          {/* Language Toggle Pill: TA | EN | Both */}
          <div className="flex bg-slate-950/90 rounded-xl p-0.5 border border-slate-800 shrink-0">
            {(['tamil', 'english', 'both'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onChangeViewMode(mode)}
                className={`min-w-[34px] px-2 sm:px-2.5 h-9 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 btn-press ${
                  viewMode === mode
                    ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                aria-pressed={viewMode === mode}
              >
                {mode === 'tamil' ? 'TA' : mode === 'english' ? 'EN' : 'Both'}
              </button>
            ))}
          </div>

          {/* Font Resize Pill: A- | A+ */}
          <div className="flex items-center bg-slate-950/90 rounded-xl p-0.5 border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => onChangeFontSize(-1)}
              disabled={fontSize <= 14}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none btn-press"
              title="Decrease text size (-)"
              aria-label="Decrease text size"
            >
              A-
            </button>
            <button
              type="button"
              onClick={() => onChangeFontSize(1)}
              disabled={fontSize >= 30}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-xs font-semibold text-[#E2B867] hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none btn-press"
              title="Increase text size (+)"
              aria-label="Increase text size"
            >
              A+
            </button>
          </div>

          {/* Auto-Scroll Play/Pause + Speed Tap */}
          <div className="flex items-center bg-slate-950/90 rounded-xl p-0.5 border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={toggleScrolling}
              className={`flex items-center justify-center gap-1 min-w-[36px] h-9 px-2.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-150 btn-press ${
                isScrolling
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'text-[#E2B867] hover:bg-slate-800'
              }`}
              title="Toggle Auto-Scroll (Spacebar)"
              aria-pressed={isScrolling}
            >
              {isScrolling ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span className="hidden xs:inline">{isScrolling ? 'Pause' : 'Auto'}</span>
            </button>
            <button
              type="button"
              onClick={cycleSpeed}
              className="min-w-[34px] px-1.5 h-9 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-[#E2B867] tabular-numbers btn-press"
              title="Cycle auto-scroll speed"
              aria-label={`Auto-scroll speed ${speed}x, tap to change`}
            >
              {speed}x
            </button>
          </div>

          {/* Next Carol */}
          <button
            type="button"
            onClick={onNextSong}
            disabled={!onNextSong}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 disabled:opacity-25 disabled:pointer-events-none btn-press shrink-0"
            title="Next Carol (Right Arrow)"
            aria-label="Next Carol"
          >
            <ChevronRight className="w-4 h-4 text-[#E2B867]" />
          </button>
        </div>
      </footer>
    </div>
  );
};
