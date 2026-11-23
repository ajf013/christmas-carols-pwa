import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Song } from '../types';

interface SongCardProps {
  song: Song;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: number) => void;
  onSelect: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  isFavorite,
  onToggleFavorite,
  onSelect,
}) => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(song)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(song);
        }
      }}
      className="group relative p-4 sm:p-5 rounded-2xl glass-panel card-lift hover:border-[#D4AF37]/50 cursor-pointer flex items-start gap-3.5 sm:gap-4 select-none focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40"
    >
      {/* Song Number Badge with Tabular Figures */}
      <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0 text-[#E2B867] font-semibold text-sm tabular-numbers shadow-inner">
        #{song.id}
      </div>

      {/* Title & Preview with Optical Balance */}
      <div className="flex-1 min-w-0 pr-8">
        <h3 className="text-base font-semibold text-white group-hover:text-[#E2B867] transition-colors duration-150 leading-snug text-balance">
          {song.titleTamil}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-[#E2B867]/90 font-sans tracking-wide mt-0.5 truncate">
          {song.titleEnglish}
        </p>

        {/* Lyric Snippet - Enhanced Contrast for Candlelight/Dim Light */}
        <p className="text-xs text-slate-300 mt-2 line-clamp-1 italic font-normal lyrics-pretty">
          "{song.preview}"
        </p>
      </div>

      {/* Favorite Button (Guaranteed 44x44px touch target) */}
      <button
        type="button"
        onClick={(e) => onToggleFavorite(e, song.id)}
        className="absolute top-2 right-2 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-[#E2B867] btn-press focus:outline-none"
        aria-label={isFavorite ? `Remove ${song.titleEnglish} from favorites` : `Add ${song.titleEnglish} to favorites`}
      >
        <Star
          className={`w-5 h-5 transition-transform duration-150 group-active:scale-95 ${
            isFavorite ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
          }`}
        />
      </button>

      {/* Chevron Indicator with Subtle 3px Nudge */}
      <ChevronRight className="w-4 h-4 text-slate-500 absolute bottom-4 right-4 group-hover:text-[#E2B867] group-hover:translate-x-0.5 transition-all duration-150" />
    </div>
  );
};
