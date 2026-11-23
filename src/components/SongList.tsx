import React from 'react';
import { Search, X, Music, Sparkles } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-24 pt-4 w-full">
      {/* Sticky Search Box */}
      <div className="sticky top-[61px] z-20 py-2 bg-[#0A0D14]/90 backdrop-blur-md">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#E2B867]/80 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Tamil or English (e.g., ஆரிராரிரோ, Chinna, Bethlehem)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/40 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 p-1 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Section Header Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 py-2 font-sans">
        <span className="font-medium">
          {showFavoritesOnly ? 'Starred Carols' : 'All Carols'} ({songs.length})
        </span>
        {searchQuery && (
          <span className="text-[#E2B867] font-medium">Matching "{searchQuery}"</span>
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
        /* Empty State */
        <div className="p-8 sm:p-12 mt-6 rounded-2xl glass-panel text-center">
          <Music className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-semibold text-slate-200">No Carols Found</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto font-sans">
            Try searching with another word in Tamil or English transliteration (e.g. "kanne", "yesu", "kudil").
          </p>
          <button
            onClick={onResetFilters}
            className="mt-4 px-4 py-2 rounded-full bg-[#D4AF37]/15 text-[#E2B867] border border-[#D4AF37]/30 text-xs font-semibold hover:bg-[#D4AF37]/25 transition-all"
          >
            Show All Carols
          </button>
        </div>
      )}

      {/* Festive Footer */}
      <div className="mt-10 text-center text-xs text-slate-400 font-sans flex items-center justify-center gap-1.5 pb-4">
        <Sparkles className="w-3.5 h-3.5 text-[#E2B867]" />
        <span>Joy to the World &bull; Christmas Carols Lyrics</span>
      </div>
    </div>
  );
};
