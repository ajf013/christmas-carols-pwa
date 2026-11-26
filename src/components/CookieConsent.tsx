import React from 'react';

interface CookieConsentProps {
  isOpen: boolean;
  onAcceptAll: () => void;
  onEssentialOnly: () => void;
  onOpenPrivacy: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  isOpen,
  onAcceptAll,
  onEssentialOnly,
  onOpenPrivacy,
}) => {
  if (!isOpen) return null;

  return (
    <aside
      role="dialog"
      aria-label="Storage and cookie preferences"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-40 p-4 rounded-2xl bg-[#111827]/95 backdrop-blur-md border border-[#D4AF37]/30 shadow-[0_12px_40px_rgba(0,0,0,0.75)] font-sans page-enter"
    >
      <p className="text-xs text-slate-200 leading-relaxed">
        Uses essential local storage for favorites &amp; offline caching, plus optional cookieless
        usage metrics.{' '}
        <a
          href="/privacy"
          onClick={(e) => {
            e.preventDefault();
            onOpenPrivacy();
          }}
          className="text-[#E2B867] underline underline-offset-2 hover:text-white"
        >
          Privacy
        </a>
      </p>

      <div className="flex items-center justify-end gap-2 mt-3">
        <button
          type="button"
          onClick={onEssentialOnly}
          className="min-h-[36px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700/70 btn-press"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={onAcceptAll}
          className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#E2B867] text-xs font-semibold text-slate-950 btn-press"
        >
          Accept
        </button>
      </div>
    </aside>
  );
};
