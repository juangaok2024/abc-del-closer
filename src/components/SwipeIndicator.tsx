'use client';

import { useEffect, useState } from 'react';

interface SwipeIndicatorProps {
  show: boolean;
}

export function SwipeIndicator({ show }: SwipeIndicatorProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) {
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
    setVisible(true);
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-500 ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <span className="text-[#808080] text-sm font-medium tracking-wide">
        Desliza para continuar
      </span>
      <div className="swipe-indicator">
        <svg
          className="w-6 h-6 text-[#C9A227]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
