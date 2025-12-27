'use client';

interface ScrollHintProps {
  onNavigate?: () => void;
}

export function ScrollHint({ onNavigate }: ScrollHintProps) {
  return (
    <button
      onClick={onNavigate}
      className="scroll-hint-container flex flex-col items-center gap-3 mt-auto pt-8 pb-6 cursor-pointer group"
      aria-label="Ir a la siguiente sección"
    >
      {/* Glowing ring behind */}
      <div className="relative">
        <div className="scroll-hint-glow absolute inset-0 w-14 h-14 -m-2 rounded-full bg-[#C9A227]/20 blur-md" />
        {/* Arrow icon */}
        <div className="scroll-hint relative w-10 h-10 flex items-center justify-center rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 group-hover:bg-[#C9A227]/20 group-hover:border-[#C9A227]/60 transition-all duration-300">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#C9A227]"
          >
            <path
              d="M12 5v14M5 12l7 7 7-7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {/* Text hint */}
      <span className="scroll-hint-text text-sm text-[#a0a0a0] uppercase tracking-[0.2em] font-medium group-hover:text-[#C9A227] transition-colors duration-300">
        Desliza
      </span>
    </button>
  );
}
