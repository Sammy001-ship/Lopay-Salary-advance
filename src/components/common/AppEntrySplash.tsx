import React, { useEffect, useState } from 'react';
import { LopayLogo } from './LopayLogo';

interface AppEntrySplashProps {
  onComplete: () => void;
  durationMs?: number;
}

export const AppEntrySplash: React.FC<AppEntrySplashProps> = ({
  onComplete,
  durationMs = 1800,
}) => {
  const [progress, setProgress] = useState<number>(15);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(100, prev + Math.floor(Math.random() * 25) + 15);
      });
    }, 240);

    // Fade out and finish
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onComplete();
      }, 350);
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [durationMs, onComplete]);

  return (
    <div
      onClick={() => {
        setIsFadingOut(true);
        setTimeout(onComplete, 200);
      }}
      className={`fixed inset-0 z-50 bg-[#000000] text-white flex flex-col justify-between items-center px-6 py-12 transition-opacity duration-300 cursor-pointer select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top Spacer */}
      <div className="w-full flex justify-end">
        <span className="text-[11px] text-zinc-600 font-mono tracking-wider hover:text-zinc-400 transition-colors">
          TAP TO ENTER
        </span>
      </div>

      {/* Center Branding: Graduation Cap Logo + LOPAY TECHNOLOGIES */}
      <div className="flex flex-col items-center justify-center my-auto animate-in zoom-in-95 duration-500">
        <LopayLogo variant="full" theme="dark" size="xl" />
      </div>

      {/* Bottom Status Initialization Bar */}
      <div className="w-full max-w-sm flex flex-col items-center justify-center pt-8 pb-4">
        {/* Progress bar pill */}
        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
