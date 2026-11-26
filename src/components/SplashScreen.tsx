import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show splash for 1.8 seconds, then initiate smooth fade out
    const timer = setTimeout(() => {
      handleClose();
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);
    setTimeout(() => {
      onDismiss();
    }, 240);
  };

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0D14] px-6 cursor-pointer select-none transition-opacity duration-240 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Launch screen, tap anywhere to enter"
      role="banner"
    >
      {/* Medallion Frame with Sacred Icon */}
      <div className="relative mb-6">
        <div className="w-48 h-60 sm:w-56 sm:h-72 rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl shadow-black/80 bg-slate-900 flex items-center justify-center transition-transform duration-300">
          <img
            src="/mother_of_perpetual_help.jpg"
            alt="Sacred Byzantine icon of Our Lady of Perpetual Help"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>

      {/* Clean Unslop Typography */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wide font-sans">
          Christmas Carols
        </h1>
        <p className="text-xs text-[#E2B867] tracking-widest uppercase font-semibold mt-2 font-sans opacity-90">
          Tamil & English
        </p>
      </div>
    </div>
  );
};
