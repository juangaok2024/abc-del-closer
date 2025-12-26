'use client';

import { useState } from 'react';

interface ContinueButtonProps {
  onClick: () => void;
  text?: string;
  isExternal?: boolean;
  href?: string;
}

export function ContinueButton({ onClick, text = 'Continuar', isExternal, href }: ContinueButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    onClick();
  };

  const baseClasses = `
    group relative w-full py-4 px-8
    bg-[#C9A227] hover:bg-[#d4ad2e]
    text-black font-semibold text-lg
    rounded-xl
    transition-all duration-300 ease-out
    shadow-[0_4px_20px_rgba(201,162,39,0.3)]
    hover:shadow-[0_8px_40px_rgba(201,162,39,0.4)]
    active:shadow-[0_2px_10px_rgba(201,162,39,0.3)]
    ${isPressed ? 'scale-[0.97]' : 'hover:scale-[1.02]'}
    focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:ring-offset-2 focus:ring-offset-[#0a0a0a]
    flex items-center justify-center gap-3
  `;

  if (isExternal && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClasses}
      >
        {text}
        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={baseClasses}
    >
      {text}
      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
    </button>
  );
}
