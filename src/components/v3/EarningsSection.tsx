'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ToggleSwitch } from '../motion/ToggleSwitch';
import { GatedContent } from '../motion/GatedContent';
import { AnimatedCounter } from '../motion/AnimatedCounter';

interface EarningsSectionProps {
  model: string;
  example: string;
  ranges: { level: string; range: string }[];
  quote?: string;
  onComplete: () => void;
}

export function EarningsSection({ model, example, ranges, quote, onComplete }: EarningsSectionProps) {
  const [hasToggled, setHasToggled] = useState(false);

  const handleToggle = (isOn: boolean) => {
    if (isOn && !hasToggled) {
      setHasToggled(true);
      setTimeout(() => onComplete(), 1000);
    }
  };

  // Parse range values for animation
  const parseRange = (range: string) => {
    const match = range.match(/\$?([\d,]+)/);
    return match ? parseInt(match[1].replace(',', '')) : 0;
  };

  return (
    <div className="space-y-8">
      <ToggleSwitch
        offLabel="Tu realidad actual"
        onLabel="Como Closer"
        onToggle={handleToggle}
        offContent={
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 mx-auto bg-[#1a1a1a] rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-[#606060]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[#606060] text-sm">Ingreso promedio en Latam</p>
            <p className="text-2xl font-semibold text-[#808080]">$500 - $800 USD</p>
            <p className="text-[#505050] text-xs">Trabajo tradicional 9-6</p>
          </div>
        }
        onContent={
          <div className="space-y-4">
            {/* Model info */}
            <div className="text-center p-4 bg-[#C9A227]/10 rounded-xl border border-[#C9A227]/20">
              <p className="text-[#a0a0a0] text-sm mb-1">Modelo de pago</p>
              <p className="text-white font-medium">{model}</p>
            </div>

            {/* Example */}
            <div className="text-center p-4 bg-white/[0.02] rounded-xl border border-white/5">
              <p className="text-[#808080] text-sm mb-1">Ejemplo real</p>
              <p className="text-[#C9A227] font-medium">{example}</p>
            </div>

            {/* Ranges with animated counters */}
            <div className="space-y-3 pt-4">
              <p className="text-[#a0a0a0] text-sm text-center">Rangos de ingresos mensuales:</p>
              {ranges.map((range, index) => {
                const maxValue = parseRange(range.range.split('-').pop() || range.range);

                return (
                  <motion.div
                    key={range.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.4 }}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-[#C9A227]/10 to-transparent border border-[#C9A227]/20 rounded-lg"
                  >
                    <span className="text-white/80 text-sm">{range.level}</span>
                    <motion.span
                      className="text-[#C9A227] font-bold text-lg"
                      animate={{
                        textShadow: [
                          '0 0 0px rgba(201, 162, 39, 0)',
                          '0 0 15px rgba(201, 162, 39, 0.6)',
                          '0 0 5px rgba(201, 162, 39, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    >
                      {range.range}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        }
      />

      {/* Quote - only shows after toggle */}
      <GatedContent
        isUnlocked={hasToggled}
        hint="Activa el switch para ver más"
        showParticles={false}
      >
        {quote && (
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="border-l-2 border-[#C9A227] pl-4 py-2"
          >
            <p className="text-[#C9A227] text-lg font-display italic">
              "{quote}"
            </p>
          </motion.blockquote>
        )}
      </GatedContent>
    </div>
  );
}
