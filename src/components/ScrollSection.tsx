'use client';

import { forwardRef } from 'react';

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export const ScrollSection = forwardRef<HTMLElement, ScrollSectionProps>(
  ({ children, className = '', id }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={`scroll-section w-full ${className}`}
      >
        {children}
      </section>
    );
  }
);

ScrollSection.displayName = 'ScrollSection';
