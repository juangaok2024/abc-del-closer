'use client';

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2 text-[#a0a0a0] hover:text-white transition-all duration-300 text-sm mb-6 -ml-1 py-2"
    >
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/5 group-hover:bg-white/10 transition-all duration-300 group-hover:-translate-x-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </span>
      <span className="font-medium">Volver</span>
    </button>
  );
}
