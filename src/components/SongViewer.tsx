import React, { useEffect } from 'react';
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

  // Scroll to top when song changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    stopScrolling();
  }, [song.id, stopScrolling]);

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 flex flex-col pb-32 page-enter">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 glass-nav pt-safe">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 border border-slate-700/60 transition-colors duration-150"
            title="Back to song list"
          >
            <ArrowLeft className="w-4 h-4 text-[#E2B867]" />
            <span className="font-sans">Songs</span>
          </button>

          {/* Song Title & English Subtitle */}
          <div className="flex-1 text-center min-w-0 px-2">
            <h2 className="text-sm sm:text-base font-semibold text-white tracking-wide truncate">
              #{song.id}. {song.titleTamil}
            </h2>
            <p className="text-xs text-[#E2B867]/90 font-sans truncate font-medium mt-0.5">
              {song.titleEnglish}
            </p>
          </div>

          {/* Favorite Star Button */}
          <button
            onClick={() => onToggleFavorite(song.id)}
            className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-[#E2B867] transition-colors duration-150"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-[#E2B867] text-[#E2B867]' : ''
              }`}
            />
          </button>
        </div>

        {/* Second Row: Mode Selector + Font Controls */}
        <div className="max-w-3xl mx-auto px-4 py-2 border-t border-slate-800/60 flex items-center justify-between gap-2 text-xs font-sans">
          {/* View Mode Selector: தமிழ் | English | Both */}
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
            {(['tamil', 'english', 'both'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onChangeViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors duration-150 ${
                  viewMode === mode
                    ? 'bg-[#D4AF37] text-slate-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode === 'tamil' ? 'தமிழ்' : mode === 'english' ? 'English' : 'Both'}
              </button>
            ))}
          </div>

          {/* Font Resizing Controls */}
          <div className="flex items-center space-x-1 bg-slate-900 rounded-xl p-1 border border-slate-800">
            <button
              onClick={() => onChangeFontSize(-1)}
              disabled={fontSize <= 14}
              className="p-1 rounded-md text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-150"
              title="Decrease text size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-[#E2B867] px-1.5 min-w-[32px] text-center font-sans">
              {fontSize}px
            </span>
            <button
              onClick={() => onChangeFontSize(1)}
              disabled={fontSize >= 30}
              className="p-1 rounded-md text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors duration-150"
              title="Increase text size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Lyrics Body */}
      <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 pt-5 flex-1">
        <div className="space-y-4">
          {song.sections.map((section, sIdx) => {
            const isChorus = section.type === 'chorus';
            return (
              <div
                key={sIdx}
                className={`p-4 sm:p-6 rounded-2xl transition-colors duration-150 ${
                  isChorus
                    ? 'bg-[#D4AF37]/5 border border-[#D4AF37]/25'
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

                {/* Lyrics Lines */}
                <div
                  className="space-y-3.5"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.7 }}
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
                            <span className="ml-2.5 text-xs font-sans px-2 py-0.5 rounded-md bg-slate-800 text-[#E2B867] border border-slate-700/60 font-semibold inline-block align-middle">
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
                            <span className="ml-2.5 text-xs font-sans px-2 py-0.5 rounded-md bg-slate-800 text-[#E2B867] border border-slate-700/60 font-semibold inline-block align-middle">
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

      {/* Floating Bottom Dock (Previous, Auto-Scroll, Next) */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 glass-nav pb-safe">
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Previous Carol Button */}
          <button
            onClick={onPrevSong}
            disabled={!onPrevSong}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 border border-slate-700/50 disabled:opacity-25 disabled:pointer-events-none transition-colors duration-150"
            title="Previous Carol"
          >
            <ChevronLeft className="w-4 h-4 text-[#E2B867]" />
            <span className="hidden sm:inline font-sans">Previous</span>
          </button>

          {/* Auto-Scroll Controller */}
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={toggleScrolling}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold transition-colors duration-150 ${
                isScrolling
                  ? 'bg-[#D4AF37] text-slate-950'
                  : 'bg-slate-800 text-[#E2B867] hover:bg-slate-700'
              }`}
            >
              {isScrolling ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span className="font-sans">{isScrolling ? 'Pause' : 'Auto-Scroll'}</span>
            </button>

            {/* Speed Options */}
            <div className="flex items-center text-[11px] font-sans space-x-1">
              {[0.7, 1.0, 1.5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1.5 py-0.5 rounded font-medium transition-colors duration-150 ${
                    speed === s
                      ? 'bg-[#D4AF37]/20 text-[#E2B867] font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-medium text-slate-200 border border-slate-700/50 disabled:opacity-25 disabled:pointer-events-none transition-colors duration-150"
            title="Next Carol"
          >
            <span className="hidden sm:inline font-sans">Next</span>
            <ChevronRight className="w-4 h-4 text-[#E2B867]" />
          </button>
        </div>
      </footer>
    </div>
  );
};
