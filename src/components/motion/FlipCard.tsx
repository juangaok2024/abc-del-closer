'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Particles } from './Particles';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  onFlip?: () => void;
  flipped?: boolean;
  disabled?: boolean;
  className?: string;
  frontClassName?: string;
  backClassName?: string;
  hint?: string;
}

export function FlipCard({
  front,
  back,
  onFlip,
  flipped: controlledFlipped,
  disabled = false,
  className = '',
  frontClassName = '',
  backClassName = '',
  hint = 'Toca para voltear',
}: FlipCardProps) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [hasFlipped, setHasFlipped] = useState(false);

  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;

  const handleFlip = () => {
    if (disabled || hasFlipped) return;

    setHasFlipped(true);
    setShowParticles(true);

    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }

    if (controlledFlipped === undefined) {
      setInternalFlipped(true);
    }
    onFlip?.();

    // Reset particles
    setTimeout(() => setShowParticles(false), 1500);
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* Particles effect */}
      <Particles
        trigger={showParticles}
        type="explosion"
        color="gold"
        count={30}
        originX={50}
        originY={50}
      />

      {/* Flash effect on flip */}
      <AnimatePresence>
        {showParticles && (
          <motion.div
            className="absolute inset-0 bg-white rounded-xl z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Card container */}
      <motion.div
        className="relative w-full h-full cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          ease: [0.32, 0.72, 0, 1],
        }}
        onClick={handleFlip}
      >
        {/* Front face */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl ${frontClassName}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="relative h-full">
            {front}

            {/* Hint overlay */}
            {!hasFlipped && (
              <motion.div
                className="absolute bottom-4 left-0 right-0 text-center"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-black/50 rounded-full text-[#a0a0a0] text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  {hint}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Back face */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl ${backClassName}`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <motion.div
            className="h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: isFlipped ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {back}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Preset for dark to gold transition
export function DarkToGoldCard({
  darkContent,
  goldContent,
  onFlip,
  className = '',
}: {
  darkContent: React.ReactNode;
  goldContent: React.ReactNode;
  onFlip?: () => void;
  className?: string;
}) {
  return (
    <FlipCard
      front={
        <div className="h-full bg-[#1a1a1a] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <div className="text-[#606060]">{darkContent}</div>
        </div>
      }
      back={
        <div className="h-full bg-gradient-to-br from-[#C9A227]/20 to-[#9a7a1a]/10 border border-[#C9A227]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center">
          <motion.div
            className="text-white"
            animate={{
              textShadow: [
                '0 0 0px rgba(201, 162, 39, 0)',
                '0 0 20px rgba(201, 162, 39, 0.5)',
                '0 0 10px rgba(201, 162, 39, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {goldContent}
          </motion.div>
        </div>
      }
      onFlip={onFlip}
      className={className}
      hint="Toca para descubrir"
    />
  );
}
