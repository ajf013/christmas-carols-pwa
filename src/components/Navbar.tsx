import React from 'react';
import { Star, Download, Sparkles } from 'lucide-react';

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
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37]/20 to-emerald-500/20 border border-[#D4AF37]/30 flex items-center justify-center text-[#E2B867] shadow-sm">
            <Sparkles className="w-5 h-5 animate-pulse text-[#E2B867]" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5 leading-tight tracking-wide">
              Christmas Carols
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                Offline PWA
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              19 Carol Lyrics &bull; Tamil & English
            </p>
          </div>
        </div>

        {/* Top Actions: Favorites & Install */}
        <div className="flex items-center space-x-2">
          {/* Starred Carols Filter Button */}
          <button
            onClick={onShowFavorites}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              showFavoritesOnly
                ? 'bg-[#D4AF37] text-slate-950 shadow-md shadow-[#D4AF37]/20 font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
            }`}
            title="Filter starred carols"
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-slate-950' : 'text-[#E2B867] fill-[#E2B867]'}`} />
            <span>{favoritesCount}</span>
          </button>

          {/* PWA Install Button */}
          {!isInstalled && (
            <button
              onClick={onInstallClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm border border-emerald-400/30 transition-all active:scale-95"
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
