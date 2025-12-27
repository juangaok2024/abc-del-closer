'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlipCard } from '../motion/FlipCard';
import { GatedContent } from '../motion/GatedContent';

interface CloserSectionProps {
  paragraphs: string[];
  quote?: string;
  onComplete: () => void;
}

export function CloserSection({ paragraphs, quote, onComplete }: CloserSectionProps) {
  const [hasFlipped, setHasFlipped] = useState(false);

  const handleFlip = () => {
    setHasFlipped(true);
    setTimeout(() => onComplete(), 500);
  };

  return (
    <div className="space-y-8">
      {/* FlipCard - Vendedor vs Closer */}
      <FlipCard
        className="h-[280px] w-full"
        onFlip={handleFlip}
        hint="Toca para descubrir la diferencia"
        front={
          <div className="h-full bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center">
            <div className="text-[#606060] mb-4">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-[#808080] text-xl font-medium mb-2">Vendedor Tradicional</h3>
            <p className="text-[#505050] text-sm text-center">
              Llama en frío, persigue clientes, vende productos baratos
            </p>
            <div className="mt-4 text-[#404040] text-xs">
              😩 Agotador y mal pagado
            </div>
          </div>
        }
        back={
          <div className="h-full bg-gradient-to-br from-[#C9A227]/20 to-[#0f0f0f] border border-[#C9A227]/30 rounded-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-[#C9A227]/10 to-transparent"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            <motion.div
              className="relative z-10"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="text-[#C9A227] mb-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <motion.h3
                className="text-white text-2xl font-bold mb-2"
                animate={{
                  textShadow: [
                    '0 0 0px rgba(201, 162, 39, 0)',
                    '0 0 20px rgba(201, 162, 39, 0.8)',
                    '0 0 10px rgba(201, 162, 39, 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                CLOSER
              </motion.h3>
              <p className="text-white/80 text-sm text-center">
                Recibe leads calificados, cierra ventas de alto valor
              </p>
              <div className="mt-4 text-[#C9A227] text-xs font-medium">
                ✨ Profesional y muy bien pagado
              </div>
            </motion.div>
          </div>
        }
      />

      {/* Content that appears after flip */}
      <GatedContent
        isUnlocked={hasFlipped}
        hint="Voltea la carta para continuar"
        showParticles={false}
      >
        <div className="space-y-6">
          {/* Explanation paragraphs */}
          {paragraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="text-[#d0d0d0] text-base leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}

          {/* Quote */}
          {quote && (
            <motion.blockquote
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: paragraphs.length * 0.2 + 0.3, duration: 0.5 }}
              className="border-l-2 border-[#C9A227] pl-4 py-2"
            >
              <p className="text-[#C9A227] text-lg font-display italic">
                "{quote}"
              </p>
            </motion.blockquote>
          )}
        </div>
      </GatedContent>
    </div>
  );
}
