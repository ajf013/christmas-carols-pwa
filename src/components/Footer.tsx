import React from 'react';

interface FooterProps {
  onNavigate: (path: '/privacy' | '/terms') => void;
  onOpenConsent: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenConsent }) => {
  return (
    <footer className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 border-t border-slate-800/70 text-xs text-slate-300 font-sans flex flex-col sm:flex-row items-center justify-between gap-3 pb-20 sm:pb-8">
      <span className="text-slate-300">carols.fcruz.org · Offline Songbook</span>
      <nav aria-label="Legal and preferences" className="flex items-center gap-4">
        <a
          href="/privacy"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/privacy');
          }}
          className="py-1.5 text-slate-300 hover:text-[#E2B867] transition-colors duration-150"
        >
          Privacy
        </a>
        <a
          href="/terms"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/terms');
          }}
          className="py-1.5 text-slate-300 hover:text-[#E2B867] transition-colors duration-150"
        >
          Terms
        </a>
        <button
          type="button"
          onClick={onOpenConsent}
          className="py-1.5 text-slate-300 hover:text-[#E2B867] transition-colors duration-150"
        >
          Storage
        </button>
      </nav>
    </footer>
  );
};
