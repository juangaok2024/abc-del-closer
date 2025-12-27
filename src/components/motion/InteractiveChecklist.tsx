'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Particles } from './Particles';

interface ChecklistItem {
  id: string;
  text: string;
  icon?: React.ReactNode;
}

interface InteractiveChecklistProps {
  items: ChecklistItem[];
  minRequired?: number;
  onComplete?: (selected: string[]) => void;
  onChange?: (selected: string[]) => void;
  mode?: 'check' | 'strikethrough';
  className?: string;
  title?: string;
  instruction?: string;
  completeMessage?: string;
  emptyMessage?: string;
}

export function InteractiveChecklist({
  items,
  minRequired = 1,
  onComplete,
  onChange,
  mode = 'check',
  className = '',
  title,
  instruction,
  completeMessage = '¡Completado!',
  emptyMessage,
}: InteractiveChecklistProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showParticles, setShowParticles] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const progress = (selected.size / items.length) * 100;
  const hasMinRequired = selected.size >= minRequired;

  useEffect(() => {
    if (hasMinRequired && !isComplete) {
      setIsComplete(true);
      setShowConfetti(true);
      onComplete?.(Array.from(selected));
      setTimeout(() => setShowConfetti(false), 2000);
    }
    onChange?.(Array.from(selected));
  }, [selected, hasMinRequired, isComplete, onComplete, onChange]);

  const toggleItem = (id: string) => {
    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }

    setShowParticles(id);
    setTimeout(() => setShowParticles(null), 1000);

    setSelected((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Confetti on complete */}
      <Particles
        trigger={showConfetti}
        type="confetti"
        color="mixed"
        count={50}
        originX={50}
        originY={0}
      />

      {/* Title */}
      {title && <h3 className="text-white font-semibold text-lg">{title}</h3>}

      {/* Instruction */}
      {instruction && !isComplete && (
        <motion.p
          className="text-[#808080] text-sm"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {instruction}
        </motion.p>
      )}

      {/* Items list */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isSelected = selected.has(item.id);
          const isStrikethrough = mode === 'strikethrough';

          return (
            <motion.button
              key={item.id}
              onClick={() => toggleItem(item.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative w-full flex items-center gap-4 p-4 rounded-xl text-left
                transition-all duration-300
                ${isSelected
                  ? isStrikethrough
                    ? 'bg-[#1a1a1a] border border-white/5'
                    : 'bg-[#C9A227]/10 border border-[#C9A227]/30'
                  : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
                }
              `}
            >
              {/* Particles on select */}
              {showParticles === item.id && (
                <Particles
                  trigger={true}
                  type="explosion"
                  color={isStrikethrough ? 'white' : 'gold'}
                  count={15}
                  originX={10}
                  originY={50}
                />
              )}

              {/* Checkbox/indicator */}
              <div
                className={`
                  relative flex-shrink-0 w-6 h-6 rounded-md border-2
                  flex items-center justify-center
                  transition-all duration-300
                  ${isSelected
                    ? isStrikethrough
                      ? 'bg-[#606060] border-[#606060]'
                      : 'bg-[#C9A227] border-[#C9A227]'
                    : 'border-white/30'
                  }
                `}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-4 h-4 text-black"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              {/* Item icon */}
              {item.icon && (
                <div className={`flex-shrink-0 ${isSelected && isStrikethrough ? 'opacity-40' : ''}`}>
                  {item.icon}
                </div>
              )}

              {/* Item text */}
              <span
                className={`
                  flex-1 text-sm transition-all duration-300
                  ${isSelected
                    ? isStrikethrough
                      ? 'line-through text-[#606060]'
                      : 'text-white'
                    : 'text-white/80'
                  }
                `}
              >
                {item.text}
              </span>

              {/* Glow effect on selected */}
              {isSelected && !isStrikethrough && (
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(201, 162, 39, 0)',
                      '0 0 15px rgba(201, 162, 39, 0.2)',
                      '0 0 0px rgba(201, 162, 39, 0)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #9a7a1a 0%, #C9A227 50%, #e3c565 100%)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Status message */}
        <AnimatePresence mode="wait">
          {isComplete ? (
            <motion.p
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-[#C9A227] text-sm font-medium"
            >
              {completeMessage}
            </motion.p>
          ) : selected.size === 0 && emptyMessage ? (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[#606060] text-xs"
            >
              {emptyMessage}
            </motion.p>
          ) : (
            <motion.p
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-[#808080] text-xs"
            >
              {selected.size} de {items.length} seleccionados
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
