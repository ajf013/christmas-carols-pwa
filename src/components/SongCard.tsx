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
      onClick={() => onSelect(song)}
      className="group relative p-4 sm:p-5 rounded-2xl glass-panel hover:border-[#D4AF37]/40 transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-start gap-4"
    >
      {/* Song Number Badge */}
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shrink-0 text-[#E2B867] font-bold text-sm shadow-inner group-hover:border-[#D4AF37]/50 group-hover:bg-slate-800 transition-all">
        #{song.id}
      </div>

      {/* Title & Preview */}
      <div className="flex-1 min-w-0 pr-7">
        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#E2B867] transition-colors leading-snug">
          {song.titleTamil}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-[#E2B867]/90 font-sans tracking-wide mt-0.5 truncate">
          {song.titleEnglish}
        </p>

        {/* Lyric Snippet */}
        <p className="text-xs text-slate-400 mt-2 line-clamp-1 italic font-light">
          "{song.preview}"
        </p>
      </div>

      {/* Favorite Button */}
      <button
        type="button"
        onClick={(e) => onToggleFavorite(e, song.id)}
        className="absolute top-4 right-3.5 p-2 rounded-full text-slate-400 hover:text-[#E2B867] transition-colors active:scale-95"
        aria-label="Favorite song"
      >
        <Star
          className={`w-5 h-5 transition-transform ${
            isFavorite
              ? 'fill-[#D4AF37] text-[#D4AF37] scale-110 drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]'
              : 'hover:scale-110'
          }`}
        />
      </button>

      {/* Chevron indicator */}
      <ChevronRight className="w-4 h-4 text-slate-400 absolute bottom-4 right-4 group-hover:text-[#E2B867] group-hover:translate-x-0.5 transition-all" />
    </div>
  );
};
