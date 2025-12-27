'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Particles } from './Particles';

interface ToggleSwitchProps {
  offLabel: string;
  onLabel: string;
  offContent: React.ReactNode;
  onContent: React.ReactNode;
  onToggle?: (isOn: boolean) => void;
  defaultOn?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ToggleSwitch({
  offLabel,
  onLabel,
  offContent,
  onContent,
  onToggle,
  defaultOn = false,
  disabled = false,
  className = '',
}: ToggleSwitchProps) {
  const [isOn, setIsOn] = useState(defaultOn);
  const [showParticles, setShowParticles] = useState(false);
  const [hasToggled, setHasToggled] = useState(false);

  const handleToggle = () => {
    if (disabled) return;

    const newState = !isOn;
    setIsOn(newState);

    if (newState && !hasToggled) {
      setHasToggled(true);
      setShowParticles(true);

      // Haptic feedback
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([50, 50, 100]);
      }

      setTimeout(() => setShowParticles(false), 1500);
    }

    onToggle?.(newState);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toggle Switch UI */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm font-medium transition-colors duration-300 ${!isOn ? 'text-white' : 'text-[#606060]'}`}>
          {offLabel}
        </span>

        <button
          onClick={handleToggle}
          disabled={disabled}
          className="relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]"
          style={{
            background: isOn
              ? 'linear-gradient(90deg, #9a7a1a 0%, #C9A227 50%, #e3c565 100%)'
              : '#2a2a2a',
            boxShadow: isOn
              ? '0 0 20px rgba(201, 162, 39, 0.5), 0 0 40px rgba(201, 162, 39, 0.2)'
              : '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
        >
          <motion.div
            className="absolute top-1 w-6 h-6 rounded-full shadow-md"
            style={{
              background: isOn ? '#ffffff' : '#808080',
            }}
            animate={{
              left: isOn ? '2.25rem' : '0.25rem',
              scale: isOn ? 1 : 0.9,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
          />

          {/* Glow effect when on */}
          {isOn && (
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                boxShadow: [
                  '0 0 10px rgba(201, 162, 39, 0.3)',
                  '0 0 20px rgba(201, 162, 39, 0.5)',
                  '0 0 10px rgba(201, 162, 39, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </button>

        <span className={`text-sm font-medium transition-colors duration-300 ${isOn ? 'text-[#C9A227]' : 'text-[#606060]'}`}>
          {onLabel}
        </span>
      </div>

      {/* Hint when not toggled */}
      {!hasToggled && (
        <motion.p
          className="text-center text-[#808080] text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Activa el switch para ver la diferencia
        </motion.p>
      )}

      {/* Content area with particles */}
      <div className="relative">
        <Particles
          trigger={showParticles}
          type="explosion"
          color="gold"
          count={30}
          originX={50}
          originY={30}
        />

        <AnimatePresence mode="wait">
          {!isOn ? (
            // OFF content
            <motion.div
              key="off"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.3 }}
              className="filter grayscale opacity-60"
            >
              {offContent}
            </motion.div>
          ) : (
            // ON content
            <motion.div
              key="on"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.32, 0.72, 0, 1],
              }}
            >
              {onContent}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Preset for earnings comparison
export function EarningsToggle({
  currentSalary,
  closerRanges,
  onToggle,
}: {
  currentSalary: string;
  closerRanges: { level: string; range: string }[];
  onToggle?: (isOn: boolean) => void;
}) {
  return (
    <ToggleSwitch
      offLabel="Tu realidad actual"
      onLabel="Como Closer"
      offContent={
        <div className="text-center py-8">
          <p className="text-[#606060] text-sm mb-2">Ingreso promedio</p>
          <p className="text-2xl font-semibold text-[#808080]">{currentSalary}</p>
          <p className="text-[#606060] text-xs mt-2">Trabajo tradicional</p>
        </div>
      }
      onContent={
        <div className="space-y-3">
          {closerRanges.map((range, index) => (
            <motion.div
              key={range.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex justify-between items-center p-4 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-lg"
            >
              <span className="text-white/80 text-sm">{range.level}</span>
              <motion.span
                className="text-[#C9A227] font-semibold"
                animate={{
                  textShadow: [
                    '0 0 0px rgba(201, 162, 39, 0)',
                    '0 0 10px rgba(201, 162, 39, 0.5)',
                    '0 0 5px rgba(201, 162, 39, 0.3)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                {range.range}
              </motion.span>
            </motion.div>
          ))}
        </div>
      }
      onToggle={onToggle}
    />
  );
}
