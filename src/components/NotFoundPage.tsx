import React from 'react';
import { ArrowLeft, Music } from 'lucide-react';

interface NotFoundPageProps {
  onReturnHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome }) => {
  return (
    <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-16 flex-1 flex items-center justify-center page-enter">
      <div className="w-full max-w-md p-8 rounded-2xl glass-panel text-center font-sans">
        <div className="w-12 h-12 rounded-2xl bg-slate-800/90 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-5">
          <Music className="w-6 h-6 text-[#E2B867]" />
        </div>

        <p className="text-4xl font-bold text-[#D4AF37] tabular-numbers tracking-tight">404</p>
        <h1 className="text-lg font-semibold text-white mt-2">Page Not Found</h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed">
          This carol or page could not be found in the collection.
        </p>

        <button
          type="button"
          onClick={onReturnHome}
          className="mt-6 inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E2B867] text-slate-950 font-semibold text-sm btn-press"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Carols</span>
        </button>
      </div>
    </main>
  );
};
