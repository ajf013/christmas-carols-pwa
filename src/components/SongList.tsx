import React from 'react';
import { Search, X, Music } from 'lucide-react';
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
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 pt-3 w-full">
      {/* Search Input Box with Strict Edge Alignment */}
      <div className="sticky top-[61px] z-20 py-2 bg-[#0A0D14]/95 backdrop-blur-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#E2B867] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Tamil or English lyrics..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-colors duration-150 font-sans shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors duration-150"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Header Count with Precision Edge Alignment */}
      <div className="flex items-center justify-between text-xs text-slate-400 py-2 font-sans tabular-numbers">
        <span>
          {showFavoritesOnly ? 'Starred Carols' : 'All Carols'} ({songs.length})
        </span>
        {searchQuery && (
          <span className="text-[#E2B867] truncate ml-2">Matching "{searchQuery}"</span>
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
          <Music className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-slate-200">
            {searchQuery ? `No carols matching "${searchQuery}"` : 'No starred carols'}
          </h4>
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-[#E2B867] border border-slate-700 text-xs font-semibold hover:bg-slate-750 btn-press"
          >
            Show All Carols
          </button>
        </div>
      )}
    </div>
  );
};
