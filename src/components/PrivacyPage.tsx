import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
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
          <Shield className="w-5 h-5 text-[#E2B867] shrink-0" />
          <div>
            <h1 className="text-xl font-semibold text-white">Privacy Policy</h1>
            <p className="text-xs text-slate-300 mt-0.5">carols.fcruz.org · Last updated November 2026</p>
          </div>
        </div>

        <section className="space-y-2 text-sm text-slate-200 leading-relaxed">
          <h2 className="text-base font-semibold text-[#E2B867]">1. Local-First &amp; Offline Design</h2>
          <p>
            Christmas Carols Lyrics is built as an offline-first Progressive Web App (PWA). We do not
            require accounts, logins, names, email addresses, or personal data to browse or sing carols.
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-200 leading-relaxed">
          <h2 className="text-base font-semibold text-[#E2B867]">2. Essential Local Storage</h2>
          <p>
            To remember your reading preferences offline, the app stores three non-identifying settings
            strictly on your own device via <code className="text-[#E2B867]">localStorage</code>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>Starred / favorite carol IDs (<code className="text-slate-200">carol_favorites</code>)</li>
            <li>Preferred lyrics font size (<code className="text-slate-200">carol_font_size</code>)</li>
            <li>Language view mode — Tamil, English, or Both (<code className="text-slate-200">carol_view_mode</code>)</li>
          </ul>
          <p>This data never leaves your device.</p>
        </section>

        <section className="space-y-2 text-sm text-slate-200 leading-relaxed">
          <h2 className="text-base font-semibold text-[#E2B867]">3. Privacy-Respecting Analytics</h2>
          <p>
            When online and permitted by your cookie/storage preference, we may use cookieless aggregate
            page-view metrics (without cross-site tracking or personal profiling) solely to understand
            which carols are most helpful to the community.
          </p>
        </section>

        <section className="space-y-2 text-sm text-slate-200 leading-relaxed">
          <h2 className="text-base font-semibold text-[#E2B867]">4. Security &amp; HTTPS</h2>
          <p>
            All traffic to <span className="text-white font-medium">carols.fcruz.org</span> is enforced
            over encrypted HTTPS with strict transport security headers.
          </p>
        </section>
      </article>
    </main>
  );
};
