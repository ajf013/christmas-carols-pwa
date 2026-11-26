import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
  return (
    <main className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 page-enter">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 border border-slate-700/60 btn-press mb-6"
      >
        <ArrowLeft className="w-4 h-4 text-[#E2B867]" />
        <span>Back to Carols</span>
      </button>

      <article className="p-6 sm:p-8 rounded-2xl glass-panel space-y-5 font-sans">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <FileText className="w-5 h-5 text-[#E2B867] shrink-0" />
          <div>
            <h1 className="text-xl font-semibold text-white">Terms &amp; Conditions</h1>
            <p className="text-xs text-slate-300 mt-0.5">carols.fcruz.org · Last updated November 2026</p>
          </div>
        </div>

        <section className="space-y-2 text-sm text-slate-200 leading-relaxed">
          <h2 className="text-base font-semibold text-[#E2B867]">1. Community &amp; Liturgical Use</h2>
          <p>
            This digital songbook is provided free of charge for parish choirs, families, and community
            Christmas carol singing. You may install it on your mobile device or tablet for offline use
            during carol rounds and services.
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-200 leading-relaxed">
          <h2 className="text-base font-semibold text-[#E2B867]">2. Lyrics &amp; Attribution</h2>
          <p>
            Traditional Tamil and English carol lyrics remain the cultural and spiritual heritage of their
            respective authors, composers, and churches. English transliterations are included solely to
            assist congregation members in singing along.
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-200 leading-relaxed">
          <h2 className="text-base font-semibold text-[#E2B867]">3. Availability</h2>
          <p>
            While cached songs work offline once loaded, the service is provided &ldquo;as is&rdquo;
            without warranties of uninterrupted availability or error-free lyrics.
          </p>
        </section>
      </article>
    </main>
  );
};
