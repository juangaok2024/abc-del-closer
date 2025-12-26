'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export function ProgressBar({ currentStep, totalSteps, progress }: ProgressBarProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5" />

      <div className="relative max-w-[480px] mx-auto px-5 py-4">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-[#a0a0a0] font-medium tracking-wide">
            Paso <span className="text-white font-semibold">{currentStep + 1}</span> de {totalSteps}
          </span>
          <span className="gold-text font-semibold tabular-nums">
            {progress}%
          </span>
        </div>

        {/* Progress track */}
        <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
          {/* Animated fill */}
          <div
            className="h-full rounded-full relative overflow-hidden transition-all duration-700 ease-out"
            style={{
              width: `${animatedProgress}%`,
              background: 'linear-gradient(90deg, #9a7a1a 0%, #C9A227 50%, #e3c565 100%)'
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 shimmer opacity-60" />
          </div>

          {/* Glow effect */}
          <div
            className="absolute top-0 h-full transition-all duration-700 ease-out"
            style={{
              left: `${animatedProgress}%`,
              width: '20px',
              marginLeft: '-10px',
              background: 'radial-gradient(circle, rgba(201, 162, 39, 0.6) 0%, transparent 70%)',
              filter: 'blur(4px)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
