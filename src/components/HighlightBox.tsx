interface HighlightBoxProps {
  children: React.ReactNode;
  variant?: 'quote' | 'info';
  className?: string;
}

export function HighlightBox({ children, variant = 'quote', className = '' }: HighlightBoxProps) {
  if (variant === 'quote') {
    return (
      <div className={`quote-box my-8 ${className}`}>
        <div className="text-[#f5f5f5]/90 font-medium leading-relaxed">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`glass-card p-5 my-6 ${className}`}>
      {children}
    </div>
  );
}
