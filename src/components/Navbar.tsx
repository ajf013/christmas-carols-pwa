import React from 'react';
import { Star, Download } from 'lucide-react';

interface NavbarProps {
  onShowFavorites: () => void;
  showFavoritesOnly: boolean;
  favoritesCount: number;
  onInstallClick: () => void;
  isInstalled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onShowFavorites,
  showFavoritesOnly,
  favoritesCount,
  onInstallClick,
  isInstalled,
}) => {
  return (
    <header className="sticky top-0 z-30 glass-nav pt-safe">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand: Sacred Medallion + Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#D4AF37]/40 shrink-0 bg-slate-900 shadow-sm">
            <img
              src="/mother_of_perpetual_help.jpg"
              alt="Our Lady of Perpetual Help"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <h1 className="text-base font-semibold text-white tracking-wide">
            Christmas Carols
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Starred Carols Filter Button */}
          <button
            onClick={onShowFavorites}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors duration-150 ${
              showFavoritesOnly
                ? 'bg-[#D4AF37] text-slate-950 font-semibold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
            }`}
            title="Filter starred carols"
            aria-label="Filter starred carols"
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-slate-950' : 'text-[#E2B867] fill-[#E2B867]'}`} />
            <span>{favoritesCount}</span>
          </button>

          {/* Install Button */}
          {!isInstalled && (
            <button
              onClick={onInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/40 transition-colors duration-150"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
