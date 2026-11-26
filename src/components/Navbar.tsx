import React, { useState, useEffect } from 'react';
import { Star, Download, X } from 'lucide-react';

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
  const [showIconModal, setShowIconModal] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    if (!showIconModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowIconModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showIconModal]);

  return (
    <>
      <header className="sticky top-0 z-30 glass-nav pt-safe backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Brand: Sacred Medallion + Title */}
          <div className="flex items-center space-x-3">
            {/* Sacred Art Medallion with Hairline Gold Foil Border */}
            <button
              type="button"
              onClick={() => setShowIconModal(true)}
              className="group relative w-9 h-9 rounded-xl overflow-hidden border border-[#D4AF37]/60 shadow-[0_0_12px_rgba(212,175,55,0.2)] shrink-0 bg-slate-900 transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50"
              title="View sacred icon of Our Lady of Perpetual Help"
              aria-label="View sacred icon of Our Lady of Perpetual Help"
            >
              <img
                src="/mother_of_perpetual_help.jpg"
                alt="Sacred Byzantine icon of Our Lady of Perpetual Help"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </button>

            <div>
              <h1 className="text-base font-semibold text-white tracking-wide leading-tight">
                Christmas Carols
              </h1>
              <p className="text-[11px] text-[#E2B867]/80 font-sans font-medium">
                Tamil & English Lyrics
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Starred Carols Filter Button */}
            <button
              onClick={onShowFavorites}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 btn-press tabular-numbers ${
                showFavoritesOnly
                  ? 'bg-[#D4AF37] text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60'
              }`}
              title="Filter starred carols"
              aria-label="Filter starred carols"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  showFavoritesOnly ? 'fill-slate-950 text-slate-950' : 'text-[#E2B867] fill-[#E2B867]'
                }`}
              />
              <span>{favoritesCount}</span>
            </button>

            {/* Install PWA Button */}
            {!isInstalled && (
              <button
                onClick={onInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white border border-emerald-500/40 transition-all duration-150 btn-press shadow-sm"
                title="Install app to your home screen"
                aria-label="Install app"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Install</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sacred Icon Modal Viewer */}
      {showIconModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md page-enter"
          onClick={() => setShowIconModal(false)}
        >
          <div
            className="relative max-w-sm w-full bg-[#0E131F] rounded-2xl border border-[#D4AF37]/50 shadow-[0_16px_50px_rgba(0,0,0,0.8)] overflow-hidden p-5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowIconModal(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-600/50 flex items-center justify-center text-slate-300 hover:text-white transition-colors duration-150 btn-press"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* High-Resolution Sacred Icon Frame */}
            <div className="w-48 h-60 mx-auto rounded-xl overflow-hidden border border-[#D4AF37]/70 shadow-[0_0_25px_rgba(212,175,55,0.25)] bg-black">
              <img
                src="/mother_of_perpetual_help.jpg"
                alt="Our Lady of Perpetual Help"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Reverent Inscription */}
            <h3 className="mt-4 text-base font-semibold text-white tracking-wide">
              Our Lady of Perpetual Help
            </h3>
            <p className="text-xs text-[#E2B867] font-medium mt-1">
              நித்திய சகாய மாதா
            </p>
            <p className="text-[11px] text-slate-400 mt-2 italic">
              "Sing joyful carols to the newborn King"
            </p>
          </div>
        </div>
      )}
    </>
  );
};
