import React from 'react';
import { Search, X, Music, Play } from 'lucide-react';
import { Song } from '../types';
import { SongCard } from './SongCard';

interface SongListProps {
  songs: Song[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favorites: number[];
  onToggleFavorite: (e: React.MouseEvent, id: number) => void;
  onSelectSong: (song: Song) => void;
  showFavoritesOnly: boolean;
  onResetFilters: () => void;
}

export const SongList: React.FC<SongListProps> = ({
  songs,
  searchQuery,
  onSearchChange,
  favorites,
  onToggleFavorite,
  onSelectSong,
  showFavoritesOnly,
  onResetFilters,
}) => {
  const handleSearchInput = (raw: string) => {
    // Strip control characters and enforce 80-char bound
    const sanitized = raw.replace(/[\u0000-\u001F\u007F]/g, '').slice(0, 80);
    onSearchChange(sanitized);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-8 pt-3 w-full flex-1">
      {/* One Clear Call to Action (Taste-Skill & Unslop) */}
      {songs.length > 0 && !searchQuery && (
        <div className="mb-4 p-4 sm:p-5 rounded-2xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-white">
              Ready for Carol Rounds
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 font-sans">
              Tamil &amp; English lyrics cached offline for instant singing.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onSelectSong(songs[0])}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E2B867] text-slate-950 font-semibold text-xs sm:text-sm btn-press shrink-0 shadow-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Singing</span>
          </button>
        </div>
      )}

      {/* Search Input Box with Strict Edge Alignment & Input Bounds */}
      <div className="sticky top-[61px] z-20 py-2 bg-[#0A0D14]/95 backdrop-blur-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#E2B867] absolute left-3.5 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            maxLength={80}
            aria-label="Search Tamil or English carol lyrics"
            placeholder="Search Tamil or English lyrics..."
            className="w-full pl-10 pr-11 py-2.5 min-h-[44px] rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-colors duration-150 font-sans shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-1.5 w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white transition-colors duration-150"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Header Count (WCAG AA Contrast) */}
      <div className="flex items-center justify-between text-xs text-slate-300 py-2 font-sans tabular-numbers">
        <span>
          {showFavoritesOnly ? 'Starred Carols' : 'All Carols'} ({songs.length})
        </span>
        {searchQuery && (
          <span className="text-[#E2B867] truncate ml-2">Matching &ldquo;{searchQuery}&rdquo;</span>
        )}
      </div>

      {/* Song Cards List */}
      {songs.length > 0 ? (
        <div className="space-y-3 mt-1">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              isFavorite={favorites.includes(song.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectSong}
            />
          ))}
        </div>
      ) : (
        /* Unslop U4 & Impeccable Compliant Empty State */
        <div className="p-8 sm:p-12 mt-6 rounded-2xl glass-panel text-center">
          <Music className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-200">
            {searchQuery ? `No carols matching "${searchQuery}"` : 'No starred carols'}
          </h4>
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 text-[#E2B867] border border-slate-700 text-xs font-semibold hover:bg-slate-750 btn-press"
          >
            Show All Carols
          </button>
        </div>
      )}
    </div>
  );
};
