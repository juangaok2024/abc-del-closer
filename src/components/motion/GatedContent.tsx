'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Particles } from './Particles';
import { useState, useEffect } from 'react';

interface GatedContentProps {
  isUnlocked: boolean;
  children: React.ReactNode;
  hint?: string;
  showParticles?: boolean;
}

export function GatedContent({
  isUnlocked,
  children,
  hint = 'Completa lo anterior para continuar',
  showParticles = true,
}: GatedContentProps) {
  const [wasLocked, setWasLocked] = useState(!isUnlocked);
  const [showUnlockEffect, setShowUnlockEffect] = useState(false);

  useEffect(() => {
    if (isUnlocked && wasLocked) {
      setShowUnlockEffect(true);
      setWasLocked(false);
      // Reset effect after animation
      const timer = setTimeout(() => setShowUnlockEffect(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [isUnlocked, wasLocked]);

  return (
    <div className="relative">
      {/* Particles on unlock */}
      {showParticles && (
        <Particles
          trigger={showUnlockEffect}
          type="explosion"
          color="gold"
          count={20}
          originX={50}
          originY={50}
        />
      )}

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          // Locked state
          <motion.div
            key="locked"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {/* Blurred content preview */}
            <div className="blur-sm opacity-30 pointer-events-none select-none">
              {children}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/50 backdrop-blur-sm rounded-xl">
              <motion.div
                className="text-center space-y-3 p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {/* Lock icon */}
                <motion.div
                  className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg
                    className="w-5 h-5 text-[#808080]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </motion.div>

                {/* Hint text */}
                <motion.p
                  className="text-[#606060] text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {hint}
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Unlocked state
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
